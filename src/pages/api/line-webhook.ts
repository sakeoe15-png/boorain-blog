import type { APIRoute } from 'astro';
import crypto from 'node:crypto';

export const prerender = false;

const GITHUB_OWNER = 'sakeoe15-png';
const GITHUB_REPO = 'boorain-blog';
const GITHUB_BRANCH = 'main';

function verifySignature(body: string, signature: string | null, channelSecret: string): boolean {
	if (!signature) return false;
	const hash = crypto.createHmac('sha256', channelSecret).update(body).digest('base64');
	return hash === signature;
}

function toDatePath(date: Date) {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return { year, month, day, iso: `${year}-${month}-${day}` };
}

// Markdownは空行を挟まない改行を無視する仕様のため、LINEで入力した通りに
// 改行が見た目に反映されるよう、単純な改行をMarkdownの強制改行(行末に半角スペース2つ)に変換する
function preserveLineBreaks(text: string): string {
	return text
		.split('\n')
		.map((line) => line.replace(/\s+$/, ''))
		.join('  \n');
}

function parseMessage(text: string): { title: string; body: string } | null {
	const titleMatch = text.match(/タイトル[:：]\s*([\s\S]*?)(?:\n本文[:：]|$)/);
	const bodyMatch = text.match(/本文[:：]\s*([\s\S]*)/);
	if (!titleMatch || !bodyMatch) return null;
	const title = titleMatch[1].trim();
	const body = bodyMatch[1].trim();
	if (!title || !body) return null;
	return { title, body };
}

async function githubRequest(path: string, init: RequestInit, token: string) {
	const res = await fetch(`https://api.github.com${path}`, {
		...init,
		headers: {
			Authorization: `Bearer ${token}`,
			Accept: 'application/vnd.github+json',
			'Content-Type': 'application/json',
			...init.headers,
		},
	});
	return res;
}

async function findAvailableFilename(iso: string, token: string): Promise<string> {
	let candidate = `${iso}.md`;
	let suffix = 2;
	while (true) {
		const res = await githubRequest(
			`/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/src/content/blog/${candidate}`,
			{ method: 'GET' },
			token,
		);
		if (res.status === 404) return candidate;
		candidate = `${iso}-${suffix}.md`;
		suffix++;
	}
}

function toSlugPathForReply(pubDate: Date, title: string): string {
	const { year, month, day } = toDatePath(pubDate);
	const cleanTitle = title.replace(/[?#%]/g, '');
	return `${year}/${month}/${day}/${cleanTitle}`;
}

async function replyToLine(replyToken: string, text: string, accessToken: string) {
	await fetch('https://api.line.me/v2/bot/message/reply', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${accessToken}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			replyToken,
			messages: [{ type: 'text', text }],
		}),
	});
}

export const POST: APIRoute = async ({ request }) => {
	const channelSecret = import.meta.env.LINE_CHANNEL_SECRET;
	const accessToken = import.meta.env.LINE_CHANNEL_ACCESS_TOKEN;
	const githubToken = import.meta.env.GH_CONTENT_TOKEN;

	const rawBody = await request.text();
	const signature = request.headers.get('x-line-signature');

	if (!channelSecret || !verifySignature(rawBody, signature, channelSecret)) {
		return new Response('invalid signature', { status: 401 });
	}

	const payload = JSON.parse(rawBody);
	const events = payload.events ?? [];

	for (const event of events) {
		if (event.type !== 'message' || event.message?.type !== 'text') continue;

		const replyToken = event.replyToken;
		const parsed = parseMessage(event.message.text as string);

		if (!parsed) {
			await replyToLine(
				replyToken,
				'フォーマットが読み取れませんでした。「タイトル: ○○○」「本文: ○○○」の形式で送ってください。',
				accessToken,
			);
			continue;
		}

		const now = new Date();
		const { iso } = toDatePath(now);
		const filename = await findAvailableFilename(iso, githubToken);
		const content = `---\ntitle: "${parsed.title.replace(/"/g, '\\"')}"\npubDate: ${iso}\n---\n\n${preserveLineBreaks(parsed.body)}\n`;
		const contentBase64 = Buffer.from(content, 'utf-8').toString('base64');

		const putRes = await githubRequest(
			`/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/src/content/blog/${filename}`,
			{
				method: 'PUT',
				body: JSON.stringify({
					message: `LINE投稿: ${parsed.title}`,
					content: contentBase64,
					branch: GITHUB_BRANCH,
				}),
			},
			githubToken,
		);

		if (!putRes.ok) {
			const errText = await putRes.text();
			console.error('GitHub API error:', errText);
			await replyToLine(replyToken, '投稿に失敗しました。もう一度試すか、確認してください。', accessToken);
			continue;
		}

		const url = `https://boorain.space/${toSlugPathForReply(now, parsed.title)}/`;
		await replyToLine(
			replyToken,
			`投稿しました！数分後に反映されます:\n${url}`,
			accessToken,
		);
	}

	return new Response('ok', { status: 200 });
};

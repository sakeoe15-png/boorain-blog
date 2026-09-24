// 記事タイトルからURLパス(年/月/日/タイトル)を生成する
// "?" 等のURL予約文字はエンコードしないと、リンク先が実ファイルのパスと一致しない
export function toSlug(pubDate: Date, title: string): string {
	const year = pubDate.getFullYear();
	const month = String(pubDate.getMonth() + 1).padStart(2, '0');
	const day = String(pubDate.getDate()).padStart(2, '0');
	const safeTitle = title.replace(/[?#%]/g, (ch) => encodeURIComponent(ch));
	return `${year}/${month}/${day}/${safeTitle}`;
}

// 記事タイトルからURLパス(年/月/日/タイトル)を生成する。
//
// "?" 等のURL予約文字をエンコードして使う方式は、Astroの静的ビルド自体が
// 出力ファイル名を生成する際に同じ文字を自動で再エンコードしてしまうため、
// リンク(1回エンコード)と実ファイル(Astroによる自動エンコード)がズレて404になる。
// そのためURL部分では予約文字を単純に除去する(表示用タイトルには影響しない)。
export function toSlugPath(pubDate: Date, title: string): string {
	const year = pubDate.getFullYear();
	const month = String(pubDate.getMonth() + 1).padStart(2, '0');
	const day = String(pubDate.getDate()).padStart(2, '0');
	// 半角スペース等の空白もURLでは壊れやすい(メッセージアプリのリンク自動検出が途中で切れる等)ため除去する
	const cleanTitle = title.replace(/[?#%]/g, '').replace(/\s+/g, '');
	return `${year}/${month}/${day}/${cleanTitle}`;
}

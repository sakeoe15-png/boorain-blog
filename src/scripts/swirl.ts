const RADIUS = 120; // この距離(px)より遠い文字は影響を受けない
const MAX_ANGLE = 150; // 一番近い文字が渦を巻く最大角度(度)
const EASE = 0.18;

// .swirl-scope要素内のテキストノードを文字ごとの<span>に分割する
// (SwirlText.astroが担う見出し用の事前分割とは別に、本文・日付・フッター等
//  任意のテキストに後付けで同じ効果をかけるための汎用処理)
function wrapTextNodes(root: HTMLElement) {
	const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
		acceptNode(node) {
			const parent = (node as Text).parentElement;
			if (!parent || parent.closest('script, style')) return NodeFilter.FILTER_REJECT;
			return NodeFilter.FILTER_ACCEPT;
		},
	});
	const textNodes: Text[] = [];
	let node: Node | null;
	while ((node = walker.nextNode())) {
		textNodes.push(node as Text);
	}
	textNodes.forEach((textNode) => {
		const text = textNode.textContent ?? '';
		if (text.trim().length === 0) return;
		const frag = document.createDocumentFragment();
		for (const ch of text) {
			if (ch === ' ' || ch === '\n' || ch === '\t') {
				frag.appendChild(document.createTextNode(ch));
			} else {
				const span = document.createElement('span');
				span.textContent = ch;
				span.style.display = 'inline-block';
				span.style.willChange = 'transform';
				frag.appendChild(span);
			}
		}
		textNode.parentNode?.replaceChild(frag, textNode);
	});
}

function setupSwirl(container: HTMLElement) {
	const spans = Array.from(container.querySelectorAll('span')) as HTMLElement[];
	let pointer: { x: number; y: number } | null = null;
	const current = spans.map(() => ({ dx: 0, dy: 0, rot: 0 }));

	function updatePointer(x: number, y: number) {
		pointer = { x, y };
	}

	function tick() {
		spans.forEach((span, i) => {
			const c = current[i];
			let tdx = 0;
			let tdy = 0;
			let trot = 0;
			if (pointer) {
				const rect = span.getBoundingClientRect();
				const cx = rect.left + rect.width / 2;
				const cy = rect.top + rect.height / 2;
				const dx = cx - pointer.x;
				const dy = cy - pointer.y;
				const dist = Math.sqrt(dx * dx + dy * dy);
				const influence = Math.max(0, 1 - dist / RADIUS);
				if (influence > 0) {
					const swirlDeg = MAX_ANGLE * influence * influence;
					const swirlRad = (swirlDeg * Math.PI) / 180;
					const angle = Math.atan2(dy, dx) + swirlRad;
					const newX = pointer.x + dist * Math.cos(angle);
					const newY = pointer.y + dist * Math.sin(angle);
					tdx = newX - cx;
					tdy = newY - cy;
					trot = swirlDeg;
				}
			}
			c.dx += (tdx - c.dx) * EASE;
			c.dy += (tdy - c.dy) * EASE;
			c.rot += (trot - c.rot) * EASE;
			span.style.transform = `translate(${c.dx.toFixed(1)}px, ${c.dy.toFixed(1)}px) rotate(${c.rot.toFixed(1)}deg)`;
		});
	}

	container.addEventListener('pointermove', (e) => updatePointer(e.clientX, e.clientY));
	container.addEventListener('pointerleave', () => {
		pointer = null;
	});
	container.addEventListener(
		'touchmove',
		(e) => {
			const touch = e.touches[0];
			if (touch) updatePointer(touch.clientX, touch.clientY);
		},
		{ passive: true },
	);
	container.addEventListener('touchend', () => {
		pointer = null;
	});

	return tick;
}

function init() {
	// .swirl-text: SwirlText.astroが事前に文字ごとspan化した見出し
	const preSplit = Array.from(document.querySelectorAll<HTMLElement>('.swirl-text'));
	// .swirl-scope: 本文・日付・フッター等、後付けでテキストノードをspan化する対象
	const scopes = Array.from(document.querySelectorAll<HTMLElement>('.swirl-scope'));
	scopes.forEach(wrapTextNodes);

	const containers = [...preSplit, ...scopes];
	if (containers.length === 0) return;
	const tickers = containers.map(setupSwirl);
	function loop() {
		tickers.forEach((tick) => tick());
		requestAnimationFrame(loop);
	}
	loop();
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', init);
} else {
	init();
}

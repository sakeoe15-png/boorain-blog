// 背景に絵文字を散らばせ、ゆっくり回転しながら上から下へ流す演出
const EMOJIS = [
	'🧠', '🫍', '🦄', '🐶', '🦕', '🐈', '🌞', '🌝', '🌛', '🌜', '🌚',
	'🌎', '🌏', '🌍', '🪐', '💫', '🌟', '✨', '⚡️', '☄️', '🫯', '🌈',
	'❄️', '🍙', '🍿', '🍭', '🪂', '🧚🏻‍♀️', '👼🏼',
];

const COUNT = 24;
const BURST_PARTICLES = 10;

function spawnBurst(x: number, y: number) {
	const burst = document.createElement('div');
	burst.className = 'emoji-burst';
	burst.style.left = `${x}px`;
	burst.style.top = `${y}px`;

	for (let i = 0; i < BURST_PARTICLES; i++) {
		const particle = document.createElement('span');
		particle.className = 'emoji-burst-particle';
		const angle = (i / BURST_PARTICLES) * Math.PI * 2 + Math.random() * 0.5;
		const distance = 40 + Math.random() * 40;
		particle.style.setProperty('--bx', `${Math.cos(angle) * distance}px`);
		particle.style.setProperty('--by', `${Math.sin(angle) * distance}px`);
		burst.appendChild(particle);
	}

	document.body.appendChild(burst);
	burst.addEventListener('animationend', () => burst.remove(), { once: true });
	// 万一animationendが発火しない環境向けの保険
	setTimeout(() => burst.remove(), 900);
}

function createEmoji(): HTMLElement {
	const fall = document.createElement('div');
	fall.className = 'bg-emoji-fall';

	const spin = document.createElement('span');
	spin.className = 'bg-emoji-spin';
	spin.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)] ?? '';

	const duration = 18 + Math.random() * 22; // 18〜40秒かけて画面を流れ落ちる
	fall.style.setProperty('--left', `${Math.random() * 100}vw`);
	fall.style.setProperty('--fall-duration', `${duration}s`);
	// マイナスの遅延にして、初回表示時から画面のあちこちに散らばった状態で始める
	fall.style.setProperty('--fall-delay', `${-Math.random() * duration}s`);
	spin.style.setProperty('--size', `${1.2 + Math.random() * 1.6}rem`);
	spin.style.setProperty('--spin-duration', `${4 + Math.random() * 6}s`);
	spin.style.setProperty('--spin-dir', Math.random() < 0.5 ? '1' : '-1');

	// clickはPCでは実際のクリック、スマホではタップでのみ発火し、
	// ホバーやスワイプ通過だけでは反応しない
	spin.addEventListener('click', () => {
		const rect = spin.getBoundingClientRect();
		spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
		fall.remove();
	});

	fall.appendChild(spin);
	return fall;
}

function init() {
	const container = document.querySelector<HTMLElement>('.emoji-bg');
	if (!container || container.childElementCount > 0) return;
	for (let i = 0; i < COUNT; i++) {
		container.appendChild(createEmoji());
	}
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', init);
} else {
	init();
}

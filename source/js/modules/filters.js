const OPEN_CLASS = 'is-open';
const LOCK_CLASS = 'scroll-lock';

// Выезжающая панель фильтра на планшетах и мобильных
export const filters = () => {
	const panel = document.querySelector('[data-filters-panel]');
	const overlay = document.querySelector('[data-filters-overlay]');
	const openButtons = document.querySelectorAll('[data-filters-open]');
	const closeButtons = document.querySelectorAll('[data-filters-close]');

	if (!panel) {
		return;
	}

	const media = window.matchMedia('(max-width: 1024px)');

	const close = () => {
		panel.classList.remove(OPEN_CLASS);
		document.body.classList.remove(LOCK_CLASS);

		if (overlay) {
			overlay.classList.remove(OPEN_CLASS);
		}
	};

	const open = () => {
		panel.classList.add(OPEN_CLASS);
		document.body.classList.add(LOCK_CLASS);

		if (overlay) {
			overlay.classList.add(OPEN_CLASS);
		}
	};

	openButtons.forEach((button) => {
		button.addEventListener('click', open);
	});

	closeButtons.forEach((button) => {
		button.addEventListener('click', close);
	});

	if (overlay) {
		overlay.addEventListener('click', close);
	}

	document.addEventListener('keydown', (evt) => {
		if (evt.key === 'Escape' && panel.classList.contains(OPEN_CLASS)) {
			close();
		}
	});

	// При переходе на десктоп панель всегда должна быть в обычном состоянии
	media.addEventListener('change', (evt) => {
		if (!evt.matches) {
			close();
		}
	});
};

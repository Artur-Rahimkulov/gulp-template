// Компенсация высоты фиксированной шапки + раскрытие поиска на мобильных

export const header = () => {
	const headerEl = document.querySelector('[data-header]');

	if (!headerEl) {
		return;
	}

	const setOffset = () => {
		const height = headerEl.getBoundingClientRect().height;
		document.documentElement.style.setProperty('--header-height', `${height}px`);
	};

	setOffset();

	if ('ResizeObserver' in window) {
		new ResizeObserver(setOffset).observe(headerEl);
	} else {
		window.addEventListener('resize', setOffset);
	}

	window.addEventListener('orientationchange', setOffset);

	// Кнопка поиска в мобильной шапке — показываем строку поиска
	const searchToggle = headerEl.querySelector('[data-search-toggle]');
	const searchInput = headerEl.querySelector('#header-search');

	if (searchToggle && searchInput) {
		searchToggle.addEventListener('click', () => {
			const isOpen = headerEl.classList.toggle('is-search-open');
			searchToggle.setAttribute('aria-expanded', String(isOpen));

			if (isOpen) {
				searchInput.focus();
			}

			setOffset();
		});
	}
};

const BODY_LOCK_CLASS = 'is-menu-open';

// Мобильное меню: бургер, аккордеоны разделов, блокировка скролла
const initMobileMenu = () => {
	const menu = document.querySelector('[data-mobile-menu]');
	const burger = document.querySelector('[data-burger]');

	if (!menu || !burger) {
		return;
	}

	const overlay = menu.querySelector('[data-mobile-menu-overlay]');
	const closeBtn = menu.querySelector('[data-menu-close]');

	let lastScrollY = 0;

	const open = () => {
		lastScrollY = window.scrollY;

		menu.classList.add('is-open');
		menu.setAttribute('aria-hidden', 'false');
		burger.setAttribute('aria-expanded', 'true');
		burger.setAttribute('aria-label', 'Закрыть меню');
		document.body.classList.add(BODY_LOCK_CLASS);

		// фиксируем позицию, чтобы фон не прокручивался под меню
		document.body.style.top = `-${lastScrollY}px`;
	};

	const close = () => {
		menu.classList.remove('is-open');
		menu.setAttribute('aria-hidden', 'true');
		burger.setAttribute('aria-expanded', 'false');
		burger.setAttribute('aria-label', 'Открыть меню');
		document.body.classList.remove(BODY_LOCK_CLASS);
		document.body.style.top = '';

		window.scrollTo(0, lastScrollY);
	};

	const toggle = () => {
		if (menu.classList.contains('is-open')) {
			close();
		} else {
			open();
		}
	};

	burger.addEventListener('click', toggle);

	if (closeBtn) {
		closeBtn.addEventListener('click', close);
	}

	if (overlay) {
		overlay.addEventListener('click', close);
	}

	document.addEventListener('keydown', (evt) => {
		if (evt.key === 'Escape' && menu.classList.contains('is-open')) {
			close();
		}
	});

	// Аккордеоны разделов внутри мобильного меню
	menu.querySelectorAll('.mobile-menu__toggle').forEach((trigger) => {
		const item = trigger.closest('.mobile-menu__item');
		const panel = document.getElementById(trigger.getAttribute('aria-controls'));

		if (!item) {
			return;
		}

		trigger.addEventListener('click', () => {
			const isOpen = item.classList.toggle('is-open');

			trigger.setAttribute('aria-expanded', String(isOpen));

			if (panel) {
				// высоту считаем от контента, чтобы работал transition
				panel.style.maxHeight = isOpen ? `${panel.scrollHeight}px` : '';
			}
		});
	});

	// при переходе на десктоп меню должно закрываться
	window.addEventListener('resize', () => {
		if (window.innerWidth > 1024 && menu.classList.contains('is-open')) {
			close();
		}
	});
};

// Десктопные дропдауны: ховер работает на CSS, здесь — доступность с клавиатуры
const initDropdowns = () => {
	const dropdowns = document.querySelectorAll('[data-dropdown]');

	if (!dropdowns.length) {
		return;
	}

	const closeAll = () => {
		dropdowns.forEach((dropdown) => {
			dropdown.classList.remove('is-open');

			const trigger = dropdown.querySelector('[data-dropdown-trigger]');

			if (trigger) {
				trigger.setAttribute('aria-expanded', 'false');
			}
		});
	};

	dropdowns.forEach((dropdown) => {
		const trigger = dropdown.querySelector('[data-dropdown-trigger]');

		if (!trigger) {
			return;
		}

		trigger.addEventListener('click', (evt) => {
			// на десктопе раскрываем по клику, не переходя по ссылке-заглушке
			if (window.innerWidth <= 1024) {
				return;
			}

			evt.preventDefault();

			const isOpen = dropdown.classList.contains('is-open');

			closeAll();

			if (!isOpen) {
				dropdown.classList.add('is-open');
				trigger.setAttribute('aria-expanded', 'true');
			}
		});
	});

	document.addEventListener('keydown', (evt) => {
		if (evt.key === 'Escape') {
			closeAll();
		}
	});

	document.addEventListener('click', (evt) => {
		if (!evt.target.closest('[data-dropdown]')) {
			closeAll();
		}
	});
};

// Табы разделов в мега-меню «Каталог»: переключение по ховеру и по фокусу
const initMegaTabs = () => {
	document.querySelectorAll('[data-mega]').forEach((mega) => {
		const tabs = mega.querySelectorAll('[data-mega-tab]');

		if (!tabs.length) {
			return;
		}

		const activate = (tab) => {
			const panelId = tab.getAttribute('aria-controls');

			if (!panelId) {
				return;
			}

			tabs.forEach((item) => {
				const isCurrent = item === tab;
				const panel = document.getElementById(item.getAttribute('aria-controls'));

				item.classList.toggle('is-active', isCurrent);
				item.setAttribute('aria-selected', String(isCurrent));

				if (panel) {
					panel.classList.toggle('is-active', isCurrent);
					panel.hidden = !isCurrent;
				}
			});
		};

		tabs.forEach((tab) => {
			// на макете разделы раскрываются наведением
			tab.addEventListener('mouseenter', () => activate(tab));
			tab.addEventListener('focus', () => activate(tab));
			tab.addEventListener('click', () => activate(tab));
		});
	});
};

const menu = () => {
	initMobileMenu();
	initDropdowns();
	initMegaTabs();
};

export {menu};

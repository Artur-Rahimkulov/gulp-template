/**
 * Модуль управления модальными окнами (состояния отправки форм: Успех и Ошибка).
 * Подготовлен для бесшовной интеграции с CMS 1C-Bitrix (AJAX и классический POST-редирект).
 */

export const modal = () => {
  const getScrollbarWidth = () => window.innerWidth - document.documentElement.clientWidth;

  let activeModal = null;

  const openModal = (target) => {
    let modalElement = null;

    if (typeof target === 'string') {
      modalElement = document.getElementById(target) || document.querySelector(`[data-modal="${target}"]`);
    } else if (target instanceof HTMLElement) {
      modalElement = target;
    }

    if (!modalElement) {
      console.warn(`[Modal] Модальное окно "${target}" не найдено в DOM.`);
      return;
    }

    if (activeModal && activeModal !== modalElement) {
      closeModal(activeModal, false);
    }

    // Блокировка скролла страницы без прыжка контента
    const scrollbarWidth = getScrollbarWidth();
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    document.body.classList.add('is-modal-open');

    modalElement.classList.add('is-active', 'is-open');
    modalElement.setAttribute('aria-hidden', 'false');
    activeModal = modalElement;

    // Фокус на кнопку закрытия для доступности
    const closeBtn = modalElement.querySelector('[data-modal-close]');
    if (closeBtn) {
      closeBtn.focus();
    }

    // Пользовательское событие для бекендера
    document.dispatchEvent(new CustomEvent('modal:open', {
      detail: {
        id: modalElement.id,
        name: modalElement.dataset.modal,
        element: modalElement
      }
    }));
  };

  const closeModal = (target, restoreScroll = true) => {
    let modalElement = target ? (typeof target === 'string' ? document.getElementById(target) || document.querySelector(`[data-modal="${target}"]`) : target) : activeModal;

    if (!modalElement && !target) {
      modalElement = document.querySelector('.modal.is-active, .modal.is-open');
    }

    if (!modalElement) return;

    modalElement.classList.remove('is-active', 'is-open');
    modalElement.setAttribute('aria-hidden', 'true');

    if (activeModal === modalElement) {
      activeModal = null;
    }

    const hasOtherModals = document.querySelector('.modal.is-active, .modal.is-open');
    if (!hasOtherModals && restoreScroll) {
      document.body.classList.remove('is-modal-open');
      document.body.style.paddingRight = '';
    }

    document.dispatchEvent(new CustomEvent('modal:close', {
      detail: {
        id: modalElement.id,
        name: modalElement.dataset.modal,
        element: modalElement
      }
    }));
  };

  /**
   * Хелпер для динамической установки текстов и открытия модалки успеха из Bitrix
   * @param {Object|string} options - Текст сообщения или объект { title, message }
   */
  const showModalSuccess = (options = {}) => {
    const modalEl = document.getElementById('modal-success') || document.querySelector('[data-modal="success"]');
    if (!modalEl) return;

    if (typeof options === 'string') {
      const textEl = modalEl.querySelector('.modal__text');
      if (textEl) textEl.textContent = options;
    } else if (typeof options === 'object') {
      if (options.title) {
        const titleEl = modalEl.querySelector('.modal__title');
        if (titleEl) titleEl.textContent = options.title;
      }
      if (options.message) {
        const textEl = modalEl.querySelector('.modal__text');
        if (textEl) textEl.textContent = options.message;
      }
    }

    openModal(modalEl);
  };

  /**
   * Хелпер для динамической установки текстов и открытия модалки ошибки из Bitrix
   * @param {Object|string} options - Текст ошибки или объект { title, message }
   */
  const showModalError = (options = {}) => {
    const modalEl = document.getElementById('modal-error') || document.querySelector('[data-modal="error"]');
    if (!modalEl) return;

    if (typeof options === 'string') {
      const textEl = modalEl.querySelector('.modal__text');
      if (textEl) textEl.textContent = options;
    } else if (typeof options === 'object') {
      if (options.title) {
        const titleEl = modalEl.querySelector('.modal__title');
        if (titleEl) titleEl.textContent = options.title;
      }
      if (options.message) {
        const textEl = modalEl.querySelector('.modal__text');
        if (textEl) textEl.textContent = options.message;
      }
    }

    openModal(modalEl);
  };

  // Делегирование кликов открытия / закрытия
  document.addEventListener('click', (e) => {
    // Открытие по клику на [data-modal-open="id"] или [data-modal-target="id"]
    const openTrigger = e.target.closest('[data-modal-open], [data-modal-target]');
    if (openTrigger) {
      e.preventDefault();
      const targetId = openTrigger.dataset.modalOpen || openTrigger.dataset.modalTarget;
      if (targetId) openModal(targetId);
      return;
    }

    // Закрытие по крестику или фону
    const closeTrigger = e.target.closest('[data-modal-close]');
    if (closeTrigger) {
      e.preventDefault();
      const parentModal = closeTrigger.closest('.modal');
      closeModal(parentModal || activeModal);
    }
  });

  // Закрытие по клавише Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && (activeModal || document.querySelector('.modal.is-active'))) {
      closeModal(activeModal);
    }
  });

  // Автоматическая проверка при загрузке страницы:
  // 1. Bitrix срендерил модалку уже с классом is-active или атрибутом data-auto-open
  const autoModal = document.querySelector('.modal[data-auto-open], .modal.is-active, .modal.is-open');
  if (autoModal) {
    openModal(autoModal);
  }

  // 2. Bitrix редирект с GET-параметром (стандартный ?formresult=addok или ?modal=success/?modal=error)
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('formresult') === 'addok' || urlParams.get('modal') === 'success') {
    openModal('modal-success');
  } else if (urlParams.get('formresult') === 'error' || urlParams.get('modal') === 'error') {
    openModal('modal-error');
  }

  // Экспорт в глобальный scope window для бекендера Bitrix
  window.BitrixModal = {
    open: openModal,
    close: closeModal,
    success: showModalSuccess,
    error: showModalError
  };
  window.openModal = openModal;
  window.closeModal = closeModal;
  window.showModalSuccess = showModalSuccess;
  window.showModalError = showModalError;
};

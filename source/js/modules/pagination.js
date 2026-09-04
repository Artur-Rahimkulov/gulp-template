import {createCatalogLoader} from './catalog-ajax.js';

// Пагинация, «показать ещё» и сортировка каталога через AJAX.
// Работает на data-атрибутах внутри [data-pagination-wrapper].
export const pagination = () => {
  const wrapper = document.querySelector('[data-pagination-wrapper]');
  if (!wrapper) {
    return;
  }

  const paginationEl = wrapper.querySelector('[data-pagination]');
  const selects = wrapper.querySelectorAll('[data-select="select"][data-params-search]');

  const {load} = createCatalogLoader(wrapper);

  const withCurrentParams = (href, {resetPage = false} = {}) => {
    const currentUrl = new URL(window.location.href);
    const linkUrl = new URL(href, window.location.href);

    linkUrl.searchParams.forEach((value, key) => {
      currentUrl.searchParams.set(key, value);
    });

    if (resetPage) {
      currentUrl.searchParams.delete('page');
    }

    return currentUrl.toString();
  };

  // Клик по номеру страницы / «в начало» / «дальше»
  paginationEl?.addEventListener('click', (evt) => {
    const link = evt.target.closest('a');
    if (!link || link.closest('[data-show-more-button]')) {
      return;
    }

    evt.preventDefault();
    load(withCurrentParams(link.href));
  });

  // «Показать ещё» — догрузка следующей страницы (делегирование, кнопка пересоздаётся)
  wrapper.addEventListener('click', (evt) => {
    const btn = evt.target.closest('[data-show-more-button]');
    if (!btn) {
      return;
    }

    evt.preventDefault();
    load(withCurrentParams(btn.dataset.href || btn.href || ''), true);
  });

  // Селекты сортировки
  selects.forEach((select) => {
    select.addEventListener('click', (evt) => {
      const option = evt.target.closest('[data-select="option"]');
      if (!option) {
        return;
      }

      const paramName = select.dataset.paramsSearch;
      const value = option.dataset.value;
      const url = new URL(window.location.href);

      if (!value || value === 'Все') {
        url.searchParams.delete(paramName);
      } else {
        url.searchParams.set(paramName, value);
      }
      url.searchParams.delete('page');

      load(url.toString());
    });
  });
};

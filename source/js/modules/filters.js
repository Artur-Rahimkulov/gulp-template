import {createCatalogLoader} from './catalog-ajax.js';
import {debounce} from '../utils/debounce.js';

const OPEN_CLASS = 'is-open';
const LOCK_CLASS = 'scroll-lock';
const ACTIVE_CLASS = 'is-active';

export const filters = () => {
  const panel = document.querySelector('[data-filters-panel]');
  const overlay = document.querySelector('[data-filters-overlay]');
  const openButtons = document.querySelectorAll('[data-filters-open]');
  const closeButtons = document.querySelectorAll('[data-filters-close]');

  // ------------------------------------------------------------------
  // Выезжающая панель фильтра на планшетах и мобильных
  // ------------------------------------------------------------------
  if (panel) {
    const media = window.matchMedia('(max-width: 1024px)');

    const close = () => {
      panel.classList.remove(OPEN_CLASS);
      document.body.classList.remove(LOCK_CLASS);
      overlay?.classList.remove(OPEN_CLASS);
    };

    const open = () => {
      panel.classList.add(OPEN_CLASS);
      document.body.classList.add(LOCK_CLASS);
      overlay?.classList.add(OPEN_CLASS);
    };

    openButtons.forEach((button) => button.addEventListener('click', open));
    closeButtons.forEach((button) => button.addEventListener('click', close));
    overlay?.addEventListener('click', close);

    document.addEventListener('keydown', (evt) => {
      if (evt.key === 'Escape' && panel.classList.contains(OPEN_CLASS)) {
        close();
      }
    });

    media.addEventListener('change', (evt) => {
      if (!evt.matches) {
        close();
      }
    });
  }

  // ------------------------------------------------------------------
  // AJAX-фильтрация по data-атрибутам
  // ------------------------------------------------------------------
  const filtersRoot = document.querySelector('[data-filters]');
  const wrapper = document.querySelector('[data-pagination-wrapper]');

  if (!filtersRoot || !wrapper) {
    return;
  }

  const {load} = createCatalogLoader(wrapper);

  const setTagState = (tag, active) => {
    tag.classList.toggle(ACTIVE_CLASS, active);
    tag.setAttribute('aria-pressed', active ? 'true' : 'false');
  };

  const buildUrl = () => {
    const url = new URL(window.location.href);
    const groups = filtersRoot.querySelectorAll('[data-filter-group]');

    groups.forEach((group) => url.searchParams.delete(group.dataset.filterGroup));
    groups.forEach((group) => {
      const key = group.dataset.filterGroup;
      group
          .querySelectorAll(`[data-filter-value].${ACTIVE_CLASS}`)
          .forEach((tag) => url.searchParams.append(key, tag.dataset.filterValue));
    });

    url.searchParams.delete('page');
    return url.toString();
  };

  const applyFilters = () => load(buildUrl());
  const applyFiltersDebounced = debounce(applyFilters, 400);

  filtersRoot.addEventListener('click', (evt) => {
    const tag = evt.target.closest('[data-filter-value]');
    if (!tag || tag.disabled) {
      return;
    }

    setTagState(tag, !tag.classList.contains(ACTIVE_CLASS));
    applyFiltersDebounced();
  });

  filtersRoot.querySelector('[data-filters-reset]')?.addEventListener('click', () => {
    filtersRoot
        .querySelectorAll(`[data-filter-value].${ACTIVE_CLASS}`)
        .forEach((tag) => setTagState(tag, false));
    applyFilters();
  });

  filtersRoot.querySelector('[data-filters-apply]')?.addEventListener('click', applyFilters);

  // Восстановление состояния из адресной строки при загрузке
  const restoreFromUrl = () => {
    const url = new URL(window.location.href);

    filtersRoot.querySelectorAll('[data-filter-group]').forEach((group) => {
      const values = url.searchParams.getAll(group.dataset.filterGroup);
      group
          .querySelectorAll('[data-filter-value]')
          .forEach((tag) => setTagState(tag, values.includes(tag.dataset.filterValue)));
    });
  };

  restoreFromUrl();
};

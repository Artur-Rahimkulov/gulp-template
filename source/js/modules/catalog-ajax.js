const LOADING_CLASS = 'is-loading';

// Общий загрузчик списка каталога.
// Делает fetch страницы по URL и подменяет в текущем DOM:
//   [data-list-items]        — карточки товаров
//   [data-pagination]        — блок пагинации
//   [data-show-more-button]  — кнопку «показать ещё» (data-href)
//   [data-results-count]     — счётчики (найдено, мин. цена)
// и синхронизирует адресную строку.
//
// [data-list-pinned] внутри списка (промо-карточка) сохраняется между
// обновлениями: элемент не зависит от ответа сервера и возвращается на свою
// исходную позицию после сортировки / фильтрации / пагинации.
export const createCatalogLoader = (wrapper) => {
  const list = wrapper.querySelector('[data-list-items]');
  const paginationEl = wrapper.querySelector('[data-pagination]');

  // Запоминаем закреплённые элементы и их позицию в сетке
  const pinned = list
    ? [...list.querySelectorAll('[data-list-pinned]')].map((node) => ({
      node,
      index: [...list.children].indexOf(node),
    }))
    : [];

  const productSelector = '[data-list-item]:not([data-list-pinned])';

  const reinsertPinned = () => {
    [...pinned]
        .sort((a, b) => a.index - b.index)
        .forEach(({node, index}) => {
          if (node.isConnected) {
            return;
          }
          const target = list.children[Math.min(index, list.children.length)] || null;
          list.insertBefore(node, target);
        });
  };

  const setLoading = (state) => {
    wrapper.classList.toggle(LOADING_CLASS, state);
    wrapper.setAttribute('aria-busy', state ? 'true' : 'false');
  };

  const handleEmpty = () => {
    if (!list) {
      return;
    }

    const hasProducts = Boolean(list.querySelector(productSelector));
    const existing = list.querySelector('[data-list-empty]');

    if (!hasProducts && !existing) {
      const message = document.createElement('p');
      message.className = 'catalog-list__empty';
      message.setAttribute('data-list-empty', '');
      message.textContent = 'Ничего не найдено';
      list.appendChild(message);
    } else if (hasProducts) {
      existing?.remove();
    }
  };

  const load = async (url, append = false) => {
    if (!list) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(url, {headers: {'X-Requested-With': 'XMLHttpRequest'}});
      const html = await response.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');

      const newList = doc.querySelector('[data-list-items]');
      if (!newList) {
        return;
      }

      // Закреплённые элементы ведём сами — из ответа их убираем
      newList.querySelectorAll('[data-list-pinned]').forEach((n) => n.remove());

      if (append) {
        list.insertAdjacentHTML('beforeend', newList.innerHTML);
      } else {
        list.innerHTML = newList.innerHTML;
        if (list.querySelector(productSelector)) {
          reinsertPinned();
        }
      }

      if (paginationEl) {
        const newPagination = doc.querySelector('[data-pagination]');
        paginationEl.innerHTML = newPagination ? newPagination.innerHTML : '';
      }

      const currentShowMore = wrapper.querySelector('[data-show-more-button]');
      const newShowMore = doc.querySelector('[data-show-more-button]');
      if (currentShowMore) {
        if (newShowMore) {
          currentShowMore.dataset.href = newShowMore.dataset.href || '';
        } else {
          currentShowMore.remove();
        }
      }

      wrapper.querySelectorAll('[data-results-count]').forEach((el) => {
        const fresh = doc.querySelector(`[data-results-count="${el.dataset.resultsCount}"]`);
        if (fresh) {
          el.textContent = fresh.textContent;
        }
      });

      if (!append) {
        wrapper.scrollIntoView({block: 'start', behavior: 'smooth'});
      }

      handleEmpty();
      window.history.pushState(null, '', url);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Catalog AJAX error:', err);
    } finally {
      setLoading(false);
    }
  };

  return {load};
};

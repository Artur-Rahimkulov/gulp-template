export const pagination = () => {
  const wrapper = document.querySelector('[data-pagination-wrapper]');
  if (!wrapper) {
    return;
  }

  const list = wrapper.querySelector('[data-list-items]');
  const paginationEl = wrapper.querySelector('[data-pagination]');
  let showMoreBtn = wrapper.querySelector('[data-show-more-button]');
  const selects = wrapper.querySelectorAll('[data-select="select"]');

  // ------------------------
  // загрузка
  // ------------------------

  const load = async (url, append = false) => {
    setLoading(true);

    try {
      const response = await fetch(url);
      const html = await response.text();

      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      const newList = doc.querySelector('[data-list-items]');
      const newPagination = doc.querySelector('[data-pagination]');
      const newShowMoreBtn = doc.querySelector('[data-show-more-button]');

      if (!newList) {
        return;
      }

      if (append) {
        list.insertAdjacentHTML(
            'beforeend',
            Array.from(newList.children).map((el) => el.outerHTML).join('')
        );
      } else {
        list.innerHTML = newList.innerHTML;
      }

      // scroll вверх при пагинации
      if (!append) {
        // скролл навверх страницы
        // window.scrollTo({ top: 0, behavior: 'smooth' })
        // скролл на вверх блока
        wrapper.scrollIntoView({block: 'start', behavior: 'smooth'});
      }

      // обновляем кнопку "показать ещё"
      if (newShowMoreBtn) {
        if (showMoreBtn) {
          showMoreBtn.dataset.href = newShowMoreBtn.dataset.href;
        }
      } else {
        showMoreBtn?.remove();
      }

      // обновляем пагинацию
      if (paginationEl && newPagination) {
        paginationEl.innerHTML = newPagination.innerHTML;
      }

      handleEmpty();

      history.pushState(null, '', url);

    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('AJAX error:', err);
    } finally {
      setLoading(false);
    }
  };

  // ------------------------
  // селекты
  // ------------------------

  const handleSelect = (select, option) => {
    const paramName = select.dataset.paramsSearch;
    const value = option.dataset.value;

    const url = new URL(window.location.href);

    if (value === 'Все') {
      url.searchParams.delete(paramName);
    } else {
      url.searchParams.set(paramName, value);
    }

    load(url.toString());
  };

  // ------------------------
  // состояние загрузки
  // ------------------------

  const setLoading = (state) => {
    wrapper.style.opacity = state ? '0.5' : '';
    wrapper.style.pointerEvents = state ? 'none' : '';
  };

  // ------------------------
  // пусто
  // ------------------------

  const handleEmpty = () => {
    const items = list.children.length;
    const existing = list.querySelector('.not-found');

    if (items === 0) {
      if (!existing) {
        const p = document.createElement('p');
        p.className = 'not-found';
        p.textContent = 'Ничего не найдено';
        list.appendChild(p);
      }
    } else {
      existing?.remove();
    }
  };

  // инициализация квери параметров
  const initSelectsFromUrl = () => {
    const url = new URL(window.location.href);

    selects.forEach((select) => {

      const paramName = select.dataset.paramsSearch;
      if (!paramName) {
        return;
      }

      const valueFromUrl = url.searchParams.get(paramName);
      if (!valueFromUrl) {
        return;
      }
      const options = select.querySelectorAll('[data-select="option"]');
      const buttonTitle = select.querySelector('[data-select="button"] .select__title span');
      const input = select.querySelector('input');

      options.forEach((option) => {
        const value = option.dataset.value;

        if (value === valueFromUrl) {
          // активный пункт
          option.classList.add('is-selected');

          // обновляем текст кнопки
          if (buttonTitle) {
            buttonTitle.textContent = option.textContent.trim();
          }

          // обновляем input
          if (input) {
            input.value = value;
          }
        } else {
          option.classList.remove('is-selected');
        }
      });
    });
  };

  // ------------------------
  // события
  // ------------------------

  // пагинация
  paginationEl?.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) {
      return;
    }
    if (link.closest('[data-show-more-button]')) {
      return;
    }

    e.preventDefault();

    const currentUrl = new URL(window.location.href);
    const linkUrl = new URL(link.href);

    linkUrl.searchParams.forEach((value, key) => {
      currentUrl.searchParams.set(key, value);
    });

    load(currentUrl.toString());
  });

  // показать ещё (делегирование)
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-show-more-button]');
    if (!btn) {
      return;
    }

    e.preventDefault();

    const btnUrl = new URL(btn.dataset.href, window.location.href);
    const currentUrl = new URL(window.location.href);

    btnUrl.searchParams.forEach((value, key) => {
      currentUrl.searchParams.set(key, value);
    });

    load(currentUrl.toString(), true);
  });

  // селекты
  selects?.forEach((select) => {
    select.addEventListener('click', (e) => {
      const option = e.target.closest('[data-select="option"]');
      if (!option) {
        return;
      }

      handleSelect(select, option);
    });
  });

  initSelectsFromUrl();
};

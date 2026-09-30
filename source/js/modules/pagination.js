export const pagination = () => {
  const wrapper = document.querySelector('[data-pagination-wrapper]')
  if (!wrapper) return

  const list = wrapper.querySelector('[data-list-items]')
  const paginationEl = wrapper.querySelector('[data-pagination]')
  let showMoreBtn = wrapper.querySelector('[data-show-more-button]')
  const filters = wrapper.querySelectorAll('[data-filter]')

  // ------------------------
  // загрузка
  // ------------------------

  const load = async (url, append = false) => {
    setLoading(true)

    try {
      const response = await fetch(url)
      const html = await response.text()

      const parser = new DOMParser()
      const doc = parser.parseFromString(html, 'text/html')

      const newList = doc.querySelector('[data-list-items]')
      const newPagination = doc.querySelector('[data-pagination]')
      const newShowMoreBtn = doc.querySelector('[data-show-more-button]')

      if (!newList) return

      if (append) {
        list.insertAdjacentHTML(
            'beforeend',
            Array.from(newList.children).map(el => el.outerHTML).join('')
        )
      } else {
        list.innerHTML = newList.innerHTML
      }

      // scroll вверх при пагинации
      if (!append) {
        // скролл навверх страницы
        // window.scrollTo({ top: 0, behavior: 'smooth' })
        // скролл на вверх блока
        wrapper.scrollIntoView({ block: "start", behavior: 'smooth' })
      }

      // обновляем кнопку "показать ещё"
      if (newShowMoreBtn) {
        if (showMoreBtn) {
          showMoreBtn.dataset.href = newShowMoreBtn.dataset.href
        }
      } else {
        showMoreBtn?.remove()
      }

      // обновляем пагинацию
      if (paginationEl && newPagination) {
        paginationEl.innerHTML = newPagination.innerHTML
      }

      handleEmpty()

      history.pushState(null, '', url)

    } catch (err) {
      console.error('AJAX error:', err)
    } finally {
      setLoading(false)
    }
  }

  // ------------------------
  // фильтры-чипы
  // ------------------------

  const setActiveFilter = (paramName, value) => {
    filters.forEach(chip => {
      if (chip.dataset.filter !== paramName) return
      chip.classList.toggle('is-active', chip.dataset.filterValue === value)
    })
  }

  const handleFilter = (chip) => {
    const paramName = chip.dataset.filter
    const value = chip.dataset.filterValue

    const url = new URL(window.location.href)

    // пустое значение — «Все»
    if (value) {
      url.searchParams.set(paramName, value)
    } else {
      url.searchParams.delete(paramName)
    }

    setActiveFilter(paramName, value)
    load(url.toString())
  }

  // ------------------------
  // состояние загрузки
  // ------------------------

  const setLoading = (state) => {
    wrapper.style.opacity = state ? '0.5' : ''
    wrapper.style.pointerEvents = state ? 'none' : ''
  }

  // ------------------------
  // пусто
  // ------------------------

  const handleEmpty = () => {
    const items = list.children.length
    const existing = list.querySelector('.not-found')

    if (items === 0) {
      if (!existing) {
        const p = document.createElement('p')
        p.className = 'not-found'
        p.textContent = 'Ничего не найдено'
        list.appendChild(p)
      }
    } else {
      existing?.remove()
    }
  }

  // инициализация фильтров из квери параметров
  const initFiltersFromUrl = () => {
    const url = new URL(window.location.href)
    const params = new Set(Array.from(filters, chip => chip.dataset.filter))

    params.forEach(paramName => {
      setActiveFilter(paramName, url.searchParams.get(paramName) || '')
    })
  }

  // ------------------------
  // события
  // ------------------------

  // пагинация
  paginationEl?.addEventListener('click', (e) => {
    const link = e.target.closest('a')
    if (!link) return
    if (link.closest('[data-show-more-button]')) return

    e.preventDefault()

    const currentUrl = new URL(window.location.href)
    const linkUrl = new URL(link.href)

    linkUrl.searchParams.forEach((value, key) => {
      currentUrl.searchParams.set(key, value)
    })

    load(currentUrl.toString())
  })

  // показать ещё (делегирование)
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-show-more-button]')
    if (!btn) return

    e.preventDefault()

    const btnUrl = new URL(btn.dataset.href, window.location.href)
    const currentUrl = new URL(window.location.href)

    btnUrl.searchParams.forEach((value, key) => {
      currentUrl.searchParams.set(key, value)
    })

    load(currentUrl.toString(), true)
  })

  // фильтры
  filters.forEach(chip => {
    chip.addEventListener('click', () => {
      if (chip.classList.contains('is-active')) return
      handleFilter(chip)
    })
  })

  initFiltersFromUrl()
}

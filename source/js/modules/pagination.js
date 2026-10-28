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
    setLoading(true, append)

    try {
      const response = await fetch(url)
      const html = await response.text()

      const parser = new DOMParser()
      const doc = parser.parseFromString(html, 'text/html')

      const newList = doc.querySelector('[data-list-items]')
      const newPagination = doc.querySelector('[data-pagination]')
      const newShowMoreBtn = doc.querySelector('[data-show-more-button]')

      if (!newList) return

      const prevHeight = list.offsetHeight
      let added = []

      if (append) {
        added = Array.from(newList.children).map(el => document.importNode(el, true))
        list.append(...added)
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

      // подгруженные карточки подчиняются активному фильтру
      const active = Array.from(filters).find(chip => chip.classList.contains('is-active'))
      if (active && hasLocalItems()) {
        applyFilter(active.dataset.filterValue)
      } else {
        handleEmpty()
      }

      if (append) animateAppend(prevHeight, added)

      history.pushState(null, '', url)

    } catch (err) {
      console.error('AJAX error:', err)
    } finally {
      setLoading(false, append)
    }
  }

  // ------------------------
  // плавное появление подгруженных карточек: список растёт по высоте, карточки проявляются снизу по очереди
  // ------------------------

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

  const animateAppend = (prevHeight, added) => {
    const visible = added.filter(el => !el.hidden)
    if (!visible.length || reducedMotion.matches) return

    visible.forEach((el, index) => {
      el.style.setProperty('--appear-delay', `${Math.min(index, 8) * 70}ms`)
      el.classList.add('is-appearing')
      el.addEventListener('animationend', () => {
        el.classList.remove('is-appearing')
        el.style.removeProperty('--appear-delay')
      }, { once: true })
    })

    const nextHeight = list.offsetHeight
    if (nextHeight <= prevHeight) return

    list.classList.add('is-growing')
    list.style.height = `${prevHeight}px`
    void list.offsetHeight // фиксируем стартовую высоту перед переходом
    list.style.height = `${nextHeight}px`

    const done = (e) => {
      if (e && (e.target !== list || e.propertyName !== 'height')) return
      list.removeEventListener('transitionend', done)
      clearTimeout(fallback)
      list.classList.remove('is-growing')
      list.style.height = ''
    }
    const fallback = setTimeout(done, 800)
    list.addEventListener('transitionend', done)
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

  // фильтрация без запроса: карточки с data-category скрываются, если категория не совпала
  // с data-filter-value активного чипа (пустое значение — «Все»)
  const hasLocalItems = () => Array.from(list.children).some(el => 'category' in el.dataset)

  const applyFilter = (value) => {
    Array.from(list.children).forEach(el => {
      if (!('category' in el.dataset)) return
      el.hidden = Boolean(value) && el.dataset.category !== value
    })
    handleEmpty()
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

    // есть карточки с data-category — фильтруем на месте, иначе просим список у сервера
    if (hasLocalItems()) {
      applyFilter(value)
      history.replaceState(null, '', url)
      return
    }

    load(url.toString())
  }

  // ------------------------
  // состояние загрузки
  // ------------------------

  // «Показать ещё» гасит только кнопку, остальная загрузка — весь блок
  const setLoading = (state, append = false) => {
    if (append) {
      wrapper.querySelectorAll('[data-show-more-button]').forEach(btn => btn.classList.toggle('is-loading', state))
      return
    }

    wrapper.style.opacity = state ? '0.5' : ''
    wrapper.style.pointerEvents = state ? 'none' : ''
  }

  // ------------------------
  // пусто
  // ------------------------

  const handleEmpty = () => {
    const items = Array.from(list.children).filter(el => !el.hidden && !el.classList.contains('list-empty')).length
    const existing = list.querySelector('.list-empty')

    if (items === 0) {
      if (!existing) {
        const empty = document.createElement('div')
        empty.className = 'list-empty'
        empty.innerHTML = `
          <p class="list-empty__title">Ничего не найдено</p>
          <p class="list-empty__text">По выбранному фильтру пока ничего нет. Попробуйте другую категорию.</p>`
        list.appendChild(empty)
      }
    } else {
      existing?.remove()
    }

    // пустой список — странице без проектов не нужен декор слотов (см. .projects.is-empty)
    wrapper.classList.toggle('is-empty', items === 0)

    // пустой список — «Показать ещё» не нужна (кнопку могли пересоздать после загрузки — ищем заново)
    const moreBtn = wrapper.querySelector('[data-show-more-button]')
    if (moreBtn) moreBtn.hidden = items === 0
  }

  // инициализация фильтров из квери параметров
  const initFiltersFromUrl = () => {
    const url = new URL(window.location.href)
    const params = new Set(Array.from(filters, chip => chip.dataset.filter))

    params.forEach(paramName => {
      const value = url.searchParams.get(paramName) || ''
      setActiveFilter(paramName, value)
      if (value && hasLocalItems()) applyFilter(value)
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

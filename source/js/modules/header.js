// Мобильное меню: открывается на весь экран, закрытие крестиком, по Esc и при переходе на десктоп
const DESKTOP_QUERY = '(min-width: 900px)'

export const header = () => {
  const menu = document.querySelector('[data-header-menu]')
  const openButton = document.querySelector('[data-header-open]')
  const closeButton = document.querySelector('[data-header-close]')

  if (!menu || !openButton) return

  const open = () => {
    menu.classList.add('is-open')
    openButton.setAttribute('aria-expanded', 'true')
    document.body.classList.add('scroll-lock')
    closeButton?.focus()
  }

  const close = () => {
    if (!menu.classList.contains('is-open')) return
    menu.classList.remove('is-open')
    openButton.setAttribute('aria-expanded', 'false')
    document.body.classList.remove('scroll-lock')
    openButton.focus()
  }

  openButton.addEventListener('click', open)
  closeButton?.addEventListener('click', close)

  document.addEventListener('keydown', (evt) => {
    if (evt.key === 'Escape') close()
  })

  window.matchMedia(DESKTOP_QUERY).addEventListener('change', (evt) => {
    if (evt.matches) close()
  })
}

// Проект в списке «Проекты» кликается целиком: [data-project-href] — адрес страницы проекта.
// Клик по ссылкам внутри (заголовок, «Подробнее») и выделение текста обрабатываются как обычно.
// Делегирование на document — работает и для проектов, подгруженных «Показать еще».
export const projectRows = () => {
  document.addEventListener('click', (e) => {
    const row = e.target.closest('[data-project-href]')
    if (!row || e.target.closest('a, button')) return
    if (window.getSelection()?.toString()) return

    const href = row.dataset.projectHref
    if (e.ctrlKey || e.metaKey) {
      window.open(href, '_blank')
    } else {
      window.location.href = href
    }
  })
}

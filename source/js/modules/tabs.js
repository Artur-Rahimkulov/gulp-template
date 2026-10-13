// Табы: [data-tabs] — обёртка, [data-tab-target] — переключатели (чипы), [data-tab-panel] — разделы.
// Пустой data-tab-target («Все») показывает все разделы. Активный таб пишется в адрес (#id) —
// по ссылке с якорем открывается нужный раздел.
export const tabs = () => {
  document.querySelectorAll('[data-tabs]').forEach((root) => {
    const buttons = [...root.querySelectorAll('[data-tab-target]')]
    const panels = [...root.querySelectorAll('[data-tab-panel]')]
    if (!buttons.length || !panels.length) return

    const show = (id, updateUrl) => {
      buttons.forEach((btn) => {
        const active = btn.dataset.tabTarget === id
        btn.classList.toggle('is-active', active)
        btn.setAttribute('aria-selected', String(active))
      })
      panels.forEach((panel) => {
        panel.hidden = Boolean(id) && panel.dataset.tabPanel !== id
      })
      if (updateUrl) {
        history.replaceState(null, '', id ? `#${id}` : location.pathname + location.search)
      }
    }

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        if (btn.classList.contains('is-active')) return
        show(btn.dataset.tabTarget, true)
      })
    })

    const fromHash = location.hash.slice(1)
    const initial = buttons.some((b) => b.dataset.tabTarget === fromHash) && fromHash
      ? fromHash
      : (buttons.find((b) => b.classList.contains('is-active')) || buttons[0]).dataset.tabTarget
    show(initial, false)
  })
}

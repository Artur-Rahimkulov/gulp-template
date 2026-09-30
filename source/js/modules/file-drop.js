// Зона «Прикрепить резюме»: выбор файла по клику и перетаскивание.
// Разметка: label[data-file-drop] > input[type=file] + [data-file-drop-label]
export const fileDrop = () => {
  document.querySelectorAll('[data-file-drop]').forEach((zone) => {
    const input = zone.querySelector('input[type="file"]')
    const label = zone.querySelector('[data-file-drop-label]')
    if (!input || !label) return

    const defaultText = label.textContent

    const update = () => {
      const file = input.files[0]
      zone.classList.toggle('is-filled', Boolean(file))
      label.textContent = file ? file.name : defaultText
    }

    input.addEventListener('change', update)

    zone.addEventListener('dragover', (evt) => {
      evt.preventDefault()
      zone.classList.add('is-dragover')
    })

    zone.addEventListener('dragleave', () => {
      zone.classList.remove('is-dragover')
    })

    zone.addEventListener('drop', (evt) => {
      evt.preventDefault()
      zone.classList.remove('is-dragover')
      if (!evt.dataTransfer.files.length) return
      input.files = evt.dataTransfer.files
      update()
    })
  })
}

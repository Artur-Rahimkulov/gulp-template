// Прикрепление нескольких документов в форме «Контакты».
// [data-files] — блок, [data-files-input] — input type=file multiple, [data-files-list] — список прикреплённых.
// Выбранные файлы накапливаются (повторный выбор добавляет, а не заменяет), крестик убирает файл из отправки.
export const contactsFiles = () => {
  document.querySelectorAll('[data-files]').forEach((block) => {
    const input = block.querySelector('[data-files-input]')
    const list = block.querySelector('[data-files-list]')
    if (!input || !list) return

    let files = []

    const sync = () => {
      const transfer = new DataTransfer()
      files.forEach((file) => transfer.items.add(file))
      input.files = transfer.files

      list.innerHTML = ''
      files.forEach((file, index) => {
        const item = document.createElement('li')
        item.className = 'contacts-form__file'
        item.innerHTML = `
          <button class="contacts-form__file-remove" type="button" aria-label="Убрать файл"></button>
          <span class="contacts-form__file-status">Файл прикреплен</span>
          <span class="contacts-form__file-name"></span>`
        item.querySelector('.contacts-form__file-name').textContent = file.name
        item.querySelector('button').addEventListener('click', () => {
          files.splice(index, 1)
          sync()
        })
        list.append(item)
      })
    }

    input.addEventListener('change', () => {
      const names = new Set(files.map((file) => file.name + file.size))
      Array.from(input.files).forEach((file) => {
        if (!names.has(file.name + file.size)) files.push(file)
      })
      sync()
    })

    // после отправки формы список очищается
    input.form?.addEventListener('reset', () => {
      files = []
      sync()
    })
  })
}

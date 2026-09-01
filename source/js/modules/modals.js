// у кнопки открывающей модалку значение дата атрибута data-modal-button
// и у модалки значение дата-атрибута data-modal должно совпадать
// например у кнопки data-modal-button="modal-feedback" и у модалки data-modal="modal-feedback"
// пример работы модалки есть в файли index.html

// для вызова из разметки бэком доступны глобальные функции:
//   window.openModal('modal-feedback')  - открыть модалку
//   window.closeModal('modal-feedback') - закрыть модалку (без аргумента закроет активную)
// например: <button onclick="openModal('modal-feedback')">Открыть</button>

const getScrollbarWidth = () => (window.innerWidth - document.body.clientWidth) + 'px'

const restoreScroll = () => {
	document.body.style.overflow = null
	document.body.style['padding-right'] = null
}

const openModal = (name) => {
	const modal = document.querySelector(`[data-modal="${name}"]`)
	if (!modal) return
	const scrollbarWidth = getScrollbarWidth()
	document.body.style.overflow = 'hidden'
	document.body.style['padding-right'] = scrollbarWidth
	modal.classList.add('active')
}

const closeModal = (name) => {
	const modal = name
		? document.querySelector(`[data-modal="${name}"]`)
		: document.querySelector('.modal.active')
	if (!modal) return
	modal.classList.remove('active')
	restoreScroll()
}

window.openModal = openModal
window.closeModal = closeModal

export const modals = () => {
	const modalButtons = document.querySelectorAll('[data-modal-button]')
	const modals = Array.from(document.querySelectorAll('[data-modal]'))

	if (modalButtons[0] && modals[0]) {
		modalButtons.forEach(button => {
			button.addEventListener('click', () => {
				openModal(button.getAttribute('data-modal-button'))
			})
		})
	}

	const handleCloseButtonClick = (evt) => {
		const closeButton = evt.target.closest('[data-close-modal]')
		if (closeButton) {
			const modal = closeButton.closest('[data-modal]')
			closeModal(modal.getAttribute('data-modal'))
		}
	}

	const handleEscPress = (evt) => {
		if (evt.key === 'Escape') {
			closeModal()
		}
	}

	const handleOverlayClick = (evt) => {
		if (evt.target.classList.contains('modal')) {
			closeModal()
		}
	}

	window.addEventListener('click', handleCloseButtonClick)
	window.addEventListener('keydown', handleEscPress)
	window.addEventListener('click', handleOverlayClick)
}
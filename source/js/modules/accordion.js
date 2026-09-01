export const accordion = () => {
    const accordions = document.querySelectorAll('[data-accordion]')

    if (accordions[0]) {
        const removeActiveClass = (accordionItems) => {
            accordionItems.forEach(accordionItem => {
                accordionItem.classList.remove('active')
            })
        }

        accordions.forEach(accordion => {
            const accordionItems = accordion.querySelectorAll('[data-accordion-item]')
            accordionItems.forEach(accordionItem => {
                const accordionButton = accordionItem.querySelector('[data-accordion-button]')
                accordionButton.addEventListener('click', (evt) => {
                    if (accordion.dataset.accordion === 'single-expand' && !evt.target.closest('.active')) {
                        removeActiveClass(accordionItems)
                    } 
                    accordionItem.classList.toggle('active')
                })
            })
        })
    }
}

export const accordion = () => {
  const accordions = document.querySelectorAll('[data-accordion]');

  if (accordions[0]) {
    const removeActiveClass = (accordionItems) => {
      accordionItems.forEach((accordionItem) => {
        accordionItem.classList.remove('active');
      });
    };

    accordions.forEach((accordionEl) => {
      const accordionItems = accordionEl.querySelectorAll('[data-accordion-item]');
      accordionItems.forEach((accordionItem) => {
        const accordionButton = accordionItem.querySelector('[data-accordion-button]');
        accordionButton.addEventListener('click', (evt) => {
          if (accordionEl.dataset.accordion === 'single-expand' && !evt.target.closest('.active')) {
            removeActiveClass(accordionItems);
          }
          accordionItem.classList.toggle('active');
        });
      });
    });
  }
};

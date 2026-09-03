export const select = () => {
  const selectClose = (selectEl, option) => {
    selectEl.classList.remove('is-open');

    if (option) {
      option.classList.add('is-selected');

      const input = selectEl.querySelector('input');
      if (input) {
        // Устанавливаем новое значение
        input.setAttribute('value', option.getAttribute('data-value'));
      }
    }
  };

  document.body.addEventListener('click', (e) => {
    const selectActive = document.querySelector(
        '[data-select="select"].is-open'
    );

    if (selectActive) {
      selectActive.classList.remove('is-open');
    }

    if (e.target.getAttribute('data-select') === 'button') {
      const selectEl = e.target.closest('[data-select="select"]');

      if (selectEl === selectActive) {
        selectEl.classList.remove('is-open');
      } else {
        selectEl.classList.add('is-open');
      }

      const optionList = selectEl.querySelector('[data-select="options"]');
      const optionItems = selectEl.querySelectorAll('[data-select="option"]');

      optionItems.forEach((option) => {
        option.addEventListener('click', () => {
          const optionSelected = optionList.querySelector('.is-selected');
          if (optionSelected && optionSelected !== option) {
            optionSelected.classList.remove('is-selected');
          }

          selectClose(selectEl, option);
          selectEl.querySelector('span').innerHTML = option.innerHTML;
        });
      });
    }
  });
};

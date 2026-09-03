import IMask from 'imask';

export const inputPhone = () => {
  const init = (input) => {
    if (input._imask) {
      return;
    }

    input._imask = new IMask(input, {
      mask: '+{7} (000) 000-00-00',
    });
  };

  document.querySelectorAll('[data-type="phone"]').forEach(init);

  document.addEventListener('focusin', (e) => {
    const input = e.target.closest('[data-type="phone"]');
    if (!input) {
      return;
    }

    init(input);
  });
};

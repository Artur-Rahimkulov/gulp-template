/**
 * Модуль динамического расчета доступных строк для описания новости на главной.
 * Рассчитывает оставшееся свободное пространство между заголовком любой высоты
 * и футером (кнопкой «Подробнее»), оставляя ровно 1 строку запаса до кнопки.
 */

export const newsCards = () => {
  const cards = document.querySelectorAll('.card-news-tab');
  if (!cards.length) return;

  const updateCardClamps = () => {
    // На мобильной экранной версии текст новости скрыт дизайном
    if (window.matchMedia('(max-width: 899.98px)').matches) return;

    cards.forEach((card) => {
      const content = card.querySelector('.card-news-tab__content');
      const title = card.querySelector('.card-news-tab__title');
      const text = card.querySelector('.card-news-tab__text');
      const footer = card.querySelector('.card-news-tab__footer');

      if (!content || !title || !text || !footer) return;

      // Сбрасываем ограничение, чтобы измерить честную высоту заголовка
      text.style.webkitLineClamp = 'none';

      const titleRect = title.getBoundingClientRect();
      const footerRect = footer.getBoundingClientRect();

      // Расстояние от низа заголовка до верха футера
      const availableSpace = footerRect.top - titleRect.bottom;

      // line-height текста = 20px (2rem), margin-top = 10px (1rem), буфер перед кнопкой = 20px (1 строка)
      const lineHeight = parseFloat(window.getComputedStyle(text).lineHeight) || 20;
      const marginTop = parseFloat(window.getComputedStyle(text).marginTop) || 10;
      const buffer = lineHeight; // ровно 1 строка запаса перед кнопкой

      const usableHeight = availableSpace - marginTop - buffer;
      const maxLines = Math.floor(usableHeight / lineHeight);

      if (maxLines <= 0) {
        text.style.display = 'none';
      } else {
        text.style.display = '-webkit-box';
        text.style.webkitLineClamp = String(maxLines);
      }
    });
  };

  updateCardClamps();

  window.addEventListener('resize', updateCardClamps, { passive: true });
};

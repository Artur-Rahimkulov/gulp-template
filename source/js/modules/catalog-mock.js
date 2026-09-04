/**
 * ЗАГЛУШКА каталога для статического шаблона.
 *
 * Перехватывает fetch-запросы, которые делает catalog-ajax.js, и отдаёт
 * HTML той же структуры, что ждёт фронт. Нужна только чтобы фильтрация,
 * сортировка и пагинация работали без бэкенда.
 *
 * Как прикрутить бэкенд:
 *   1. Реализовать GET по текущему URL страницы каталога с query-параметрами:
 *        category         — категорийные теги в hero (servers|storage|network|ups|software)
 *        brand, availability, form-factor, model, cpu-type, cpu-count,
 *        ram, max-disks   — мультизначные (?brand=Dell&brand=Lenovo)
 *        sort             — asc | desc | popular | new
 *        page             — номер страницы (1..N)
 *   2. Ответ — HTML-фрагмент (или целая страница), где есть узлы:
 *        [data-list-items]                 — карточки товаров
 *        [data-pagination]                — разметка пагинации
 *        [data-show-more-button][data-href] — кнопка «показать ещё» (или её нет)
 *        [data-results-count="found"] / [data-results-count="min-price"]
 *   3. Удалить импорт initCatalogMock из main.js и этот файл.
 */

const PAGE_SIZE = 9;

const BRANDS = ['Hewlett Packard', 'Dell', 'Lenovo', 'Acer', 'AIC', 'ASUS', 'Cisco'];
const AVAILABILITY = ['В наличии', 'Под заказ'];
const FORM_FACTORS = ['1U', '2U', '3U', '4U', '12U', 'Mid Tower', 'Mini Tower', 'Tower'];
const MODELS = ['PowerEdge R650', 'ProLiant DL380'];
const CPU_TYPES = ['Intel Xeon', 'AMD EPYC'];
const CPU_COUNTS = ['1', '2', '4'];
const RAM = ['32 Gb', '64 Gb', '128 Gb'];
const MAX_DISKS = ['8', '12', '24'];

const CATEGORIES = ['servers', 'storage', 'network', 'ups', 'software'];

const pick = (arr, i) => arr[i % arr.length];

// Детерминированный набор «товаров»
const PRODUCTS = Array.from({length: 34}, (_, i) => {
  const brand = pick(BRANDS, i);
  const formFactor = pick(FORM_FACTORS, i + 1);
  const cpuType = pick(CPU_TYPES, i);
  const cpuCount = pick(CPU_COUNTS, i + 1);
  const ram = pick(RAM, i + 2);
  const maxDisks = pick(MAX_DISKS, i);

  return {
    'id': i + 1,
    'title': `Сервер ${brand} ${pick(MODELS, i)} (${formFactor})`,
    'price': 189000 + i * 7350,
    'partNumber': `P${22000 + i * 37}-${100 + i}`,
    brand,
    'category': pick(CATEGORIES, i),
    'availability': pick(AVAILABILITY, i),
    'form-factor': formFactor,
    'model': pick(MODELS, i),
    'cpu-type': cpuType,
    'cpu-count': cpuCount,
    'ram': ram,
    'max-disks': maxDisks,
    'popularity': (i * 13) % 100,
    'createdAt': i,
    'specs': [
      `Rack ${formFactor}`,
      `${cpuCount} x ${cpuType}`,
      `${ram} DDR4`,
      `до ${maxDisks} дисков`,
      'SAS/SATA/SSD/NVMe'
    ],
  };
});

const FILTER_KEYS = [
  'category', 'brand', 'availability', 'form-factor', 'model',
  'cpu-type', 'cpu-count', 'ram', 'max-disks'
];

const formatPrice = (value) => `${value.toLocaleString('ru-RU')} ₽`;

const filterProducts = (params) => {
  let result = PRODUCTS.filter((product) =>
    FILTER_KEYS.every((key) => {
      const wanted = params.getAll(key);
      return wanted.length === 0 || wanted.includes(String(product[key]));
    })
  );

  switch (params.get('sort')) {
    case 'desc':
      result = result.slice().sort((a, b) => b.price - a.price);
      break;
    case 'popular':
      result = result.slice().sort((a, b) => b.popularity - a.popularity);
      break;
    case 'new':
      result = result.slice().sort((a, b) => b.createdAt - a.createdAt);
      break;
    default:
      result = result.slice().sort((a, b) => a.price - b.price);
  }

  return result;
};

const renderCard = (product) => `
  <article class="product-card" data-list-item>
    <div class="product-card__media">
      <span class="product-card__corner product-card__corner--start" aria-hidden="true"></span>
      <span class="product-card__corner product-card__corner--end" aria-hidden="true"></span>
      <img class="product-card__image" src="assets/img/server-dell.webp" width="240" height="45" alt="${product.title}" loading="lazy">
      <div class="product-card__badges">
        <span class="badge badge--stock">${product.availability === 'В наличии' ? 'Склад' : 'Под заказ'}</span>
      </div>
    </div>
    <div class="product-card__body">
      <div class="product-card__info">
        <p class="product-card__price">от ${formatPrice(product.price)}</p>
        <div class="product-card__summary">
          <h3 class="product-card__title">
            <a class="product-card__link" href="#">${product.title}</a>
          </h3>
          <ul class="product-card__specs spec-list">
            ${product.specs.map((spec) => `<li class="spec-list__item">${spec}</li>`).join('')}
          </ul>
        </div>
      </div>
      <div class="product-card__actions">
        <p class="product-card__partnometer">Партнометр: <span>${product.partNumber}</span></p>
        <div class="product-card__buttons">
          <div class="product-card__actions-row">
            <button class="btn btn--soft btn--lg btn--icon-left product-card__buy" type="button">
              <span class="btn__icon"><svg class="icon" width="24" height="24" aria-hidden="true" focusable="false"><use href="assets/svg/sprite.svg#icon-bag"></use></svg></span>
              <span class="btn__label">Купить в 1 клик</span>
            </button>
            <button class="btn btn--outlined btn--square product-card__cart" type="button" aria-label="Добавить в корзину">
              <svg class="icon" width="24" height="24" aria-hidden="true" focusable="false"><use href="assets/svg/sprite.svg#icon-cart"></use></svg>
            </button>
          </div>
          <button class="btn btn--primary btn--lg btn--icon-left btn--block" type="button">
            <span class="btn__icon"><svg class="icon" width="24" height="24" aria-hidden="true" focusable="false"><use href="assets/svg/sprite.svg#icon-gear"></use></svg></span>
            <span class="btn__label">Сконфигурировать</span>
          </button>
        </div>
      </div>
    </div>
  </article>`;

const navLink = (label, targetPage, disabled) => (disabled
  ? `<span class="pagination__nav is-disabled" aria-disabled="true">${label}</span>`
  : `<a class="pagination__nav" href="?page=${targetPage}">${label}</a>`);

const renderPagination = (page, totalPages) => {
  const items = [];
  for (let num = 1; num <= totalPages; num += 1) {
    const active = num === page ? ' is-active' : '';
    items.push(`<li><a class="pagination__page${active}" href="?page=${num}"${active ? ' aria-current="page"' : ''}>${num}</a></li>`);
  }

  return `
    <nav class="pagination" aria-label="Пагинация каталога" data-pagination>
      ${navLink('В начало', 1, page <= 1)}
      <ul class="pagination__list">${items.join('')}</ul>
      ${navLink('Дальше', page + 1, page >= totalPages)}
    </nav>`;
};

const buildResponseHtml = (params) => {
  const all = filterProducts(params);
  const page = Math.max(1, parseInt(params.get('page'), 10) || 1);
  const totalPages = Math.max(1, Math.ceil(all.length / PAGE_SIZE));
  const pageItems = all.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const cards = pageItems.map(renderCard).join('\n');
  const minPrice = all.length ? formatPrice(Math.min(...all.map((p) => p.price))) : '—';
  const showMore = page < totalPages
    ? `<button class="btn btn--outlined btn--md btn--block" type="button" data-show-more-button data-href="?page=${page + 1}">Показать еще</button>`
    : '';

  return `<!doctype html><html><body>
    <b data-results-count="found">${all.length}</b>
    <b data-results-count="min-price">${minPrice}</b>
    <div data-list-items>${cards}</div>
    <div>${showMore}</div>
    ${renderPagination(page, totalPages)}
  </body></html>`;
};

export const initCatalogMock = () => {
  const wrapper = document.querySelector('[data-pagination-wrapper][data-catalog-mock]');
  if (!wrapper || typeof window.fetch !== 'function') {
    return;
  }

  const realFetch = window.fetch.bind(window);
  const pagePath = window.location.pathname;

  window.fetch = (input, init) => {
    const requestUrl = new URL(
        typeof input === 'string' ? input : input.url,
        window.location.href
    );

    if (requestUrl.pathname !== pagePath) {
      return realFetch(input, init);
    }

    const body = buildResponseHtml(requestUrl.searchParams);
    return Promise.resolve(
        new Response(body, {status: 200, headers: {'Content-Type': 'text/html; charset=utf-8'}})
    );
  };
};

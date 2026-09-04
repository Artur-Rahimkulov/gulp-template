# План исправлений по код-ревью (`remake.txt`)

Статус: 🟩 сделано · 🟨 в работе · ⬜ не начато

---

## 1. Общие замечания

### 1.1. Убрать robots.txt — 🟩
- [x] `source/robots.txt` удалён, ссылка убрана из `gulp/copyAssets.mjs`.
- [x] `build/` в `.gitignore` и полностью пересобирается (`clean`), устаревший `build/robots.txt` уходит сам.
- [x] Ссылок в `gulpfile.js`/вотчерах нет.
- [ ] Открытый вопрос: судьба `<meta name="robots" content="noindex, nofollow">` в `source/html/base/head.html:5` — уточнить у менеджера (для дев-шаблона ок).

### 1.2. Локальные шрифты — 🟩
- [x] Скачаны вариативные `woff2` (latin + cyrillic субсеты): `source/fonts/{inter,onest}-{latin,cyrillic}.woff2`.
- [x] `@font-face` в `source/sass/global/fonts.scss`, `font-display: swap`, `font-weight: 400 600`, `unicode-range` по субсетам.
- [x] Из `head.html` убраны `preconnect` + `<link>` Google Fonts, добавлены `<link rel="preload">` на 4 файла.
- [x] Удалён неиспользуемый `source/fonts/merriweatherregular.woff2`.
- [x] Проверено: `copy` кладёт `source/fonts/**` → `build/fonts/`, в CSS `url(../fonts/…)` резолвится.

### 1.3. Адаптивность и резиновая вёрстка — 🟨 (высокий приоритет)
- [x] Починен `source/sass/breakpoints.scss`: убран дубликат ключа `$vp-360`, имена приведены к значениям (`$vp-768`, `$vp-575`, `$vp-992`), удалён неиспользуемый `$vp-991`.
- [x] Добавлены миксины промежуточных точек: `vp-1280`, `vp-1140`, `vp-992` + универсальный `vp($width)`. Существующие `vp-1440/1024/756/360` сохранены (используются 60+ раз).
- [x] `.container` — резиновый боковой padding `clamp(16px, 3.2vw, 40px)` вместо немонотонной лесенки 40→32→40.
- [x] `.catalog__aside` — резиновая ширина `clamp(272px, 22vw, 328px)` вместо скачка 328→280.
- [x] **Проверка в Chrome** (iframe-стенд, каталог на 375/768/1000/1280/1366/1440):
  - было: «Купить в 1 клик» ломался на 2–3 строки в 3-колоночной сетке ниже ~1440 → добавлен `white-space: nowrap` на лейбл + уменьшен gap иконки; сетка товаров переходит на 2 колонки при `≤1280` (`vp-1280`).
  - было: на 375–575 тулбар каталога и селект сортировки вылезали за край (стили были только для `≤360`) → `catalog-list` и `product-card` мобильные блоки переведены с `vp-360` на `vp-575`; тулбару добавлены `flex-wrap` и `max-width` селекту.
- [ ] Резиновость типографики (`clamp()` / `RubberSize`) для крупных заголовков `catalog-hero__title`, `seo-text__title`, `intro-title` — **осознанно отложено**: размеры заданы по макету ступенями, fluid может разойтись с дизайном. Согласовать.
- [ ] Остальные страницы (`index`, `main`, `ui-kit`) в Chrome не проверялись — пройтись при необходимости.
- [ ] Спорные места дизайна — уточнять у менеджера, не верстать «как есть».

### 1.4. Растровые → WebP, в разметке сразу WebP — 🟩
- [x] Разметка переведена на `.webp`: `catalog-hero.html`, `catalog-promo.html` (×2), `menu-{cases,company,it-solutions,support}.html`, `product-card.html`.
- [x] `cta.scss` — `background url()` переведён на `cta-bg.webp` (×4).
- [x] `gulp/copyAssets.mjs`: `copyImages` больше не копирует растр в `build` (только webp, если появятся в исходниках). `copy` уже исключал растр.
- [x] `gulpfile.js`: порядок `webpImages` → `copyImages` (в `build` и в вотчере).
- [x] `gulp/optimizeImages.mjs`: исправлены пути `createWebp`/`optimizeImages` (`source/assets/img`, `build/assets/img`), убран мёртвый импорт/код. `svgo` оставлен ручным (вынут из `build`, чтобы не переписывать исходники на каждой сборке).
- [x] Проверено: `build/assets/img/` содержит только `.webp`, `googleapis/gstatic` в `build/` нет, растровых файлов в `build/` нет.
- [x] Решено: чистый `.webp` без `<picture>`/fallback.

---

## 2. Стили

### 2.1. Адаптив в каждом классе отдельно — 🟨
- [x] `catalog-list.scss` — «хвостовые» `@include vp-*` разнесены внутрь каждого `&__`-селектора.
- [ ] Остальные `components/*.scss` (`catalog-filters` — модальный режим `.filters` оставлен единым блоком осознанно: элемент целиком меняет роль на ≤1024). Пройтись при следующем касании файлов.

### 2.2. Убрать лишние комментарии — 🟨
- [x] `catalog-filters.scss`, `catalog-list.scss` — убраны пояснительные комментарии со ссылками на макет; оставлен только комментарий про перебивание `.btn--outlined`.
- [ ] Разделители `// ----` — проектная конвенция (есть и в `variables.scss`/`style.scss`), не трогаем. Точечная чистка `по макету`-комментариев в остальных файлах — по мере правок.

### 2.3. rem вместо px — 🟩
- [x] Подключён `postcss-pxtorem` в `gulp/compileStyles.mjs` (`rootValue: 16`, `minPixelValue: 2`, `mediaQuery: false`). В исходниках пишем px из макета — в CSS уходит `rem`.
- [x] Проверено: в `build/css/style.css` ~720 `rem`, px остаются только у брейкпоинтов (медиа) и бордеров < 2px.
- [ ] `postcss-pxtorem` добавлен через `npm` (в `package.json`). `pnpm-lock.yaml` не обновлён — при работе через pnpm выполнить `pnpm install`.

---

## 3. JS — AJAX на фильтрации/пагинации через data-атрибуты — 🟩

- [x] Общий загрузчик вынесен в `source/js/modules/catalog-ajax.js` (`createCatalogLoader`): fetch страницы, подмена `[data-list-items]`, `[data-pagination]`, `[data-show-more-button]`, `[data-results-count]`, `history.pushState`, класс `is-loading`, `aria-busy`, пустой результат.
- [x] `pagination.js` переписан на общий загрузчик: клики по страницам, «показать ещё» (делегирование), селект сортировки (`data-params-search`).
- [x] `filters.js` расширен: тоггл `[data-filter-value]` → сбор активных по группам `[data-filter-group]` → `URLSearchParams` (multi-value) → дебаунс 400мс → `load`. Кнопки `[data-filters-reset]` / `[data-filters-apply]`. Восстановление состояния из URL при загрузке. Панель на ≤1024 работает как раньше.
- [x] Разметка приведена к контракту: `catalog-list.html` (`data-pagination-wrapper`, `data-list-items`, `data-pagination`, `data-show-more-button[data-href]`, `data-results-count`), `catalog-filters.html` (`data-filter-group`, `data-filter-value`, `aria-pressed`), карточки — `data-list-item`.
- [x] Индикатор загрузки — класс `.catalog-list.is-loading` в SCSS (вместо инлайновых `wrapper.style`).
- [x] **Заглушка бэкенда**: `source/js/modules/catalog-mock.js` — патчит `fetch`, отдаёт HTML нужной структуры из in-memory набора товаров (фильтр/сортировка/пагинация работают без сервера). Включается атрибутом `data-catalog-mock` на `[data-pagination-wrapper]`. В шапке файла — контракт для бэкенда (query-параметры, узлы ответа) и как удалить заглушку.
- [ ] Реальный бэкенд по тому же контракту — заменяет заглушку.

---

## 4. HTML

### 4.1. Повторяющийся блок в компонент — 🟩
- [x] Создан `source/html/components/dropdown-promo.html` (параметр `title`, опц. `href`).
- [x] Подключён через `@@include(..., { "title": … })` в `menu-cases/company/it-solutions/support.html` — 4 копии блока удалены.

### 4.2. Текст разметкой, не картинкой — 🟨
Проверено по Figma (локальный Dev Mode MCP), ноды `2742:41124` и `2742:41130` — это **промо-карточки сайдбара** (`catalog-promo.html`), не hero-баннер.
- Нода 2742:41124 (328×378): заголовок «Помощь в выборе сервера под Ваши задачи и требования» + кнопка-стрелка 36×36 (`#005aa3`, radius 8) + фото ЦОД 280×210. Тёмный градиент (`--promo-gradient`).
- Нода 2742:41130 (328×260): заголовок «Калькулятор RAID» + та же кнопка-стрелка, фон — текстура RAID.
- Типографика заголовков: Onest Medium 20/24 («Web/Heading 5»).
- [x] `catalog-promo.html` переверстан: заголовок (`h3`) + стрелка (`span` со svg `#icon-chevron-right`) — реальная разметка; изображение — только фон/фото.
- [x] `catalog-promo.scss` переписан под макет (градиент, кнопка, раскладка).
- [ ] **Нужны картинки без вшитого текста**: текущие `promo-datacenter` / `promo-raid` — это готовые карточки с текстом внутри, из-за чего текст дублируется. Дизайн должен отдать: фото ЦОД (~280×210) и текстуру RAID (328×260) без надписей.
- [ ] `catalog-hero__banner-img` — по Figma не проверялся (нода не давалась), уточнить у менеджера, есть ли текст в растре.

### 4.3. Контент из админки — без классов, стилизация от родителя — 🟩
- [x] `source/html/components/seo-text.html`: убраны `seo-text__list`, `spec-list*`, `seo-text__lead` с `<ul>/<li>/<p>` внутри `__body`.
- [x] `source/sass/components/seo-text.scss`: стилизация по тегам `.seo-text__body { p {} ul {} li {} }`, удалён неиспользуемый `.spec-list--md`.
- [ ] Проверить описания товаров и прочие «текстовые» зоны (в `product-card` спеки — часть UI-компонента, классы там оправданы).

### 4.4. Непонятный «?» — 🟩
- [x] `product-card.html`: у `spec-list__hint` добавлены `title` + `data-tooltip` с пояснением про гарантию; глиф «?» оставлен как понятный маркер справки, `aria-label` сохранён. Полноценный поповер — при появлении JS-тултипа.

---

## Порядок работ

| # | Объём | Этап |
|---|---|---|
| 1 | S | 🟩 robots.txt дочистить, удалить лишний шрифт |
| 2 | M | 🟩 Локальные `@font-face`, убрать Google Fonts |
| 3 | M | 🟩 Починить `breakpoints.scss`, почистить `optimizeImages.mjs` |
| 4 | M | 🟩 WebP в разметке + порядок тасков |
| 5 | L | 🟨 Резиновая вёрстка: container + сайдбар — резина; сетка 2 кол. ≤1280; мобилка ≤575; типографика-clamp отложена |
| 6 | M | 🟩 AJAX-фильтры + разметка + **заглушка бэкенда** (`catalog-mock.js`) |
| 7 | M | 🟩 px → rem через `postcss-pxtorem` |
| 8 | S | 🟩 HTML: компонент dropdown-promo, классы в seo-text, «?» |
| 9 | S | 🟨 Убрать лишние комментарии в SCSS, разнести адаптив по классам (сделано для catalog-list/filters) |
| 10 | — | 🟨 Промо-карточки каталога переверстаны под Figma (текст разметкой) |

## Осталось / требует внешнего ввода
- **Картинки промо-карточек без текста** (4.2) — дизайн должен отдать фото ЦОД и текстуру RAID без вшитых надписей, иначе текст дублируется.
- **Резиновая типографика** (5) — согласовать с дизайном перевод ступенчатых размеров заголовков в `clamp()`.
- **Сетка 3→2 колонки при ≤1280** и **мобилка с ≤575** — отклонение от макетных брейкпоинтов ради «не плывёт»; подтвердить у менеджера.
- **Реальный бэкенд** (6) по контракту из `catalog-mock.js`.
- **`<picture>` + fallback** для webp — решено: не нужен (чистый `.webp`).
- **`banner-hero`** — проверить в Figma/у менеджера на вшитый текст.
- **pnpm** — при работе через pnpm выполнить `pnpm install` (добавлен `postcss-pxtorem`).

## Заметки по окружению
- Сборка требует `NODE_OPTIONS=--openssl-legacy-provider` (webpack 4 + Node 17+). Уже прописано в `package.json` → `npm run build` / `npm start` работают; голый `npx gulp build` — нет.

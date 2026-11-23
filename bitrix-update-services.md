# Обновление вёрстки: карточки услуг, форма консультации, футер

Изменения после прод-коммита `470147e` для переноса в шаблон 1C-Bitrix.

Затронуто:
- каталог «Услуги» (`services.html`) — карточки услуг и блок «Нужна консультация по выбору услуг?»;
- детальная услуга (`service.html`) — блок «Комплекс работ в рамках услуги»;
- футер на всех страницах — список «Услуги» (только CSS).

JS и остальная вёрстка не менялись.

Все пути указаны от корня сборки `build/`. На сервере это та же структура внутри папки шаблона Bitrix — там, где лежат `css/` и `assets/`.

---

## 1. Файлы для заливки по FTP

Перед заливкой выполните продакшен-сборку: `npm run build`.

### Стили (заменить)

- `css/style.css`
- `css/style.min.css`
- `css/style.min.css.map` — если карта загружается на сервер

### Картинки услуг (заменить все, 58 файлов) — `assets/img/`

```
services-{код}.webp
services-{код}-m.webp
```

Коды: `agree`, `ak`, `aps`, `asud`, `asutp`, `aupt`, `bktp`, `check`, `design`, `eg`, `em`, `en`, `eo`, `es`, `kl`, `ktpn`, `mast`, `oru`, `permit`, `repair1`, `repair2`, `sks`, `skud`, `smart`, `soue`, `spdv`, `ss`, `vl`.

Иллюстрации теперь прозрачные и обрезаны по содержимому. Со старыми картинками новые стили будут выглядеть неправильно, поэтому заменить нужно все.

### Больше не используются (можно удалить с сервера)

- `assets/img/service-card-gas.webp`
- `assets/img/service-card-motor.webp`
- `assets/img/service-card-light.webp`
- `assets/img/service-card-shadow.webp`
- `assets/img/service-card-bg.webp`

Тени `services-shadow.webp`, `services-shadow-m.webp`, `services-shadow-wide.webp` и `services-shadow-wide-m.webp` не менялись и уже должны лежать на сервере. Теперь их использует и детальная страница.

---

## 2. Каталог «Услуги» — карточка `.service-tile`

### Новый класс на корневом `<a>`: `service-tile--art-{код}`

По этому коду CSS ставит иллюстрацию на её место.

```html
<a class="service-tile service-tile--small service-tile--art-eg" href="...">
```

У каждого элемента инфоблока должен быть код картинки (`eg`, `em`, …). Тот же код уже используется в путях `services-{код}.webp`. Если у карточки код не из списка, картинка встанет на место по умолчанию: вверху, по центру.

### SVG-декор внутри `.service-tile__bg`

Добавлен первый `<path>`, у остальных убран `fill`, обводка стала 2px.

```html
<svg class="service-tile__decor" viewBox="0 0 435 329" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
  <!-- у широкой карточки: viewBox="0 0 666 329" -->
  <path d="M0 54H173" stroke="rgba(255, 255, 255, 0.08)" stroke-width="2" />
  <path d="M173 54H435V329H72L173 54Z" stroke="rgba(255, 255, 255, 0.08)" stroke-width="2" />
  <!-- у широкой карточки: d="M173 54H666V329H72L173 54Z" -->
</svg>
```

Остальная разметка (`<picture>`, `__body`, `__title`, `__text`, `__arrow`) не изменилась.

---

## 3. Детальная услуга — «Комплекс работ», карточка `.service-card`

Разметка карточки заменена целиком. Модификаторы `--gas`, `--motor` и `--light` удалены, ширина и высота у `<img>` больше не задаются. Картинки теперь те же, что в каталоге, и с мобильной версией.

### Было

```html
<a class="service-card service-card--gas" href="...">
  <span class="service-card__bg" aria-hidden="true">
    <svg class="service-card__decor" viewBox="0 0 435 329" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
      <path d="M173 54H435V329H72L173 54Z" fill="rgba(0, 20, 60, 0.05)" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1"/>
    </svg>
  </span>
  <img class="service-card__img" src="assets/img/service-card-gas.webp" width="231" height="223" alt="" loading="lazy">
  <span class="service-card__title">...</span>
  <span class="service-card__arrow" aria-hidden="true"></span>
</a>
```

### Стало

```html
<a class="service-card service-card--art-{код}" href="...">
  <span class="service-card__bg" aria-hidden="true">
    <svg class="service-card__decor" viewBox="0 0 435 329" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
      <path d="M0 54H173" stroke="rgba(255, 255, 255, 0.08)" stroke-width="2" />
      <path d="M173 54H435V329H72L173 54Z" stroke="rgba(255, 255, 255, 0.08)" stroke-width="2" />
    </svg>
  </span>
  <picture class="service-card__pic" aria-hidden="true">
    <source media="(max-width: 899.98px)" srcset="assets/img/services-{код}-m.webp">
    <img class="service-card__img" src="assets/img/services-{код}.webp" alt="" loading="lazy">
  </picture>
  <span class="service-card__title">...</span>
  <span class="service-card__arrow" aria-hidden="true"></span>
</a>
```

`{код}` — код связанной услуги из каталога. Например: ЭГ → `eg`, ЭМ → `em`, ЭО → `eo`.

---

## 4. Изменения только в CSS (разметку не трогать)

Эти правки входят в новый `style.css` / `style.min.css`, менять HTML в шаблоне не нужно.

- **Карточки услуг (каталог и детальная):** новый градиент плашки и тени. У малых карточек иллюстрации стоят строго по центру по горизонтали, у широких — прижаты вправо и к низу.
- **«Комплекс работ»:** название прижато к низу карточки, длинные названия больше не вылезают за край.
- **«Нужна консультация по выбору услуг?» (`.services-consult`):** на десктопе до 1400px форма стоит под заголовком, а не рядом. Раньше это включалось только до 1200px, и на ширине 1200–1400 поля выходили за края.
- **Футер, список «Услуги» (`.footer__services-list`):** до 1530px пункты идут одной колонкой, чтобы не заходить под синюю плашку у правого края. Раньше одна колонка включалась только до 1200px. Порядок пунктов в одной колонке сохраняется через CSS `order`, поэтому порядок `<li>` в разметке менять не нужно.

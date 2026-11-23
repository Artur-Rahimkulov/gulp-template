# Обновление вёрстки: карточки услуг, форма консультации, футер, модалка «Обсудить проект»

Изменения после прод-коммита `470147e` для переноса в шаблон 1C-Bitrix.

Затронуто:
- каталог «Услуги» (`services.html`) — карточки услуг и блок «Нужна консультация по выбору услуг?»;
- детальная услуга (`service.html`) — блок «Комплекс работ в рамках услуги»;
- футер на всех страницах — список «Услуги» (только CSS);
- новая модалка с формой «Обсудить проект» (все страницы) — открывается кнопкой «Обсудить проект» в шапке на любой странице и кнопками в контенте на главной, в детальной проекта и детальной услуги.

Остальная вёрстка не менялась.

Все пути указаны от корня сборки `build/`. На сервере это та же структура внутри папки шаблона Bitrix — там, где лежат `css/` и `assets/`.

---

## 1. Файлы для заливки по FTP

Перед заливкой выполните продакшен-сборку: `npm run build`.

### Стили (заменить)

- `css/style.css`
- `css/style.min.css`
- `css/style.min.css.map` — если карта загружается на сервер

### Скрипты (заменить)

- `js/main.min.js` — мобильное меню закрывается, когда открывается модалка (`js/modules/header.js`)

### Иконки (добавить)

- `assets/svg/modal-cross.svg` — крестик модалки «Обсудить проект»

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

---

## 5. Модалка «Обсудить проект» — `#modal-project`

Модалка с формой: контактное лицо, e-mail, телефон, прикрепление документов, сообщение и согласие. Каркас такой же, как у модалок успеха и ошибки (`.modal`, `data-modal`, закрытие по крестику, клику по фону и Esc). Форма — та же, что «Остались вопросы?» на «Контактах», с модификатором `contacts-form--modal`, поэтому валидация, маска телефона, прикрепление файлов и отправка работают как у остальных форм.

### Где выводить

Разметку модалки выводите **на всех страницах** — рядом с модалками успеха, ошибки и reCAPTCHA (в вёрстке это `components/modals.html`, перед подключением скриптов).

### Разметка

```html
<div class="modal modal--form" id="modal-project" data-modal="modal-project" aria-hidden="true" role="dialog" aria-modal="true"
  aria-label="Обсудить проект">
  <div class="modal__overlay" data-modal-close></div>
  <div class="modal__dialog">
    <button class="modal__close" type="button" aria-label="Закрыть окно" data-modal-close>
      <img src="assets/svg/modal-cross.svg" width="24" height="24" alt="" aria-hidden="true">
    </button>

    <form class="contacts-form contacts-form--files contacts-form--modal" action="#" method="post" enctype="multipart/form-data" novalidate>
      <div class="contacts-form__grid">
        <label class="contacts-form__field contacts-form__field--name" data-form-group>
          <input class="contacts-form__input" type="text" name="name" placeholder=" " required data-type="name" autocomplete="name" data-required-message="Заполните поле" data-error-message="Введите корректное имя">
          <span class="contacts-form__label">Контактное лицо</span>
        </label>
        <label class="contacts-form__field contacts-form__field--email" data-form-group>
          <input class="contacts-form__input" type="email" name="email" placeholder=" " required data-type="email" autocomplete="email" data-required-message="Заполните поле" data-error-message="Некорректный email">
          <span class="contacts-form__label">e-mail</span>
        </label>
        <label class="contacts-form__field contacts-form__field--phone" data-form-group>
          <input class="contacts-form__input" type="tel" name="phone" placeholder=" " required data-type="phone" autocomplete="tel" data-required-message="Заполните поле" data-error-message="Некорректный телефон">
          <span class="contacts-form__label">Телефон</span>
        </label>

        <!-- документы: data-files — выбор, data-files-list — список прикреплённых (заполняется скриптом) -->
        <div class="contacts-form__files" data-files>
          <label class="contacts-form__attach">
            <input class="visually-hidden" type="file" name="files[]" multiple data-files-input>
            <img src="assets/svg/icon-attach.svg" width="40" height="40" alt="" aria-hidden="true">
            <span>Прикрепить документ</span>
          </label>
          <ul class="contacts-form__file-list" data-files-list></ul>
        </div>
      </div>

      <label class="contacts-form__message" data-form-group>
        <textarea class="contacts-form__textarea" name="message" placeholder="Расскажите о вашем проекте"></textarea>
      </label>

      <div class="contacts-form__bottom">
        <button class="btn contacts-form__btn" type="submit">Отправить</button>
        <label class="contacts-form__consent" data-form-group-checkbox>
          <input class="contacts-form__checkbox" type="checkbox" name="consent" required>
          <span class="contacts-form__box" aria-hidden="true"></span>
          <span class="contacts-form__consent-text">Нажимая на&nbsp;кнопку «Отправить» Вы&nbsp;выражаете своё <a href="policy.html" target="_blank" rel="noopener noreferrer">согласие</a> на&nbsp;обработку Ваших персональных данных в&nbsp;соответствии с&nbsp;Федеральным законом от&nbsp;27&nbsp;июля 2006&nbsp;г.<br class="contacts-form__consent-br"> №&nbsp;152-ФЗ «О&nbsp;персональных данных» и&nbsp;<a href="policy.html" target="_blank" rel="noopener noreferrer">Политикой конфиденциальности компании</a></span>
        </label>
      </div>
    </form>
  </div>
</div>
```

Имена полей (`name`, `email`, `phone`, `files[]`, `message`, `consent`) можно заменить на имена полей веб-формы Bitrix. Атрибуты `data-form-group`, `data-type`, `data-required-message`, `data-error-message`, `data-files*` нужны скриптам — их не убирать. Ссылки `policy.html` заменить на адрес страницы политики.

### Кнопки, которые открывают модалку

Модалку открывает атрибут `data-modal-open="modal-project"` у кнопки «Обсудить проект»:

| Где | Кнопка |
|---|---|
| Шапка, **все страницы** | `.header__btn` (в мобильном меню) |
| Главная | в первом экране (`.home-hero__btn`) |
| Детальная проекта | внизу страницы (`.project-cta__btn`) |
| Детальная услуги | в первом экране (`.service-hero__btn`) |

```html
<a class="btn btn--md header__btn" href="contacts.html" data-modal-open="modal-project">Обсудить проект</a>
```

`href` оставлен как запасной вариант, если скрипт не загрузился: на «Контакты», а у кнопки в первом экране детальной услуги — якорь `#service-feedback` к форме на странице.

При открытии модалки мобильное меню закрывается само (`js/modules/header.js`), иначе после закрытия модалки под ней остаётся открытое меню.

Из скрипта модалку можно открыть и закрыть так: `window.openModal('modal-project')`, `window.closeModal('modal-project')`.

### Отправка формы

Как у остальных форм (подробнее — `bitrix-handover.md`):

- при `action="#"` или с атрибутом `data-ajax` форма не уходит обычным POST — скрипт генерирует событие `form:submit-ajax` с `detail: { form, formData }`. Обработчик Bitrix делает `preventDefault()` у события, отправляет `formData` (в нём и прикреплённые файлы) и по ответу вызывает `window.showModalSuccess()` или `window.showModalError()`;
- при настоящем `action` форма отправляется обычным POST после проверки полей, а результат показывается модалками успеха и ошибки, как у других форм (`?formresult=addok`, `?modal=error`);
- модалка успеха или ошибки сама закрывает модалку с формой.

# Руководство по интеграции модальных окон и форм в CMS 1C-Bitrix

Данный документ описывает интеграцию модальных окон статуса отправки форм (Успех, Ошибка, reCAPTCHA) и плашки Cookie для backend-разработчика 1C-Bitrix.

---

## 1. Формат интеграции в шаблоне компонента формы Bitrix

В шаблоне компонента формы (например, веб-формы `bitrix:form.result.new` или формы обратной связи) интеграция выполняется через проверку `$arResult["isFormNote"]` и `$arResult['isFormErrors']`:

```php
<?php if ($arResult["isFormNote"] == "Y"): ?>
    <?php if ($arResult['isFormErrors'] == 'Y'): ?>
        <script>
            (function () {
                var btn = document.querySelector('[data-section-form] button[type="submit"]');
                if(btn) btn.classList.remove('is-lock-button');

                var modal = document.querySelector('div[data-modal="modal-error"]');
                if (modal) modal.classList.add('active');
            })();
        </script>
    <?php else: ?>
        <script>
            (function () {
                var btn = document.querySelector('[data-section-form] button[type="submit"]');
                if(btn) btn.classList.remove('is-lock-button');

                // Очистка полей
                var formWrapper = document.querySelector('[data-section-form]');
                if (formWrapper) {
                    var nameInput = formWrapper.querySelector('input[data-type="name"]');
                    if (nameInput) nameInput.value = '';
                    var phoneInput = formWrapper.querySelector('input[data-type="phone"]');
                    if (phoneInput) phoneInput.value = '';
                    var checkbox = formWrapper.querySelector('.footer__form-checkbox .checkbox-input');
                    if (checkbox) checkbox.checked = false;
                }

                // Надежная разблокировка скролла
                document.body.style.overflow = '';
                document.documentElement.style.overflow = '';

                var modal = document.querySelector('div[data-modal="modal-success"]');
                if (modal) modal.classList.add('active');
            })();
        </script>
    <?php endif; ?>
<?php endif; ?>
```

---

## 2. Обработка ошибки проверки reCAPTCHA

Если в форме используется проверка Google reCAPTCHA / капчи Bitrix и она завершилась неудачей, используйте модальное окно с селектором `div[data-modal="modal-recaptcha"]`:

```php
<?php if ($arResult['isRecaptchaError'] == 'Y' || (isset($arResult['FORM_ERRORS']['recaptcha']))): ?>
    <script>
        (function () {
            var btn = document.querySelector('[data-section-form] button[type="submit"]');
            if (btn) btn.classList.remove('is-lock-button');

            var modal = document.querySelector('div[data-modal="modal-recaptcha"]');
            if (modal) modal.classList.add('active');
        })();
    </script>
<?php endif; ?>
```

---

## 3. Селекторы и разметка модальных окон

Все модальные окна находятся в разметке (`source/html/components/modals.html`) и снабжены соответствующими селекторами `data-modal`:

### 3.1. Успешная отправка (`modal-success.html`)
- **Селектор:** `div[data-modal="modal-success"]` (или `id="modal-success"`)
- **Класс показа:** `.active` (также поддерживаются `.is-active`, `.is-open`)
- **Разметка карточки:**
  ```html
  <div class="modal" id="modal-success" data-modal="modal-success" role="dialog" aria-modal="true" aria-hidden="true">
    <div class="modal__dialog">
      <div class="modal__decor" aria-hidden="true"></div>
      <button class="modal__close" type="button" aria-label="Закрыть окно" data-modal-close>
        <svg class="modal__close-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M12.5 3.5L3.5 12.5M3.5 3.5L12.5 12.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
      </button>
      <div class="modal__icon modal__icon--success" aria-hidden="true">
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
          <circle cx="30" cy="30" r="30" fill="#192F7C"/>
          <path d="M20 30.5L26.5 37L40 23.5" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <p class="modal__title">Ваша заявка отправлена</p>
      <p class="modal__text">В&nbsp;ближайшее время мы&nbsp;свяжемся с&nbsp;вами для&nbsp;уточнения деталей.</p>
      <button class="btn btn--primary modal__btn" type="button" data-modal-close>Закрыть</button>
    </div>
  </div>
  ```

### 3.2. Ошибка отправки (`modal-error.html`)
- **Селектор:** `div[data-modal="modal-error"]` (или `id="modal-error"`)
- **Класс показа:** `.active` (также `.is-active`, `.is-open`)
- **Разметка карточки:**
  ```html
  <div class="modal" id="modal-error" data-modal="modal-error" role="dialog" aria-modal="true" aria-hidden="true">
    <div class="modal__dialog">
      <div class="modal__decor" aria-hidden="true"></div>
      <button class="modal__close" type="button" aria-label="Закрыть окно" data-modal-close>
        <svg class="modal__close-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M12.5 3.5L3.5 12.5M3.5 3.5L12.5 12.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
      </button>
      <div class="modal__icon modal__icon--error" aria-hidden="true">
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
          <circle cx="30" cy="30" r="30" fill="#F00000"/>
          <path d="M30 18V34M30 42H30.02" stroke="#FFFFFF" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <p class="modal__title">Ошибка отправки</p>
      <div class="rich-text modal__text">
        <p>При отправке сообщения произошла ошибка. Пожалуйста, попробуйте позже или свяжитесь с&nbsp;нами по&nbsp;телефону.</p>
      </div>
      <button class="btn btn--primary modal__btn" type="button" data-modal-close>Закрыть</button>
    </div>
  </div>
  ```

### 3.3. Ошибка проверки reCAPTCHA (`modal-recaptcha.html`)
- **Селектор:** `div[data-modal="modal-recaptcha"]` (или `id="modal-recaptcha"`)
- **Класс показа:** `.active` (также `.is-active`, `.is-open`)
- **Разметка карточки:**
  ```html
  <div class="modal" id="modal-recaptcha" data-modal="modal-recaptcha" role="dialog" aria-modal="true" aria-hidden="true">
    <div class="modal__dialog">
      <div class="modal__decor" aria-hidden="true"></div>
      <button class="modal__close" type="button" aria-label="Закрыть окно" data-modal-close>
        <svg class="modal__close-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M12.5 3.5L3.5 12.5M3.5 3.5L12.5 12.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
      </button>
      <div class="modal__icon modal__icon--error" aria-hidden="true">
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
          <circle cx="30" cy="30" r="30" fill="#F00000"/>
          <path d="M30 18V34M30 42H30.02" stroke="#FFFFFF" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <p class="modal__title">Ошибка проверки</p>
      <div class="rich-text modal__text">
        <p>Не пройдена проверка reCAPTCHA. Повторите отправку формы.</p>
      </div>
      <button class="btn btn--primary modal__btn" type="button" data-modal-close>Закрыть</button>
    </div>
  </div>
  ```

---

## 4. Разметка формы и атрибуты полей (`[data-section-form]`)

Для корректной работы серверного скрипта оберните форму компонента или саму форму в атрибут `data-section-form`:

```html
<div data-section-form>
  <form class="contacts-form" action="..." method="post">
    <!-- Поле Имя -->
    <input class="contacts-form__input" type="text" name="name" data-type="name" required>

    <!-- Поле Телефон -->
    <input class="contacts-form__input" type="tel" name="phone" data-type="phone" required>

    <!-- Чекбокс согласия -->
    <label class="contacts-form__consent footer__form-checkbox">
      <input class="contacts-form__checkbox checkbox-input" type="checkbox" name="consent" required>
      <span class="contacts-form__box"></span>
      <span class="contacts-form__consent-text">Согласие на обработку...</span>
    </label>

    <!-- Кнопка отправки -->
    <button class="btn btn--primary contacts-form__btn" type="submit">Отправить</button>
  </form>
</div>
```

### Назначение атрибутов:
- `data-section-form` — корневой контейнер формы для поиска кнопки, полей и сброса значений.
- `input[data-type="name"]` — поле имени/контактного лица.
- `input[data-type="phone"]` — поле телефона.
- `.checkbox-input` (или `.footer__form-checkbox .checkbox-input`) — чекбокс согласия на обработку данных.
- `.is-lock-button` — вспомогательный CSS-класс блокировки кнопки при отправке (удаляется скриптом: `btn.classList.remove('is-lock-button')`).

---

## 5. Поведение и закрытие модальных окон

В файле `source/js/modules/modal.js` и стилях `source/sass/components/modal.scss` реализована полная поддержка класса `.active`:
1. **Открытие:**
   Добавление класса `.active` к элементу модалки (`modal.classList.add('active')`) сразу делает модальное окно видимым, запускает плавную анимацию появления и масштабирования окна.
2. **Закрытие:**
   При клике на крестик (`[data-modal-close]`), кнопку «Закрыть» внутри карточки, клике по фоновой подложке (оверлею) или нажатии клавиши **Escape** класс `.active` (а также `.is-active`, `.is-open`) автоматически удаляется, восстанавливая скролл страницы.
3. **Разблокировка скролла:**
   В коде скрипта предусмотрен сброс:
   ```javascript
   document.body.style.overflow = '';
   document.documentElement.style.overflow = '';
   ```
   Фронтенд-модуль дополнительно снимает служебный класс `is-modal-open` и компенсирующий `padding-right`.

---

## 6. Размещение в шаблоне Bitrix (`footer.php`)

Подключите модальные окна в нижней части сайта перед закрывающим тегом `</body>`:

```php
    <!-- footer.php -->
    </footer>

    <!-- Cookie-плашка -->
    <?php require($_SERVER['DOCUMENT_ROOT'] . '/local/templates/[ваш_шаблон]/include/cookie.php'); ?>

    <!-- Модальные окна (успех, ошибка, recaptcha) -->
    <?php require($_SERVER['DOCUMENT_ROOT'] . '/local/templates/[ваш_шаблон]/include/modals.php'); ?>

    <!-- Основной бандл скриптов -->
    <script src="<?= SITE_TEMPLATE_PATH ?>/js/main.min.js"></script>
  </body>
</html>
```

---

## 7. Файловая структура проекта

| Файл | Описание |
|---|---|
| `source/html/components/modal-success.html` | Модалка успеха (`data-modal="modal-success"`) |
| `source/html/components/modal-error.html` | Модалка ошибки (`data-modal="modal-error"`) |
| `source/html/components/modal-recaptcha.html` | Модалка ошибки reCAPTCHA (`data-modal="modal-recaptcha"`) |
| `source/html/components/modals.html` | Общий контейнер включения всех модалок |
| `source/html/components/cookie.html` | Баннер Cookie |
| `source/sass/components/modal.scss` | Стили модальных окон (поддерживает `.active`, `.is-active`, `.is-open`) |
| `source/js/modules/modal.js` | Логика работы, закрытие по крестику/Escape/оверлею, сброс классов |

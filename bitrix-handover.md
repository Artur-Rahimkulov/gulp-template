# Руководство по интеграции модальных окон и Cookie в CMS 1C-Bitrix

Данный документ описывает окружение, структуру компонентов и способы подключения модальных окон статуса отправки форм (Успех/Ошибка) и плашки Cookie для backend-разработчика 1C-Bitrix.

---

## 1. Структура файлов и ассетов

### Разметка (HTML):
- `source/html/components/modal-success.html` — модальное окно успешной отправки заявки («Ваша заявка отправлена»).
- `source/html/components/modal-error.html` — модальное окно ошибки («При отправке сообщения произошла ошибка…»).
- `source/html/components/modal-recaptcha.html` — модальное окно ошибки reCAPTCHA («Не пройдена проверка reCAPTCHA. Повторите отправку формы.»).
- `source/html/components/modals.html` — единый контейнер, включающий окна.
- `source/html/components/cookie.html` — плашка согласия с использованием файлов Cookie («Этот сайт использует cookie»).
- `source/html/base/scripts.html` — партиал скриптов перед `</body>`, куда подключены `cookie.html` и `modals.html`.

### Стили (SCSS):
- `source/sass/components/modal.scss` — стили модальных окон (десктоп 511px / мобильная 328px, анимация, блокировка скролла, позиционирование).
- `source/sass/components/cookie.scss` — стили плашки cookie (десктоп 601px в правом нижнем углу / мобильная 328px снизу).
- Подключены в общий `source/sass/style.scss`.

### Скрипты (JS):
- `source/js/modules/modal.js` — модуль управления модалками, экспорт методов в `window`, обработка клавиатуры (Escape), оверлея, авто-открытие при загрузке.
- `source/js/modules/cookie.js` — модуль баннера cookie, запись в `localStorage` и `document.cookie` (`cookie_accepted=true`).
- `source/js/modules/validateForms.js` — валидация форм и передача управления в AJAX/Bitrix события.
- Подключены в `source/js/main.js`.

### Графика и иконки:
- `source/assets/svg/modal-close.svg` — иконка крестика закрытия (16×16px).
- `source/assets/svg/modal-error-icon.svg` — иконка ошибки (круг 60×60px, `#F00000`, восклицательный знак).
- `source/assets/svg/modal-success-icon.svg` — иконка успеха (круг 60×60px, `#192F7C`, галочка).
- `source/assets/img/modal-decor.png` — декоративная фоновая фигура карточки модального окна.

---

## 2. Размещение в структуре шаблона Битрикс

Рекомендуется разместить модальные окна и плашку Cookie в файле подвала шаблона сайта (`local/templates/[ваш_шаблон]/footer.php`) непосредственно перед вызовом скриптов или закрывающим тегом `</body>`:

```php
    <!-- footer.php -->
    </footer>

    <!-- Cookie-плашка -->
    <?php require($_SERVER['DOCUMENT_ROOT'] . '/local/templates/[ваш_шаблон]/include/cookie.php'); ?>

    <!-- Модальные окна статуса отправки -->
    <?php require($_SERVER['DOCUMENT_ROOT'] . '/local/templates/[ваш_шаблон]/include/modals.php'); ?>

    <!-- Скрипты сайта -->
    <script src="<?= SITE_TEMPLATE_PATH ?>/js/main.min.js"></script>
  </body>
</html>
```

---

## 3. JavaScript API для бекендера

Все методы доступны глобально в объекте `window`:

```javascript
// Открытие модалки по ID или типу
window.openModal('modal-success'); // или window.BitrixModal.open('modal-success')
window.openModal('modal-error');   // или window.BitrixModal.open('modal-error')

// Закрытие активной модалки
window.closeModal();               // или window.BitrixModal.close()

// Динамическое открытие с кастомным текстом (например, текст ошибки от валидатора Битрикса)
window.showModalSuccess({
  title: 'Заявка принята',
  message: 'Мы свяжемся с вами в течение 15 минут.'
});

window.showModalError({
  title: 'Ошибка',
  message: 'Не удалось прикрепить файл. Превышен допустимый размер.'
});

// Для проверки / сброса Cookie в процессе тестирования
window.resetCookieConsent();
```

---

## 4. Сценарии интеграции форм

### Вариант А: Отправка формы через AJAX (рекомендуемый)

Форма перехватывается скриптом `validateForms.js`. При успешной клиентской валидации инициируется событие `form:submit-ajax`:

```javascript
document.addEventListener('form:submit-ajax', function (event) {
  const form = event.detail.form;
  const formData = event.detail.formData;

  // Отправка в компонент Битрикса или контроллер
  fetch('/local/ajax/feedback.php', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    if (data.status === 'success') {
      window.showModalSuccess(data.message || 'Ваша заявка отправлена');
      form.reset();
    } else {
      window.showModalError(data.error || 'Произошла ошибка при отправке');
    }
  })
  .catch(error => {
    window.showModalError('Ошибка сети или сервера. Попробуйте позже.');
  });
});
```

Если вы используете `BX.ajax` или `BX.ajax.runComponentAction`:

```javascript
BX.ajax.runComponentAction('custom:feedback', 'sendForm', {
  mode: 'class',
  data: new FormData(form)
}).then(function (response) {
  if (response.data.success) {
    window.openModal('modal-success');
    form.reset();
  }
}, function (response) {
  const firstError = response.errors[0]?.message || 'При отправке произошла ошибка.';
  window.showModalError(firstError);
});
```

---

### Вариант Б: Классическая отправка с перезагрузкой страницы (POST-Redirect-GET)

Если форма отправляется стандартным методом POST компонента `bitrix:form.result.new` или `main.feedback`:

1. **Через URL-параметр Битрикса**:
   При успешной отправке Битрикс обычно добавляет параметр `?formresult=addok` в URL.
   Скрипт `modal.js` **автоматически распознает этот параметр при загрузке страницы** и сразу откроет `modal-success`.
   Если передать `?formresult=error` или `?modal=error`, откроется `modal-error`.

2. **Через атрибут в DOM**:
   Если Битрикс срендерил модалку с классом `is-active` или атрибутом `data-auto-open`:
   ```html
   <div class="modal modal--success is-active" id="modal-success" data-modal="success">...</div>
   ```
   Модальное окно автоматически активируется при загрузке страницы.

3. **Через инлайн-скрипт в шаблоне компонента**:
   ```php
   <?php if ($arResult["isFormNote"] == "Y"): ?>
     <script>
       document.addEventListener('DOMContentLoaded', function() {
         window.openModal('modal-success');
       });
     </script>
   <?php elseif (!empty($arResult["FORM_ERRORS"])): ?>
     <script>
       document.addEventListener('DOMContentLoaded', function() {
         window.showModalError(<?= CUtil::PhpToJSObject(implode(' ', $arResult["FORM_ERRORS"])) ?>);
       });
     </script>
   <?php endif; ?>
   ```

---

## 5. Интеграция плашки Cookie в PHP

Модуль `cookie.js` при нажатии пользователем кнопки **«ПРИНЯТЬ ВСЁ»** устанавливает:
1. Ключ в `localStorage`: `cookie_accepted = 'true'`.
2. Cookie в браузере: `document.cookie = "cookie_accepted=true; path=/; max-age=31536000; SameSite=Lax"`.

Бекендер в PHP может проверить, дал ли пользователь согласие:
```php
$isCookieAccepted = isset($_COOKIE['cookie_accepted']) && $_COOKIE['cookie_accepted'] === 'true';

if (!$isCookieAccepted) {
  // Например, не подключаем внешние счетчики Яндекс.Метрики / Google Analytics до согласия
}
```

---

## 6. Тестирование

На странице `ui-kit.html` добавлен интерактивный блок:
1. Кнопка **«Модалка Успеха»** — открывает модальное окно успешной отправки заявки.
2. Кнопка **«Модалка Ошибки»** — открывает модальное окно ошибки.
3. Кнопка **«Сбросить Cookie»** — очищает запись в localStorage и куку, повторно вызывая появление плашки Cookie.

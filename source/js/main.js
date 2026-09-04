import {modals} from './modules/modals';
import {accordion} from './modules/accordion';
import {sliders} from './modules/sliders';
import {select} from './modules/select';
import {validateForms} from './modules/validateForms.js';
import {inputPhone} from './modules/input-phone.js';
import {pagination} from './modules/pagination.js';
import {filters} from './modules/filters.js';
import {initCatalogMock} from './modules/catalog-mock.js';
import {DynamicAdapt} from './modules/dynamicAdapt.js';
import {header} from './modules/header.js';
import {menu} from './modules/menu.js';

// все скрипты должны быть в обработчике 'DOMContentLoaded', но не все в 'load'
// в load следует добавить скрипты, не участвующие в работе первого экрана

window.addEventListener('DOMContentLoaded', () => {
  // Utils
  inputPhone();

  // ---------------------------------

  // Modules
  header();
  menu();
  DynamicAdapt.init();
  // ---------------------------------

  // Заглушка каталога: патчит fetch до вызова pagination()/filters().
  // Удалить вместе с модулем, когда появится бэкенд.
  initCatalogMock();

  window.addEventListener('load', () => {
    modals();
    accordion();
    sliders();
    select();
    validateForms();
    pagination();
    filters();

  });
});

// ---------------------------------
// привязывайте js не на классы, а на дата атрибуты (data-validate)

// вместо модификаторов .block--active используем утилитарные классы
// .is-active || .is-open || .is-invalid и прочие (обязателен нейминг в два слова)
// .select.select--opened ❌ ---> [data-select].is-open ✅

// для адаптивного JS используется matchMedia

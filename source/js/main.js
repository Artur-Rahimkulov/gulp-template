import { modals } from './modules/modals';
import { accordion } from './modules/accordion';
import { sliders } from './modules/sliders';
import { select } from './modules/select';
import {validateForms} from "./modules/validateForms.js";
import {inputPhone} from "./modules/input-phone.js";
import {pagination} from "./modules/pagination.js";
import {DynamicAdapt} from "./modules/dynamicAdapt.js";

// все скрипты должны быть в обработчике 'DOMContentLoaded', но не все в 'load'
// в load следует добавить скрипты, не участвующие в работе первого экрана

window.addEventListener('DOMContentLoaded', () => {
	// Utils
    inputPhone()

	// ---------------------------------

	// Modules
	DynamicAdapt.init();
	// ---------------------------------

	window.addEventListener('load', () => {
		modals();
		accordion();
		sliders();
		select();
        validateForms();
        pagination();

	});
});

// ---------------------------------
// привязывайте js не на классы, а на дата атрибуты (data-validate)

// вместо модификаторов .block--active используем утилитарные классы
// .is-active || .is-open || .is-invalid и прочие (обязателен нейминг в два слова)
// .select.select--opened ❌ ---> [data-select].is-open ✅

// для адаптивного JS используется matchMedia

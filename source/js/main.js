import { header } from './modules/header.js';
import { sliders } from './modules/sliders.js';
import { validateForms } from './modules/validateForms.js';
import { inputPhone } from './modules/input-phone.js';
import { pagination } from './modules/pagination.js';
import { fileDrop } from './modules/file-drop.js';
import { heroTags } from './modules/hero-tags.js';
import { about } from './modules/about.js';
import { contactsFiles } from './modules/contacts-files.js';
import { contactsMap } from './modules/contacts-map.js';
import { projectRows } from './modules/project-rows.js';

// все скрипты должны быть в обработчике 'DOMContentLoaded', но не все в 'load'
// в load следует добавить скрипты, не участвующие в работе первого экрана

window.addEventListener('DOMContentLoaded', () => {
	// Modules
	header();
	heroTags();
	inputPhone();
	projectRows();
	// ---------------------------------

	window.addEventListener('load', () => {
		sliders();
		validateForms();
		pagination();
		fileDrop();
		about();
		contactsFiles();
		contactsMap();
	});
});

// ---------------------------------
// привязывайте js не на классы, а на дата атрибуты (data-validate)

// вместо модификаторов .block--active используем утилитарные классы
// .is-active || .is-open || .is-invalid и прочие (обязателен нейминг в два слова)
// .select.select--opened ❌ ---> [data-select].is-open ✅

// для адаптивного JS используется matchMedia

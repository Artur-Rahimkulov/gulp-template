/**
 * Debounce функция (для оптимизации resize/scroll)
 * @param {Function} func - функция, которую нужно вызвать
 * @param {number} wait - задержка в мс
 */
export function debounce(func, wait) {
	let timeout;
	return function executedFunction(...args) {
		const later = () => {
			timeout = null;
			func(...args);
		};
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
	};
}

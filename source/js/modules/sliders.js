import Swiper from "swiper";
import { Pagination, Autoplay } from "swiper/modules";


// пример инициализации слайдера
export const sliders = () => {
	// const organizersSlider = document.querySelector('[data-slider="organizers"]');
	// if (organizersSlider) {
	// 	const organizersPagination = organizersSlider.querySelector('[data-slider-pagination]');
	// 	new Swiper(organizersSlider, {
	// 		modules: [Pagination, Autoplay],
	// 		loop: true,
	// 		slideToClickedSlide: false,
	// 		simulateTouch: true,
	// 		touchRatio: 1,
	// 		speed: 700,
	// 		autoplay: {
	// 			delay: 2800,
	// 			// Отключить после ручного перетаскивания
	// 			disableOnInteraction: false
	// 		},
	// 		breakpoints: {
	// 			0: {
	// 				slidesPerView: 1,
	// 				spaceBetween: 10,
	// 			},
	// 			576: {
	// 				slidesPerView: 2,
	// 				spaceBetween: 10,
	// 			},
	// 			1281: {
	// 				slidesPerView: 3,
	// 				spaceBetween: 20,
	// 			},
	// 		},
	// 		pagination: {
	// 			el: organizersPagination,
	// 			clickable: 'true',
	// 			type: 'bullets',
	// 			renderBullet: function (className) {
	// 				return '<span class="' + className + '">' + '<i></i>' + '<b></b>'  + '</span>';
	// 			},
	// 		}
	// 	});
	// }
}

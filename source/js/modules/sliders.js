import Swiper from 'swiper'
import { Navigation } from 'swiper/modules'

// Слайдеры: листание стрелками, на мобильной — лента с прокруткой.
// Разметка: [data-slider] > .swiper-wrapper > .swiper-slide, стрелки — source/html/ui/slider-arrows.html
// Настройки десктопа (от 900px) через атрибуты:
//   data-slider-per-view — сколько слайдов видно (по умолчанию 3);
//     на узком десктопе не больше 2 (900–1199) и 3 (1200–1439), чтобы карточки не сжимались
//   data-slider-gap — зазор между слайдами в px (по умолчанию 30)
//   data-slider-mobile-off — на мобильной слайдер выключен, раскладку задаёт CSS
export const sliders = () => {
  document.querySelectorAll('[data-slider]').forEach((slider) => {
    const wrapper = slider.closest('[data-slider-wrapper]') || slider.parentElement
    const perView = Number(slider.dataset.sliderPerView) || 3
    const gap = slider.dataset.sliderGap !== undefined ? Number(slider.dataset.sliderGap) : 30
    const mobileOff = slider.hasAttribute('data-slider-mobile-off')

    new Swiper(slider, {
      modules: [Navigation],
      enabled: !mobileOff,
      slidesPerView: 'auto',
      spaceBetween: 12,
      navigation: {
        prevEl: wrapper.querySelector('[data-slider-prev]'),
        nextEl: wrapper.querySelector('[data-slider-next]'),
      },
      breakpoints: {
        900: {
          enabled: true,
          slidesPerView: Math.min(perView, 2),
          spaceBetween: gap,
        },
        1200: {
          slidesPerView: Math.min(perView, 3),
        },
        1440: {
          slidesPerView: perView,
        },
      },
    })
  })
}

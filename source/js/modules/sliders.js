import Swiper from 'swiper'
import { Navigation } from 'swiper/modules'

// Галереи: листание стрелками, на мобильной — лента с прокруткой.
// Разметка: [data-slider] > .swiper-wrapper > .swiper-slide, стрелки — source/html/ui/slider-arrows.html
export const sliders = () => {
  document.querySelectorAll('[data-slider]').forEach((slider) => {
    const wrapper = slider.closest('[data-slider-wrapper]') || slider.parentElement

    new Swiper(slider, {
      modules: [Navigation],
      slidesPerView: 'auto',
      spaceBetween: 24,
      navigation: {
        prevEl: wrapper.querySelector('[data-slider-prev]'),
        nextEl: wrapper.querySelector('[data-slider-next]'),
      },
      breakpoints: {
        900: {
          slidesPerView: 3,
          spaceBetween: 30,
        },
      },
    })
  })
}

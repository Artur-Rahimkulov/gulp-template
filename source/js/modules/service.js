import Swiper from 'swiper'
import { Navigation } from 'swiper/modules'

// Страница «Услуга»: галерея объекта [data-service-gallery] и слайдер «Реализованные проекты» [data-service-projects].
// По одному слайду, листание стрелками ([data-slider-prev] / [data-slider-next] внутри блока).
const initSlider = (block, options = {}) => {
  const slider = block.querySelector('.swiper')
  if (!slider) return

  new Swiper(slider, {
    modules: [Navigation],
    slidesPerView: 1,
    spaceBetween: 30,
    navigation: {
      prevEl: block.querySelector('[data-slider-prev]'),
      nextEl: block.querySelector('[data-slider-next]'),
    },
    ...options,
  })
}

export const service = () => {
  document.querySelectorAll('[data-service-gallery]').forEach((block) => initSlider(block))
  document.querySelectorAll('[data-service-projects]').forEach((block) => initSlider(block, { autoHeight: true }))
}

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

// «Комплекс работ» [data-service-works]: на десктопе — сетка из трёх карточек (CSS), на мобильной — слайдер по одной
const initWorks = (block) => {
  const mobile = window.matchMedia('(max-width: 899.98px)')
  let swiper = null

  const toggle = () => {
    if (mobile.matches && !swiper) {
      swiper = new Swiper(block.querySelector('.swiper'), {
        modules: [Navigation],
        slidesPerView: 1,
        spaceBetween: 16,
        navigation: {
          prevEl: block.querySelector('[data-slider-prev]'),
          nextEl: block.querySelector('[data-slider-next]'),
        },
      })
    } else if (!mobile.matches && swiper) {
      swiper.destroy(true, true)
      swiper = null
    }
  }

  toggle()
  mobile.addEventListener('change', toggle)
}

export const service = () => {
  document.querySelectorAll('[data-service-gallery]').forEach((block) => initSlider(block))
  document.querySelectorAll('[data-service-projects]').forEach((block) => initSlider(block, {
    autoHeight: true,
    // слайдер обрезан на 50 левее себя (там цифра «01») — промежуток больше, чтобы край предыдущего слайда туда не попадал
    spaceBetween: 60,
  }))
  document.querySelectorAll('[data-service-works]').forEach(initWorks)
}

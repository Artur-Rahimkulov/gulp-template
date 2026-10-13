import Swiper from 'swiper'
import { Navigation } from 'swiper/modules'

// Слайдеры: листание стрелками, на мобильной — лента с прокруткой.
// Разметка: [data-slider] > .swiper-wrapper > .swiper-slide, стрелки — source/html/ui/slider-arrows.html
// Настройки десктопа (от 900px) через атрибуты:
//   data-slider-per-view — сколько слайдов видно (по умолчанию 3) или auto — ширину слайда задаёт CSS;
//     на узком десктопе не больше 2 (900–1199) и 3 (1200–1439), чтобы карточки не сжимались
//   data-slider-gap — зазор между слайдами в px (по умолчанию 30)
//   data-slider-gap-mobile — зазор на мобильной (по умолчанию 12)
//   data-slider-mobile-off — на мобильной слайдер выключен, раскладку задаёт CSS
//   data-slider-align-last — на мобильной последний слайд встаёт к левому краю, как остальные (а не прижимается вправо)
export const sliders = () => {
  document.querySelectorAll('[data-slider]').forEach((slider) => {
    const wrapper = slider.closest('[data-slider-wrapper]') || slider.parentElement
    const auto = slider.dataset.sliderPerView === 'auto'
    const perView = Number(slider.dataset.sliderPerView) || 3
    const gap = slider.dataset.sliderGap !== undefined ? Number(slider.dataset.sliderGap) : 30
    const gapMobile = slider.dataset.sliderGapMobile !== undefined ? Number(slider.dataset.sliderGapMobile) : 12
    const mobileOff = slider.hasAttribute('data-slider-mobile-off')
    const view = (max) => (auto ? 'auto' : Math.min(perView, max))
    const alignLast = slider.hasAttribute('data-slider-align-last')
    const mobile = window.matchMedia('(max-width: 899.98px)')

    // отступ после последнего слайда = ширина ленты − ширина слайда: тогда последний доходит до левого края
    const updateOffset = (swiper) => {
      if (!alignLast) return
      const last = swiper.slides[swiper.slides.length - 1]
      const offset = mobile.matches && last ? Math.max(0, swiper.width - last.offsetWidth) : 0
      if (swiper.params.slidesOffsetAfter !== offset) {
        swiper.params.slidesOffsetAfter = offset
        swiper.update()
      }
    }

    new Swiper(slider, {
      modules: [Navigation],
      enabled: !mobileOff,
      slidesPerView: 'auto',
      spaceBetween: gapMobile,
      navigation: {
        prevEl: wrapper.querySelector('[data-slider-prev]'),
        nextEl: wrapper.querySelector('[data-slider-next]'),
      },
      on: {
        init: updateOffset,
        resize: updateOffset,
      },
      breakpoints: {
        // параметры брейкпоинтов Swiper не наследуются от меньших — в каждом задаём всё
        900: {
          enabled: true,
          slidesPerView: view(2),
          spaceBetween: gap,
        },
        1200: {
          enabled: true,
          slidesPerView: view(3),
          spaceBetween: gap,
        },
        1440: {
          enabled: true,
          slidesPerView: auto ? 'auto' : perView,
          spaceBetween: gap,
        },
      },
    })
  })
}

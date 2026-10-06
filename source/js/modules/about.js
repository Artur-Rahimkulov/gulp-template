import Swiper from 'swiper'
import { Navigation } from 'swiper/modules'

// «О компании»: история по годам и документы.
// История: [data-history] — слайдер [data-history-slider], годы на шкале [data-history-tab],
//   крупный год на фоне [data-history-year]; шкале передаются положения точек (--progress, --line-end).
// Документы: [data-docs-slider] листается только на мобильной, на десктопе — сетка.
export const about = () => {
  const history = document.querySelector('[data-history]')

  if (history) {
    const tabs = [...history.querySelectorAll('[data-history-tab]')]
    const years = history.querySelectorAll('[data-history-year]')
    const timeline = history.querySelector('[data-history-tabs]')

    const dotX = (tab) => tab.closest('li').offsetLeft + 12.5

    const update = (index) => {
      tabs.forEach((tab, i) => {
        tab.classList.toggle('is-active', i === index)
        tab.setAttribute('aria-current', i === index ? 'step' : 'false')
      })
      const year = tabs[index]?.querySelector('.about-timeline__year')?.textContent
      if (year) years.forEach((el) => { el.textContent = year })
      if (timeline && tabs.length) {
        timeline.style.setProperty('--progress', `${dotX(tabs[index])}px`)
        timeline.style.setProperty('--line-end', `${dotX(tabs[tabs.length - 1])}px`)
      }
    }

    const slider = new Swiper(history.querySelector('[data-history-slider]'), {
      modules: [Navigation],
      slidesPerView: 1,
      spaceBetween: 30,
      navigation: {
        prevEl: history.querySelector('[data-slider-prev]'),
        nextEl: history.querySelector('[data-slider-next]'),
      },
      on: {
        slideChange: (swiper) => update(swiper.activeIndex),
      },
    })

    tabs.forEach((tab, i) => tab.addEventListener('click', () => slider.slideTo(i)))
    update(0)
    window.addEventListener('resize', () => update(slider.activeIndex))
  }

  const docs = document.querySelector('[data-docs-slider]')

  if (docs) {
    const wrapper = docs.closest('[data-docs-wrapper]')

    new Swiper(docs, {
      modules: [Navigation],
      slidesPerView: 1,
      spaceBetween: 30,
      navigation: {
        prevEl: wrapper.querySelector('[data-slider-prev]'),
        nextEl: wrapper.querySelector('[data-slider-next]'),
      },
      breakpoints: {
        // на десктопе слайдер выключен — карточки стоят сеткой
        900: {
          enabled: false,
          slidesPerView: 1,
          spaceBetween: 30,
        },
      },
    })
  }
}

// Карта на странице «Контакты»: Яндекс.Карты JS API 2.1 с оформлением как в макете.
// [data-contacts-map] — контейнер; data-map-apikey — ключ JS API, data-map-coords — точка «широта,долгота»
// (если не задана — её ищет геокодер по data-map-address), data-map-zoom — масштаб.
// Голубое оформление — CSS-фильтр на слое тайлов (components/contacts.scss), JSON-стили платного тарифа не нужны.
// Пока API не загрузилось (или заблокировано) — видна картинка карты из макета.
const API_URL = 'https://api-maps.yandex.ru/2.1/'

let apiPromise = null

const loadApi = (apikey) => {
  if (window.ymaps) return new Promise((resolve) => window.ymaps.ready(() => resolve(window.ymaps)))
  if (apiPromise) return apiPromise

  apiPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    const params = new URLSearchParams({ lang: 'ru_RU' })
    if (apikey) params.set('apikey', apikey)
    script.src = `${API_URL}?${params}`
    script.onload = () => window.ymaps.ready(() => resolve(window.ymaps))
    script.onerror = reject
    document.head.append(script)
  })

  return apiPromise
}

const findPoint = (ymaps, coords, address) => {
  if (coords) return Promise.resolve(coords.split(',').map(Number))
  return ymaps.geocode(address, { results: 1 })
    .then((res) => res.geoObjects.get(0)?.geometry.getCoordinates())
}

const init = (ymaps, container) => {
  const zoom = Number(container.dataset.mapZoom) || 16
  const address = container.dataset.mapAddress || ''
  const canvas = container.querySelector('[data-contacts-map-canvas]')

  findPoint(ymaps, container.dataset.mapCoords, address).then((point) => {
    if (!point) return

    const map = new ymaps.Map(canvas, { center: point, zoom, controls: ['zoomControl'] }, {
      suppressMapOpenBlock: true, // «Открыть в Яндекс Картах», «Как добраться»
      copyrightUaVisible: false, // «Условия использования», «Создать свою карту»
      copyrightProvidersVisible: false,
      yandexMapDisablePoiInteractivity: true,
      zoomControlPosition: { right: 16, top: 16 },
      zoomControlSize: 'small',
    })

    // колесо мыши прокручивает страницу, а не масштаб; на телефоне карта двигается двумя пальцами
    map.behaviors.disable('scrollZoom')
    if (window.matchMedia('(max-width: 899.98px)').matches) map.behaviors.disable('drag')

    map.geoObjects.add(new ymaps.Placemark(point, { hintContent: address }, {
      iconLayout: 'default#image',
      iconImageHref: 'assets/img/contacts-pin.webp',
      iconImageSize: [37, 48],
      iconImageOffset: [-18, -48],
    }))

    container.classList.add('is-ready')
  })
}

export const contactsMap = () => {
  const container = document.querySelector('[data-contacts-map]')
  if (!container) return

  // API грузится, когда карта подходит к экрану: первому экрану он не мешает
  const observer = new IntersectionObserver((entries) => {
    if (!entries[0].isIntersecting) return
    observer.disconnect()
    loadApi(container.dataset.mapApikey)
      .then((ymaps) => init(ymaps, container))
      .catch(() => {})
  }, { rootMargin: '400px 0px' })

  observer.observe(container)
}

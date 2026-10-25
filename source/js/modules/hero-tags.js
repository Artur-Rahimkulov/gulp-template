// Плашки услуг на первом экране главной: на мобильной видна одна, стрелки листают по кругу.
// На десктопе при наведении (или фокусе) над плашкой раскрывается видео в кружке — .is-video-shown на плашке.
// Разметка: [data-hero-tags] > [data-hero-tag] (активная — .is-active), [data-hero-tags-prev] / [data-hero-tags-next]
export const heroTags = () => {
  const root = document.querySelector('[data-hero-tags]')
  if (!root) return

  const tags = [...root.querySelectorAll('[data-hero-tag]')]
  tags.forEach(initTagVideo)
  if (tags.length < 2) return

  let current = Math.max(tags.findIndex((tag) => tag.classList.contains('is-active')), 0)

  const show = (index) => {
    tags[current].classList.remove('is-active')
    current = (index + tags.length) % tags.length
    tags[current].classList.add('is-active')
  }

  root.querySelector('[data-hero-tags-prev]')?.addEventListener('click', () => show(current - 1))
  root.querySelector('[data-hero-tags-next]')?.addEventListener('click', () => show(current + 1))
}

const desktop = window.matchMedia('(min-width: 900px)')

const initTagVideo = (tag) => {
  const video = tag.querySelector('video')
  const link = tag.querySelector('a')
  if (!video || !link) return

  let hideTimer

  const show = () => {
    if (!desktop.matches) return
    clearTimeout(hideTimer)
    tag.classList.add('is-video-shown')
    video.play().catch(() => {})
  }

  const hide = () => {
    tag.classList.remove('is-video-shown')
    // пауза после того, как кружок скрылся; следующий показ начнётся с начала
    hideTimer = setTimeout(() => {
      video.pause()
      video.currentTime = 0
    }, 450)
  }

  link.addEventListener('mouseenter', show)
  link.addEventListener('mouseleave', hide)
  link.addEventListener('focus', show)
  link.addEventListener('blur', hide)
}

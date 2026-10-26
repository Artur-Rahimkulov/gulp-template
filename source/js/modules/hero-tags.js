// Плашки услуг на первом экране главной: на мобильной видна одна, стрелки листают по кругу.
// На десктопе при наведении (или фокусе) над плашкой раскрывается видео в кружке — .is-video-shown на плашке.
// Разметка: [data-hero-tags] > [data-hero-tag] (активная — .is-active), [data-hero-tags-prev] / [data-hero-tags-next]
export const heroTags = () => {
  const root = document.querySelector('[data-hero-tags]')
  if (!root) return

  const tags = [...root.querySelectorAll('[data-hero-tag]')]
  tags.forEach(initTagVideo)
  revealAfterVideo(root)
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

// На десктопе плашки плавно появляются за секунду до конца видео первого экрана.
// Пока ждём — у секции .is-tags-waiting (стоит в разметке, чтобы плашки не мелькнули при загрузке);
// на мобильной, без видео или если оно не играет (ошибка, автоплей запрещён) — показываем сразу
const REVEAL_BEFORE_END = 1

const revealAfterVideo = (root) => {
  const hero = root.closest('.home-hero')
  if (!hero) return

  const video = hero.querySelector('[data-hero-video]')
  let timer
  let stalled

  const reveal = () => {
    hero.classList.remove('is-tags-waiting')
    clearTimeout(timer)
    clearTimeout(stalled)
    video?.removeEventListener('timeupdate', check)
  }

  // timeupdate приходит раз в ~250 мс — последний отрезок досчитываем таймером
  const check = () => {
    if (!video.duration || timer) return
    const left = video.duration - video.currentTime - REVEAL_BEFORE_END
    if (left <= 0.5) timer = setTimeout(reveal, Math.max(left, 0) * 1000)
  }

  if (!video || video.ended || !desktop.matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    reveal()
    return
  }

  video.addEventListener('timeupdate', check)
  video.addEventListener('ended', reveal, { once: true })
  video.addEventListener('error', reveal, { once: true })
  // при нескольких <source> ошибка приходит на последний источник, а не на video
  video.querySelector('source:last-of-type')?.addEventListener('error', reveal, { once: true })
  desktop.addEventListener('change', reveal, { once: true })

  // видео так и не пошло — плашки не прячем
  stalled = setTimeout(() => {
    if (video.paused && video.currentTime === 0) reveal()
  }, 3000)
}

const initTagVideo = (tag) => {
  const video = tag.querySelector('video')
  const link = tag.querySelector('a')
  if (!video || !link) return

  // превью кружка ставим только на десктопе — на мобильной кружков нет, картинки не нужны
  const setPoster = () => {
    if (!desktop.matches || !video.dataset.poster) return
    video.poster = video.dataset.poster
    delete video.dataset.poster
  }
  setPoster()
  desktop.addEventListener('change', setPoster)

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

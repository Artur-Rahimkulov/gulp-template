// Плашки услуг на первом экране главной: на мобильной видна одна, стрелки листают по кругу.
// Разметка: [data-hero-tags] > [data-hero-tag] (активная — .is-active), [data-hero-tags-prev] / [data-hero-tags-next]
export const heroTags = () => {
  const root = document.querySelector('[data-hero-tags]')
  if (!root) return

  const tags = [...root.querySelectorAll('[data-hero-tag]')]
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

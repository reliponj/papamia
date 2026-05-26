import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export type ImageSlide = {
  id: string | number
  src: string
  alt?: string
  link?: string
}

type Props = {
  slides: ImageSlide[]
  ariaLabel?: string
  prevLabel?: string
  nextLabel?: string
  className?: string
  autoMs?: number
}

function isExternalLink(link: string): boolean {
  return /^https?:\/\//i.test(link)
}

function SlideContent({ slide }: { slide: ImageSlide }) {
  const img = (
    <img src={slide.src} alt={slide.alt ?? ''} className="image-slider__img" loading="lazy" />
  )

  if (!slide.link) return img

  if (isExternalLink(slide.link)) {
    return (
      <a href={slide.link} className="image-slider__link" target="_blank" rel="noopener noreferrer">
        {img}
      </a>
    )
  }

  return (
    <Link to={slide.link} className="image-slider__link">
      {img}
    </Link>
  )
}

export function ImageSlider({
  slides,
  ariaLabel = 'Gallery',
  prevLabel = 'Previous',
  nextLabel = 'Next',
  className = '',
  autoMs = 6000,
}: Props) {
  const [index, setIndex] = useState(0)

  const goTo = useCallback(
    (next: number) => {
      if (slides.length === 0) return
      setIndex(((next % slides.length) + slides.length) % slides.length)
    },
    [slides.length],
  )

  const goPrev = useCallback(() => goTo(index - 1), [goTo, index])
  const goNext = useCallback(() => goTo(index + 1), [goTo, index])

  useEffect(() => {
    if (slides.length <= 1 || autoMs <= 0) return
    const timer = window.setInterval(() => goNext(), autoMs)
    return () => window.clearInterval(timer)
  }, [slides.length, goNext, autoMs])

  useEffect(() => {
    if (index >= slides.length) setIndex(0)
  }, [slides.length, index])

  if (slides.length === 0) return null

  const rootClass = ['image-slider', className].filter(Boolean).join(' ')

  return (
    <section className={rootClass} aria-label={ariaLabel}>
      <div className="image-slider__frame">
        <div className="image-slider__viewport" aria-live="polite" aria-atomic="true">
          <div className="image-slider__track" style={{ transform: `translateX(-${index * 100}%)` }}>
            {slides.map((slide) => (
              <div key={slide.id} className="image-slider__slide">
                <SlideContent slide={slide} />
              </div>
            ))}
          </div>
        </div>

        {slides.length > 1 && (
          <>
            <button
              type="button"
              className="image-slider__arrow image-slider__arrow--prev"
              onClick={goPrev}
              aria-label={prevLabel}
            >
              ‹
            </button>
            <button
              type="button"
              className="image-slider__arrow image-slider__arrow--next"
              onClick={goNext}
              aria-label={nextLabel}
            >
              ›
            </button>
            <div className="image-slider__dots" role="tablist">
              {slides.map((slide, i) => (
                <button
                  key={slide.id}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`${i + 1} / ${slides.length}`}
                  className={`image-slider__dot${i === index ? ' is-active' : ''}`}
                  onClick={() => goTo(i)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}

import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listBanners } from '../../api/public/banner'
import type { Banner } from '../../api/public/types'
import { useLocale } from '../../contexts/LocaleContext'

function isExternalLink(link: string): boolean {
  return /^https?:\/\//i.test(link)
}

function BannerSlide({ banner }: { banner: Banner }) {
  const img = (
    <img src={banner.imageUrl} alt="" className="banner-carousel__img" loading="lazy" />
  )

  if (!banner.link) return img

  if (isExternalLink(banner.link)) {
    return (
      <a
        href={banner.link}
        className="banner-carousel__link"
        target="_blank"
        rel="noopener noreferrer"
      >
        {img}
      </a>
    )
  }

  return (
    <Link to={banner.link} className="banner-carousel__link">
      {img}
    </Link>
  )
}

export function BannerCarousel() {
  const { t } = useLocale()
  const [banners, setBanners] = useState<Banner[]>([])
  const [index, setIndex] = useState(0)

  useEffect(() => {
    let cancelled = false
    listBanners()
      .then((items) => {
        if (!cancelled) setBanners(items)
      })
      .catch(() => {
        if (!cancelled) setBanners([])
      })
    return () => {
      cancelled = true
    }
  }, [])

  const goTo = useCallback(
    (next: number) => {
      if (banners.length === 0) return
      setIndex(((next % banners.length) + banners.length) % banners.length)
    },
    [banners.length],
  )

  const goPrev = useCallback(() => goTo(index - 1), [goTo, index])
  const goNext = useCallback(() => goTo(index + 1), [goTo, index])

  useEffect(() => {
    if (banners.length <= 1) return
    const timer = window.setInterval(() => goNext(), 6000)
    return () => window.clearInterval(timer)
  }, [banners.length, goNext])

  useEffect(() => {
    if (index >= banners.length) setIndex(0)
  }, [banners.length, index])

  if (banners.length === 0) return null

  return (
    <section className="banner-carousel section" aria-label={t('banner.carousel.label')}>
      <div className="banner-carousel__frame">
        <div
          className="banner-carousel__viewport"
          aria-live="polite"
          aria-atomic="true"
        >
          <div
            className="banner-carousel__track"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {banners.map((banner) => (
              <div key={banner.id} className="banner-carousel__slide">
                <BannerSlide banner={banner} />
              </div>
            ))}
          </div>
        </div>

        {banners.length > 1 && (
          <>
            <button
              type="button"
              className="banner-carousel__arrow banner-carousel__arrow--prev"
              onClick={goPrev}
              aria-label={t('banner.carousel.prev')}
            >
              ‹
            </button>
            <button
              type="button"
              className="banner-carousel__arrow banner-carousel__arrow--next"
              onClick={goNext}
              aria-label={t('banner.carousel.next')}
            >
              ›
            </button>
            <div className="banner-carousel__dots" role="tablist">
              {banners.map((b, i) => (
                <button
                  key={b.id}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`${i + 1} / ${banners.length}`}
                  className={`banner-carousel__dot${i === index ? ' is-active' : ''}`}
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

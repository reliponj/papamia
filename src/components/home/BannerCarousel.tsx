import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listBanners } from '../../api/public/banner'
import type { Banner } from '../../api/public/types'

export function BannerCarousel() {
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

  useEffect(() => {
    if (banners.length <= 1) return
    const timer = window.setInterval(() => {
      setIndex((i) => (i + 1) % banners.length)
    }, 6000)
    return () => window.clearInterval(timer)
  }, [banners.length])

  if (banners.length === 0) return null

  const current = banners[index]

  return (
    <section className="banner-carousel section" aria-label="Promotions">
      <div className="banner-carousel__frame">
        {current.link ? (
          <Link to={current.link} className="banner-carousel__link">
            <img
              src={current.imageUrl}
              alt=""
              className="banner-carousel__img"
              loading="lazy"
            />
          </Link>
        ) : (
          <img
            src={current.imageUrl}
            alt=""
            className="banner-carousel__img"
            loading="lazy"
          />
        )}
        {banners.length > 1 && (
          <div className="banner-carousel__dots" role="tablist">
            {banners.map((b, i) => (
              <button
                key={b.id}
                type="button"
                role="tab"
                aria-selected={i === index}
                className={`banner-carousel__dot${i === index ? ' is-active' : ''}`}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

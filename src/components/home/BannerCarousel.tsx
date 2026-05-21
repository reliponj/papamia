import { useEffect, useState } from 'react'
import { listBanners } from '../../api/public/banner'
import type { Banner } from '../../api/public/types'
import { ImageSlider, type ImageSlide } from '../ui/ImageSlider'
import { useLocale } from '../../contexts/LocaleContext'

export function BannerCarousel() {
  const { t } = useLocale()
  const [slides, setSlides] = useState<ImageSlide[]>([])

  useEffect(() => {
    let cancelled = false
    listBanners()
      .then((items) => {
        if (cancelled) return
        setSlides(
          items.map((b: Banner) => ({
            id: b.id,
            src: b.imageUrl,
            link: b.link || undefined,
          })),
        )
      })
      .catch(() => {
        if (!cancelled) setSlides([])
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (slides.length === 0) return null

  return (
    <ImageSlider
      slides={slides}
      className="banner-carousel section"
      ariaLabel={t('banner.carousel.label')}
      prevLabel={t('banner.carousel.prev')}
      nextLabel={t('banner.carousel.next')}
    />
  )
}

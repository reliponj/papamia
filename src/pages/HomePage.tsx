import { Hero } from '../components/home/Hero'
import { BannerCarousel } from '../components/home/BannerCarousel'
import { FeaturedSection } from '../components/home/FeaturedSection'
import { AboutTeaser } from '../components/home/AboutTeaser'
import { GalleryStrip } from '../components/home/GalleryStrip'

export function HomePage() {
  return (
    <>
      <Hero />
      <BannerCarousel />
      <FeaturedSection />
      <AboutTeaser />
      <GalleryStrip />
    </>
  )
}

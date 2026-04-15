import { Hero } from '../components/home/Hero'
import { PromoGrid } from '../components/home/PromoGrid'
import { AboutTeaser } from '../components/home/AboutTeaser'
import { FeaturedSection } from '../components/home/FeaturedSection'
import { DeliveryStrip } from '../components/home/DeliveryStrip'
import { GalleryStrip } from '../components/home/GalleryStrip'

export function HomePage() {
  return (
    <>
      <Hero />
      <PromoGrid />
      <AboutTeaser />
      <FeaturedSection />
      <DeliveryStrip />
      <GalleryStrip />
    </>
  )
}

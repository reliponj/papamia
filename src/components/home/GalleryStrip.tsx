import { useLocale } from '../../contexts/LocaleContext'

const IMAGES = [
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80',
  'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&q=80',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80',
  'https://images.unsplash.com/photo-1466978913421-dad2ebd028de?w=600&q=80',
]

export function GalleryStrip() {
  const { t } = useLocale()
  return (
    <section className="gallery section" id="gallery">
      <header className="section-head">
        <h2 className="section-title">{t('gallery.title')}</h2>
      </header>
      <div className="gallery__row">
        {IMAGES.map((src) => (
          <figure key={src} className="gallery__cell">
            <img src={src} alt="" loading="lazy" />
          </figure>
        ))}
      </div>
    </section>
  )
}

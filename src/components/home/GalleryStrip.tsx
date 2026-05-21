import { useLocale } from '../../contexts/LocaleContext'

const IMAGES = [
  {
    src: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200&q=85',
    alt: 'Warm dining room with candlelight',
    layout: 'hero',
  },
  {
    src: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=85',
    alt: 'Cozy trattoria interior',
    layout: 'tall',
  },
  {
    src: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&q=85',
    alt: 'Italian table setting with wine',
    layout: 'tall',
  },
  {
    src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=85',
    alt: 'Evening atmosphere in the restaurant',
    layout: 'wide',
  },
  {
    src: 'https://images.unsplash.com/photo-1552569973-610105b58caf?w=800&q=85',
    alt: 'Brick wall and wooden tables',
    layout: 'wide',
  },
  {
    src: 'https://images.unsplash.com/photo-1590846408792-0dbd535886b3?w=800&q=85',
    alt: 'Open kitchen with wood-fired oven',
    layout: 'wide',
  },
] as const

export function GalleryStrip() {
  const { t } = useLocale()

  return (
    <section className="interior-gallery section" id="gallery">
      <header className="section-head">
        <p className="interior-gallery__eyebrow">{t('gallery.eyebrow')}</p>
        <h2 className="section-title">{t('gallery.title')}</h2>
        <p className="section-sub">{t('gallery.sub')}</p>
      </header>
      <div className="interior-gallery__grid">
        {IMAGES.map((item) => (
          <figure
            key={item.src}
            className={`interior-gallery__cell interior-gallery__cell--${item.layout}`}
          >
            <img src={item.src} alt={item.alt} loading="lazy" />
            <figcaption className="interior-gallery__caption">{item.alt}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}

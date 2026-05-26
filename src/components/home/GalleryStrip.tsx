import { useLocale } from '../../contexts/LocaleContext'

const IMAGES = [
  {
    src: 'https://i1-c.pinimg.com/736x/d6/8c/84/d68c840bae6f16a25e05f0aff3de9fdd.jpg',
    alt: 'Evening dining room with warm candlelight',
    layout: 'hero',
  },
  {
    src: 'https://i1-c.pinimg.com/736x/e1/2c/b5/e12cb5bf6722cc47bfcf54562f777160.jpg',
    alt: 'Classic Italian restaurant interior',
    layout: 'tall',
  },
  {
    src: 'https://i1-c.pinimg.com/1200x/d2/ca/6d/d2ca6dda107e94020437bc11e9342934.jpg',
    alt: 'Lush garden dining atmosphere',
    layout: 'tall',
  },
  {
    src: 'https://i.pinimg.com/736x/76/8e/4b/768e4bea1736ea2ad0450a38952bfa0b.jpg',
    alt: 'Cozy booth seating with leather chairs',
    layout: 'wide',
  },
  {
    src: 'https://i1-c.pinimg.com/1200x/ec/b8/60/ecb8602d3fc7ed53230bd5578eb773d9.jpg',
    alt: 'Botanical restaurant with hanging greenery',
    layout: 'wide',
  },
  {
    src: 'https://i1-c.pinimg.com/1200x/9e/d4/1e/9ed41e3bcc83d7072259a991fea72a23.jpg',
    alt: 'Intimate table for two among plants',
    layout: 'wide',
  },
  {
    src: 'https://i.pinimg.com/736x/d9/30/41/d93041c38a8dcda004a3684cc8f802d2.jpg',
    alt: 'Warm trattoria with soft ambient light',
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

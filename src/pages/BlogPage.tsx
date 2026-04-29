import { Link } from 'react-router-dom'
import { BLOG_POSTS } from '../data/blog'
import { useLocale } from '../contexts/LocaleContext'
import type { Lang } from '../types'

function formatDate(iso: string, lang: Lang) {
  return new Date(iso).toLocaleDateString(
    lang === 'ro' ? 'ro-RO' : lang === 'ru' ? 'ru-RU' : 'en-GB',
    { day: 'numeric', month: 'long', year: 'numeric' },
  )
}

export function BlogPage() {
  const { t, lang } = useLocale()

  return (
    <div className="blog-page section">
      <header className="section-head blog-page__head">
        <h1 className="section-title">{t('blog.title')}</h1>
        <p className="section-sub">{t('blog.sub')}</p>
      </header>

      <div className="blog-grid">
        {BLOG_POSTS.map((post) => (
          <article key={post.id} className="blog-card">
            <Link to={`/blog/${post.slug}`} className="blog-card__img-wrap" tabIndex={-1} aria-hidden>
              <img
                src={post.image}
                alt={post.title[lang as Lang]}
                className="blog-card__img"
                loading="lazy"
              />
            </Link>
            <div className="blog-card__body">
              <time className="blog-card__date" dateTime={post.date}>
                {formatDate(post.date, lang as Lang)}
              </time>
              <h2 className="blog-card__title">
                <Link to={`/blog/${post.slug}`}>{post.title[lang as Lang]}</Link>
              </h2>
              <p className="blog-card__excerpt">{post.excerpt[lang as Lang]}</p>
              <Link to={`/blog/${post.slug}`} className="blog-card__read-more">
                {t('blog.readMore')}
                <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listArticles } from '../api/public/article'
import type { Article } from '../api/public/types'
import { useLocale } from '../contexts/LocaleContext'
import type { Lang } from '../types'

function formatDate(iso: string, lang: Lang) {
  return new Date(iso).toLocaleDateString(
    lang === 'ro' ? 'ro-RO' : lang === 'ru' ? 'ru-RU' : 'en-GB',
    { day: 'numeric', month: 'long', year: 'numeric' },
  )
}

function excerpt(text: string, max = 120): string {
  const trimmed = text.replace(/\s+/g, ' ').trim()
  if (trimmed.length <= max) return trimmed
  return `${trimmed.slice(0, max).trimEnd()}…`
}

export function BlogPage() {
  const { t, lang } = useLocale()
  const [posts, setPosts] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    listArticles()
      .then((items) => {
        if (!cancelled) setPosts(items)
      })
      .catch(() => {
        if (!cancelled) setPosts([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="blog-page section">
      <header className="section-head blog-page__head">
        <h1 className="section-title">{t('blog.title')}</h1>
        <p className="section-sub">{t('blog.sub')}</p>
      </header>

      {loading ? (
        <p className="blog-page__loading">...</p>
      ) : (
        <div className="blog-grid">
          {posts.map((post) => (
            <article key={post.id} className="blog-card">
              <Link to={`/blog/${post.id}`} className="blog-card__img-wrap" tabIndex={-1} aria-hidden>
                <img
                  src={post.imageUrl}
                  alt=""
                  className="blog-card__img"
                  loading="lazy"
                />
              </Link>
              <div className="blog-card__body">
                <time className="blog-card__date" dateTime={post.createdAt}>
                  {formatDate(post.createdAt, lang)}
                </time>
                <p className="blog-card__excerpt">{excerpt(post.text)}</p>
                <Link to={`/blog/${post.id}`} className="blog-card__read-more">
                  {t('blog.readMore')}
                  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path
                      d="M3 8h10M9 4l4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

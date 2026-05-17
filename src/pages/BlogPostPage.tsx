import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getArticle } from '../api/public/article'
import type { Article } from '../api/public/types'
import { useLocale } from '../contexts/LocaleContext'
import type { Lang } from '../types'

function formatDate(iso: string, lang: Lang) {
  return new Date(iso).toLocaleDateString(
    lang === 'ro' ? 'ro-RO' : lang === 'ru' ? 'ru-RU' : 'en-GB',
    { day: 'numeric', month: 'long', year: 'numeric' },
  )
}

export function BlogPostPage() {
  const { id: idParam } = useParams<{ id: string }>()
  const { t, lang } = useLocale()
  const [post, setPost] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const id = Number(idParam)
    if (!Number.isFinite(id)) {
      setNotFound(true)
      setLoading(false)
      return
    }
    let cancelled = false
    getArticle(id)
      .then((article) => {
        if (!cancelled) setPost(article)
      })
      .catch(() => {
        if (!cancelled) setNotFound(true)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [idParam])

  if (loading) {
    return (
      <div className="blog-post section">
        <p>...</p>
      </div>
    )
  }

  if (notFound || !post) {
    return (
      <div className="blog-post section">
        <p className="blog-post__not-found">{t('blog.notFound')}</p>
        <Link to="/blog" className="blog-post__back">
          {t('blog.back')}
        </Link>
      </div>
    )
  }

  const paragraphs = post.text.split('\n').filter((line) => line.trim() !== '')

  return (
    <article className="blog-post section">
      <div className="blog-post__hero">
        <img src={post.imageUrl} alt="" className="blog-post__hero-img" />
        <div className="blog-post__hero-overlay" />
        <div className="blog-post__hero-content">
          <time className="blog-post__date" dateTime={post.createdAt}>
            {formatDate(post.createdAt, lang)}
          </time>
        </div>
      </div>

      <div className="blog-post__body">
        {paragraphs.map((para, i) => (
          <p key={i} className="blog-post__para">
            {para}
          </p>
        ))}
      </div>

      <Link to="/blog" className="blog-post__back">
        {t('blog.back')}
      </Link>
    </article>
  )
}

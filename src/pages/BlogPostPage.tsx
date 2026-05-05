import { Link, useParams } from 'react-router-dom'
import { getPostBySlug } from '../data/blog'
import { useLocale } from '../contexts/LocaleContext'
import type { Lang } from '../types'

function formatDate(iso: string, lang: Lang) {
  return new Date(iso).toLocaleDateString(
    lang === 'ro' ? 'ro-RO' : lang === 'ru' ? 'ru-RU' : 'en-GB',
    { day: 'numeric', month: 'long', year: 'numeric' },
  )
}

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const { t, lang } = useLocale()
  const post = slug ? getPostBySlug(slug) : undefined

  if (!post) {
    return (
      <div className="blog-post section">
        <p className="blog-post__not-found">{t('blog.notFound')}</p>
        <Link to="/blog" className="blog-post__back">{t('blog.back')}</Link>
      </div>
    )
  }

  const paragraphs = post.body[lang as Lang].split('\n\n').filter(Boolean)

  return (
    <article className="blog-post section">
      <div className="blog-post__hero">
        <img src={post.image} alt={post.title[lang as Lang]} className="blog-post__hero-img" />
        <div className="blog-post__hero-overlay" />
        <div className="blog-post__hero-content">
          <time className="blog-post__date" dateTime={post.date}>
            {formatDate(post.date, lang as Lang)}
          </time>
          <h1 className="blog-post__title">{post.title[lang as Lang]}</h1>
        </div>
      </div>

      <div className="blog-post__body">
        <p className="blog-post__lead">{post.excerpt[lang as Lang]}</p>
        {paragraphs.map((para, i) => (
          <p key={i} className="blog-post__para">{para}</p>
        ))}
      </div>

      <Link to="/blog" className="blog-post__back">{t('blog.back')}</Link>
    </article>
  )
}

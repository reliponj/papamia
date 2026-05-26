import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getArticle, postArticleComment } from '../api/public/article'
import { PublicApiError } from '../api/public/http'
import type { Article, ArticleComment } from '../api/public/types'
import { useAuthState } from '../contexts/AuthContext'
import { useLocale } from '../contexts/LocaleContext'
import type { Lang } from '../types'
import type { UiKey } from '../data/translations'
import { Button } from '../components/ui/Button'

function formatDate(iso: string, lang: Lang) {
  return new Date(iso).toLocaleDateString(
    lang === 'ro' ? 'ro-RO' : lang === 'ru' ? 'ru-RU' : 'en-GB',
    { day: 'numeric', month: 'long', year: 'numeric' },
  )
}

const COMMENT_ERROR_KEYS: Record<string, UiKey> = {
  comment_text_required: 'blog.comments.error.required',
  article_not_found: 'blog.comments.error.notFound',
}

export function BlogPostPage() {
  const { id: idParam } = useParams<{ id: string }>()
  const { t, lang } = useLocale()
  const { isAuthenticated } = useAuthState()
  const [post, setPost] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [commentError, setCommentError] = useState('')
  const [submitting, setSubmitting] = useState(false)

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

  async function handleSubmitComment(e: React.FormEvent) {
    e.preventDefault()
    if (!post) return
    setCommentError('')
    setSubmitting(true)
    try {
      const created = await postArticleComment(post.id, commentText.trim())
      setPost((prev) =>
        prev
          ? { ...prev, comments: [...(prev.comments ?? []), created] }
          : prev,
      )
      setCommentText('')
    } catch (err) {
      const msg =
        err instanceof PublicApiError && COMMENT_ERROR_KEYS[err.message]
          ? t(COMMENT_ERROR_KEYS[err.message])
          : err instanceof Error
            ? err.message
            : 'Failed to post comment'
      setCommentError(msg)
    } finally {
      setSubmitting(false)
    }
  }

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
  const comments = post.comments ?? []

  return (
    <article className="blog-post section">
      <div className="blog-post__hero">
        <img src={post.imageUrl} alt="" className="blog-post__hero-img" />
        <div className="blog-post__hero-overlay" />
        <div className="blog-post__hero-content">
          <h1 className="blog-post__title">{post.title}</h1>
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

      <section className="blog-comments">
        <h2 className="blog-comments__title">{t('blog.comments.title')}</h2>

        {comments.length === 0 ? (
          <p className="blog-comments__empty">{t('blog.comments.empty')}</p>
        ) : (
          <ul className="blog-comments__list">
            {comments.map((c: ArticleComment) => (
              <li key={c.id} className="blog-comment">
                <time className="blog-comment__date" dateTime={c.createdAt}>
                  {formatDate(c.createdAt, lang)}
                </time>
                <p className="blog-comment__text">{c.text}</p>
              </li>
            ))}
          </ul>
        )}

        {isAuthenticated ? (
          <form className="blog-comments__form" onSubmit={(e) => void handleSubmitComment(e)}>
            <textarea
              className="blog-comments__input"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={t('blog.comments.placeholder')}
              rows={3}
              required
            />
            {commentError && <p className="blog-comments__error">{commentError}</p>}
            <Button type="submit" variant="primary" disabled={submitting || !commentText.trim()}>
              {submitting ? '...' : t('blog.comments.submit')}
            </Button>
          </form>
        ) : (
          <p className="blog-comments__login">
            {t('blog.comments.loginPrompt')}{' '}
            <Link to="/login" className="text-link">
              {t('blog.comments.loginLink')}
            </Link>
          </p>
        )}
      </section>

      <Link to="/blog" className="blog-post__back">
        {t('blog.back')}
      </Link>
    </article>
  )
}

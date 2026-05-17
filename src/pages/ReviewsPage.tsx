import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import * as Tooltip from '@radix-ui/react-tooltip'
import { useLocale } from '../contexts/LocaleContext'
import { useAuthState } from '../contexts/AuthContext'
import { listReviews, createReview, type Review } from '../api/reviews'

function StarRating({
  value,
  onChange,
  readOnly = false,
}: {
  value: number
  onChange?: (v: number) => void
  readOnly?: boolean
}) {
  const [hovered, setHovered] = useState(0)
  const { t } = useLocale()

  return (
    <Tooltip.Provider delayDuration={200}>
      <div
        className="review-stars"
        role={readOnly ? undefined : 'group'}
        aria-label={readOnly ? undefined : t('reviews.write.rating')}
      >
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= (readOnly ? value : hovered || value)
          return (
            <Tooltip.Root key={star}>
              <Tooltip.Trigger asChild>
                <button
                  type="button"
                  className={`review-star${filled ? ' is-filled' : ''}${readOnly ? ' is-readonly' : ''}`}
                  onClick={() => !readOnly && onChange?.(star)}
                  onMouseEnter={() => !readOnly && setHovered(star)}
                  onMouseLeave={() => !readOnly && setHovered(0)}
                  aria-label={`${star} ${star === 1 ? t('reviews.star') : t('reviews.stars')}`}
                  disabled={readOnly}
                  tabIndex={readOnly ? -1 : 0}
                >
                  ★
                </button>
              </Tooltip.Trigger>
              {!readOnly && (
                <Tooltip.Portal>
                  <Tooltip.Content className="review-tooltip" sideOffset={4}>
                    {star} {star === 1 ? t('reviews.star') : t('reviews.stars')}
                    <Tooltip.Arrow className="review-tooltip__arrow" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              )}
            </Tooltip.Root>
          )
        })}
      </div>
    </Tooltip.Provider>
  )
}

function ReviewCard({ review }: { review: Review }) {
  const date = new Date(review.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  return (
    <article className="review-card">
      <header className="review-card__header">
        <div className="review-card__author">
          <span className="review-card__avatar" aria-hidden>
            {review.authorName.charAt(0).toUpperCase()}
          </span>
          <span className="review-card__name">{review.authorName}</span>
        </div>
        <div className="review-card__meta">
          <StarRating value={review.rating} readOnly />
          <time className="review-card__date" dateTime={review.createdAt}>
            {date}
          </time>
        </div>
      </header>
      {review.text && <p className="review-card__text">{review.text}</p>}
    </article>
  )
}

export function ReviewsPage() {
  const { t } = useLocale()
  const { isAuthenticated, user } = useAuthState()

  const [reviews, setReviews] = useState<Review[]>([])
  const [loadState, setLoadState] = useState<'idle' | 'loading' | 'error'>('loading')

  const [rating, setRating] = useState(5)
  const [text, setText] = useState('')
  const [submitState, setSubmitState] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle')
  const [submitError, setSubmitError] = useState('')

  const fetchReviews = useCallback(async () => {
    setLoadState('loading')
    try {
      const data = await listReviews()
      setReviews(data)
      setLoadState('idle')
    } catch {
      setLoadState('error')
    }
  }, [])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (submitState === 'submitting') return
    setSubmitState('submitting')
    setSubmitError('')
    try {
      const created = await createReview({ rating, text: text.trim() })
      setReviews((prev) => [created, ...prev])
      setText('')
      setRating(5)
      setSubmitState('done')
      setTimeout(() => setSubmitState('idle'), 3000)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Error')
      setSubmitState('error')
    }
  }

  return (
    <main className="section reviews-page">
      <div className="reviews-page__inner">
        <div className="section-head">
          <h1 className="section-title">{t('reviews.title')}</h1>
          <p className="section-sub">{t('reviews.sub')}</p>
        </div>

        <section className="review-form-section" aria-label={t('reviews.write.title')}>
          <h2 className="review-form-section__title">{t('reviews.write.title')}</h2>

          {isAuthenticated ? (
            <form className="review-form" onSubmit={handleSubmit}>
              <div className="review-form__row">
                <span className="review-form__label">{t('reviews.write.rating')}</span>
                <StarRating value={rating} onChange={setRating} />
              </div>

              <textarea
                className="review-form__textarea"
                rows={4}
                placeholder={t('reviews.write.placeholder')}
                value={text}
                onChange={(e) => setText(e.target.value)}
                maxLength={1000}
                disabled={submitState === 'submitting'}
              />

              <div className="review-form__footer">
                {submitState === 'done' && (
                  <p className="review-form__success">{t('reviews.write.submitted')}</p>
                )}
                {submitState === 'error' && submitError && (
                  <p className="review-form__error">{submitError}</p>
                )}
                <button
                  type="submit"
                  className="btn btn--primary review-form__submit"
                  disabled={submitState === 'submitting'}
                >
                  {submitState === 'submitting' ? '…' : t('reviews.write.submit')}
                </button>
              </div>
            </form>
          ) : (
            <div className="review-login-prompt">
              <p>
                {t('reviews.write.loginPrompt')}{' '}
                <Link to="/login" className="text-link">
                  {t('reviews.write.loginLink')}
                </Link>
                .
              </p>
            </div>
          )}
        </section>

        <section className="reviews-list-section" aria-label={t('reviews.list.title')}>
          <h2 className="reviews-list-section__title">{t('reviews.list.title')}</h2>

          {loadState === 'loading' && (
            <p className="reviews-list__status">{t('reviews.list.loading')}</p>
          )}
          {loadState === 'error' && (
            <p className="reviews-list__status reviews-list__status--error">
              {t('reviews.list.error')}
            </p>
          )}
          {loadState === 'idle' && reviews.length === 0 && (
            <p className="reviews-list__status">{t('reviews.list.empty')}</p>
          )}
          {loadState === 'idle' && reviews.length > 0 && (
            <ul className="reviews-list" role="list">
              {reviews.map((r) => (
                <li key={r.id}>
                  <ReviewCard review={r} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  )
}

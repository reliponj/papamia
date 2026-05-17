import { Link, useLocation } from 'react-router-dom'
import { useLocale } from '../contexts/LocaleContext'
import { useAuthState } from '../contexts/AuthContext'

type SuccessState = {
  orderId?: number
}

export function OrderSuccessPage() {
  const { t } = useLocale()
  const { isAuthenticated } = useAuthState()
  const location = useLocation()
  const state = (location.state ?? {}) as SuccessState
  const orderId = state.orderId

  return (
    <div className="order-success section">
      <div className="order-success__inner">
        <div className="order-success__icon" aria-hidden="true">
          ✓
        </div>
        <h1 className="order-success__title">
          {orderId != null
            ? t('order.success.titleWithId').replace('{id}', String(orderId))
            : t('order.success.title')}
        </h1>
        <p className="order-success__sub">{t('order.success.sub')}</p>
        <div className="order-success__actions">
          {isAuthenticated ? (
            <Link to="/account" className="btn btn--outline order-success__btn">
              {t('order.success.account')}
            </Link>
          ) : null}
          <Link to="/menu" className="btn btn--primary order-success__btn">
            {t('order.success.back')}
          </Link>
        </div>
      </div>
    </div>
  )
}

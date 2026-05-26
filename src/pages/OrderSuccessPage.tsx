import { useLocation } from 'react-router-dom'
import { useLocale } from '../contexts/LocaleContext'
import { ButtonLink } from '../components/ui/Button'

type SuccessState = {
  orderId?: number
}

export function OrderSuccessPage() {
  const { t } = useLocale()
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
        <ButtonLink to="/" variant="primary" className="order-success__btn">
          {t('order.success.home')}
        </ButtonLink>
      </div>
    </div>
  )
}

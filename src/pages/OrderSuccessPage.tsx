import { Link } from 'react-router-dom'
import { useLocale } from '../contexts/LocaleContext'

export function OrderSuccessPage() {
  const { t } = useLocale()

  return (
    <div className="order-success section">
      <div className="order-success__inner">
        <div className="order-success__icon" aria-hidden="true">✓</div>
        <h1 className="order-success__title">{t('order.success.title')}</h1>
        <p className="order-success__sub">{t('order.success.sub')}</p>
        <Link to="/menu" className="btn btn--primary order-success__btn">
          {t('order.success.back')}
        </Link>
      </div>
    </div>
  )
}

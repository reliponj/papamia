import { useLocale } from '../../contexts/LocaleContext'

export function DeliveryStrip() {
  const { t } = useLocale()
  return (
    <section className="delivery-strip">
      <div className="delivery-strip__inner">
        <div>
          <h2 className="delivery-strip__title">{t('delivery.title')}</h2>
          <p className="delivery-strip__text">{t('delivery.text')}</p>
        </div>
        <div className="delivery-strip__badge">{t('delivery.hours')}</div>
      </div>
    </section>
  )
}

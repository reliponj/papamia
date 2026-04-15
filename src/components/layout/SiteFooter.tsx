import { Link } from 'react-router-dom'
import { useLocale } from '../../contexts/LocaleContext'

export function SiteFooter() {
  const { t } = useLocale()
  return (
    <footer className="site-footer">
      <div className="site-footer__grid">
        <div>
          <div className="site-footer__brand">Papa Mia</div>
          <p className="site-footer__muted">{t('brand.tagline')}</p>
        </div>
        <div>
          <h3 className="site-footer__title">{t('footer.onlineMenu')}</h3>
          <ul className="site-footer__links">
            <li>
              <Link to="/menu">{t('nav.menu')}</Link>
            </li>
            <li>
              <a href="#gallery">{t('gallery.title')}</a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="site-footer__title">{t('footer.info')}</h3>
          <ul className="site-footer__links">
            <li>
              <a href="#">{t('footer.allergens')}</a>
            </li>
            <li>
              <a href="#">{t('footer.privacy')}</a>
            </li>
            <li>
              <a href="#">{t('footer.terms')}</a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="site-footer__title">{t('nav.contacts')}</h3>
          <ul className="site-footer__links">
            <li>{t('contacts.phone')}</li>
            <li>{t('contacts.email')}</li>
            <li>{t('contacts.address')}</li>
            <li>
              <span className="site-footer__muted">{t('footer.hoursLabel')}: 10:00–23:00</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="site-footer__bottom">
        <span>
          {t('footer.partner')}: PapaMia.md
        </span>
        <span>© {new Date().getFullYear()} Papa Mia</span>
      </div>
    </footer>
  )
}

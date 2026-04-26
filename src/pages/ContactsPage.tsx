import { useLocale } from '../contexts/LocaleContext'

const LOCATIONS = [
  {
    key: 'botanica',
    name: { ro: 'Papa Mia — Botanica', ru: 'Papa Mia — Ботаника', en: 'Papa Mia — Botanica' },
    address: {
      ro: 'bd. Dacia 23, Chișinău',
      ru: 'бул. Дачия 23, Кишинёв',
      en: 'Dacia Blvd. 23, Chișinău',
    },
  },
  {
    key: 'centru',
    name: { ro: 'Papa Mia — Centru', ru: 'Papa Mia — Центр', en: 'Papa Mia — Center' },
    address: {
      ro: 'str. Ștefan cel Mare 65, Chișinău',
      ru: 'ул. Штефан чел Маре 65, Кишинёв',
      en: 'Ștefan cel Mare St. 65, Chișinău',
    },
  },
  {
    key: 'riscani',
    name: { ro: 'Papa Mia — Rîșcani', ru: 'Papa Mia — Рышкань', en: 'Papa Mia — Rîșcani' },
    address: {
      ro: 'str. Florilor 8, Chișinău',
      ru: 'ул. Флорилор 8, Кишинёв',
      en: 'Florilor St. 8, Chișinău',
    },
  },
  {
    key: 'buiucani',
    name: { ro: 'Papa Mia — Buiucani', ru: 'Papa Mia — Буюканы', en: 'Papa Mia — Buiucani' },
    address: {
      ro: 'str. Alba Iulia 75, Chișinău',
      ru: 'ул. Алба Юлия 75, Кишинёв',
      en: 'Alba Iulia St. 75, Chișinău',
    },
  },
]

const PHONE = '+373 22 000 001'
const EMAIL = 'hello@papamia.md'
const HOURS = { ro: 'Zilnic 10:00–23:00', ru: 'Ежедневно 10:00–23:00', en: 'Daily 10:00–23:00' }

export function ContactsPage() {
  const { t, lang } = useLocale()

  return (
    <article className="contacts-page section">
      <h1 className="section-title">{t('contacts.title')}</h1>

      <section className="contacts-page__section">
        <h2 className="contacts-page__heading">{t('contacts.section.locations')}</h2>
        <div className="contacts-page__locations">
          {LOCATIONS.map((loc) => (
            <div key={loc.key} className="contacts-page__card">
              <h3 className="contacts-page__card-name">{loc.name[lang]}</h3>
              <p className="contacts-page__card-address">{loc.address[lang]}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="contacts-page__section">
        <h2 className="contacts-page__heading">{t('contacts.section.contacts')}</h2>
        <div className="contacts-page__details">
          <div className="contacts-page__detail-item">
            <span className="contacts-page__label">{t('contacts.phone.label')}</span>
            <a href={`tel:${PHONE.replace(/\s/g, '')}`}>{PHONE}</a>
          </div>
          <div className="contacts-page__detail-item">
            <span className="contacts-page__label">{t('contacts.email.label')}</span>
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
          </div>
          <div className="contacts-page__detail-item">
            <span className="contacts-page__label">{t('contacts.hours.label')}</span>
            <span>{HOURS[lang]}</span>
          </div>
        </div>
      </section>
    </article>
  )
}

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useLocale } from '../contexts/LocaleContext'

// Fix leaflet default marker icons broken by bundlers
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
})

const LOCATIONS = [
  {
    key: 'botanica',
    name: { ro: 'Papa Mia — Botanica', ru: 'Papa Mia — Ботаника', en: 'Papa Mia — Botanica' },
    address: {
      ro: 'bd. Dacia 23, Chișinău',
      ru: 'бул. Дачия 23, Кишинёв',
      en: 'Dacia Blvd. 23, Chișinău',
    },
    coords: [46.9985, 28.8612] as [number, number],
  },
  {
    key: 'centru',
    name: { ro: 'Papa Mia — Centru', ru: 'Papa Mia — Центр', en: 'Papa Mia — Center' },
    address: {
      ro: 'str. Ștefan cel Mare 65, Chișinău',
      ru: 'ул. Штефан чел Маре 65, Кишинёв',
      en: 'Ștefan cel Mare St. 65, Chișinău',
    },
    coords: [47.0245, 28.8322] as [number, number],
  },
  {
    key: 'riscani',
    name: { ro: 'Papa Mia — Rîșcani', ru: 'Papa Mia — Рышкань', en: 'Papa Mia — Rîșcani' },
    address: {
      ro: 'str. Florilor 8, Chișinău',
      ru: 'ул. Флорилор 8, Кишинёв',
      en: 'Florilor St. 8, Chișinău',
    },
    coords: [47.0412, 28.8185] as [number, number],
  },
  {
    key: 'buiucani',
    name: { ro: 'Papa Mia — Buiucani', ru: 'Papa Mia — Буюканы', en: 'Papa Mia — Buiucani' },
    address: {
      ro: 'str. Alba Iulia 75, Chișinău',
      ru: 'ул. Алба Юлия 75, Кишинёв',
      en: 'Alba Iulia St. 75, Chișinău',
    },
    coords: [47.0318, 28.8055] as [number, number],
  },
]

const MAP_CENTER: [number, number] = [47.024, 28.826]
const PHONE = '+373 22 000 001'
const EMAIL = 'hello@papamia.md'
const HOURS = { ro: 'Zilnic 10:00–23:00', ru: 'Ежедневно 10:00–23:00', en: 'Daily 10:00–23:00' }

export function ContactsPage() {
  const { t, lang } = useLocale()

  return (
    <article className="contacts-page section">
      <h1 className="section-title">{t('contacts.title')}</h1>

      <div className="contacts-page__map-wrap">
        <MapContainer
          center={MAP_CENTER}
          zoom={13}
          scrollWheelZoom={false}
          className="contacts-page__map"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {LOCATIONS.map((loc) => (
            <Marker key={loc.key} position={loc.coords}>
              <Popup>
                <strong>{loc.name[lang]}</strong>
                <br />
                {loc.address[lang]}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

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

import { useEffect, useMemo, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MapPin, Phone, Clock } from 'lucide-react'
import { listLocations } from '../api/public/location'
import type { Location } from '../api/public/types'
import { useLocale } from '../contexts/LocaleContext'

const DEFAULT_CENTER: [number, number] = [47.024, 28.826]

// Inline SVG pin so markers always render (no reliance on bundled image assets).
const SHOP_PIN = L.divIcon({
  className: 'shop-pin',
  html: `
    <svg width="32" height="42" viewBox="0 0 24 32" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0C5.4 0 0 5.4 0 12c0 8.6 12 20 12 20s12-11.4 12-20C24 5.4 18.6 0 12 0z" fill="#c45c3e" stroke="#fff" stroke-width="1.5"/>
      <circle cx="12" cy="12" r="4.5" fill="#fff"/>
    </svg>`,
  iconSize: [32, 42],
  iconAnchor: [16, 40],
  popupAnchor: [0, -36],
})

/** Auto-fits the map viewport to all shop markers whenever they change. */
function FitToLocations({ locations }: { locations: Location[] }) {
  const map = useMap()
  useEffect(() => {
    if (locations.length === 0) return
    if (locations.length === 1) {
      map.setView([locations[0].latitude, locations[0].longitude], 15)
      return
    }
    const bounds = L.latLngBounds(locations.map((l) => [l.latitude, l.longitude]))
    map.fitBounds(bounds, { padding: [60, 60], maxZoom: 15 })
  }, [locations, map])
  return null
}

export function ContactsPage() {
  const { t } = useLocale()
  const [locations, setLocations] = useState<Location[]>([])

  useEffect(() => {
    let cancelled = false
    listLocations()
      .then((items) => {
        if (!cancelled) setLocations(items)
      })
      .catch(() => {
        if (!cancelled) setLocations([])
      })
    return () => {
      cancelled = true
    }
  }, [])

  const mapCenter = useMemo<[number, number]>(() => {
    if (locations.length === 0) return DEFAULT_CENTER
    const lat = locations.reduce((s, l) => s + l.latitude, 0) / locations.length
    const lng = locations.reduce((s, l) => s + l.longitude, 0) / locations.length
    return [lat, lng]
  }, [locations])

  return (
    <article className="contacts-page section">
      <h1 className="section-title">{t('contacts.title')}</h1>

      <div className="contacts-page__map-wrap">
        <MapContainer
          center={mapCenter}
          zoom={13}
          scrollWheelZoom
          className="contacts-page__map"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FitToLocations locations={locations} />
          {locations.map((loc) => (
            <Marker key={loc.id} position={[loc.latitude, loc.longitude]} icon={SHOP_PIN}>
              <Popup>
                <strong>{loc.name}</strong>
                {loc.address ? (
                  <>
                    <br />
                    {loc.address}
                  </>
                ) : null}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <section className="contacts-page__section">
        <h2 className="contacts-page__heading">{t('contacts.section.locations')}</h2>
        <div className="contacts-page__locations">
          {locations.map((loc) => (
            <div key={loc.id} className="contacts-page__card">
              {loc.imageUrl ? (
                <img src={loc.imageUrl} alt="" className="contacts-page__card-img" loading="lazy" />
              ) : null}
              <h3 className="contacts-page__card-name">{loc.name}</h3>
              <p className="contacts-page__card-address">
                <MapPin size={15} strokeWidth={1.75} aria-hidden className="contacts-page__card-icon" />
                <span>{loc.address}</span>
              </p>
              <p className="contacts-page__card-phone">
                <Phone size={15} strokeWidth={1.75} aria-hidden className="contacts-page__card-icon" />
                <a href={`tel:${loc.phoneNumber.replace(/\s/g, '')}`}>{loc.phoneNumber}</a>
              </p>
              <p className="contacts-page__card-hours">
                <Clock size={15} strokeWidth={1.75} aria-hidden className="contacts-page__card-icon" />
                <span>{loc.worktime}</span>
              </p>
            </div>
          ))}
        </div>
      </section>
    </article>
  )
}

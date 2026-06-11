import { useEffect, useMemo, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MapPin, Phone, Clock } from 'lucide-react'
import { listLocations } from '../api/public/location'
import type { Location } from '../api/public/types'
import { useLocale } from '../contexts/LocaleContext'

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
})

const DEFAULT_CENTER: [number, number] = [47.024, 28.826]

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
          scrollWheelZoom={false}
          className="contacts-page__map"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {locations.map((loc) => (
            <Marker key={loc.id} position={[loc.latitude, loc.longitude]}>
              <Popup>
                <strong>{loc.name}</strong>
                <br />
                {loc.address}
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

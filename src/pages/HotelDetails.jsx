import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getHotelById, createBooking } from '../services/api'
import './HotelDetails.css'

export default function HotelDetails() {
  const { id } = useParams()
  const [hotel, setHotel] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [loadError, setLoadError] = useState(null)

  const [form, setForm] = useState({ checkIn: '', checkOut: '', guests: 2, name: '', email: '' })
  const [submitting, setSubmitting] = useState(false)
  const [confirmation, setConfirmation] = useState(null)

  useEffect(() => {
    let active = true
    setLoading(true)
    setNotFound(false)
    setLoadError(null)

    getHotelById(id)
      .then((result) => {
        if (!active) return
        if (!result) setNotFound(true)
        else setHotel(result)
      })
      .catch(() => {
        if (active) setLoadError('Could not reach the hotel API right now. Please try again.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [id])

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleBook(e) {
    e.preventDefault()
    setSubmitting(true)
    try {
      const result = await createBooking({ hotelId: id, ...form })
      setConfirmation(result)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="container detail-loading">Loading stay…</div>
  }

  if (loadError) {
    return (
      <div className="container detail-loading">
        <p>{loadError}</p>
        <Link to="/">← Back to all stays</Link>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="container detail-loading">
        <p>We couldn't find that hotel.</p>
        <Link to="/">← Back to all stays</Link>
      </div>
    )
  }

  const nights = calcNights(form.checkIn, form.checkOut)
  const total = nights > 0 ? nights * hotel.price : null
  const sidePhotos = hotel.photos.slice(0, 3)

  return (
    <div className="container detail">
      <Link to="/" className="detail__back">← Back to all stays</Link>

      <div className="detail__gallery">
        <img src={hotel.thumbnail} alt={hotel.name} className="detail__gallery-main" />
        <div className="detail__gallery-side">
          {sidePhotos.map((src, i) => (
            <img src={src} alt={`${hotel.name} view ${i + 1}`} key={src + i} />
          ))}
        </div>
      </div>

      <div className="detail__grid">
        <div className="detail__main">
          <p className="eyebrow">{hotel.location}</p>
          <h1 className="detail__title">{hotel.name}</h1>
          <p className="detail__rating">★ {hotel.rating.toFixed(1)} rating</p>
          <p className="detail__description">{hotel.description}</p>
        </div>

        <aside className="detail__booking">
          {confirmation ? (
            <div className="booking-confirmed">
              <p className="eyebrow">Booking confirmed</p>
              <h3>You're all set.</h3>
              <p className="booking-confirmed__code">{confirmation.confirmationCode}</p>
              <p>A confirmation would normally be emailed to {confirmation.email}.</p>
              <Link to="/">← Back to all stays</Link>
            </div>
          ) : (
            <form className="booking-card" onSubmit={handleBook}>
              <p className="booking-card__price">
                ₹{hotel.price.toLocaleString('en-IN')} <span>/ night</span>
              </p>

              <div className="booking-card__row">
                <div className="booking-card__field">
                  <label htmlFor="checkIn">Check in</label>
                  <input
                    id="checkIn"
                    type="date"
                    required
                    value={form.checkIn}
                    onChange={(e) => updateField('checkIn', e.target.value)}
                  />
                </div>
                <div className="booking-card__field">
                  <label htmlFor="checkOut">Check out</label>
                  <input
                    id="checkOut"
                    type="date"
                    required
                    value={form.checkOut}
                    onChange={(e) => updateField('checkOut', e.target.value)}
                  />
                </div>
              </div>

              <div className="booking-card__field">
                <label htmlFor="guests">Guests</label>
                <input
                  id="guests"
                  type="number"
                  min="1"
                  max="12"
                  value={form.guests}
                  onChange={(e) => updateField('guests', Number(e.target.value))}
                />
              </div>

              <div className="booking-card__field">
                <label htmlFor="name">Full name</label>
                <input
                  id="name"
                  type="text"
                  required
                  placeholder="Jordan Rivera"
                  value={form.name}
                  onChange={(e) => updateField('name', e.target.value)}
                />
              </div>

              <div className="booking-card__field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => updateField('email', e.target.value)}
                />
              </div>

              {total !== null && (
                <div className="booking-card__total">
                  <span>{nights} night{nights > 1 ? 's' : ''}</span>
                  <strong>₹{total.toLocaleString('en-IN')}</strong>
                </div>
              )}

              <button type="submit" className="booking-card__submit" disabled={submitting}>
                {submitting ? 'Booking…' : 'Request to book'}
              </button>
            </form>
          )}
        </aside>
      </div>
    </div>
  )
}

function calcNights(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0
  const inDate = new Date(checkIn)
  const outDate = new Date(checkOut)
  const diff = (outDate - inDate) / (1000 * 60 * 60 * 24)
  return diff > 0 ? diff : 0
}

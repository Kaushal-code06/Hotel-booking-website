import { Link } from 'react-router-dom'
import './HotelCard.css'

export default function HotelCard({ hotel }) {
  return (
    <Link to={`/hotel/${hotel.id}`} className="hcard">
      <div className="hcard__image-wrap">
        <img src={hotel.thumbnail} alt={hotel.name} loading="lazy" />
        <span className="hcard__price">₹{hotel.price.toLocaleString('en-IN')}<small>/night</small></span>
      </div>
      <div className="hcard__body">
        <div className="hcard__row">
          <h3 className="hcard__name">{hotel.name}</h3>
          <span className="hcard__rating">★ {hotel.rating.toFixed(1)}</span>
        </div>
        <p className="hcard__location">{hotel.location}</p>
        <p className="hcard__snippet">{hotel.description}</p>
      </div>
    </Link>
  )
}

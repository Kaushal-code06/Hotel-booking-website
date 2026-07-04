import { useState } from 'react'
import './SearchBar.css'

export default function SearchBar({ onSearch }) {
  const [destination, setDestination] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [minRating, setMinRating] = useState('')
  const [sort, setSort] = useState('default')

  function handleSubmit(e) {
    e.preventDefault()
    onSearch?.({
      destination,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      minRating: minRating ? Number(minRating) : undefined,
      sort,
    })
  }

  return (
    <form className="ticket" onSubmit={handleSubmit}>
      <div className="ticket__main">
        <div className="ticket__field ticket__field--wide">
          <label htmlFor="destination">Destination</label>
          <input
            id="destination"
            type="text"
            placeholder="City or hotel name"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
        </div>

        <div className="ticket__field">
          <label htmlFor="maxPrice">Max price / night</label>
          <input
            id="maxPrice"
            type="number"
            min="0"
            placeholder="Any"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>

        <div className="ticket__field">
          <label htmlFor="minRating">Min rating</label>
          <select id="minRating" value={minRating} onChange={(e) => setMinRating(e.target.value)}>
            <option value="">Any</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="4.5">4.5+</option>
          </select>
        </div>

        <div className="ticket__field ticket__field--narrow">
          <label htmlFor="sort">Sort by</label>
          <select id="sort" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="default">Featured</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="rating-desc">Rating</option>
          </select>
        </div>
      </div>

      <div className="ticket__perforation" aria-hidden="true"></div>

      <div className="ticket__stub">
        <span className="ticket__stub-label">Boarding</span>
        <span className="ticket__stub-code">WAYFARE</span>
        <button type="submit" className="ticket__submit">
          Search stays
        </button>
      </div>
    </form>
  )
}

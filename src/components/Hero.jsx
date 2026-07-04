import SearchBar from './SearchBar'
import './Hero.css'

export default function Hero({ onSearch }) {
  return (
    <section className="hero">
      <div className="container hero__inner">
        <p className="eyebrow">No two stays alike</p>
        <h1 className="hero__title">
          Find a room worth
          <br />
          leaving home for.
        </h1>
        <p className="hero__subtitle">
          500 hotels across India, live from the Wayfare hotel API.
        </p>
      </div>
      <div className="container hero__search">
        <SearchBar onSearch={onSearch} />
      </div>
    </section>
  )
}

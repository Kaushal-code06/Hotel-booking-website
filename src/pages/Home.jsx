import { useEffect, useState } from 'react'
import Hero from '../components/Hero'
import HotelCard from '../components/HotelCard'
import { getHotels } from '../services/api'
import './Home.css'

const PAGE_SIZE = 12

export default function Home() {
  const [hotels, setHotels] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchHotels(filters, page)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  async function fetchHotels(nextFilters, nextPage) {
    setLoading(true)
    setError(null)
    try {
      const result = await getHotels({ ...nextFilters, page: nextPage, pageSize: PAGE_SIZE })
      setHotels(result.hotels)
      setTotal(result.total)
    } catch (err) {
      setError('Could not reach the hotel API right now. Please try again in a moment.')
      setHotels([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }

  function handleSearch(nextFilters) {
    setFilters(nextFilters)
    setPage(1)
    fetchHotels(nextFilters, 1)
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  return (
    <>
      <Hero onSearch={handleSearch} />

      <section className="container results" id="stays">
        <div className="results__heading">
          <h2>{filters.destination ? `Stays in "${filters.destination}"` : 'All stays'}</h2>
          <p>{loading ? 'Searching…' : `${total} places found`}</p>
        </div>

        {error && <p className="results__error">{error}</p>}

        {loading ? (
          <div className="results__grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div className="skeleton-card" key={i} />
            ))}
          </div>
        ) : hotels.length === 0 ? (
          <p className="results__empty">
            No stays match those filters yet. Try a different city or widen your price range.
          </p>
        ) : (
          <>
            <div className="results__grid">
              {hotels.map((hotel) => (
                <HotelCard hotel={hotel} key={hotel.id} />
              ))}
            </div>

            {totalPages > 1 && (
              <nav className="pagination" aria-label="Results pages">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  ← Previous
                </button>
                <span className="pagination__status">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next →
                </button>
              </nav>
            )}
          </>
        )}
      </section>
    </>
  )
}

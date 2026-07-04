// src/services/api.js
//
// Live integration with the Hotel Search API Playground:
//   Docs: https://demohotelsapi.pythonanywhere.com/
//   Data: https://demohotelsapi.pythonanywhere.com/hotels/
//
// The API returns ALL hotels in a single response (no server-side
// search, filtering, or pagination), so this module fetches the full
// list once, caches it in memory, and does searching / sorting /
// pagination on the client. That keeps Home.jsx and HotelDetails.jsx
// simple and fast (no refetching on every keystroke or page change).

const API_BASE = 'https://demohotelsapi.pythonanywhere.com'

let cache = null // Array of normalized hotels, once loaded
let inFlight = null // Dedupe concurrent fetches

// Normalize the API's raw shape into what the UI uses.
// Raw hotel: { id, name, price (string), thumbnail, rating, location, description, photos[] }
function normalize(raw) {
  return {
    id: raw.id,
    name: raw.name,
    location: raw.location,
    price: Math.round(parseFloat(raw.price)),
    rating: raw.rating,
    description: raw.description,
    thumbnail: raw.thumbnail,
    photos: Array.isArray(raw.photos) ? raw.photos : [],
  }
}

async function loadAllHotels() {
  if (cache) return cache
  if (inFlight) return inFlight

  inFlight = fetch(`${API_BASE}/hotels/`)
    .then((res) => {
      if (!res.ok) throw new Error(`Request failed with status ${res.status}`)
      return res.json()
    })
    .then((json) => {
      const list = Array.isArray(json.data) ? json.data : []
      cache = list.map(normalize)
      inFlight = null
      return cache
    })
    .catch((err) => {
      inFlight = null
      throw err
    })

  return inFlight
}

/**
 * Fetch hotels, optionally filtered, sorted, and paginated.
 * @param {{
 *   destination?: string,
 *   minPrice?: number,
 *   maxPrice?: number,
 *   minRating?: number,
 *   sort?: 'price-asc' | 'price-desc' | 'rating-desc' | 'default',
 *   page?: number,
 *   pageSize?: number
 * }} filters
 * @returns {Promise<{ hotels: Array, total: number, page: number, pageSize: number }>}
 */
export async function getHotels(filters = {}) {
  const all = await loadAllHotels()
  const {
    destination = '',
    minPrice,
    maxPrice,
    minRating,
    sort = 'default',
    page = 1,
    pageSize = 12,
  } = filters

  let results = all

  const query = destination.trim().toLowerCase()
  if (query) {
    results = results.filter(
      (hotel) =>
        hotel.location.toLowerCase().includes(query) ||
        hotel.name.toLowerCase().includes(query)
    )
  }

  if (typeof minPrice === 'number') {
    results = results.filter((hotel) => hotel.price >= minPrice)
  }
  if (typeof maxPrice === 'number') {
    results = results.filter((hotel) => hotel.price <= maxPrice)
  }
  if (typeof minRating === 'number') {
    results = results.filter((hotel) => hotel.rating >= minRating)
  }

  results = [...results]
  if (sort === 'price-asc') results.sort((a, b) => a.price - b.price)
  else if (sort === 'price-desc') results.sort((a, b) => b.price - a.price)
  else if (sort === 'rating-desc') results.sort((a, b) => b.rating - a.rating)

  const total = results.length
  const start = (page - 1) * pageSize
  const hotels = results.slice(start, start + pageSize)

  return { hotels, total, page, pageSize }
}

/**
 * Fetch a single hotel by id (looked up from the cached full list).
 * @param {number|string} id
 * @returns {Promise<Object|null>}
 */
export async function getHotelById(id) {
  const all = await loadAllHotels()
  const numericId = Number(id)
  return all.find((hotel) => hotel.id === numericId) || null
}

/**
 * Return the distinct list of locations/cities present in the data,
 * sorted alphabetically. Useful for a destination filter dropdown.
 * @returns {Promise<string[]>}
 */
export async function getLocations() {
  const all = await loadAllHotels()
  const set = new Set(all.map((hotel) => hotel.location))
  return Array.from(set).sort()
}

/**
 * Submit a booking request. The demo API has no booking endpoint, so
 * this simulates one locally. Swap this out for a real POST once a
 * booking endpoint exists.
 * @param {{ hotelId: number|string, checkIn: string, checkOut: string, guests: number, name: string, email: string }} booking
 * @returns {Promise<{ confirmationCode: string }>}
 */
export async function createBooking(booking) {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const confirmationCode = 'WF-' + Math.random().toString(36).slice(2, 8).toUpperCase()
  return { confirmationCode, ...booking }
}

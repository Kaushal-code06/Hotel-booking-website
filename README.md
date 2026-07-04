# Wayfare — Hotel Booking App (live API)

A React + Vite hotel booking front end wired to a real, live API:

- Docs: https://demohotelsapi.pythonanywhere.com/
- Data: https://demohotelsapi.pythonanywhere.com/hotels/

The API returns all ~500 hotels in a single response with no
server-side search or pagination, so this app fetches the list once,
caches it in memory, and does searching, sorting, and pagination on
the client (`src/services/api.js`).

## Structure

```
hotel-booking/
├── public/
├── src/
│   ├── components/     Navbar, Hero, HotelCard, SearchBar, Footer
│   ├── pages/           Home (list + filters + pagination), HotelDetails (gallery + booking form)
│   ├── services/api.js  Real fetch() calls to the hotel API, client-side filter/sort/paginate
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

## What's implemented

- **Home page**: search by city/hotel name, max price, minimum rating,
  and sort (price or rating), plus pagination (12 per page)
- **Hotel details page**: photo gallery, description, rating, and a
  booking form that calculates total price from check-in/check-out
  dates
- **Loading and error states**: skeleton cards while fetching, a clear
  message if the API is unreachable, and a "no results" state for
  filters that match nothing
- **Booking**: the demo API has no booking endpoint, so `createBooking`
  in `src/services/api.js` simulates one locally and returns a
  confirmation code. Swap it for a real `POST` once a booking endpoint
  exists — the rest of the app doesn't need to change.

## Run it locally

Requires [Node.js](https://nodejs.org/) 18+.

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## Build for production

```bash
npm run build
npm run preview   # optional: preview the production build locally
```

Deploy the `dist/` folder to Vercel, Netlify, GitHub Pages, or any
static host.

## Publishing to GitHub

```bash
git init
git add .
git commit -m "Wayfare hotel booking app with live API integration"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

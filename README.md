# HavenDesk hotel frontend

React 19 + Vite frontend for HavenDesk hotel operations, designed to connect to a Django REST API.

## Run locally

1. Install Node.js 20.19+ or 22.12+.
2. Run npm install.
3. Copy .env.example to .env.local and set VITE_API_BASE_URL to the Django server URL.
4. Run npm run dev and open the URL printed by Vite.

Modules show sample data if their API endpoint is unavailable. Changes made in preview mode are stored in the current browser only and are clearly labeled.

## Django API endpoints

All endpoints use JSON and Django session cookies. Unsafe requests include the X-CSRFToken header when the csrftoken cookie is present. Configure Django CORS and CSRF trusted origins when Vite and Django use different origins.

- GET /api/dashboard/ returns summary metrics and optional weekly_occupancy.
- GET /api/reservations/ returns a list or DRF paginated response. POST /api/reservations/ accepts guest, room type, guest count and stay dates.
- GET /api/arrivals/ returns today's arrivals.
- GET, POST /api/rooms/ lists and creates rooms; PATCH /api/rooms/{id}/ updates room records.
- GET, POST /api/guests/ lists and creates guest profiles.
- GET, POST /api/folios/ lists and creates folios/payment records.
- GET, POST /api/housekeeping/tasks/ lists and creates tasks; PATCH /api/housekeeping/tasks/{id}/ advances task state.
- GET /api/reports/ supplies report metrics and filtered data.
- GET, PATCH /api/settings/ supplies and updates hotel configuration.

Override any URL path through the matching VITE_*_ENDPOINT setting in .env.local. The initial backend should enforce authorization, booking conflicts, payment state transitions, room readiness and audit logging. The browser preview cannot enforce those business rules.

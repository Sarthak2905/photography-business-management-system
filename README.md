# Luxury Wedding Photography Business Platform

Premium full-stack management platform for a professional wedding photography studio.

## Highlights

- Cinematic public-facing portfolio website with hero, about, services, filtered masonry gallery, testimonials, inquiry form, and WhatsApp CTA
- Secure admin dashboard with JWT login, analytics, leads, manual clients, bookings, revenue tracking, portfolio management, testimonials, and settings
- Express + MongoDB API with fallback demo data for local review when MongoDB is not configured
- Cloudinary-ready upload endpoint and Nodemailer-ready inquiry notification flow
- Responsive React + Vite frontend styled with Tailwind CSS, Framer Motion, and Recharts analytics

## Project Structure

- `/client` – React frontend
- `/server` – Express API

## Local Setup

### 1. Install dependencies

Dependencies are already separated by app:

```bash
npm install --prefix client
npm install --prefix server
```

### 2. Configure environment variables

Copy the example files and update values:

```bash
cp .env.example .env
cp server/.env.example server/.env
```

Frontend:

- `VITE_API_URL=http://localhost:5000/api`

Backend:

- `MONGODB_URI`
- `JWT_SECRET`
- `DEFAULT_ADMIN_EMAIL`
- `DEFAULT_ADMIN_PASSWORD`
- optional SMTP and Cloudinary credentials

### 3. Start the apps

```bash
npm run dev:server
npm run dev:client
```

### 4. Validate

```bash
npm run lint
npm run build
npm test
```

## Demo Login

- Email: `admin@luminaweddings.com`
- Password: `admin123`

If the backend or MongoDB is unavailable, the frontend automatically falls back to demo mode so the full experience can still be reviewed locally.

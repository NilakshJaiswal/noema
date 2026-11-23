# Noema Technology — MERN Website

A premium, modern rebuild of [noematechnology.com](https://noematechnology.com) for
**Noema Science & Technology Pvt. Ltd.** — a research-driven cognitive science &
education-technology organisation and the makers of **Cogmentor**, India's first
scientifically proven AI-based cognitive assessment & training platform for children.

Built on the **MERN** stack with a design-forward front end.

> *Forward Thinking — decoding what's on your mind, cognitively train and evolve.*

---

## Tech stack

| Layer    | Tech |
|----------|------|
| Frontend | React 18 · Vite · Tailwind CSS · Framer Motion · React Router · Lucide icons · Axios |
| Backend  | Node.js · Express · Mongoose (MongoDB) · Helmet · express-validator · express-rate-limit · Nodemailer |
| Database | MongoDB (local or Atlas) |

### Design highlights
- Deep-navy "neuroscience lab" aesthetic with refined teal + amber brand palette
  (evolved from the original `#00839f` / `#ED7500`).
- Animated neural-network hero (canvas), scroll-triggered reveals, glass surfaces.
- Space Grotesk / Inter / JetBrains Mono typography.
- Fully responsive, keyboard accessible, WCAG-AA contrast, `prefers-reduced-motion` aware.

---

## Project structure

```
.
├── client/            # React + Vite front end
│   ├── src/
│   │   ├── components/ # Navbar, Footer, Logo, Reveal, NeuralField, Avatar, Icon…
│   │   ├── sections/   # Hero, Product, About, Research, Leadership, VisionMission, JoinCTA, Contact
│   │   ├── pages/      # Home, LegalPage, Admin
│   │   ├── data/       # Published content and theme bindings
│   │   └── lib/api.js    # Axios client
│   └── vite.config.js    # Dev proxy /api → :5000
├── server/            # Express API
│   ├── content/       # Website defaults, editing schema, and persistence
│   ├── routes/contentRoutes.js
│   ├── models/Contact.js
│   ├── routes/contactRoutes.js
│   ├── controllers/contactController.js
│   ├── config/db.js
│   ├── utils/mailer.js
│   └── server.js
└── package.json       # Root scripts (run client + server together)
```

---

## Getting started

### Prerequisites
- Node.js 18+ and npm
- (Optional) MongoDB running locally or a MongoDB Atlas connection string for contact submissions

### 1. Install everything
```bash
npm run install:all
```

### 2. Configure environment
```bash
cp server/.env.example server/.env
cp client/.env.example client/.env     # optional for dev
```
Edit `server/.env` and set `MONGODB_URI` (and mail settings if you want email
notifications). MongoDB stores contact submissions. Website edits are saved to the content file described below.

### 3. Run in development (both servers together)
```bash
npm run dev
```
- Client → http://localhost:5173
- API    → http://localhost:5000  (health check at `/api/health`)
- Admin  → http://localhost:5173/admin

### 4. Production build
```bash
npm run build        # builds client/dist
npm start            # runs the Express API
```
Serve `client/dist` from a static host or reverse proxy. Configure an SPA fallback to `index.html` for frontend routes such as `/admin`. Serve the API on the same origin or set `VITE_API_BASE` before building and add the frontend origin to `CLIENT_ORIGINS`.

---

## Website admin

1. Set `ADMIN_EMAIL` and a unique `ADMIN_PASSWORD` of at least 12 characters in `server/.env`, then restart the API.
2. Open `/admin` and sign in. Select a section to edit its content. Use the visibility controls to remove or restore a whole homepage section. Lists support adding, editing, removing, and reordering items.
3. Select **Publish changes** to make the entire draft live. **View website** opens the visitor view in another tab.

Published edits are stored in `server/data/site-content.json` by default. For production, set `SITE_CONTENT_FILE` to an absolute path on a writable, persistent volume and back up this file. Run one API process against each content file. Sign in again after an API restart.

## API

| Method | Route           | Body                                   | Description |
|--------|-----------------|----------------------------------------|-------------|
| GET    | `/api/health`   | —                                      | Service + DB status |
| POST   | `/api/contact`  | `{ name, email, mobile?, message, kind? }` | Store & notify on a contact/join enquiry |
| GET    | `/api/content`  | — | Read published website content |
| POST   | `/api/admin/login` | `{ email, password }` | Start an admin session |
| GET    | `/api/admin/content` | — | Read the editor content and revision |
| PUT    | `/api/admin/content` | `{ revision, content }` | Publish the draft for the given revision |
| POST   | `/api/admin/logout` | — | End the admin session |

Admin endpoints other than login use an `Authorization: Bearer <token>` header.

`kind` is `"contact"` (default) or `"join"`. A hidden `company` honeypot field and
per-IP rate limiting guard against spam.

---

## Notes
- The **Disclaimer** and **Privacy Policy** pages contain sensible template copy —
  have them reviewed by a legal professional before going live.
- Scientist and leader profiles support optional photos from the admin panel. A profile with an empty photo field uses its initials.

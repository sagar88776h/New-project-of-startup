# DEVI — The Real Fast Food Centre
### Digital Contactless QR Menu & Table Ordering System

Production-grade, motion-driven, mobile-perfect digital restaurant menu built with **React 19**, **Vite**, **Framer Motion**, and native CSS tokens. Designed specifically for instant smartphone scanning, contactless table ordering, and kitchen dispatch.

---

## 🚀 Key Features

- **Mobile-First Responsive Architecture**: Zero horizontal overflow at any viewport width (tested at 320px, 360px, 375px, 390px, 412px, 430px, and short displays down to 568px).
- **Motion System**: Smooth 60fps micro-animations powered by `framer-motion` (`LazyMotion`, `m.*` components), strict GPU transforms/opacities, and respect for `prefers-reduced-motion`.
- **High-Performance Image Pipeline**: WebP + AVIF modern image formats with asynchronous decoding, lazy loading, and priority preloading for the hero banner. Graceful styled fallbacks with dietary badges on network failure.
- **Dietary Indicators & Smart Filters**: Pure Veg, Non-Veg, Bestsellers, and Chef's Specials instant filtering.
- **Contactless Table Ordering**: Customization options (extras, portion sizing, spice levels, chef notes), quantity management, tax & service calculation, and WhatsApp kitchen dispatch.
- **Table Service Assistance**: Instant one-tap "Call Waiter", "Request Water", "Extra Plates & Napkins", and "Bill Request" modals.
- **Admin Suite & QR Studio**: Dynamic table QR code generator for printable tent cards, menu manager, and theme controls accessed via `?admin=1`.
- **WCAG AA Accessibility & Rich SEO**: Keyboard focus trapping, Escape key modal dismiss, visible focus rings, full Open Graph / Twitter Card social previews, Web App Manifest, and sitemap.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Framework** | React 19, Vite 8 |
| **Animation** | Framer Motion (LazyMotion, domAnimation, m.*) |
| **Icons** | Lucide React |
| **Styling** | Vanilla CSS Design Tokens (`src/styles/index.css`) |
| **Quality Gate** | Oxlint, Playwright Chromium, Lighthouse |
| **Image Engine** | Sharp (WebP + AVIF batch generation) |

---

## 📦 Getting Started

### 1. Prerequisites
- Node.js 18+ (Node.js 20+ recommended)
- npm 9+

### 2. Installation
```bash
npm install
```

### 3. Local Development
```bash
npm run dev
```
Starts the Vite development server with Hot Module Replacement (HMR) at `http://localhost:5173`.

### 4. Production Build
```bash
npm run build
```
Generates the optimized static distribution bundle in `./dist` with automatic vendor chunk splitting (`motion`, `icons`, `qrcode`, `react-dom`).

### 5. Preview Production Build
```bash
npm run preview
```
Spins up a local HTTP server serving the production `./dist` bundle.

---

## 🧪 Quality Gate & Automated Testing

Run the full quality gate pipeline in a single command:
```bash
npm run check
```
This runs:
1. `npm run lint` — Instant linting with **oxlint** (0 errors, 0 warnings).
2. `npm run build` — Production Vite bundle generation with code splitting.
3. `npm run test:smoke` — Automated Playwright smoke testing across all mobile widths (320px–430px).
4. `npm run test:e2e` — End-to-end user flows (filters, search, dish customization, order placement, table change, waiter assistance, info modal).

---

## 🌐 Deployment Guide

### Option 1: Vercel (Recommended)
This repository includes a pre-configured [`vercel.json`](file:///c:/Users/sagar/Desktop/new%20project%20for%20startup/New-project-of-startup/vercel.json) file with SPA fallback routing and 1-year immutable cache headers for hashed bundles.

1. Install the Vercel CLI (or link via GitHub):
   ```bash
   npm i -g vercel
   vercel
   ```
2. For production deploy:
   ```bash
   vercel --prod
   ```
3. Or import the repository directly in the [Vercel Dashboard](https://vercel.com/new). Settings will be detected automatically:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Option 2: Netlify
This repository includes [`netlify.toml`](file:///c:/Users/sagar/Desktop/new%20project%20for%20startup/New-project-of-startup/netlify.toml) with SPA redirects:
1. Connect repository in [Netlify Dashboard](https://app.netlify.com/).
2. Build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

---

## 🔗 Special Query Parameters & URL Routing

- **Customer Table Access**:
  - `https://your-domain.com/?table=04` — Automatically locks the order session to Table #4.
- **Admin Dashboard & QR Studio**:
  - `https://your-domain.com/?admin=1` — Reveals the top test bar, admin controls, and QR code generator studio.

---

## ✅ Launch Verification Checklist (Manual Hand-Off)

Before making the QR code live in the restaurant, perform this checklist on real devices:

1. **Physical QR Scan on 2–3 Real Phones**:
   - [ ] Scan a generated table QR code (`?table=04`) on an iPhone (Safari Camera) and an Android device (Google Lens / Chrome).
   - [ ] Verify the table number automatically displays as `Table 04` in the top header and cart.
2. **End-to-End Test Order**:
   - [ ] Add an item with customizations (e.g. portion size, special kitchen note).
   - [ ] Proceed to order and verify the WhatsApp link redirects with the formatted order text and correct table number.
3. **Verify Contact Information**:
   - [ ] Verify restaurant WhatsApp number in `src/data/defaultRestaurants.js` (`contact.whatsapp`).
   - [ ] Verify phone number, address, and WiFi password in the About modal.
4. **Custom Domain & HTTPS**:
   - [ ] Connect custom restaurant domain (e.g., `menu.devifastfood.com`) in Vercel/Netlify.
   - [ ] Ensure HTTPS SSL certificate is active.
5. **Analytics & Monitoring**:
   - [ ] Enable Vercel Web Analytics or add your Google Analytics 4 tag in `index.html`.

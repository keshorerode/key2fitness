# The Key 2 Fitness — Next.js Website

Unisex gym website for The Key 2 Fitness, Erode.

## Tech Stack
- **Next.js 14** (App Router, TypeScript)
- **Framer Motion** (all animations)
- **next/font** (Bebas Neue, Barlow Condensed, Barlow)
- **next/image** (optimised images)
- **localStorage** (CMS persistence — no backend needed)

---

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Run development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

### 3. Build for production
```bash
npm run build
npm start
```

---

## Deploy to Vercel (Free)

1. Push this folder to a GitHub repo
2. Go to [vercel.com](https://vercel.com) → Import project
3. Select the repo → Deploy
4. Buy a domain (e.g. key2fitness.in) → Add in Vercel Settings → Domains

---

## CMS Admin Dashboard

Visit `/admin` (e.g. `https://yourdomain.com/admin`)

**Password:** `key2fit2026`

### What the coach can edit:
| Section | Fields |
|---------|--------|
| 🏠 Hero | Headlines, subheading, quotes |
| 👩 Female | Headlines, description, stats |
| 🏋️ Training | All 6 cards (title, icon, desc, tag) |
| 💰 Prices | All 5 membership prices + PT packages |
| 📞 Contact | Address, phone, hours, payment |
| 🖼 Gallery | Add/remove photos by URL |

**To add gym photos:**
1. Upload to [imgbb.com](https://imgbb.com) (free)
2. Copy the Direct Link
3. Admin → Gallery → Paste URL → Add Photo → Save

**Keyboard shortcut:** `Ctrl+S` to save

---

## Adding Real Gym Photos

Replace Unsplash placeholder images by:
1. Going to Admin → Gallery
2. Pasting your actual gym photo URLs

For Hero and Female section photos, edit these lines in:
- `components/HeroSection.tsx` — male athlete photo URL
- `components/FemaleSection.tsx` — female athlete photo URL

---

## Project Structure

```
app/
  layout.tsx          ← fonts, metadata
  page.tsx            ← main page
  globals.css         ← CSS variables + global styles
  admin/
    page.tsx          ← full CMS dashboard
components/
  Navbar.tsx
  HeroSection.tsx
  FemaleSection.tsx
  TrainingSection.tsx
  GallerySection.tsx
  PackagesSection.tsx
  ContactSection.tsx
  Footer.tsx
lib/
  cms-data.ts         ← data types, defaults, localStorage helpers
```

---

## Change Admin Password

Open `app/admin/page.tsx` → find line:
```ts
const CMS_PW = 'key2fit2026'
```
Change to your new password → save → redeploy.

---

Built with ❤️ for The Key 2 Fitness, Erode.

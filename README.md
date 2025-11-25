**Project Overview**

- **Name:** `mlm`
- **Type:** Next.js (App Router) full-stack application
- **Purpose:** A multi-level marketing (MLM) platform with referral tracking, admin dashboards, payments, blog editor, and user management.

**Quick Start (Windows PowerShell)**

- **Install dependencies:**

  ```powershell
  npm install
  ```

- **Run development server:**

  ```powershell
  npm run dev
  ```

- **Build for production:**

  ```powershell
  npm run build
  npm run start
  ```

**Core Technologies**

- **Framework:** Next.js (App Router)
- **Language:** JavaScript (ESM modules)
- **UI:** React + Tailwind (and some SCSS)
- **State:** Redux Toolkit + SWR
- **DB:** MongoDB (via `mongoose` / native Mongo driver)
- **Auth:** `next-auth` (with Mongo adapter)
- **Email:** SendGrid / Nodemailer (project includes `@sendgrid/mail` and `nodemailer`)
- **File Uploads:** Cloudinary + custom upload endpoints
- **Other libs:** `react-hot-toast`, `recharts`, `framer-motion`, etc.

**Repository Scripts** (see `package.json`)

- **dev:** `next dev` — Run development server
- **build:** `next build` — Build for production
- **start:** `next start` — Start production server
- **lint:** `eslint` — Run ESLint

**Important Files & Folders**

- `src/app/` : Next.js App Router pages and layout (primary app code)
- `src/components/` : Reusable UI components (Sidebar, Navbar, Hero, dashboard widgets)
- `src/api/` : API route handlers used by the app
- `src/lib/` : Helpers (DB, email, template parsing, Cloudinary upload helpers)
- `src/models/` : Mongoose models such as `User`, `Transaction`, `Payment`, `EmailTemplate`
- `src/store/` : Redux store configuration
- `next.config.mjs` : Next configuration (image remote patterns configured)
- `scripts/` : Utility scripts (seeding, DB updates)

**next.config.mjs (images)**

- The project already allows some remote image hosts via `remotePatterns`:

  - `lh3.googleusercontent.com`
  - `avatars.githubusercontent.com`
  - `res.cloudinary.com`

  If you add images from other external hosts, add them to `next.config.mjs` (or to `images.domains` / `remotePatterns`).

**Environment Variables**

The project uses several secrets and external services. Create a `.env.local` (do NOT commit) and set the necessary variables. Common variables used by this project may include:

- **Database**:
  - `MONGODB_URI` — MongoDB connection string

- **NextAuth & App**:
  - `NEXTAUTH_SECRET` — NextAuth secret
  - `NEXTAUTH_URL` — Application URL (e.g., `http://localhost:3000`)

- **Email / SendGrid / SMTP**:
  - `SENDGRID_API_KEY` — (if using SendGrid)
  - `SENDGRID_FROM_EMAIL`

- **Cloudinary (uploads)**:
  - `CLOUDINARY_CLOUD_NAME`
  - `CLOUDINARY_API_KEY`
  - `CLOUDINARY_API_SECRET`

- **Now Payment**:
  - `NOWPAYMENTS_API_KEY`
  - `NOWPAYMENTS_API_URL`
  - `IPN_SECRET_KEY`
  - `APP_URL`  — Application URL



Add other provider keys as required by the services you enable. Keep these private.

**Development Notes**

- The app uses the App Router. Server and client components are mixed; put client-only logic inside client components (e.g., `useEffect` or `'use client'` files).
- API routes live under `src/app/api` and follow Next.js conventions.
- For image optimization, use `next/image` (the repository was updated to replace `img` tags with `Image` in certain modals and pages).

**Build & Deployment**

- Build with `npm run build`. If you see ESLint blocking errors, run `npm run lint` to inspect them locally.
- Deploy to Vercel or other hosts supporting Next.js. Ensure environment variables from the `.env.local` are configured in the deployment environment.

**Troubleshooting & Recent Fixes**

This project recently had a few build/lint issues that were addressed; include these notes when troubleshooting:

- **react/no-unescaped-entities**: The production build can fail when JSX contains unescaped quotes/apostrophes. Fix: escape or rephrase text (examples updated in `src/app/payment/page.js`, `src/app/success/page.js`, and `src/components/Hero.js`).
- **react-hooks/exhaustive-deps**: Some `useEffect` hooks missed stable dependencies. Fix: wrap functions with `useCallback` or include the callbacks in the dependency array (fixed in `src/app/(pages)/user/downline/page.js` and `src/components/Sidebar.js`).
- **useSearchParams prerender**: `useSearchParams()` in a server-prerendered page requires a Suspense boundary. Fix: moved search param parsing to client-side `useEffect` in the blog editor page (`src/app/(pages)/blog-editor/page.js`).
- **@next/next/no-img-element**: Replaced critical plain `<img>` usages with `next/image` across several pages (e.g., `src/app/(pages)/manage-users/page.js`, `src/app/(pages)/user/profile/page.js`, `src/app/(pages)/user/referrals/page.js`). If external images cause build errors, update `next.config.mjs` to include the host in `remotePatterns`.

**Testing & Linting**

- ESLint is configured via `eslint-config-next`. Run:

  ```powershell
  npm run lint
  ```

- There are no automated test scripts in `package.json` by default. Consider adding unit/integration tests (Jest/Testing Library) if needed.



**Next Steps & Recommendations**

- If you plan to serve images from additional external hosts, add them to `next.config.mjs`.
- Add a `.env.example` (non-secret sample) listing required environment variables so other developers can quickly onboard.
- Add unit tests for critical logic (auth, payment status updates, referral calculations).



## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

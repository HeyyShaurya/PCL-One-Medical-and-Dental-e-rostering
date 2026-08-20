# PCL One — Medical & Dental e-Rostering (demo)

A demonstration build for The Rotherham NHS Foundation Trust & Barnsley Hospital NHS
Foundation Trust. Restyled to the PCL One design system, and made fully interactive —
every module has real (mock) data, working tabs, and working row actions, not just a
static template.

## Run locally

```bash
npm install
npm run dev
```

Open the printed local URL (usually http://localhost:3000).

## Build a static copy

```bash
npm install
npm run build
```

This produces a `dist/` folder you can deploy anywhere that serves static files.

## Deploy for free (no build step needed on their end)

The easiest zero-setup option is **Netlify Drop**:
1. Run `npm run build` locally (or use the pre-built `dist/` you were given separately).
2. Go to https://app.netlify.com/drop
3. Drag the `dist` folder onto the page. It deploys instantly and gives you a public URL.

Vercel, Cloudflare Pages, or GitHub Pages also work — point them at this repo with
build command `npm run build` and output directory `dist`.

## What's in this build

- Sign-in: six persona cards (Consultant, Registrar, Roster Coordinator, Guardian of
  Safe Working, Junior Doctor, Clinical Director).
- Top bar: Trust switcher, live search (try typing "leave" or "theatre"), a notifications
  dropdown, and a hamburger menu that opens a module drawer.
- Home springboard: 11 module tiles, quick actions that link into the right module, and
  a "Things to review" panel whose numbers are live counts, not hardcoded text.
- All 11 modules (Scheduling, Optimisation, Self-Roster, Leave, Exceptions, Theatre,
  Integrations, Mobile App, Vacancies, Analytics, Admin) have distinct data and working
  actions — approving leave, resolving an exception, or filling a vacancy updates the
  Home page counts immediately.
- Session (who's logged in) and demo data changes persist across a page refresh via
  `sessionStorage`, and reset cleanly when you sign out.

## Fixed from the previous build

1. **Blank white screen on refresh / direct link to any module** — caused by calling
   `navigate()` during render instead of in `useEffect`. Fixed in `Layout.tsx`.
2. **Every module was the same copy-pasted template** (same 3 fake rows, same headers,
   regardless of module) with no working buttons. Each module now has its own real mock
   dataset and working tabs/actions.
3. **Home greeting showed "Good morning, Dr."** — name parsing broke on personas with a
   title. Fixed with a `firstNameOf()` helper in `store.tsx`.
4. Hamburger menu, notification bell, and search box were purely decorative — now all
   three work (module drawer, notifications dropdown with "mark all read", live search).

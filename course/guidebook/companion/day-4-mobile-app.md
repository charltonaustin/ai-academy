# Day 4: Progressive Web App

**Session 04 of 5**

**Today's Goal:** Turn the Angular frontend into an installable, offline-capable Progressive Web App (PWA)

**Work at your own pace - start with foundation, add features throughout the day**

---

## What You're Building Today

### Required Foundation

Make the existing Angular app installable and resilient:

- [ ] Add PWA support with `ng add @angular/pwa` (service worker + web manifest)
- [ ] Configure the web app manifest (name, icons, theme color, `display: standalone`)
- [ ] Configure service worker caching in `ngsw-config.json` (app shell + assets)
- [ ] Verify the app installs to the home screen / desktop
- [ ] Verify the app shell loads offline
- [ ] Responsive lead list and lead detail views that work at phone sizes

---

## PWA Foundation

### Technology Stack

**Angular + `@angular/pwa`:**

- Angular's service worker (`@angular/service-worker`) handles caching and offline delivery
- A web app manifest makes the app installable ("Add to Home Screen")
- TypeScript for type safety (same codebase as the web app - no separate project)

**Key pieces added by `ng add @angular/pwa`:**

- `ngsw-config.json` (service worker caching configuration)
- `src/manifest.webmanifest` (installability metadata + icons)
- Service worker registration in `app.config.ts` (`provideServiceWorker('ngsw-worker.js', ...)`)
- A set of PWA icons under `public/` (or `src/assets/`)

### Setting Up the PWA

**Add PWA support:**

- Run `ng add @angular/pwa` in the `crm-frontend` project
- This wires up the service worker, manifest, and icons automatically
- `HttpClient` already connects to the backend REST API - no new client needed

**Critical: the service worker only runs in a production build:**

- `ng serve` (dev) does **not** register the service worker - this is intentional
- To test PWA behavior, build for production and serve the static output:

```bash
# Build production bundle (emits ngsw-worker.js + manifest)
npm run build

# Serve the built app over a local static server
npx http-server dist/crm-frontend/browser -p 8080
```

- Open `http://localhost:8080` and the service worker will register

### Testing the Install

**In Chrome/Edge DevTools (Application tab):**

- **Manifest** panel: confirm name, icons, theme color, and `display: standalone`
- **Service Workers** panel: confirm `ngsw-worker.js` is activated and running
- **Cache Storage**: confirm the app shell and assets are cached
- Click the install icon in the address bar to install the app to your OS

**On a physical device:**

- Service workers require HTTPS (localhost is exempt). To test on a phone, either deploy
  to an HTTPS host or expose your local server over HTTPS (e.g. an `ngrok`/`cloudflared` tunnel)
- Open the URL in mobile Chrome/Safari → **Add to Home Screen**
- Launch from the home screen icon - it opens standalone (no browser chrome)

**Update flow:**

- Use `SwUpdate` to detect when a new version is available and prompt the user to reload
- Console logs and network activity appear in DevTools like any web app

---

## PWA Features to Build

### Responsive Lead List View

**What to build:**

Display all leads from the backend REST API, laid out for small screens:

- Lead name, email, phone, budget
- Activity score with color-coded badge
- Tap/click a lead to navigate to the detail view (Angular Router)
- Pull-to-refresh (or a refresh button) to re-run the query

**UX patterns to implement:**

- Loading state while fetching data (a `loading` signal toggled around the `HttpClient` call)
- Error state if backend unreachable
- Empty state if no leads exist
- Use Angular CDK `BreakpointObserver` (or CSS media queries) to adapt the layout

### Responsive Lead Detail View

**What to build:**

Display complete lead information on a single scrollable screen:

- Full lead details (name, email, phone, budget, status)
- AI summary (if generated on Day 2)
- Activity score badge with color
- All interactions in chronological order
- All tasks (read-only display)
- Back navigation via Angular Router

**UX patterns:**

- Loading state for the individual lead query
- Error handling for failed queries
- Router `back` navigation
- Scrollable content for long interaction/task lists

---

## PWA-Specific Gotchas to Watch For

PWAs behave differently than a plain `ng serve` app. Here are the key gotchas:

### The Service Worker Only Runs in Production Builds

**The challenge:**

- Running `ng serve` will **never** register the service worker - offline/install won't work in dev
- Beginners often test with `ng serve`, see no PWA behavior, and assume it's broken

**What to do:**

- Always test PWA behavior against a **production build** served by a static server
- `npm run build` then serve `dist/crm-frontend/browser`

### HTTPS Is Required (Except on localhost)

**The challenge:**

- Service workers only register over HTTPS. `localhost` is a special exemption, but a phone
  hitting `http://192.168.1.x:8080` is **not** localhost, so the service worker won't register

**What to do:**

- Test install on a device via an HTTPS tunnel (`ngrok http 8080`) or a deployed HTTPS URL
- For quick local checks, use desktop Chrome on `http://localhost:8080`

### Caching REST Reads and Handling Writes Offline

**The challenge:**

- Angular's service worker `dataGroups` cache **GET** requests, so REST reads (`GET /leads`,
  `GET /leads/:id`) are cached offline out of the box once configured
- But **writes** (`POST`/`PATCH`/`DELETE`) can't be cached — they fail with no connection

**What to do:**

- Add a `dataGroups` entry for the API URL so read endpoints are cached (freshness/performance
  strategy as needed)
- For offline writes, queue them at the app layer in IndexedDB and replay on reconnect - covered
  in the **Advanced PWA Features** bonus module
- At minimum, detect offline state (`navigator.onLine`) and show a clear "You're offline" message

### Stale Content After Deploy

**The challenge:**

- The service worker serves cached assets, so users can keep seeing an old version after you deploy

**What to do:**

- Inject `SwUpdate`, subscribe to `versionUpdates`, and prompt the user to reload when a new
  version is ready. Angular versions assets via hashing, so a reload picks up the new bundle

---

## Stretch Goals (If Foundation Complete)

### CRUD Operations in the PWA

**What to build:**

Full create, read, update, delete operations, working the same installed as in the browser:

**Create new lead:**

- Reactive form with fields: name, email, phone, budget, status
- Input validation (required fields, email format) via Angular Validators
- Submit to backend via `POST /leads` (`HttpClient`)
- Navigate to newly created lead detail

**Edit existing lead:**

- Pre-populate form with current lead data
- Same validation as create
- `PATCH /leads/:id` to the backend
- Refresh lead detail with updated data

**Log interaction:**

- Select interaction type (call, email, meeting, note)
- Text input for notes
- Date selection for interaction date
- Submit to backend, refresh interaction list

**Delete lead:**

- Confirmation dialog before delete (Angular Material `MatDialog`)
- `DELETE /leads/:id` to the backend
- Navigate back to lead list

### Advanced PWA Features

These build on the foundation and are detailed in the **Advanced PWA Features** bonus module:

**Offline mode with local caching:**

- Cache leads in IndexedDB (plus the service worker `dataGroups` cache for GET reads)
- Display cached data when offline
- Sync changes when connection is restored (Background Sync API)
- Indicate offline state to the user

**Web push notifications:**

- Use `SwPush` with VAPID keys to subscribe the browser
- Trigger notifications from backend events
- Notifications display even when the app is closed
- Click a notification to navigate to the relevant lead

**Geolocation for check-ins:**

- Request location permission (Geolocation API)
- Capture GPS coordinates during interaction logging
- Save location with the interaction
- Display "visited lead at [location]" in interaction history

**Native-feeling UX enhancements:**

- Swipe actions on lead cards (Angular CDK gestures)
- Long-press / context menus
- Bottom sheets via Angular Material `MatBottomSheet`
- Route transition animations via `@angular/animations`

---

## Testing PWAs

### Testing Strategy

**Automated testing:**

- Vitest + Angular `TestBed` for component tests (`ng test`)
- Mock REST calls with `HttpTestingController` (`provideHttpClientTesting`)
- Test navigation flows with `RouterTestingHarness`
- Assert offline/online UI states by faking `navigator.onLine`

**PWA auditing (critical for this day):**

- Run **Lighthouse** (DevTools → Lighthouse → Progressive Web App) against the production build
- Confirm "installable" and "PWA optimized" checks pass
- Use the **Application** tab to inspect manifest, service worker, and cache storage
- Toggle **Offline** in DevTools (Network tab) and confirm the app shell still loads

### Manual Testing Checklist

**Essential validations:**

- Production build serves without errors and registers the service worker
- Lighthouse PWA audit passes (installable + service worker)
- App installs to home screen / desktop and launches standalone
- App shell loads with the network set to Offline
- Lead list displays all leads from the backend (when online)
- Tapping a lead navigates to the detail view
- Detail view shows complete lead information
- Offline state is clearly communicated to the user

**Network scenario testing:**

- Toggle DevTools Offline → verify offline messaging and cached shell
- Stop backend → verify error state displays for live queries
- Restart backend / go back online → verify data loads correctly
- Deploy a change → verify `SwUpdate` prompts to reload

---

## By End of Day 4

### Minimum Completion

**You should have:**

- [ ] PWA support added (`@angular/pwa`) with a valid manifest and service worker
- [ ] App installable to the home screen / desktop, launching standalone
- [ ] App shell loads offline (verified in DevTools)
- [ ] Responsive lead list view displaying all leads
- [ ] Responsive lead detail view showing full lead info
- [ ] Navigation between views functional (Angular Router)
- [ ] Passing Lighthouse PWA audit on a production build
- [ ] Understanding of PWA-specific challenges (prod-only SW, HTTPS, POST caching, updates)

---

**✅ Day 4 complete**

**See full trail:** [Companion overview](README.md)

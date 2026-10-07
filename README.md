# Pod Surfer

Pod Surfer is a progressive web application (PWA) designed for listening to podcasts. It features an offline-first architecture with Workbox service workers, custom Lit Web Components, and smooth page navigation using the modern Web View Transitions API.

---

## 🛠️ Technology Stack

- **Frontend Core & Components**: [Lit](https://lit.dev/) Web Components (custom elements, shadow DOM, reactive properties).
- **State & Local Persistence**: IndexedDB via [`idb-keyval`](https://github.com/jakearchibald/idb-keyval) for managing episode progress, playback states, and completed episodes.
- **Polyfills & Helpers**: [`@js-temporal/polyfill`](https://github.com/tc39/proposal-temporal) for modern date/time handling.
- **Service Worker & PWA**: [Workbox](https://developer.chrome.com/docs/workbox) (`workbox-cli`, background sync, caching strategies, range requests for audio streaming).
- **Bundler & Build Tooling**: [esbuild](https://esbuild.github.io/) for fast ESM bundling.
- **Animations & Transitions**: Browser-native [View Transitions API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API).

---

## 🔍 Code Analysis & Architecture Overview

1. **Modular Web Components (`src/`)**:
   - `pod-scroller.js` & `pod-list.js`: Scrollable and vertical lists displaying podcasts and episodes with gesture interaction.
   - `podcast-page.js` & `episode-page.js`: View pages for individual podcasts and current episode playback/details.
   - `pod-audio.js`: Custom audio controller element managing playback position, persistence in IndexedDB, media session integration, and playback speed.
   - `swipe-action.js`: Touch swipe gestures for episode actions (e.g., mark complete).
   - `ViewTransitionMixin.js`: Lit mixin helper for seamless View Transition animations during state transitions.

2. **Offline Caching & Service Worker (`service-worker.js` & `workbox-config.cjs`)**:
   - Workbox routes handle dynamic RSS feed caching, episode metadata responses, static asset precaching, and range request audio streaming.

3. **Backend API Dependencies**:
   - The app communicates with a backend endpoint (`https://oracle.mone.dev/podsurfer/`) to fetch subscribed podcasts, recent episodes, episode feeds, and add new RSS feeds (`/add`).

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)

### Installation & Build

```bash
# Install dependencies
npm install

# Build client bundle and inject Service Worker manifest
npm run build
```

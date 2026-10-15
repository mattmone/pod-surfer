# 🧪 Comprehensive QA Testing Strategy & Roadmap

This document outlines the testing strategy, tooling stack, mock server specifications, and test plan for **Pod Surfer**, covering **Unit**, **Integration**, and **End-to-End (E2E)** testing tiers.

> [!IMPORTANT]
> **Real Browser Policy**: All test tiers run exclusively inside **real browser instances** (Headless Chromium, Mobile WebKit, Firefox) using [`@web/test-runner`](https://modern-web.dev/docs/test-runner/overview/) and [Playwright](https://playwright.dev/). No synthetic Node/jsdom environments are used, ensuring 100% native support for Web Components, Shadow DOM, Service Workers, IndexedDB, and the Web View Transitions API.

---

## 🎯 Testing Architecture & Tooling Stack

| Tier | Tooling Stack | Primary Focus / Scope |
| :--- | :--- | :--- |
| **Unit Testing** | [`@web/test-runner`](https://modern-web.dev/docs/test-runner/overview/) + [Playwright Launcher](https://modern-web.dev/docs/test-runner/browser-launchers/playwright/) | Isolated utility functions, native IndexedDB persistence (`src/storage.js`), network wrapper timeouts (`src/api.js`), custom events, and real Shadow DOM rendering of Web Components. |
| **Integration Testing** | [`@web/test-runner`](https://modern-web.dev/docs/test-runner/overview/) + [MSW (Mock Service Worker)](https://mswjs.io/) | Multi-component workflows, custom event cascades (`episode-select`, `episode-completed`), native View Transitions, offline fallback state synchronization, and DOM-to-IndexedDB sync. |
| **E2E Testing** | [Playwright Test](https://playwright.dev/) | Full PWA browser environment (Desktop Chromium, Mobile Chrome), Service Worker lifecycle (`SKIP_WAITING`, precaching), IndexedDB persistence across page reloads, touch swipe gestures, and simulated network offline mode (`context.setOffline(true)`). |

---

## 🎭 Mocking Requirements Specification

To achieve deterministic test runs without depending on external infrastructure (`https://oracle.mone.dev`), external backend boundaries are intercepted at the network level in real browser contexts:

### 1. Backend REST API Mocks (`https://oracle.mone.dev`)

| Endpoint | Method | Mock Data / Behavior Specs |
| :--- | :--- | :--- |
| `/podsurfer/` | `GET` | Array of subscribed podcast metadata (Title, Feed URL, iTunes artwork). |
| `/podsurfer/recent/` | `GET` | List of recently released episodes across feeds. |
| `/podsurfer/episodes/:title` | `GET` | Episode details array (Audio enclosure URL, iTunes duration, content snippet). |
| `/podsurfer/add` | `POST` | Payload: `{ url: string }`. Returns `200 OK` on success, `400 Bad Request` for invalid feed RSS. |
| `/notifications/initialize` | `POST` | Returns `{ userId: "user-123", publicKey: "mock-vapid-key" }`. |
| `/notifications/subscribe` | `POST` | Accepts VAPID subscription object and podcast notifiers list. |
| `/notifications/unsubscribe` | `POST` | Removes VAPID push subscription registration. |
| `/image/?url=:targetUrl` | `GET` | Proxied image request mock returning a standard 1x1 synthetic PNG binary. |

### 2. Real Browser Platform APIs (No Mocks Required)

- **IndexedDB**: Native browser IndexedDB database clean resets between test suites (`indexedDB.deleteDatabase("keyval-store")`).
- **HTMLMediaElement / Audio Element**: Real DOM `<audio>` elements controlled via standard JS methods (`play()`, `pause()`) and native event triggers (`timeupdate`, `ended`).
- **PushManager & Service Worker**: Native browser PushManager and ServiceWorker APIs.
- **View Transitions API**: Native browser `document.startViewTransition()` executed in Chromium.

---

## 📋 Comprehensive Test Plan

### Phase 1: Unit Test Suite (`src/__tests__/unit/`)

#### 1.1 Storage Abstraction Service (`src/storage.js`)
- [ ] `getCompleteEpisodes()` / `addCompleteEpisode()`: Verify initial empty array return and item deduplication by episode title.
- [ ] `getInProgressEpisodes()` / `setInProgressEpisodes()`: Ensure array updates persist to IndexedDB properly.
- [ ] `removeInProgressEpisode(id)`: Verify removal filters by both `id` and `title`.
- [ ] `getEpisodeTime(title)` / `setEpisodeTime(title, time)`: Verify key formatting (`episode-${title}-time`) and numerical fallback to `0`.
- [ ] `getPlaybackRate()` / `setPlaybackRate(rate)`: Verify playback speed persistence and default fallback of `1`.

#### 1.2 Network & Resilience Helper (`src/api.js`)
- [ ] `fetchWithTimeout()`: Verify successful HTTP response within timeout limit.
- [ ] `fetchWithTimeout()`: Verify abort signal triggers after configured `timeoutMs` (e.g. 8s).
- [ ] `fetchWithTimeout()`: Verify HTTP non-2xx status codes throw formatted errors (`HTTP Error 404`).
- [ ] `showToast()`: Verify element creation, auto-dismiss timeout after 4 seconds, and CSS background styling toggles between error (`#e53935`) and success (`#2e7d32`).

#### 1.3 Web Components Shadow DOM Rendering
- [ ] **`pod-scroller.js`**: Verify `.items` property rendering horizontal scroll list and selecting items dispatches `podcast-select` / `episode-select` events.
- [ ] **`pod-list.js`**: Verify vertical episode list rendering, progress calculation (`minutesRemaining`), and swipe action triggers (`left-action`, `right-action`).
- [ ] **`pod-audio.js`**: Verify custom controls (play/pause toggle, seek bar position, playback rate selector: 1x, 1.25x, 1.5x, 2x) update audio state accurately.
- [ ] **`podcast-page.js`**: Verify subscription state badge toggles based on `_checkSubscription()` result.

---

## 🔗 Phase 2: Integration Test Suite (`src/__tests__/integration/`)

#### 2.1 Component Interaction & Event Cascades
- [ ] **Podcast Detail View Navigation**: Selecting a podcast in `pod-scroller` fetches `/podsurfer/episodes/:title`, populates `<podcast-page>`, and triggers `startViewTransition`.
- [ ] **Episode Selection to Audio Player**: Selecting an episode in `pod-list` dispatches `episode-select`, creates an entry in `in-progress-episodes` storage, and initializes `<episode-page>` with `<pod-audio>`.
- [ ] **Playback Synchronization**: Fire `timeupdate` on `<pod-audio>` -> verify `setEpisodeTime()` called -> verify `<pod-list>` progress calculation updates dynamically.
- [ ] **Episode Completion Workflow**: Fire `ended` event on `<pod-audio>` -> verify `EpisodeCompletedEvent` fires -> verify episode is removed from `in-progress-episodes` and appended to `complete-episodes`.

#### 2.2 Offline Fallback Integration (MSW Network Interception)
- [ ] **Offline Initial Launch**: Simulate MSW network error for `/podsurfer/` -> verify app loads cached podcasts from IndexedDB and displays `"Offline mode: Using cached podcasts"` toast.
- [ ] **Offline Episode Details Navigation**: Simulate MSW network error for `/podsurfer/episodes/:title` -> verify `<podcast-page>` renders local fallback items and displays `"Offline mode: Limited episode data available"` toast.

---

## 🌐 Phase 3: End-to-End (E2E) Test Suite (`tests/e2e/`)

#### 3.1 PWA & Service Worker Lifecycle (Playwright)
- [ ] **Service Worker Registration & Precaching**: Verify Service Worker installs, registers successfully, and precaches dist static assets + icons.
- [ ] **Full Offline Flow**:
  1. Load app online, navigate to podcast page, play 10 seconds of episode.
  2. Toggle Playwright context to offline (`context.setOffline(true)`).
  3. Reload browser page.
  4. Verify application UI renders, IndexedDB state persists, and offline toast appears.
- [ ] **Audio Range Request Streaming**: Verify Service Worker handles HTTP 206 partial content audio requests from `audio-cache`.

#### 3.2 User Interaction Workflows (Mobile & Desktop Viewports)
- [ ] **Add Podcast Feed Dialog**: Click `➕` button -> open modal `#add-podcast` -> enter RSS URL -> click `Add` -> verify POST request to `/podsurfer/add` and success toast display.
- [ ] **Touch Gesture Swipe Actions**: Simulate touch drag left on an in-progress episode card -> verify deletion from list and storage update.
- [ ] **Push Notification Toggle**: Click `subscribe` icon on `<podcast-page>` -> verify PushManager subscription flow triggers without JS exceptions.

---

## 🛠️ Step-by-Step Package & Implementation Plan

### 1. Install Real Browser Testing Tooling

```bash
# Install @web/test-runner with Playwright launcher, MSW, and Playwright Test
npm install -D @web/test-runner @web/test-runner-playwright msw @playwright/test
```

### 2. Configure `@web/test-runner.config.mjs`

```javascript
import { playwrightLauncher } from "@web/test-runner-playwright";

export default {
  files: "src/__tests__/**/*.test.js",
  nodeResolve: true,
  browsers: [
    playwrightLauncher({ product: "chromium" }),
    playwrightLauncher({ product: "webkit" }),
  ],
  testFramework: {
    config: {
      timeout: "5000",
    },
  },
};
```

### 3. Configure `playwright.config.js` (E2E)

```javascript
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  use: {
    baseURL: "http://localhost:8080",
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile-chrome", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: "npm run build && npx http-server ./ -p 8080",
    url: "http://localhost:8080",
    reuseExistingServer: !process.env.CI,
  },
});
```

### 4. Configure `package.json` Scripts

```json
{
  "scripts": {
    "test": "wtr",
    "test:watch": "wtr --watch",
    "test:e2e": "playwright test"
  }
}
```

### 5. Directory Hierarchy

```bash
mkdir -p src/__tests__/unit src/__tests__/integration tests/e2e tests/mocks
```

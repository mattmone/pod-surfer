var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/EpisodeSelectEvent.js
var EpisodeSelectEvent;
var init_EpisodeSelectEvent = __esm({
  "src/EpisodeSelectEvent.js"() {
    EpisodeSelectEvent = class extends Event {
      constructor(episode) {
        super("episode-select", {
          bubbles: true,
          composed: true
        });
        this.episode = episode;
      }
    };
  }
});

// src/PodSelectEvent.js
var PodSelectEvent;
var init_PodSelectEvent = __esm({
  "src/PodSelectEvent.js"() {
    PodSelectEvent = class extends Event {
      constructor(podcast) {
        super("podcast-select", {
          bubbles: true,
          composed: true
        });
        this.podcast = podcast;
      }
    };
  }
});

// src/pod-scroller.js
var pod_scroller_exports = {};
import { LitElement, html, css } from "lit";
var PodScroller;
var init_pod_scroller = __esm({
  "src/pod-scroller.js"() {
    init_EpisodeSelectEvent();
    init_PodSelectEvent();
    PodScroller = class extends LitElement {
      static get properties() {
        return {
          items: { type: Array },
          _lastSelected: {
            type: Boolean,
            reflect: true,
            attribute: "has-last-selected"
          },
          _selected: { type: Boolean, reflect: true, attribute: "selected" }
        };
      }
      static get styles() {
        return css`
      :host {
        display: grid;
        gap: 4px;
        grid-template-columns: repeat(var(--item-count), max-content);
        container: scroller / size;
        max-width: calc(100vw - 16px);
        overflow-x: scroll;
      }
      img[selected] {
        view-transition-name: header-image;
      }

      button {
        border: 1px solid rgba(0, 0, 0, 0.3);
        border-radius: 8px;
        background-color: #fff;
        cursor: pointer;
        display: grid;
        place-content: center;
        height: 100cqb;
        object-fit: cover;
        aspect-ratio: 1 / 1;
        padding: 0;
        overflow: hidden;
        position: relative;
        &[complete] {
          opacity: 0.5;
          &:after {
            content: "COMPLETED";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: grid;
            place-content: center;
            color: red;
            rotate: -30deg;
            font-size: 25px;
            font-weight: bold;
            text-shadow: 1px 1px black, 1px -1px black, -1px 1px black,
              -1px -1px black;
          }
        }
        & img {
          height: 100cqb;
        }
        & p {
          margin: 0;
          padding: 4px;
          width: 100%;
          position: absolute;
          bottom: 0;
          left: 0;
          color: white;
          height: calc(3lh + 8px);
          background: linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.8) 0%,
            rgba(0, 0, 0, 0.5) 80%,
            rgba(0, 0, 0, 0) 100%
          );
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: clip;
        }
      }
    `;
      }
      constructor() {
        super();
        this.items = [];
      }
      updated(changedProperties) {
        if (changedProperties.has("items")) {
          this.style.setProperty("--item-count", this.items.length);
        }
      }
      async #select(item) {
        this._lastSelected = void 0;
        this._selected = item;
        await this.updateComplete;
        if (this.getAttribute("type") == "episode")
          return this.dispatchEvent(new EpisodeSelectEvent(item));
        return this.dispatchEvent(new PodSelectEvent(item));
      }
      async deselect() {
        this._lastSelected = this._selected;
        this._selected = void 0;
        await this.updateComplete;
      }
      async reselect() {
        this._selected = this._lastSelected;
        this._lastSelected = void 0;
        await this.updateComplete;
        requestAnimationFrame(() => {
          this._selected = void 0;
        });
      }
      render() {
        return html`
      ${this.items.map(
          (item) => html`
            <button
              ?complete=${item.complete}
              @click=${() => this.#select(item)}
            >
              <img
                ?selected=${this._selected === item}
                ?last-selected=${this._lastSelected === item}
                src=${item.image?.url ?? item.itunes?.image ?? item.podcastImage}
              />
              <p>${item.title}</p>
            </button>
          `
        )}
    `;
      }
    };
    customElements.define("pod-scroller", PodScroller);
  }
});

// src/play-pause.css.js
import { css as css2 } from "lit";
var playPauseStyles;
var init_play_pause_css = __esm({
  "src/play-pause.css.js"() {
    playPauseStyles = css2`
  svg[play-pause] {
    height: 100%;
    place-self: center;
    aspect-ratio: 1 / 1;
    padding: 0;
    & path {
      fill: black;
      transition: all 0.3s linear;
    }
    &[play] path {
      d: path(
        "M320-200v-560l440 280-440 280Zm80-280Zm0 134 210-134-210-134l0 268Z"
      );
      fill: var(--primarycolor, #000);
    }

    &[pause] path {
      d: path("M320-200v-560l80 0-0 560Zm235-0Zm80 0 0-560-80 0l0 560Z");
      fill: #000;
    }
  }
`;
  }
});

// src/swipe-action.js
import { LitElement as LitElement2, html as html2, css as css3 } from "lit";
var SwipeAction;
var init_swipe_action = __esm({
  "src/swipe-action.js"() {
    SwipeAction = class extends LitElement2 {
      static get properties() {
        return {
          open: { type: Boolean }
        };
      }
      static get styles() {
        return css3`
      :host {
        display: grid;
        width: 100%;
        height: 100%;
        overflow-x: scroll;
        scroll-snap-type: x mandatory;
        container: swipe-action / size;
      }
      ::slotted(*) {
        width: 100%;
      }
      #swipe-container {
        display: grid;
        width: 140cqi;
        height: 100cqb;
        grid-template-columns: 20cqi 100cqi 20cqi;
        grid-template-rows: 100cqb;
        grid-template-areas: "left contents right";
      }
      #left-action {
        grid-area: left;
        scroll-snap-align: unset;
      }
      #contents {
        grid-area: contents;
        scroll-snap-stop: always;
        scroll-snap-align: start;
      }
      #right-action {
        grid-area: right;
        scroll-snap-align: unset;
      }
      #default-left {
        background: linear-gradient(
          90deg,
          rgba(255, 0, 0, 1) 0%,
          rgba(255, 0, 0, 0.3) 25%,
          rgba(0, 0, 0, 0) 100%
        );
        height: 100%;
        width: 100%;
      }
      #default-right {
        background: linear-gradient(
          -90deg,
          rgba(0, 0, 255, 1) 0%,
          rgba(0, 0, 255, 0.3) 25%,
          rgba(0, 0, 0, 0) 100%
        );
        height: 100%;
        width: 100%;
      }
    `;
      }
      firstUpdated() {
        super.connectedCallback();
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.intersectionRatio >= 0.7) {
                if (entry.target.id === "left-action") {
                  this.dispatchEvent(new CustomEvent("left-action"));
                } else if (entry.target.id === "right-action") {
                  this.dispatchEvent(new CustomEvent("right-action"));
                }
              }
            });
          },
          {
            root: document.body,
            rootMargin: "5px",
            threshold: 0.7
          }
        );
        observer.observe(this.shadowRoot.querySelector("#left-action"));
        observer.observe(this.shadowRoot.querySelector("#right-action"));
      }
      render() {
        return html2`
      <div id="swipe-container">
        <div id="left-action">
          <slot name="left-action">
            <div id="default-left"></div>
          </slot>
        </div>
        <div id="contents">
          <slot></slot>
        </div>
        <div id="right-action">
          <slot name="right-action">
            <div id="default-right"></div>
          </slot>
        </div>
      </div>
    `;
      }
    };
    customElements.define("swipe-action", SwipeAction);
  }
});

// src/EpisodeCompletedEvent.js
var EpisodeCompletedEvent_exports = {};
__export(EpisodeCompletedEvent_exports, {
  EpisodeCompletedEvent: () => EpisodeCompletedEvent
});
var EpisodeCompletedEvent;
var init_EpisodeCompletedEvent = __esm({
  "src/EpisodeCompletedEvent.js"() {
    EpisodeCompletedEvent = class extends Event {
      constructor(episode) {
        super("episode-completed", {
          bubbles: true,
          composed: true
        });
        this.episode = episode;
      }
    };
  }
});

// src/pod-list.js
var pod_list_exports = {};
import { LitElement as LitElement3, html as html3, css as css4, when, until } from "lit";
import { Temporal } from "@js-temporal/polyfill";
var PodList;
var init_pod_list = __esm({
  "src/pod-list.js"() {
    init_EpisodeSelectEvent();
    init_play_pause_css();
    init_swipe_action();
    PodList = class extends LitElement3 {
      static get properties() {
        return {
          items: { type: Array },
          _lastSelected: {
            type: Boolean,
            reflect: true,
            attribute: "has-last-selected"
          },
          _selected: { type: Boolean, reflect: true, attribute: "selected" }
        };
      }
      static get styles() {
        return [
          playPauseStyles,
          css4`
        * {
          box-sizing: border-box;
        }
        :host {
          display: grid;
          gap: 4px;
          grid-template-rows: repeat(var(--item-count), 3lh);
          container: list / size;
          max-width: calc(100vw - 16px);
          overflow-y: scroll;
        }
        img[selected] {
          view-transition-name: header-image;
        }
        button {
          display: grid;
          padding: 0;
          background: none;
          border: 1px solid rgba(0, 0, 0, 0.2);
          border-radius: 8px;
          overflow: clip;
          grid-template-areas:
            "image title play"
            "image progress play";
          grid-template-rows: 2lh minmax(1lh, 1fr);
          grid-template-columns: 3lh minmax(0, 1fr) 3lh;
          height: 100%;
          & p {
            margin: 0;
          }
          & #image {
            grid-area: image;
            height: 100%;
            aspect-ratio: 1 / 1;
            place-self: end;
          }
          & #title {
            grid-area: title;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: clip;
            padding: 8px 16px;
            text-align: left;
          }
          & #progress {
            grid-area: progress;
            width: calc(100% - 32px);
            margin: 0 16px;
          }
          #play {
            grid-area: play;
            place-self: end;
          }
        }
      `
        ];
      }
      constructor() {
        super();
        this.items = [];
      }
      get cleanItems() {
        return this.items.map((item) => ({ ...item, progress: 0 }));
      }
      async minutesRemaining(item) {
        const duration = Math.floor(this.secondDuration(item.itunes?.duration));
        const progress = Math.floor(await item.progress ?? 0);
        const durationRemaining = Temporal.Duration.from({
          seconds: duration - progress
        }).round({ largestUnit: "minutes" });
        return durationRemaining.minutes;
      }
      updated(changedProperties) {
        if (changedProperties.has("items")) {
          this.style.setProperty("--item-count", this.items.length || 1);
        }
      }
      secondDuration(duration = "00:00:00") {
        duration = `00:00:00:${duration}`.slice(-8);
        const [hours, minutes, seconds] = duration.split(":");
        return Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds);
      }
      async selectEpisode(episode) {
        this._lastSelected = void 0;
        this._selected = episode;
        const cleanedEpsiode = { ...episode, progress: await episode.progress };
        this.dispatchEvent(new EpisodeSelectEvent(cleanedEpsiode));
      }
      async deselect() {
        this._lastSelected = this._selected;
        this._selected = void 0;
        await this.updateComplete;
      }
      async reselect() {
        this._selected = this._lastSelected;
        this._lastSelected = void 0;
        await this.updateComplete;
        requestAnimationFrame(() => {
          this._selected = void 0;
        });
      }
      async delete(episode) {
        const { get: get2, set: set2 } = await import("idb-keyval");
        const episodes = await get2("in-progress-episodes") || [];
        set2(
          "in-progress-episodes",
          episodes.filter((ep) => ep.id !== episode.id)
        );
        this.items = this.items.filter((ep) => ep.id !== episode.id);
      }
      async complete(episode) {
        const { EpisodeCompletedEvent: EpisodeCompletedEvent2 } = await Promise.resolve().then(() => (init_EpisodeCompletedEvent(), EpisodeCompletedEvent_exports));
        this.dispatchEvent(new EpisodeCompletedEvent2(episode));
      }
      render() {
        return html3`
      ${when(
          this.items.length,
          () => this.items.map(
            (item) => html3`
                <swipe-action
                  @left-action=${() => this.delete(item)}
                  @right-action=${() => this.delete(item)}
                >
                  <button
                    ?complete=${item.complete}
                    @click=${() => this.selectEpisode(item)}
                  >
                    <img
                      id="image"
                      ?selected=${this._selected?.title === item.title}
                      ?last-selected=${this._lastSelected === item}
                      src=${item.image?.url ?? item.itunes?.image ?? item.podcastImage}
                    />
                    <p id="title">${item.title}</p>
                    <p id="progress">
                      ${until(this.minutesRemaining(item), 0)} minutes remaning
                    </p>

                    <svg viewBox="0 -960 960 960" id="play" play-pause play>
                      <path></path>
                    </svg>
                  </button>
                </swipe-action>
              `
          ),
          () => html3`<slot></slot>`
        )}
    `;
      }
    };
    customElements.define("pod-list", PodList);
  }
});

// src/pod-surfer.js
var pod_surfer_exports = {};
var init_pod_surfer = __esm({
  "src/pod-surfer.js"() {
    init_pod_scroller();
    init_pod_list();
  }
});

// src/podcast-page.js
var podcast_page_exports = {};
__export(podcast_page_exports, {
  PodcastPage: () => PodcastPage
});
import { html as html4, LitElement as LitElement4, css as css5, when as when2 } from "lit";
import { get, set } from "idb-keyval";
var PodcastPage;
var init_podcast_page = __esm({
  "src/podcast-page.js"() {
    PodcastPage = class extends LitElement4 {
      static get properties() {
        return {
          podcast: { type: Object },
          _isSubscribed: { state: true }
        };
      }
      static get styles() {
        return css5`
      * {
        box-sizing: border-box;
      }
      :host {
        display: contents;
      }
      header,
      main {
        background-color: white;
        z-index: 2;
      }
      :host(:not([hidden])) header {
        view-transition-name: header;
      }
      :host(:not([hidden])) header img {
        view-transition-name: header-image;
      }
      :host(:not([hidden])) main {
        view-transition-name: body;
      }
      ::view-transition-old(body) {
        opacity: 0;
      }

      header {
        grid-area: header;
        height: 40vh;
        position: relative;
        & img {
          block-size: 100vw;
          inline-size: 100vw;
        }
        & button {
          position: absolute;
          top: 8px;
          left: 8px;
          background: rgba(0, 0, 0, 0.5);
          border: none;
          border-radius: 8px;
          cursor: pointer;
          color: white;
          display: grid;
          place-content: center;
          height: 44px;
          width: 44px;
          z-index: 3;
          & svg {
            width: 100%;
            fill: white;
          }
        }
        & p {
          position: absolute;
          bottom: 0;
          left: 0;
          padding: 8px;
          color: white;
          margin: 0;
          background: rgba(0, 0, 0, 0.5);
          width: 100%;
          text-align: center;
          transform: translateY(0);
          transition: all 0.3s ease-in;
          transition-delay: 0.6s;
          @starting-style {
            transform: translateY(100%);
            opacity: 0;
          }
        }
      }

      main {
        display: grid;
        gap: 8px;
        grid-template-areas: "description" "audio-controls";
        grid-template-rows: max-content minmax(0, 1fr);
        grid-area: body;
        padding: 16px;
        border-radius: 24px 24px 0 0;
        transition: all 0.5s ease-out;
        transition-delay: 0.2s;
        @starting-style {
          transform: translateY(100%);
          opacity: 0;
        }
        & pre {
          margin: 0;
          white-space: break-spaces;
        }
        & h2 {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 42px;
          font-family: system-ui, sans-serif;
          padding: 0;
          margin: 0;
        }
        & #subscribe {
          background: none;
          border: none;
          margin: 0;
          padding: 0;
          & svg {
            fill: var(--primarycolor, #000);
            height: 44px;
            width: 44px;
          }
        }
      }
    `;
      }
      constructor() {
        super();
        this.podcast = {};
      }
      updated(changedProperties) {
        if (changedProperties.has("podcast")) {
          this._checkSubscription();
        }
      }
      async _checkSubscription() {
        if (!this.podcast) return;
        if (!this.registration)
          this.registration = await navigator.serviceWorker.ready;
        const subscription = await this.registration.pushManager.getSubscription();
        if (subscription !== null) {
          const { notifiers } = await get(`pod-surfer/subscription`);
          this._isSubscribed = notifiers.includes(this.podcast.title);
        }
      }
      async subscribe() {
        if (this._isSubscribed) return;
        this._isSubscribed = true;
        try {
          const localSubscription = await get(`pod-surfer/subscription`);
          let { userId, publicKey, subscription } = localSubscription;
          if (!localSubscription) {
            const initializeResult = await fetch(
              "https://oracle.mone.dev/notifications/initialize",
              {
                method: "POST",
                headers: new Headers({ "content-type": "application/json" }),
                body: JSON.stringify({
                  appId: "pod-surfer"
                })
              }
            ).then((r) => r.json());
            userId = initializeResult.userId;
            publicKey = initializeResult.publicKey;
            const subscription2 = await this.registration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: publicKey
            });
          }
          const notifiers = await fetch(
            "https://oracle.mone.dev/notifications/subscribe",
            {
              method: "POST",
              headers: new Headers({ "content-type": "application/json" }),
              body: JSON.stringify({
                appId: "pod-surfer",
                notifiers: [this.podcast.title],
                userId,
                publicKey,
                subscription: subscription.toJSON()
              })
            }
          );
          await set(`pod-surfer/subscription`, {
            userId,
            publicKey,
            notifiers
          });
        } catch (error) {
          console.error(error);
          this._isSubscribed = false;
        }
      }
      async unsubscribe() {
        if (!this._isSubscribed) return;
        this._isSubscribed = false;
        try {
          const subscription = await this.registration.pushManager.getSubscription();
          if (!subscription) return;
          await subscription.unsubscribe();
          await fetch("https://oracle.mone.dev/notifications/unsubscribe", {
            method: "POST",
            headers: new Headers({ "content-type": "application/json" }),
            body: JSON.stringify({
              appId: "pod-surfer",
              subscription: subscription.toJSON()
            })
          });
          await set(`pod-surfer/subscription`, null);
        } catch (error) {
          console.error(error);
          this._isSubscribed = true;
        }
      }
      render() {
        return html4`
      <header>
        <button
          id="close"
          @click=${() => this.dispatchEvent(
          new CustomEvent("podcast-close", {
            bubbles: true,
            composed: true
          })
        )}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
            <path
              d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"
            />
          </svg>
        </button>
        <img src=${this.podcast?.image?.url ?? this.podcast.itunes?.image} />
        <p>${this.podcast.title}</p>
      </header>
      <main>
        <h2>
          <span>Episodes</span>
          <button
            id="subscribe"
            @click=${() => this._isSubscribed ? this.unsubscribe() : this.subscribe()}
          >
            ${when2(
          this._isSubscribed,
          () => html4`
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 -960 960 960"
                >
                  <path
                    d="M80-560q0-100 44.5-183.5T244-882l47 64q-60 44-95.5 111T160-560H80Zm720 0q0-80-35.5-147T669-818l47-64q75 55 119.5 138.5T880-560h-80ZM160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160Zm320-300Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z"
                  />
                </svg>
              `,
          () => html4`
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 -960 960 960"
                >
                  <path
                    d="M480-500Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80Zm240-360v-120H600v-80h120v-120h80v120h120v80H800v120h-80ZM160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q14 4 27.5 8.5T593-772q-15 14-27 30.5T545-706q-15-7-31.5-10.5T480-720q-66 0-113 47t-47 113v280h320v-112q18 11 38 18t42 11v83h80v80H160Z"
                  />
                </svg>
              `
        )}
          </button>
        </h2>
        <pod-list .items=${this.podcast.items ?? []}></pod-list>
      </main>
    `;
      }
    };
    customElements.define("podcast-page", PodcastPage);
  }
});

// src/ViewTransitionMixin.js
var ViewTransitionMixin;
var init_ViewTransitionMixin = __esm({
  "src/ViewTransitionMixin.js"() {
    ViewTransitionMixin = (superClass) => class extends superClass {
      async scheduleUpdate() {
        if (this._viewTransition !== void 0) {
          await this._viewTransition.finished;
        }
        return super.scheduleUpdate();
      }
      async performUpdate() {
        if (!document.startViewTransition) {
          return super.performUpdate();
        }
        await (this._viewTransition = document.startViewTransition(() => {
          super.performUpdate();
        }));
        this._viewTransition = void 0;
      }
    };
  }
});

// src/episode-page.js
var episode_page_exports = {};
__export(episode_page_exports, {
  EpisodePage: () => EpisodePage
});
import { html as html5, css as css6, LitElement as LitElement5, when as when3 } from "lit";
var EpisodePage;
var init_episode_page = __esm({
  "src/episode-page.js"() {
    init_EpisodeSelectEvent();
    init_ViewTransitionMixin();
    EpisodePage = class extends ViewTransitionMixin(LitElement5) {
      static get properties() {
        return {
          hidden: { state: true },
          podcast: { type: Object },
          episode: { type: Object },
          audioTime: { state: true },
          playbackRate: { state: true }
        };
      }
      static get styles() {
        return css6`
      * {
        box-sizing: border-box;
      }
      :host {
        display: contents;
      }
      header,
      main {
        background-color: white;
        z-index: 3;
      }
      :host(:not([hidden])) header {
        view-transition-name: header;
      }
      :host(:not([hidden])) header img {
        view-transition-name: header-image;
      }
      :host(:not([hidden])) main {
        view-transition-name: body;
      }
      ::view-transition-old(body) {
        opacity: 0;
      }
      header {
        grid-area: header;
        height: 40vh;
        position: relative;
        & img {
          block-size: 100vw;
          inline-size: 100vw;
        }
        & button {
          position: absolute;
          top: 8px;
          left: 8px;
          background: rgba(0, 0, 0, 0.5);
          border: none;
          border-radius: 8px;
          cursor: pointer;
          color: white;
          display: grid;
          place-content: center;
          height: 44px;
          width: 44px;
          z-index: 3;
          & svg {
            width: 100%;
            fill: white;
          }
        }
        & p {
          position: absolute;
          bottom: 0;
          left: 0;
          padding: 8px;
          color: white;
          margin: 0;
          background: rgba(0, 0, 0, 0.5);
          width: 100%;
          text-align: center;
          transform: translateY(0);
          transition: all 0.3s ease-in;
          transition-delay: 0.6s;
          @starting-style {
            transform: translateY(100%);
            opacity: 0;
          }
        }
      }

      main {
        display: grid;
        gap: 8px;
        grid-template-areas: "description" "audio-controls";
        grid-template-rows: max-content minmax(0, 1fr);
        grid-area: body;
        padding: 16px;
        border-radius: 24px 24px 0 0;
        transition: all 0.5s ease-out;
        transition-delay: 0.2s;
        @starting-style {
          transform: translateY(100%);
          opacity: 0;
        }
        & pre {
          margin: 0;
          white-space: break-spaces;
        }
      }
    `;
      }
      updated(changedProperties) {
        if (changedProperties.has("episode")) {
          this._imageLoaded = false;
          import("idb-keyval").then(({ get: get2, set: set2 }) => {
            get2(`episode-${this.episode.title}-time`).then((time) => {
              if (!time) return;
              this.audioTime = time;
            });
            get2(`playback-rate`).then((rate) => {
              if (!rate) return;
              this.playbackRate = rate;
            });
          });
        }
      }
      constructor() {
        super();
        this.episode = {};
      }
      get imageLoaded() {
        return new Promise((resolve) => {
          if (this._imageLoaded) return resolve(true);
          this.addEventListener(
            "load",
            () => {
              this._imageLoaded = true;
              resolve(true);
            },
            { once: true }
          );
        });
      }
      async handleEnded() {
        const { EpisodeCompletedEvent: EpisodeCompletedEvent2 } = await Promise.resolve().then(() => (init_EpisodeCompletedEvent(), EpisodeCompletedEvent_exports));
        this.dispatchEvent(new EpisodeCompletedEvent2(this.episode));
        this.dispatchEvent(
          new CustomEvent("episode-close", {
            bubbles: true,
            composed: true
          })
        );
      }
      async handleTimeUpdate({ detail: { time } }) {
        const { set: set2 } = await import("idb-keyval");
        set2(`episode-${this.episode.title}-time`, time);
      }
      async handlePlaybackRateChange({ detail: { rate } }) {
        const { set: set2 } = await import("idb-keyval");
        set2(`playback-rate`, rate);
      }
      render() {
        return html5`<header>
        <button
          @click=${() => this.dispatchEvent(
          new CustomEvent("episode-close", {
            bubbles: true,
            composed: true
          })
        )}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
            <path
              d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"
            />
          </svg>
        </button>
        <img src=${this.episode.itunes?.image ?? this.episode.podcastImage} />
        <p>${this.episode.title}</p>
      </header>
      <main>
        <details>
          <summary>Episode Description</summary>
          <pre>
							${this.episode.contentSnippet}
						</pre
          >
        </details>
        <pod-audio
          url=${`https://oracle.mone.dev/podsurfer/audio/${this.episode.podcastId}/${this.episode.id}`}
          type=${this.episode.enclosure.type}
          length=${this.episode.enclosure.length}
          duration=${this.episode.itunes?.duration}
          podcast=${this.episode.podcastId}
          image=${this.episode.itunes?.image ?? this.episode.podcastImage}
          title=${this.episode.title}
          author=${this.episode.creator}
          .audioTime=${this.audioTime ?? 0}
          .playbackRate=${this.playbackRate ?? 1}
          @time-updated=${this.handleTimeUpdate}
          @playbackrate-changed=${this.handlePlaybackRateChange}
          @ended=${this.handleEnded}
        ></pod-audio>
      </main> `;
      }
    };
    customElements.define("episode-page", EpisodePage);
  }
});

// src/pod-audio.js
var pod_audio_exports = {};
__export(pod_audio_exports, {
  PodAudio: () => PodAudio
});
import { LitElement as LitElement6, html as html6, css as css7, when as when4, ref, createRef } from "lit";
import { Temporal as Temporal2 } from "@js-temporal/polyfill";
var PX_BETWEEN_RECTANGLES, PodAudio;
var init_pod_audio = __esm({
  "src/pod-audio.js"() {
    init_play_pause_css();
    PX_BETWEEN_RECTANGLES = 2;
    PodAudio = class extends LitElement6 {
      static get properties() {
        return {
          url: { type: String },
          type: { type: String },
          length: { type: Number },
          duration: { type: String },
          title: { type: String },
          author: { type: String },
          image: { type: String },
          playing: { type: Boolean, reflect: true },
          maxDuration: { state: true },
          currentTime: { type: Number },
          playbackRate: { state: true },
          audioTime: { type: Number },
          audioCurrentTime: { state: true },
          audioDuration: { state: true }
        };
      }
      static get styles() {
        return [
          playPauseStyles,
          css7`
        * {
          box-sizing: border-box;
        }
        :host {
          container: audio / size;
          display: grid;
          grid-template-areas:
            "title title title title title"
            "author author author author author"
            "progress progress progress progress progress"
            "currentTime currentTime duration duration duration"
            "rate back play forward .";
          grid-template-rows: max-content max-content minmax(0, 1fr) max-content;
          grid-template-columns: repeat(5, calc(20% - 8px));
          gap: 8px;
        }
        h1 {
          grid-area: title;
          margin: 0;
        }
        p {
          grid-area: author;
          margin: 0;
        }
        progress {
          padding: 1px;
        }
        progress,
        svg#progress-cover {
          grid-area: progress;
          height: 100%;
          width: 100%;
          appearance: none;
          aspect-ratio: 1 / 1;
          &::-webkit-progress-value {
            background-color: var(--primarycolor, #fff);
          }
          &::-webkit-progress-bar {
            background-color: rgba(0, 0, 0, 0.2);
          }
          & path {
            fill: #fff;
          }
        }
        svg {
          pointer-events: none;
          width: 50%;
        }
        p#currentTime {
          grid-area: currentTime;
        }
        p#duration {
          grid-area: duration;
          justify-self: end;
        }
        button {
          aspect-ratio: 1 / 1;
          background: none;
          border-radius: 50%;
          border: 1px solid rgba(0, 0, 0, 0.2);
          padding: 0;
          display: grid;
          place-items: center;
        }
        button#rate {
          grid-area: rate;
        }
        button#back {
          grid-area: back;
        }
        button#play {
          grid-area: play;
        }
        button#forward {
          grid-area: forward;
        }
      `
        ];
      }
      constructor() {
        super();
        this._audioRef = createRef();
        this._playRef = createRef();
        this.currentTime = "00:00";
        this.maxDuration = "00:00";
        this.playbackRate = 1;
      }
      updated(changedProperties) {
        if (changedProperties.has("playbackRate") || changedProperties.has("url")) {
          this._audioRef.value.playbackRate = this.playbackRate;
        }
        if (changedProperties.has("url")) {
          let path = 'path("M 0 0 L 0 100 L 100 100 L 100 0';
          for (let rectIndex = 0; rectIndex < 100 / PX_BETWEEN_RECTANGLES; rectIndex++) {
            const amplitude = Math.floor(Math.random() * 25) + 15;
            path += ` M ${rectIndex * (PX_BETWEEN_RECTANGLES + PX_BETWEEN_RECTANGLES / 100)} ${amplitude} l ${PX_BETWEEN_RECTANGLES / 2} 0 l 0 ${100 - 2 * amplitude} l -${PX_BETWEEN_RECTANGLES / 2} 0 `;
          }
          path += 'Z")';
          this.shadowRoot.querySelector("path").setAttribute("style", `d: ${path}`);
          this._setupMediaSession();
        }
        if (changedProperties.has("audioTime")) {
          this.seekTo(this.audioTime);
        }
        if (changedProperties.has("playbackRate") || changedProperties.has("audioDuration") || changedProperties.has("audioCurrentTime")) {
          navigator.mediaSession.setPositionState({
            duration: (this.audioDuration ?? this._audioRef.value?.duration) || 100,
            playbackRate: this.playbackRate ?? this._audioRef.value.playbackRate ?? 1,
            position: this.audioCurrentTime ?? this._audioRef.value.currentTime ?? 0
          });
        }
      }
      _setupMediaSession() {
        if ("mediaSession" in navigator) {
          navigator.mediaSession.metadata = new MediaMetadata({
            title: this.title,
            artist: this.author,
            album: this.podcast ?? this.author,
            artwork: [
              {
                src: this.image,
                sizes: "198x198",
                type: "image/png"
              }
            ]
          });
          navigator.mediaSession.setActionHandler("play", () => {
            this._audioRef.value.play();
          });
          navigator.mediaSession.setActionHandler("pause", () => {
            this._audioRef.value.pause();
          });
          navigator.mediaSession.setActionHandler("stop", () => {
            this._audioRef.value.stop();
          });
          navigator.mediaSession.setActionHandler("seekbackward", () => {
            this.seekTo(this._audioRef.value.currentTime - 10);
          });
          navigator.mediaSession.setActionHandler("seekforward", () => {
            this.seekTo(this._audioRef.value.currentTime + 10);
          });
          navigator.mediaSession.setActionHandler("seekto", () => {
          });
        }
      }
      handleDurationChange() {
        this.audioDuration = this._audioRef.value.duration;
        const maxDuration = Temporal2.Duration.from({
          seconds: Math.floor(this._audioRef.value.duration)
        }).round({ largestUnit: "minutes" });
        this.maxDuration = `${`${maxDuration.minutes}`.padStart(2, "0").slice(-2)}:${`${maxDuration.seconds}`.padStart(2, "0").slice(-2)}`;
      }
      handleEnded() {
        this.playing = false;
        this.dispatchEvent(new Event("ended"));
      }
      handlePlay() {
        this.playing = true;
      }
      handlePause() {
        this.playing = false;
      }
      handlePlaybackRateChange() {
        this.playbackRate += 0.1;
        this.dispatchEvent(
          new CustomEvent("playbackrate-changed", {
            detail: { rate: this.playbackRate }
          })
        );
      }
      handleTimeUpdate() {
        this.audioCurrentTime = this._audioRef.value.currentTime;
        const currentTime = Temporal2.Duration.from({
          seconds: Math.floor(this._audioRef.value.currentTime)
        }).round({ largestUnit: "minutes" });
        this.currentTime = `${`${currentTime.minutes}`.padStart(2, "0").slice(-2)}:${`${currentTime.seconds}`.padStart(2, "0").slice(-2)}`;
        this.dispatchEvent(
          new CustomEvent("time-updated", {
            detail: { time: this._audioRef.value.currentTime }
          })
        );
      }
      seekTo(time) {
        this._audioRef.value.currentTime = time;
      }
      toggleAudio() {
        if (this.playing) return this._audioRef.value.pause();
        this._audioRef.value.play();
      }
      render() {
        return html6`
      <h1>${this.title}</h1>
      <p>${this.author}</p>
      <progress
        min="0"
        max=${this._audioRef.value?.duration}
        value=${this._audioRef.value?.currentTime}
        @click=${(event) => this.seekTo(
          this._audioRef.value?.duration * event.offsetX / this.offsetWidth
        )}
      ></progress>
      <svg viewBox="0 0 100 100" id="progress-cover" preserveAspectRatio="none">
        <path></path>
      </svg>
      <p id="currentTime">${this.currentTime}</p>
      <p id="duration">${this.maxDuration}</p>
      <button id="rate" @click=${this.handlePlaybackRateChange}>
        ${`${this.playbackRate}`.slice(0, 3)}
      </button>
      <button
        id="back"
        @click=${() => this.seekTo(this._audioRef.value.currentTime - 10)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
          <path
            d="M480-120q-138 0-240.5-91.5T122-440h82q14 104 92.5 172T480-200q117 0 198.5-81.5T760-480q0-117-81.5-198.5T480-760q-69 0-129 32t-101 88h110v80H120v-240h80v94q51-64 124.5-99T480-840q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-480q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-120Zm112-192L440-464v-216h80v184l128 128-56 56Z"
          />
        </svg>
      </button>
      <button id="play" @click=${this.toggleAudio}>
        <svg
          viewBox="0 -960 960 960"
          id="play"
          ${ref(this._playRef)}
          play-pause
          ?play=${!this.playing}
          ?pause=${this.playing}
        >
          <path></path>
        </svg>
      </button>
      <button
        id="forward"
        @click=${() => this.seekTo(this._audioRef.value.currentTime + 10)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
          <path
            d="M480-120q-75 0-140.5-28.5t-114-77q-48.5-48.5-77-114T120-480q0-75 28.5-140.5t77-114q48.5-48.5 114-77T480-840q82 0 155.5 35T760-706v-94h80v240H600v-80h110q-41-56-101-88t-129-32q-117 0-198.5 81.5T200-480q0 117 81.5 198.5T480-200q105 0 183.5-68T756-440h82q-15 137-117.5 228.5T480-120Zm112-192L440-464v-216h80v184l128 128-56 56Z"
          />
        </svg>
      </button>
      <audio
        ${ref(this._audioRef)}
        src=${this.url}
        crossorigin
        preload
        @play=${this.handlePlay}
        @pause=${this.handlePause}
        @durationchange=${this.handleDurationChange}
        @loadeddata=${this.handleDurationChange}
        @canplaythrough=${this.handleDurationChange}
        @timeupdate=${this.handleTimeUpdate}
        @ended=${this.handleEnded}
      ></audio>
    `;
      }
    };
    customElements.define("pod-audio", PodAudio);
  }
});

// src/index.js
window.addEventListener("message", async (event) => {
  const { type } = event.data;
  if (type === "PODCAST_CACHE_UPDATE") {
    console.log("PODCAST_CACHE_UPDATE");
    const myPodcasts = document.querySelector("#my-podcasts pod-scroller");
    myPodcasts.items = podcasts;
  }
});
await navigator.serviceWorker.register("./service-worker.js", {
  type: "module"
});
var registration = await navigator.serviceWorker.ready;
await registration.update();
try {
  const incomingServiceWorker = registration.waiting ?? registration.installing;
  const firstInstall2 = incomingServiceWorker && !registration.active;
  incomingServiceWorker.addEventListener(
    "statechange",
    ({ target: { state } }) => {
      if (state === "installed")
        incomingServiceWorker.postMessage({ type: "SKIP_WAITING" });
    }
  );
} catch (error) {
  console.warn(error);
}
registration.addEventListener("controllerchange", () => {
  if (firstInstall) return;
  window.location.reload();
});
Promise.all([
  fetch("https://oracle.mone.dev/podsurfer/").then((r) => r.json()),
  fetch("https://oracle.mone.dev/podsurfer/recent/").then((r) => r.json()),
  import("idb-keyval"),
  Promise.resolve().then(() => (init_pod_surfer(), pod_surfer_exports)),
  Promise.resolve().then(() => (init_pod_scroller(), pod_scroller_exports))
]).then(async ([podcasts2, recents, { get: get2 }]) => {
  const completeEpisodes = await get2("complete-episodes") || [];
  const myPodcasts = document.querySelector("#my-podcasts pod-scroller");
  myPodcasts.items = podcasts2;
  document.querySelector("#recently-released pod-scroller").items = recents.map(
    (recentEpisode) => ({
      ...recentEpisode,
      complete: completeEpisodes.find(
        (completeEpisode) => completeEpisode.title === recentEpisode.title
      )
    })
  );
  myPodcasts.addEventListener("podcast-select", async ({ podcast }) => {
    const [items] = await Promise.all([
      fetch(`https://oracle.mone.dev/podsurfer/episodes/${podcast.title}`).then(
        (r) => r.json()
      ),
      Promise.resolve().then(() => (init_podcast_page(), podcast_page_exports)),
      Promise.resolve().then(() => (init_pod_list(), pod_list_exports))
    ]);
    const podcastPage = document.querySelector("podcast-page");
    podcastPage.podcast = { ...podcast, items };
    podcastPage.addEventListener(
      "podcast-close",
      () => {
        document.startViewTransition(async () => {
          const scrollerWithSelection = document.querySelector(
            "pod-list[has-last-selected], pod-scroller[has-last-selected]"
          );
          if (scrollerWithSelection) {
            await scrollerWithSelection.reselect();
          }
          document.querySelector("#body").toggleAttribute("hidden", false);
          podcastPage.toggleAttribute("hidden", true);
        });
      },
      { once: true }
    );
    document.startViewTransition(async () => {
      const scrollerWithSelection = document.querySelector(
        "pod-list[selected], pod-scroller[selected]"
      );
      if (scrollerWithSelection) {
        await scrollerWithSelection.deselect();
      }
      document.querySelector("#body").toggleAttribute("hidden", true);
      podcastPage.toggleAttribute("hidden", false);
    });
  });
});
Promise.all([import("idb-keyval"), Promise.resolve().then(() => (init_pod_list(), pod_list_exports))]).then(
  async ([{ get: get2, set: set2 }]) => {
    const completeEpisodes = await get2("complete-episodes") || [];
    const inProgressPodList = document.querySelector("#in-progress pod-list");
    const updateInProgress = async () => {
      const inProgressEpisodes = await get2("in-progress-episodes") ?? [];
      const completeEpisodes2 = await get2("complete-episodes") || [];
      inProgressPodList.items = inProgressEpisodes.filter((episode) => {
        return !completeEpisodes2.some(
          (complete) => complete.title === episode.title
        );
      }).map((episode) => ({
        ...episode,
        progress: get2(`episode-${episode.title}-time`) || 0
      }));
    };
    updateInProgress();
    document.body.addEventListener("episode-select", async ({ episode }) => {
      await Promise.all([
        Promise.resolve().then(() => (init_episode_page(), episode_page_exports)),
        Promise.resolve().then(() => (init_pod_audio(), pod_audio_exports))
      ]);
      if (!inProgressPodList.items.some((ep) => ep.title === episode.title)) {
        set2("in-progress-episodes", [...inProgressPodList.cleanItems, episode]);
      }
      const episodePage = document.querySelector("episode-page");
      episodePage.episode = episode;
      await episodePage.updateComplete;
      document.startViewTransition(async () => {
        const scrollerWithSelection = document.querySelector(
          "pod-list[selected], pod-scroller[selected]"
        );
        if (scrollerWithSelection) {
          await scrollerWithSelection.deselect();
        }
        document.querySelector("#body").toggleAttribute("hidden", true);
        episodePage.toggleAttribute("hidden", false);
      });
    });
    document.body.addEventListener("episode-completed", async ({ episode }) => {
      inProgressPodList.items = inProgressPodList.items.filter(
        (ep) => ep.title !== episode.title
      );
      set2("in-progress-episodes", inProgressPodList.items);
      get2("complete-episodes").then(
        (completeEpisodes2 = []) => set2("complete-episodes", [...completeEpisodes2, episode])
      );
      const recentlyReleasedScroller = document.querySelector(
        "#recently-released pod-scroller"
      );
      recentlyReleasedScroller.items = recentlyReleasedScroller.items.filter(
        (recentEpisode) => episode.title !== recentEpisode.title
      );
    });
    document.body.addEventListener("episode-close", () => {
      updateInProgress();
      const transition = document.startViewTransition(async () => {
        const scrollerWithSelection = document.querySelector(
          "pod-list[has-last-selected], pod-scroller[has-last-selected]"
        );
        if (scrollerWithSelection) {
          await scrollerWithSelection.reselect();
        }
        document.querySelector("#body").toggleAttribute("hidden", false);
        document.querySelector("episode-page").toggleAttribute("hidden", true);
      });
    });
  }
);
document.querySelector("#my-podcasts header button").addEventListener("click", () => {
  const dialog = document.querySelector("dialog#add-podcast");
  dialog.showModal();
  const dialogForm = dialog.querySelector("form");
  dialogForm.addEventListener("submit", async (event) => {
    const formData = new FormData(dialogForm);
    console.log(formData);
    if (formData === "cancel") return;
    const url = formData.get("rss-feed");
    const response = await fetch("https://oracle.mone.dev/podsurfer/add", {
      method: "POST",
      headers: new Headers({ "content-type": "application/json" }),
      body: JSON.stringify({ url })
    });
  });
});

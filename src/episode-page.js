import { html, css, LitElement, when } from "lit";
import { EpisodeSelectEvent } from "./EpisodeSelectEvent.js";
import { ViewTransitionMixin } from "./ViewTransitionMixin.js";

export class EpisodePage extends ViewTransitionMixin(LitElement) {
  static get properties() {
    return {
      hidden: { state: true },
      podcast: { type: Object },
      episode: { type: Object },
      audioTime: { state: true },
      playbackRate: { state: true },
    };
  }

  static get styles() {
    return css`
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
      import("idb-keyval").then(({ get, set }) => {
        get(`episode-${this.episode.title}-time`).then((time) => {
          if (!time) return;
          this.audioTime = time;
        });
        get(`playback-rate`).then((rate) => {
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
    const { EpisodeCompletedEvent } = await import(
      "./EpisodeCompletedEvent.js"
    );
    this.dispatchEvent(new EpisodeCompletedEvent(this.episode));
    this.dispatchEvent(
      new CustomEvent("episode-close", {
        bubbles: true,
        composed: true,
      })
    );
  }

  async handleTimeUpdate({ detail: { time } }) {
    const { set } = await import("idb-keyval");
    set(`episode-${this.episode.title}-time`, time);
  }

  async handlePlaybackRateChange({ detail: { rate } }) {
    const { set } = await import("idb-keyval");
    set(`playback-rate`, rate);
  }

  render() {
    return html`<header>
        <button
          @click=${() =>
            this.dispatchEvent(
              new CustomEvent("episode-close", {
                bubbles: true,
                composed: true,
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
}

customElements.define("episode-page", EpisodePage);

import { LitElement, html, css, when, until } from "lit";
import { EpisodeSelectEvent } from "./EpisodeSelectEvent.js";
import { playPauseStyles } from "./play-pause.css.js";
import { Temporal } from "@js-temporal/polyfill";

import "./swipe-action.js";

class PodList extends LitElement {
  static get properties() {
    return {
      items: { type: Array },
      _lastSelected: {
        type: Boolean,
        reflect: true,
        attribute: "has-last-selected",
      },
      _selected: { type: Boolean, reflect: true, attribute: "selected" },
    };
  }

  static get styles() {
    return [
      playPauseStyles,
      css`
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
      `,
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
    const progress = Math.floor((await item.progress) ?? 0);
    const durationRemaining = Temporal.Duration.from({
      seconds: duration - progress,
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
    this._lastSelected = undefined;
    this._selected = episode;
    const cleanedEpsiode = { ...episode, progress: await episode.progress };
    this.dispatchEvent(new EpisodeSelectEvent(cleanedEpsiode));
  }

  async deselect() {
    this._lastSelected = this._selected;
    this._selected = undefined;
    await this.updateComplete;
  }

  async reselect() {
    this._selected = this._lastSelected;
    this._lastSelected = undefined;
    await this.updateComplete;
    requestAnimationFrame(() => {
      this._selected = undefined;
    });
  }

  async delete(episode) {
    const { get, set } = await import("idb-keyval");
    const episodes = (await get("in-progress-episodes")) || [];
    set(
      "in-progress-episodes",
      episodes.filter((ep) => ep.id !== episode.id)
    );
    this.items = this.items.filter((ep) => ep.id !== episode.id);
  }

  async complete(episode) {
    const { EpisodeCompletedEvent } = await import(
      "./EpisodeCompletedEvent.js"
    );
    this.dispatchEvent(new EpisodeCompletedEvent(episode));
  }

  render() {
    return html`
      ${when(
        this.items.length,
        () =>
          this.items.map(
            (item) =>
              html`
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
                      src=${item.image?.url ??
                      item.itunes?.image ??
                      item.podcastImage}
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
        () => html`<slot></slot>`
      )}
    `;
  }
}

customElements.define("pod-list", PodList);

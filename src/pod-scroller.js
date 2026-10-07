import { LitElement, html, css } from "lit";
import { EpisodeSelectEvent } from "./EpisodeSelectEvent.js";
import { PodSelectEvent } from "./PodSelectEvent.js";

class PodScroller extends LitElement {
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
    this._lastSelected = undefined;
    this._selected = item;
    await this.updateComplete;
    if (this.getAttribute("type") == "episode")
      return this.dispatchEvent(new EpisodeSelectEvent(item));
    return this.dispatchEvent(new PodSelectEvent(item));
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

  render() {
    return html`
      ${this.items.map(
        (item) =>
          html`
            <button
              ?complete=${item.complete}
              @click=${() => this.#select(item)}
            >
              <img
                ?selected=${this._selected === item}
                ?last-selected=${this._lastSelected === item}
                src=${item.image?.url ??
                item.itunes?.image ??
                item.podcastImage}
              />
              <p>${item.title}</p>
            </button>
          `
      )}
    `;
  }
}

customElements.define("pod-scroller", PodScroller);

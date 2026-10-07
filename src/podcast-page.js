import { html, LitElement, css } from "lit";
import { when } from "lit/directives/when.js";
import { getSubscription, setSubscription } from "./storage.js";
import { fetchWithTimeout, showToast } from "./api.js";

export class PodcastPage extends LitElement {
  static get properties() {
    return {
      podcast: { type: Object },
      _isSubscribed: { state: true },
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
      const localSubscription = await getSubscription();
      this._isSubscribed = localSubscription?.notifiers?.includes(this.podcast.title) || false;
    }
  }

  async subscribe() {
    if (this._isSubscribed) return;
    this._isSubscribed = true;
    try {
      const localSubscription = await getSubscription();
      let { userId, publicKey, subscription } = localSubscription || {};
      if (!localSubscription) {
        const initializeResult = await fetchWithTimeout(
          "https://oracle.mone.dev/notifications/initialize",
          {
            method: "POST",
            headers: new Headers({ "content-type": "application/json" }),
            body: JSON.stringify({
              appId: "pod-surfer",
            }),
          }
        ).then((r) => r.json());
        userId = initializeResult.userId;
        publicKey = initializeResult.publicKey;
        subscription = await this.registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: publicKey,
        });
      }

      const notifiers = await fetchWithTimeout(
        "https://oracle.mone.dev/notifications/subscribe",
        {
          method: "POST",
          headers: new Headers({ "content-type": "application/json" }),
          body: JSON.stringify({
            appId: "pod-surfer",
            notifiers: [this.podcast.title],
            userId,
            publicKey,
            subscription: subscription.toJSON(),
          }),
        }
      );
      await setSubscription({
        userId,
        publicKey,
        notifiers,
      });
      showToast("Subscribed to push notifications");
    } catch (error) {
      console.error(error);
      this._isSubscribed = false;
      showToast("Failed to subscribe to notifications", true);
    }
  }

  async unsubscribe() {
    if (!this._isSubscribed) return;
    this._isSubscribed = false;
    try {
      const subscription =
        await this.registration.pushManager.getSubscription();
      if (!subscription) return;
      await subscription.unsubscribe();
      await fetchWithTimeout("https://oracle.mone.dev/notifications/unsubscribe", {
        method: "POST",
        headers: new Headers({ "content-type": "application/json" }),
        body: JSON.stringify({
          appId: "pod-surfer",
          subscription: subscription.toJSON(),
        }),
      });
      await setSubscription(null);
      showToast("Unsubscribed from push notifications");
    } catch (error) {
      console.error(error);
      this._isSubscribed = true;
      showToast("Failed to unsubscribe", true);
    }
  }

  render() {
    return html`
      <header>
        <button
          id="close"
          @click=${() =>
            this.dispatchEvent(
              new CustomEvent("podcast-close", {
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
        <img src=${this.podcast?.image?.url ?? this.podcast.itunes?.image} />
        <p>${this.podcast.title}</p>
      </header>
      <main>
        <h2>
          <span>Episodes</span>
          <button
            id="subscribe"
            @click=${() =>
              this._isSubscribed ? this.unsubscribe() : this.subscribe()}
          >
            ${when(
              this._isSubscribed,
              () => html`
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 -960 960 960"
                >
                  <path
                    d="M80-560q0-100 44.5-183.5T244-882l47 64q-60 44-95.5 111T160-560H80Zm720 0q0-80-35.5-147T669-818l47-64q75 55 119.5 138.5T880-560h-80ZM160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160Zm320-300Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z"
                  />
                </svg>
              `,
              () => html`
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
}

customElements.define("podcast-page", PodcastPage);

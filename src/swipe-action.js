import { LitElement, html, css } from "lit";

export class SwipeAction extends LitElement {
  static get properties() {
    return {
      open: { type: Boolean },
    };
  }

  static get styles() {
    return css`
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
        threshold: 0.7,
      }
    );
    observer.observe(this.shadowRoot.querySelector("#left-action"));
    observer.observe(this.shadowRoot.querySelector("#right-action"));
  }

  render() {
    return html`
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
}

customElements.define("swipe-action", SwipeAction);

import { LitElement, html, css } from "lit";
import { getPlaybackRateForEpisode, setPlaybackRateForEpisode } from "./storage.js";
import { when } from "lit/directives/when.js";
import { ref, createRef } from "lit/directives/ref.js";
import { Temporal } from "@js-temporal/polyfill";
import { playPauseStyles } from "./play-pause.css.js";

const PX_BETWEEN_RECTANGLES = 2;

export class PodAudio extends LitElement {
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
      currentTime: { type: String },
      playbackRate: { state: true },
      audioTime: { type: Number },
      audioCurrentTime: { state: true },
      audioDuration: { state: true },
      buffering: { type: Boolean, reflect: true },
      displayTime: { state: true },
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
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        svg.spinner {
          width: 60%;
          height: 60%;
          animation: spin 1s linear infinite;
        }
        svg.spinner circle {
          stroke: var(--primarycolor, #000);
          stroke-linecap: round;
          stroke-dasharray: 90, 150;
          stroke-dashoffset: 0;
        }
        progress[buffering] {
          opacity: 0.6;
          animation: pulse 1.2s ease-in-out infinite alternate;
        }
        @keyframes pulse {
          0% {
            opacity: 0.4;
          }
          100% {
            opacity: 0.85;
          }
        }
      `,
    ];
  }

  constructor() {
    super();
    this._audioRef = createRef();
    this._playRef = createRef();
    this.currentTime = "00:00";
    this.maxDuration = "00:00";
    this.playbackRate = 1;
    this.buffering = false;
    this.displayTime = null;
    this._pendingSeekTime = null;
    this._seekDebounceTimer = null;
  }

  async updated(changedProperties) {
    if (changedProperties.has("playbackRate") || changedProperties.has("url")) {
      this._audioRef.value.playbackRate = this.playbackRate;
    }
    if (changedProperties.has("url")) {
      this._pendingSeekTime =
        typeof this.audioTime === "number" && this.audioTime > 0
          ? this.audioTime
          : null;
      let path = 'path("M 0 0 L 0 100 L 100 100 L 100 0';
      for (
        let rectIndex = 0;
        rectIndex < 100 / PX_BETWEEN_RECTANGLES;
        rectIndex++
      ) {
        const amplitude = Math.floor(Math.random() * 25) + 15;
        path += ` M ${
          rectIndex * (PX_BETWEEN_RECTANGLES + PX_BETWEEN_RECTANGLES / 100)
        } ${amplitude} l ${PX_BETWEEN_RECTANGLES / 2} 0 l 0 ${
          100 - 2 * amplitude
        } l -${PX_BETWEEN_RECTANGLES / 2} 0 `;
      }
      path += 'Z")';
      this.shadowRoot.querySelector("path").setAttribute("style", `d: ${path}`);
      this._setupMediaSession();
      // Load per‑episode playback rate (default 1)
      this.playbackRate = await getPlaybackRateForEpisode(this.url);

    }
    if (changedProperties.has("audioTime")) {
      if (
        typeof this.audioTime === "number" &&
        !isNaN(this.audioTime) &&
        Math.abs((this._audioRef.value?.currentTime ?? 0) - this.audioTime) > 1
      ) {
        this.seekTo(this.audioTime);
      }
    }
    if (
      changedProperties.has("playbackRate") ||
      changedProperties.has("audioDuration") ||
      changedProperties.has("audioCurrentTime")
    ) {
      navigator.mediaSession.setPositionState({
        duration: (this.audioDuration ?? this._audioRef.value?.duration) || 100,
        playbackRate:
          this.playbackRate ?? this._audioRef.value.playbackRate ?? 1,
        position:
          this.audioCurrentTime ?? this._audioRef.value.currentTime ?? 0,
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
            type: "image/png",
          },
        ],
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
        const current = this.displayTime ?? this._audioRef.value?.currentTime ?? 0;
        this.seekTo(Math.max(0, current - 10));
      });
      navigator.mediaSession.setActionHandler("seekforward", () => {
        const current = this.displayTime ?? this._audioRef.value?.currentTime ?? 0;
        this.seekTo(current + 10);
      });
      navigator.mediaSession.setActionHandler("seekto", (details) => {
        if (details?.seekTime !== undefined) {
          this.seekTo(details.seekTime);
        }
      });
    }
  }

  formatTime(seconds) {
    if (typeof seconds !== "number" || isNaN(seconds)) return "00:00";
    const dur = Temporal.Duration.from({
      seconds: Math.floor(Math.max(0, seconds)),
    }).round({ largestUnit: "minutes" });
    return `${`${dur.minutes}`.padStart(2, "0").slice(-2)}:${`${dur.seconds}`.padStart(2, "0").slice(-2)}`;
  }

  isTimeBuffered(audio, time) {
    if (!audio || !audio.buffered) return false;
    for (let i = 0; i < audio.buffered.length; i++) {
      if (time >= audio.buffered.start(i) && time <= audio.buffered.end(i)) {
        return true;
      }
    }
    return false;
  }

  handleDurationChange() {
    if (!this._audioRef?.value) return;
    this.audioDuration = this._audioRef.value.duration;
    if (this._audioRef.value.duration) {
      this.maxDuration = this.formatTime(this._audioRef.value.duration);
    }
  }

  handleLoadedMetadata() {
    this.handleDurationChange();
    const audio = this._audioRef?.value;
    if (
      audio &&
      this._pendingSeekTime !== null &&
      this._pendingSeekTime !== undefined &&
      this._pendingSeekTime > 0
    ) {
      const timeToSeek = this._pendingSeekTime;
      this._pendingSeekTime = null;
      this._applySeek(timeToSeek);
    }
  }

  handleEnded() {
    this.playing = false;
    this.buffering = false;
    this.displayTime = null;
    this.dispatchEvent(new Event("ended"));
  }

  handlePlay() {
    this.playing = true;
  }

  handlePlaying() {
    this.playing = true;
    this.buffering = false;
    this.displayTime = null;
  }

  handlePause() {
    this.playing = false;
    this.buffering = false;
  }

  handleWaiting() {
    this.buffering = true;
  }

  handleSeeking() {
    this.buffering = true;
  }

  handleSeeked() {
    this.buffering = false;
    this.displayTime = null;
  }

  handleCanPlay() {
    this.buffering = false;
  }

  async handlePlaybackRateChange() {
    this.playbackRate = Number((this.playbackRate + 0.1).toFixed(1));
    // Persist per‑episode rate
    await setPlaybackRateForEpisode(this.url, this.playbackRate);
    this.dispatchEvent(
      new CustomEvent("playbackrate-changed", {
        detail: { rate: this.playbackRate },
      })
    );
  }

  handleTimeUpdate() {
    const audio = this._audioRef?.value;
    if (!audio) return;

    // Suppress initial 0-second timeupdate if we have a pending seek to a saved position
    if (
      this._pendingSeekTime !== null &&
      this._pendingSeekTime > 0 &&
      audio.currentTime === 0
    ) {
      return;
    }

    if (!this._seekDebounceTimer) {
      this.displayTime = null;
      this.currentTime = this.formatTime(audio.currentTime);
    }

    this.audioCurrentTime = audio.currentTime;
    this.dispatchEvent(
      new CustomEvent("time-updated", {
        detail: { time: audio.currentTime },
      })
    );
  }

  seekTo(time, immediate = false) {
    if (typeof time !== "number" || isNaN(time)) return;
    const audio = this._audioRef?.value;
    const duration = this.audioDuration ?? audio?.duration;
    const targetTime = Math.max(0, duration ? Math.min(time, duration) : time);

    // Instant optimistic UI feedback
    this.displayTime = targetTime;
    this.currentTime = this.formatTime(targetTime);

    if (!audio) {
      this._pendingSeekTime = targetTime;
      return;
    }

    if (audio.readyState < HTMLMediaElement.HAVE_METADATA) {
      this._pendingSeekTime = targetTime;
      return;
    }

    if (this._seekDebounceTimer) {
      clearTimeout(this._seekDebounceTimer);
      this._seekDebounceTimer = null;
    }

    // If target is already buffered in memory or immediate is specified, apply without delay
    if (immediate || this.isTimeBuffered(audio, targetTime)) {
      this._applySeek(targetTime);
    } else {
      this.buffering = true;
      this._seekDebounceTimer = setTimeout(() => {
        this._seekDebounceTimer = null;
        this._applySeek(targetTime);
      }, 250);
    }
  }

  _applySeek(targetTime) {
    const audio = this._audioRef?.value;
    if (!audio) return;
    try {
      this.buffering = true;
      audio.currentTime = targetTime;
      this._pendingSeekTime = null;
    } catch (err) {
      console.warn("Could not set currentTime on audio element:", err);
      this.buffering = false;
    }
  }

  toggleAudio() {
    if (this.playing) return this._audioRef.value.pause();
    this._audioRef.value.play();
  }

  render() {
    return html`
      <h1>${this.title}</h1>
      <p>${this.author}</p>
      <progress
        min="0"
        max=${this.audioDuration ?? this._audioRef.value?.duration}
        value=${this.displayTime ?? this._audioRef.value?.currentTime}
        ?buffering=${this.buffering}
        @click=${(event) => {
          const duration =
            this.audioDuration ?? this._audioRef?.value?.duration;
          if (duration) {
            this.seekTo(
              (duration * event.offsetX) / this.offsetWidth
            );
          }
        }}
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
        @click=${() => {
          const current =
            this.displayTime ?? this._audioRef.value?.currentTime ?? 0;
          this.seekTo(Math.max(0, current - 10));
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
          <path
            d="M480-120q-138 0-240.5-91.5T122-440h82q14 104 92.5 172T480-200q117 0 198.5-81.5T760-480q0-117-81.5-198.5T480-760q-69 0-129 32t-101 88h110v80H120v-240h80v94q51-64 124.5-99T480-840q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-480q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-120Zm112-192L440-464v-216h80v184l128 128-56 56Z"
          />
        </svg>
      </button>
      <button id="play" ?buffering=${this.buffering} @click=${this.toggleAudio}>
        ${this.buffering
          ? html`<svg viewBox="0 0 50 50" class="spinner">
              <circle cx="25" cy="25" r="20" fill="none" stroke-width="4"></circle>
            </svg>`
          : html`<svg
              viewBox="0 -960 960 960"
              id="play"
              ${ref(this._playRef)}
              play-pause
              ?play=${!this.playing}
              ?pause=${this.playing}
            >
              <path></path>
            </svg>`}
      </button>
      <button
        id="forward"
        @click=${() => {
          const current =
            this.displayTime ?? this._audioRef.value?.currentTime ?? 0;
          this.seekTo(current + 10);
        }}
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
        preload="auto"
        @play=${this.handlePlay}
        @playing=${this.handlePlaying}
        @pause=${this.handlePause}
        @waiting=${this.handleWaiting}
        @seeking=${this.handleSeeking}
        @seeked=${this.handleSeeked}
        @canplay=${this.handleCanPlay}
        @canplaythrough=${this.handleCanPlay}
        @loadedmetadata=${this.handleLoadedMetadata}
        @durationchange=${this.handleDurationChange}
        @timeupdate=${this.handleTimeUpdate}
        @ended=${this.handleEnded}
      ></audio>
    `;
  }
}

customElements.define("pod-audio", PodAudio);

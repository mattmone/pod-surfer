export class EpisodeSelectEvent extends Event {
  constructor(episode) {
    super("episode-select", {
      bubbles: true,
      composed: true,
    });
    this.episode = episode;
  }
}

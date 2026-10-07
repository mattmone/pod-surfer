export class EpisodeCompletedEvent extends Event {
  constructor(episode) {
    super("episode-completed", {
      bubbles: true,
      composed: true,
    });
    this.episode = episode;
  }
}

export class PodSelectEvent extends Event {
  constructor(podcast) {
    super("podcast-select", {
      bubbles: true,
      composed: true,
    });
    this.podcast = podcast;
  }
}

/**
 * Core Data Models & Type Definitions for Pod Surfer
 */

export interface PodcastImage {
  url?: string;
}

export interface PodcastITunes {
  image?: string;
  duration?: string | number;
}

export interface EpisodeEnclosure {
  url: string;
  type: string;
  length?: number | string;
}

export interface Episode {
  id?: string;
  title: string;
  podcastId?: string;
  podcastImage?: string;
  creator?: string;
  contentSnippet?: string;
  enclosure: EpisodeEnclosure;
  itunes?: PodcastITunes;
  image?: PodcastImage;
  progress?: number | Promise<number>;
  complete?: boolean;
}

export interface Podcast {
  title: string;
  image?: PodcastImage;
  itunes?: PodcastITunes;
  items?: Episode[];
}

export interface PushSubscriptionData {
  userId?: string;
  publicKey?: string;
  notifiers?: string[];
  subscription?: PushSubscriptionJSON;
}

export type PodcastSelectEventDetail = {
  podcast: Podcast;
};

export type EpisodeSelectEventDetail = {
  episode: Episode;
};

export type EpisodeCompletedEventDetail = {
  episode: Episode;
};

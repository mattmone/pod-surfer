import { get, set } from "idb-keyval";

/** @typedef {import('./types.d.ts').Episode} Episode */
/** @typedef {import('./types.d.ts').PushSubscriptionData} PushSubscriptionData */

export const StorageKeys = {
  COMPLETE_EPISODES: "complete-episodes",
  IN_PROGRESS_EPISODES: "in-progress-episodes",
  PLAYBACK_RATE: "playback-rate",
  SUBSCRIPTION: "pod-surfer/subscription",
  /**
   * @param {string} title
   * @returns {string}
   */
  episodeTime: (title) => `episode-${title}-time`,
};

/**
 * @returns {Promise<Episode[]>}
 */
export async function getCompleteEpisodes() {
  return (await get(StorageKeys.COMPLETE_EPISODES)) || [];
}

/**
 * @param {Episode} episode
 * @returns {Promise<void>}
 */
export async function addCompleteEpisode(episode) {
  const current = await getCompleteEpisodes();
  if (!current.some((ep) => ep.title === episode.title)) {
    await set(StorageKeys.COMPLETE_EPISODES, [...current, episode]);
  }
}

/**
 * @returns {Promise<Episode[]>}
 */
export async function getInProgressEpisodes() {
  return (await get(StorageKeys.IN_PROGRESS_EPISODES)) ?? [];
}

/**
 * @param {Episode[]} episodes
 * @returns {Promise<void>}
 */
export async function setInProgressEpisodes(episodes) {
  await set(StorageKeys.IN_PROGRESS_EPISODES, episodes);
}

/**
 * @param {string} episodeIdentifier
 * @returns {Promise<Episode[]>}
 */
export async function removeInProgressEpisode(episodeIdentifier) {
  const current = await getInProgressEpisodes();
  const updated = current.filter(
    (ep) => ep.id !== episodeIdentifier && ep.title !== episodeIdentifier
  );
  await setInProgressEpisodes(updated);
  return updated;
}

/**
 * @param {string} title
 * @returns {Promise<number>}
 */
export async function getEpisodeTime(title) {
  return (await get(StorageKeys.episodeTime(title))) || 0;
}

/**
 * @param {string} title
 * @param {number} time
 * @returns {Promise<void>}
 */
export async function setEpisodeTime(title, time) {
  await set(StorageKeys.episodeTime(title), time);
}

/**
 * @returns {Promise<number>}
 */
export async function getPlaybackRate() {
  return (await get(StorageKeys.PLAYBACK_RATE)) || 1;
}

/**
 * @param {number} rate
 * @returns {Promise<void>}
 */
export async function setPlaybackRate(rate) {
  await set(StorageKeys.PLAYBACK_RATE, rate);
}
// Per-episode playback rate helpers
export async function getPlaybackRateForEpisode(url) {
  return (await get(`${StorageKeys.PLAYBACK_RATE}:${url}`)) || 1;
}

export async function setPlaybackRateForEpisode(url, rate) {
  await set(`${StorageKeys.PLAYBACK_RATE}:${url}`, rate);
}

/**
 * @returns {Promise<PushSubscriptionData | null>}
 */
export async function getSubscription() {
  return (await get(StorageKeys.SUBSCRIPTION)) || null;
}

/**
 * @param {PushSubscriptionData | null} subscriptionData
 * @returns {Promise<void>}
 */
export async function setSubscription(subscriptionData) {
  await set(StorageKeys.SUBSCRIPTION, subscriptionData);
}

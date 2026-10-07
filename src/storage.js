import { get, set } from "idb-keyval";

export const StorageKeys = {
  COMPLETE_EPISODES: "complete-episodes",
  IN_PROGRESS_EPISODES: "in-progress-episodes",
  PLAYBACK_RATE: "playback-rate",
  SUBSCRIPTION: "pod-surfer/subscription",
  episodeTime: (title) => `episode-${title}-time`,
};

export async function getCompleteEpisodes() {
  return (await get(StorageKeys.COMPLETE_EPISODES)) || [];
}

export async function addCompleteEpisode(episode) {
  const current = await getCompleteEpisodes();
  if (!current.some((ep) => ep.title === episode.title)) {
    await set(StorageKeys.COMPLETE_EPISODES, [...current, episode]);
  }
}

export async function getInProgressEpisodes() {
  return (await get(StorageKeys.IN_PROGRESS_EPISODES)) ?? [];
}

export async function setInProgressEpisodes(episodes) {
  await set(StorageKeys.IN_PROGRESS_EPISODES, episodes);
}

export async function removeInProgressEpisode(episodeIdentifier) {
  const current = await getInProgressEpisodes();
  const updated = current.filter(
    (ep) => ep.id !== episodeIdentifier && ep.title !== episodeIdentifier
  );
  await setInProgressEpisodes(updated);
  return updated;
}

export async function getEpisodeTime(title) {
  return (await get(StorageKeys.episodeTime(title))) || 0;
}

export async function setEpisodeTime(title, time) {
  await set(StorageKeys.episodeTime(title), time);
}

export async function getPlaybackRate() {
  return (await get(StorageKeys.PLAYBACK_RATE)) || 1;
}

export async function setPlaybackRate(rate) {
  await set(StorageKeys.PLAYBACK_RATE, rate);
}

export async function getSubscription() {
  return (await get(StorageKeys.SUBSCRIPTION)) || null;
}

export async function setSubscription(subscriptionData) {
  await set(StorageKeys.SUBSCRIPTION, subscriptionData);
}

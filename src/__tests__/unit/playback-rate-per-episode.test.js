import { expect } from '@esm-bundle/chai';
import { getPlaybackRateForEpisode, setPlaybackRateForEpisode } from '../../src/storage.js';

describe('Per‑episode Playback Rate Storage', () => {
  beforeEach(async () => {
    // Clear IndexedDB before each test
    await indexedDB.deleteDatabase('keyval-store');
  });

  it('defaults to 1 for a new episode', async () => {
    const rate = await getPlaybackRateForEpisode('episodeA');
    expect(rate).to.equal(1);
  });

  it('can set and retrieve a specific rate', async () => {
    const url = 'episodeB';
    await setPlaybackRateForEpisode(url, 1.8);
    const stored = await getPlaybackRateForEpisode(url);
    expect(stored).to.equal(1.8);
  });

  it('rates are isolated per episode', async () => {
    const a = 'episodeA';
    const b = 'episodeB';
    await setPlaybackRateForEpisode(a, 1.2);
    await setPlaybackRateForEpisode(b, 2.0);
    expect(await getPlaybackRateForEpisode(a)).to.equal(1.2);
    expect(await getPlaybackRateForEpisode(b)).to.equal(2.0);
  });
});

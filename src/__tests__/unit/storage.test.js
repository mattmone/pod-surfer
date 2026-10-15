import { expect } from '@esm-bundle/chai';
import { getCompleteEpisodes, addCompleteEpisode, getInProgressEpisodes, setInProgressEpisodes, removeInProgressEpisode, getEpisodeTime, setEpisodeTime, getPlaybackRate, setPlaybackRate } from '../../src/storage.js';

describe('Storage Abstraction Service', () => {
  beforeEach(async () => {
    // Clear IndexedDB before each test
    await indexedDB.deleteDatabase('keyval-store');
  });

  it('should return empty array for getCompleteEpisodes initially', async () => {
    const episodes = await getCompleteEpisodes();
    expect(episodes).to.be.an('array').that.is.empty;
  });

  it('should add and deduplicate complete episodes', async () => {
    const ep = { title: 'Episode 1', id: '1' };
    await addCompleteEpisode(ep);
    await addCompleteEpisode(ep);
    const episodes = await getCompleteEpisodes();
    expect(episodes).to.have.lengthOf(1);
    expect(episodes[0].title).to.equal('Episode 1');
  });

  it('should persist in-progress episodes', async () => {
    const eps = [{ title: 'A', id: 'a' }, { title: 'B', id: 'b' }];
    await setInProgressEpisodes(eps);
    const stored = await getInProgressEpisodes();
    expect(stored).to.deep.equal(eps);
  });

  it('should remove in-progress episode by id or title', async () => {
    const eps = [{ title: 'A', id: 'a' }, { title: 'B', id: 'b' }];
    await setInProgressEpisodes(eps);
    await removeInProgressEpisode('a');
    const after = await getInProgressEpisodes();
    expect(after).to.have.lengthOf(1);
    expect(after[0].id).to.equal('b');
  });

  it('should handle episode time storage', async () => {
    await setEpisodeTime('Episode X', 123);
    const time = await getEpisodeTime('Episode X');
    expect(time).to.equal(123);
  });

  it('should default playback rate to 1 and allow setting', async () => {
    const defaultRate = await getPlaybackRate();
    expect(defaultRate).to.equal(1);
    await setPlaybackRate(1.5);
    const newRate = await getPlaybackRate();
    expect(newRate).to.equal(1.5);
  });
});

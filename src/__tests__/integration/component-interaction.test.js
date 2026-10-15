import { expect } from '@esm-bundle/chai';
import { click } from '@web/test-runner-commands';
import '../../src/podcast-page.js';
import '../../src/pod-scroller.js';
import '../../src/pod-list.js';

describe('Integration: Component Interaction', () => {
  it('should navigate from scroller to podcast page and render episodes', async () => {
    const scroller = document.createElement('pod-scroller');
    document.body.appendChild(scroller);
    await scroller.updateComplete;
    const firstItem = scroller.shadowRoot.querySelector('li');
    expect(firstItem).to.exist;
    await click(firstItem);
    const podcastPage = document.querySelector('podcast-page');
    expect(podcastPage).to.exist;
    await new Promise(r => setTimeout(r, 500));
    const episodeList = podcastPage.shadowRoot.querySelector('pod-list');
    expect(episodeList).to.exist;
  });
});

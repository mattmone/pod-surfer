window.addEventListener("message", async (event) => {
  const { type } = event.data;
  if (type === "PODCAST_CACHE_UPDATE") {
    console.log("PODCAST_CACHE_UPDATE");
    const myPodcasts = document.querySelector("#my-podcasts pod-scroller");
    myPodcasts.items = podcasts;
  }
});
await navigator.serviceWorker.register("./service-worker.js", {
  type: "module",
});
const registration = await navigator.serviceWorker.ready;
await registration.update();
let firstInstall = false;
try {
  const incomingServiceWorker = registration.waiting ?? registration.installing;
  firstInstall = incomingServiceWorker && !registration.active;
  if (incomingServiceWorker) {
    incomingServiceWorker.addEventListener(
      "statechange",
      ({ target: { state } }) => {
        if (state === "installed")
          incomingServiceWorker.postMessage({ type: "SKIP_WAITING" });
      }
    );
  }
} catch (error) {
  console.warn(error);
}
registration.addEventListener("controllerchange", () => {
  if (firstInstall) return;
  window.location.reload();
});
import { fetchWithTimeout, showToast } from "./api.js";

Promise.all([
  fetchWithTimeout("https://oracle.mone.dev/podsurfer/")
    .then((r) => r.json())
    .catch((err) => {
      console.warn("Failed fetching podcasts:", err);
      showToast("Offline mode: Using cached podcasts", true);
      return [];
    }),
  fetchWithTimeout("https://oracle.mone.dev/podsurfer/recent/")
    .then((r) => r.json())
    .catch((err) => {
      console.warn("Failed fetching recent episodes:", err);
      return [];
    }),
  import("./storage.js"),
  import("./pod-surfer.js"),
  import("./pod-scroller.js"),
]).then(async ([podcasts = [], recents = [], { getCompleteEpisodes }]) => {
  const completeEpisodes = await getCompleteEpisodes();
  const myPodcasts = document.querySelector("#my-podcasts pod-scroller");
  myPodcasts.items = podcasts;
  document.querySelector("#recently-released pod-scroller").items = recents.map(
    (recentEpisode) => ({
      ...recentEpisode,
      complete: completeEpisodes.find(
        (completeEpisode) => completeEpisode.title === recentEpisode.title
      ),
    })
  );
  myPodcasts.addEventListener("podcast-select", async ({ podcast }) => {
    const [items] = await Promise.all([
      fetchWithTimeout(`https://oracle.mone.dev/podsurfer/episodes/${podcast.title}`)
        .then((r) => r.json())
        .catch((err) => {
          console.warn("Failed fetching podcast episodes:", err);
          showToast("Offline mode: Limited episode data available", true);
          return podcast.items || [];
        }),
      import("./podcast-page.js"),
      import("./pod-list.js"),
    ]);
    const podcastPage = document.querySelector("podcast-page");
    podcastPage.podcast = { ...podcast, items };
    podcastPage.addEventListener(
      "podcast-close",
      () => {
        document.startViewTransition(async () => {
          const scrollerWithSelection = document.querySelector(
            "pod-list[has-last-selected], pod-scroller[has-last-selected]"
          );
          if (scrollerWithSelection) {
            await scrollerWithSelection.reselect();
          }
          document.querySelector("#body").toggleAttribute("hidden", false);
          podcastPage.toggleAttribute("hidden", true);
        });
      },
      { once: true }
    );
    document.startViewTransition(async () => {
      const scrollerWithSelection = document.querySelector(
        "pod-list[selected], pod-scroller[selected]"
      );
      if (scrollerWithSelection) {
        await scrollerWithSelection.deselect();
      }
      document.querySelector("#body").toggleAttribute("hidden", true);
      podcastPage.toggleAttribute("hidden", false);
    });
  });
});

Promise.all([import("./storage.js"), import("./pod-list.js")]).then(
  async ([{ getCompleteEpisodes, getInProgressEpisodes, setInProgressEpisodes, addCompleteEpisode, getEpisodeTime }]) => {
    const inProgressPodList = document.querySelector("#in-progress pod-list");
    const updateInProgress = async () => {
      const inProgressEpisodes = await getInProgressEpisodes();
      const completeEpisodes = await getCompleteEpisodes();

      const filteredEpisodes = inProgressEpisodes.filter((episode) => {
        return !completeEpisodes.some(
          (complete) => complete.title === episode.title
        );
      });

      inProgressPodList.items = await Promise.all(
        filteredEpisodes.map(async (episode) => ({
          ...episode,
          progress: await getEpisodeTime(episode.title),
        }))
      );
    };
    updateInProgress();

    document.body.addEventListener("episode-select", async ({ episode }) => {
      await Promise.all([
        import("./episode-page.js"),
        import("./pod-audio.js"),
      ]);
      if (!inProgressPodList.items.some((ep) => ep.title === episode.title)) {
        await setInProgressEpisodes([...inProgressPodList.cleanItems, episode]);
      }
      const episodePage = document.querySelector("episode-page");
      episodePage.episode = episode;
      await episodePage.updateComplete;
      document.startViewTransition(async () => {
        const scrollerWithSelection = document.querySelector(
          "pod-list[selected], pod-scroller[selected]"
        );
        if (scrollerWithSelection) {
          await scrollerWithSelection.deselect();
        }
        document.querySelector("#body").toggleAttribute("hidden", true);
        episodePage.toggleAttribute("hidden", false);
      });
    });
    document.body.addEventListener("episode-completed", async ({ episode }) => {
      inProgressPodList.items = inProgressPodList.items.filter(
        (ep) => ep.title !== episode.title
      );
      await setInProgressEpisodes(inProgressPodList.items);
      await addCompleteEpisode(episode);
      const recentlyReleasedScroller = document.querySelector(
        "#recently-released pod-scroller"
      );
      recentlyReleasedScroller.items = recentlyReleasedScroller.items.filter(
        (recentEpisode) => episode.title !== recentEpisode.title
      );
    });
    document.body.addEventListener("episode-close", () => {
      updateInProgress();
      const transition = document.startViewTransition(async () => {
        const scrollerWithSelection = document.querySelector(
          "pod-list[has-last-selected], pod-scroller[has-last-selected]"
        );
        if (scrollerWithSelection) {
          await scrollerWithSelection.reselect();
        }
        document.querySelector("#body").toggleAttribute("hidden", false);
        document.querySelector("episode-page").toggleAttribute("hidden", true);
      });
    });
  }
);

document
  .querySelector("#my-podcasts header button")
  .addEventListener("click", () => {
    const dialog = document.querySelector("dialog#add-podcast");
    dialog.showModal();
    const dialogForm = dialog.querySelector("form");
    const handleSubmit = async (event) => {
      if (event.submitter && event.submitter.value === "cancel") return;
      const formData = new FormData(dialogForm);
      const url = formData.get("rss-feed");
      if (!url) return;
      try {
        await fetchWithTimeout("https://oracle.mone.dev/podsurfer/add", {
          method: "POST",
          headers: new Headers({ "content-type": "application/json" }),
          body: JSON.stringify({ url }),
        });
        showToast("Podcast feed added successfully!");
      } catch (err) {
        console.error("Failed adding podcast feed:", err);
        showToast("Failed to add podcast feed. Check connection.", true);
      }
    };
    dialogForm.addEventListener("submit", handleSubmit, { once: true });
  });

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
try {
  const incomingServiceWorker = registration.waiting ?? registration.installing;
  const firstInstall = incomingServiceWorker && !registration.active;
  incomingServiceWorker.addEventListener(
    "statechange",
    ({ target: { state } }) => {
      if (state === "installed")
        incomingServiceWorker.postMessage({ type: "SKIP_WAITING" });
    }
  );
} catch (error) {
  console.warn(error);
}
registration.addEventListener("controllerchange", () => {
  if (firstInstall) return;
  window.location.reload();
});
Promise.all([
  fetch("https://oracle.mone.dev/podsurfer/").then((r) => r.json()),
  fetch("https://oracle.mone.dev/podsurfer/recent/").then((r) => r.json()),
  import("idb-keyval"),
  import("./pod-surfer.js"),
  import("./pod-scroller.js"),
]).then(async ([podcasts, recents, { get }]) => {
  const completeEpisodes = (await get("complete-episodes")) || [];
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
      fetch(`https://oracle.mone.dev/podsurfer/episodes/${podcast.title}`).then(
        (r) => r.json()
      ),
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

Promise.all([import("idb-keyval"), import("./pod-list.js")]).then(
  async ([{ get, set }]) => {
    const completeEpisodes = (await get("complete-episodes")) || [];
    const inProgressPodList = document.querySelector("#in-progress pod-list");
    const updateInProgress = async () => {
      const inProgressEpisodes = (await get("in-progress-episodes")) ?? [];
      const completeEpisodes = (await get("complete-episodes")) || [];

      inProgressPodList.items = inProgressEpisodes
        .filter((episode) => {
          return !completeEpisodes.some(
            (complete) => complete.title === episode.title
          );
        })
        .map((episode) => ({
          ...episode,
          progress: get(`episode-${episode.title}-time`) || 0,
        }));
    };
    updateInProgress();

    document.body.addEventListener("episode-select", async ({ episode }) => {
      await Promise.all([
        import("./episode-page.js"),
        import("./pod-audio.js"),
      ]);
      if (!inProgressPodList.items.some((ep) => ep.title === episode.title)) {
        set("in-progress-episodes", [...inProgressPodList.cleanItems, episode]);
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
      set("in-progress-episodes", inProgressPodList.items);
      get("complete-episodes").then((completeEpisodes = []) =>
        set("complete-episodes", [...completeEpisodes, episode])
      );
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
    dialogForm.addEventListener("submit", async (event) => {
      const formData = new FormData(dialogForm);
      console.log(formData);
      if (formData === "cancel") return;
      const url = formData.get("rss-feed");
      const response = await fetch("https://oracle.mone.dev/podsurfer/add", {
        method: "POST",
        headers: new Headers({ "content-type": "application/json" }),
        body: JSON.stringify({ url }),
      });
    });
  });

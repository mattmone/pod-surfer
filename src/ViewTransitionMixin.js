export const ViewTransitionMixin = (superClass) =>
  class extends superClass {
    async scheduleUpdate() {
      if (this._viewTransition !== undefined) {
        await this._viewTransition.finished;
      }
      return super.scheduleUpdate();
    }

    async performUpdate() {
      if (!document.startViewTransition) {
        return super.performUpdate();
      }

      await (this._viewTransition = document.startViewTransition(() => {
        super.performUpdate();
      }));
      // clear the _viewTransition object so that we don't await a resolved Promise in a
      // future scheduleUpdate() call:
      this._viewTransition = undefined;
    }
  };
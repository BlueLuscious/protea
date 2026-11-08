export function createOpenStateAuthority(initialOpen = false, hooks = {}) {
  let value = initialOpen;
  let busy = false;
  const registrations = new Set();
  const stats = { reads: 0, requests: [], subscriptions: 0, releases: 0, disposals: 0 };

  function transition(next) {
    if (busy) {
      return false;
    }

    busy = true;

    try {
      if (hooks.allow !== undefined && !hooks.allow(next)) {
        return false;
      }

      hooks.beforeCommit?.(next);

      if (value !== next) {
        const change = { previous: value, current: next };
        value = next;
        hooks.beforeNotify?.(change);
        const failures = [];

        for (const registration of [...registrations]) {
          if (!registrations.has(registration)) {
            continue;
          }

          try {
            registration(change);
          } catch (error) {
            failures.push(error);
          }
        }

        try {
          hooks.afterNotify?.(change);
        } catch (error) {
          failures.push(error);
        }

        if (failures.length > 0) {
          throw new AggregateError(failures, "Fixture source delivery failed.");
        }
      }

      return true;
    } finally {
      busy = false;
    }
  }

  const authority = {
    get isOpen() {
      stats.reads += 1;
      hooks.onRead?.(value);
      return value;
    },
    requestOpen(next) {
      stats.requests.push(next);
      return transition(next);
    },
    subscribeOpenChange(listener) {
      stats.subscriptions += 1;
      const registration = (change) => listener(change);
      registrations.add(registration);
      hooks.afterSubscribe?.();
      let released = false;

      return () => {
        if (released) {
          return;
        }

        released = true;
        stats.releases += 1;
        hooks.release?.();
        registrations.delete(registration);
      };
    },
    dispose() {
      stats.disposals += 1;
      registrations.clear();
    },
  };

  return { authority, stats, setOpen: transition, registrationCount: () => registrations.size };
}

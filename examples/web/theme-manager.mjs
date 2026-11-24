/** @description Owns the page's theme preference, system input and effective-theme observations. */
export class ThemeManager {
  /** @description The selected preference, initially following the system. */
  #selectedValue = "system";
  /** @description The latest system theme, retained while a fixed preference is selected. */
  #systemTheme;
  /** @description The borrowed application policy, released when the manager ends. */
  #canSetPreference;
  /** @description Independent observations of effective preference changes. */
  #selectionListeners = new Set();
  /** @description Independent observations of effective theme changes. */
  #effectiveThemeListeners = new Set();
  /** @description Whether the manager may accept mutations or observations. */
  #alive = true;
  /** @description Whether a policy decision or update delivery excludes nested mutations. */
  #busy = false;

  /**
   * @description Starts in system mode using the caller's current system theme.
   * @param {"light" | "dark"} initialSystemTheme - Initial host-supplied system preference.
   * @param {(preference: string) => boolean} canSetPreference - Optional synchronous application policy.
   */
  constructor(initialSystemTheme, canSetPreference = () => true) {
    this.#systemTheme = this.#requireSystemTheme(initialSystemTheme);
    if (typeof canSetPreference !== "function") {
      throw new TypeError("Theme preference policy must be callable.");
    }
    this.#canSetPreference = canSetPreference;
  }

  /**
   * @description Reads the committed preference, including after finalisation.
   * @returns {string} The selected light, dark or system preference.
   */
  get selectedValue() {
    return this.#selectedValue;
  }

  /**
   * @description Resolves the committed preference against the latest system theme.
   * @returns {"light" | "dark"} The effective theme, including after finalisation.
   */
  get effectiveTheme() {
    return this.#selectedValue === "system" ? this.#systemTheme : this.#selectedValue;
  }

  /**
   * @description Authorises and synchronously commits a preference through the application policy.
   * @remarks Commit precedes preference and then theme delivery. Observer failure does not roll back.
   * Busy or finalised requests return false before processing the target.
   * @param {string} preference - Requested light, dark or system preference.
   * @returns {boolean} Whether the preference is authorised and effective.
   */
  requestSelection(preference) {
    if (!this.#alive || this.#busy) {
      return false;
    }
    if (preference !== "light" && preference !== "dark" && preference !== "system") {
      throw new TypeError("Theme preference must be light, dark or system.");
    }
    if (preference === this.#selectedValue) {
      return true;
    }

    this.#busy = true;
    try {
      const policy = this.#canSetPreference;
      const accepted = policy(preference);
      if (typeof accepted !== "boolean") {
        throw new TypeError("Theme preference policy must return a boolean.");
      }
      if (!this.#alive || !accepted) {
        return false;
      }
      this.#commit(preference, this.#systemTheme);
      return true;
    } finally {
      this.#busy = false;
    }
  }

  /**
   * @description Retains a system update independently of the application's preference policy.
   * @remarks A fixed preference keeps its effective theme. Busy or finalised updates return false.
   * @param {"light" | "dark"} systemTheme - Current host-supplied system preference.
   * @returns {boolean} Whether the system input was accepted, including an unchanged value.
   */
  setSystemTheme(systemTheme) {
    if (!this.#alive || this.#busy) {
      return false;
    }
    const next = this.#requireSystemTheme(systemTheme);
    if (next === this.#systemTheme) {
      return true;
    }

    this.#busy = true;
    try {
      this.#commit(this.#selectedValue, next);
      return true;
    } finally {
      this.#busy = false;
    }
  }

  /**
   * @description Observes future preference changes without replay.
   * @param {(change: import("@luscious-garden/protea-components/select").SelectChangeType) => void} listener - Borrowed synchronous observer.
   * @returns {() => void} An idempotent release for this registration.
   */
  subscribeSelectionChange(listener) {
    return this.#subscribe(this.#selectionListeners, listener);
  }

  /**
   * @description Observes future effective-theme changes without replay.
   * @param {(change: Readonly<{ previous: "light" | "dark", current: "light" | "dark" }>) => void} listener - Borrowed synchronous observer.
   * @returns {() => void} An idempotent release for this registration.
   */
  subscribeEffectiveThemeChange(listener) {
    return this.#subscribe(this.#effectiveThemeListeners, listener);
  }

  /**
   * @description Ends manager-owned registrations while retaining its final state.
   * @remarks Repeated calls are harmless. Borrowed models and host connections keep their owners.
   * @returns No value.
   */
  dispose() {
    this.#alive = false;
    this.#canSetPreference = undefined;
    this.#selectionListeners.clear();
    this.#effectiveThemeListeners.clear();
  }

  /**
   * @description Validates the host's two-state system input.
   * @param {unknown} value - Candidate system theme.
   * @returns {"light" | "dark"} The validated theme.
   */
  #requireSystemTheme(value) {
    if (value !== "light" && value !== "dark") {
      throw new TypeError("System theme must be light or dark.");
    }
    return value;
  }

  /**
   * @description Adds an independent registration to one manager-owned stream.
   * @param registrations - The chosen stream's registrations.
   * @param listener - Borrowed synchronous observer.
   * @returns {() => void} An idempotent release for this registration.
   */
  #subscribe(registrations, listener) {
    if (!this.#alive) {
      throw new Error("Cannot subscribe after Theme Manager finalisation.");
    }
    if (typeof listener !== "function") {
      throw new TypeError("A theme observation listener must be callable.");
    }
    const registration = (change) => listener(change);
    registrations.add(registration);
    return () => {
      registrations.delete(registration);
    };
  }

  /**
   * @description Commits both inputs before delivering preference and then effective-theme changes.
   * @remarks Both delivery snapshots precede callbacks; additions wait for a later update.
   * Remaining eligible observers are attempted before reporting failures.
   * @param {string} preference - The validated next preference.
   * @param {"light" | "dark"} systemTheme - The validated latest system input.
   * @returns No value.
   */
  #commit(preference, systemTheme) {
    const previousPreference = this.#selectedValue;
    const previousTheme = this.effectiveTheme;
    this.#selectedValue = preference;
    this.#systemTheme = systemTheme;
    const currentTheme = this.effectiveTheme;
    const preferenceObservers = [...this.#selectionListeners];
    const themeObservers = [...this.#effectiveThemeListeners];
    const failures = [];
    if (previousPreference !== preference) {
      this.#deliver(this.#selectionListeners, preferenceObservers,
        Object.freeze({ previous: previousPreference, current: preference }), failures);
    }
    if (previousTheme !== currentTheme) {
      this.#deliver(this.#effectiveThemeListeners, themeObservers,
        Object.freeze({ previous: previousTheme, current: currentTheme }), failures);
    }
    if (failures.length > 0) {
      throw new AggregateError(failures, "Theme Manager observation failed.");
    }
  }

  /**
   * @description Attempts eligible observers from one committed update's stream snapshot.
   * @param registrations - The stream's current registrations.
   * @param snapshot - Registrations captured before either stream began delivery.
   * @param change - Immutable effective transition supplied to each observer.
   * @param failures - Collection retaining callback failures until both streams finish.
   * @returns No value.
   */
  #deliver(registrations, snapshot, change, failures) {
    for (const registration of snapshot) {
      if (!this.#alive) {
        break;
      }
      if (!registrations.has(registration)) {
        continue;
      }
      try {
        registration(change);
      } catch (error) {
        failures.push(error);
      }
    }
  }
}

/**
 * @description Owns the measurement and finalisation result of one simulated export.
 * @remarks A full measurement leaves the result pending until the export is finalised.
 */
export class SampleExport {
  /** @description The last accepted processed record count. */
  #value = 0;

  /** @description Whether the finalisation step has succeeded. */
  #isComplete = false;

  /**
   * @description Reads the current processed record count.
   * @returns {number} The accepted count.
   */
  get value() {
    return this.#value;
  }

  /**
   * @description Reads the fixed number of records in this export.
   * @returns {number} The total record count.
   */
  get total() {
    return 3;
  }

  /**
   * @description Reads the result of the application's finalisation step.
   * @returns {boolean} Whether finalisation has succeeded.
   */
  get isComplete() {
    return this.#isComplete;
  }

  /**
   * @description Validates and commits a processed record count.
   * @param {number} count - The count measured by the application.
   * @returns {boolean} Whether the accepted count changed.
   * @throws {TypeError} The sample is not a number.
   * @throws {RangeError} The sample is not an integer within the remaining range.
   */
  reportProcessed(count) {
    if (typeof count !== "number") {
      throw new TypeError("The processed record count must be a number.");
    }
    if (!Number.isInteger(count) || count < this.#value || count > this.total) {
      throw new RangeError("The processed record count must be an integer between the current count and the export total.");
    }
    if (count === this.#value) {
      return false;
    }

    this.#value = count;
    return true;
  }

  /**
   * @description Marks the simulated export as complete after all records are processed.
   * @returns No value.
   * @throws {Error} The records are still being processed.
   */
  finish() {
    if (this.#value !== this.total) {
      throw new Error("Process all records before finishing the export.");
    }

    this.#isComplete = true;
  }
}

/**
 * @description A readonly snapshot of one effective Button availability transition.
 * @remarks Opposite boolean directions exclude unchanged writes, initialisation and finalisation.
 */
export type ButtonDisabledChangeType =
  | {
      /** @description The enabled policy before the change. */
      readonly previous: false;
      /** @description The committed disabled policy. */
      readonly current: true;
    }
  | {
      /** @description The disabled policy before the change. */
      readonly previous: true;
      /** @description The committed enabled policy. */
      readonly current: false;
    };

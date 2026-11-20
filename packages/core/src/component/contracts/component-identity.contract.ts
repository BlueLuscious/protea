/** @description The logical identity of a reusable component type. */
export interface ComponentIdentity {
  /** @description The lowercase ASCII kebab-case name of the type. */
  readonly name: string;

  /** @description An optional lowercase ASCII kebab-case namespace for attribution. */
  readonly namespace?: string;
}

/**
 * @description Requires a creation argument when the recipe does not accept undefined.
 * @typeParam Options - The options inferred from the definition.
 */
export type TComponentCreationOptions<Options> = undefined extends Options
  ? [options?: NoInfer<Options>]
  : [options: NoInfer<Options>];

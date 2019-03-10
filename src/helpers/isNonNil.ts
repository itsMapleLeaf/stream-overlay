export const isNonNil = <T>(value: T | undefined | null | void): value is T =>
  value != null

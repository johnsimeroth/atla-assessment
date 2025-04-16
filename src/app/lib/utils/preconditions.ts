/**
 * Preconditions are used for assertions that should never fail.
 * Failure indicates a mistaken assumption that should be fixed.
 */
class Preconditions {
  static checkExists<T>(value: T | null | undefined): T {
    if (value == null) {
      throw new Error("Unexpected nullish value");
    }
    return value;
  }
}

export { Preconditions };

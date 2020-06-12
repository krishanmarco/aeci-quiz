export function safeRun<T>(run: () => T, fallback: T): T {
  try {
    return run();
  } catch (e) {
    console.log("HelperFunctions err: ", e);
    return fallback;
  }
}

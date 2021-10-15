const packageVersion = '0.0.2-rc.2';

export const defaults = {
  startup: {
    // Stress the request time used while starting up the SDK.
    requestTimeoutBeforeReady: 5,
    // How many quick retries we will do while starting up the SDK.
    retriesOnFailureBeforeReady: 1,
    // Maximum amount of time used before notifies me a timeout.
    readyTimeout: 10,
    // Amount of time we will wait before the first push of events.
    eventsFirstPushWindow: 10,
  },

  // Instance version.
  version: `reactnative-${packageVersion}`,

  // @TODO check if we should provide some way to overwrite the default log level
  debug: undefined,
};

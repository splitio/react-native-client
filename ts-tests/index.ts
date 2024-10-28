/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Split software typescript declarations testing.
 *
 * This file is not meant to run but to be compiled without errors. This is the same way to test .d.ts files
 * that you will need to comply to publish packages on @types organization on NPM (DefinitelyTyped).
 * We import the declarations through the NPM package name (using the development branch of the repo)
 * to test in the same way in which customers will be using it on development.
 *
 * The step of compiling this file is part of the continous integration systems in place.
 *
 * @author Nico Zelaya <nicolas.zelaya@split.io>
 */

import { SplitFactory, DebugLogger, InfoLogger, WarnLogger, ErrorLogger } from '../types/index';

let reactNativeSettings: SplitIO.IReactNativeSettings = {
  core: {
    authorizationKey: 'another-key',
    key: 'customer-key',
  },
};

let fullReactNativeSettings: SplitIO.IReactNativeSettings = {
  core: {
    authorizationKey: 'asd',
    key: 'asd',
    labelsEnabled: false,
  },
  scheduler: {
    featuresRefreshRate: 1,
    impressionsRefreshRate: 1,
    impressionsQueueSize: 1,
    telemetryRefreshRate: 1,
    segmentsRefreshRate: 1,
    offlineRefreshRate: 1,
    eventsPushRate: 1,
    eventsQueueSize: 1,
    pushRetryBackoffBase: 1,
  },
  startup: {
    readyTimeout: 1,
    requestTimeoutBeforeReady: 1,
    retriesOnFailureBeforeReady: 1,
    eventsFirstPushWindow: 1,
  },
  urls: {
    sdk: 'https://asd.com/sdk',
    events: 'https://asd.com/events',
    auth: 'https://asd.com/auth',
    streaming: 'https://asd.com/streaming',
    telemetry: 'https://asd.com/telemetry',
  },
  features: {
    feature1: 'treatment',
    feature2: { treatment: 'treatment2', config: "{ 'prop': 'value'}" },
    feature3: { treatment: 'treatment3', config: null },
  },
  storage: undefined,
  impressionListener: {
    logImpression: (data: SplitIO.ImpressionData) => {
      let impressionData: SplitIO.ImpressionData = data;
    },
  },
  debug: true,
  integrations: [],
  streamingEnabled: true,
  sync: {
    splitFilters: [
      {
        type: 'bySet',
        values: ['set_a', 'set_b'],
      },
      {
        type: 'byName',
        values: ['my_split_1', 'my_split_1'],
      },
      {
        type: 'byPrefix',
        values: ['my_split', 'test_split_'],
      },
    ],
    impressionsMode: 'DEBUG',
    enabled: true,
    requestOptions: {
      getHeaderOverrides(context) {
        return { ...context.headers, headerName: 'value' };
      },
    },
  },
  userConsent: 'GRANTED',
  mode: 'standalone',
};

reactNativeSettings.userConsent = 'DECLINED';
reactNativeSettings.userConsent = 'UNKNOWN';

// debug property can be a log level or Logger instance
reactNativeSettings.debug = 'ERROR';
reactNativeSettings.debug = DebugLogger();
reactNativeSettings.debug = InfoLogger();
reactNativeSettings.debug = WarnLogger();
reactNativeSettings.debug = ErrorLogger();

const SDK: SplitIO.ISDK = SplitFactory(reactNativeSettings);

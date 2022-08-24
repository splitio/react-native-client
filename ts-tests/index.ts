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
 * @author Emiliano Sanchez <emiliano.sanchez@split.io>
 */

///<reference types="../types" />
///<reference types="../types/full" />

import {
  SplitFactory as SplitFactoryFull,
  DebugLogger as DebugLoggerFull,
  InfoLogger as InfoLoggerFull,
  WarnLogger as WarnLoggerFull,
  ErrorLogger as ErrorLoggerFull,
} from '@splitsoftware/splitio-react-native/full';
import { SplitFactory, DebugLogger, InfoLogger, WarnLogger, ErrorLogger, LocalhostFromObject } from '@splitsoftware/splitio-react-native';

/**** Interfaces ****/

// Facade return interface
let SDK: SplitIO.ISDK;
// Settings interfaces
let reactNativeSettings: SplitIO.IReactNativeSettings;
// Client & Manager APIs
let client: SplitIO.IClient;
let manager: SplitIO.IManager;

/**** Tests for SDK interface ****/

reactNativeSettings = {
  core: {
    authorizationKey: 'another-key',
    key: 'customer-key',
  },
};

SDK = SplitFactory(reactNativeSettings);
SDK = SplitFactoryFull(reactNativeSettings);

// Client and Manager
client = SDK.client();
client = SDK.client('a customer key'); // `client = SDK.client('a customer key', 'a traffic type');` Not valid in Browser JS SDK
manager = SDK.manager();

console.log(client);
console.log(manager);

/**** Tests for fully crowded settings interfaces ****/

// Config parameters
let impressionListener: SplitIO.IImpressionListener = {
  logImpression: (data: SplitIO.ImpressionData) => {
    console.log(data);
  },
};
let splitFilters: SplitIO.SplitFilter[] = [
  { type: 'byName', values: ['my_split_1', 'my_split_1'] },
  { type: 'byPrefix', values: ['my_split', 'test_split_'] },
];

const fullReactNativeConfig: SplitIO.IReactNativeSettings = {
  core: {
    authorizationKey: 'api-key',
    key: 'some-key',
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
  },
  impressionListener: impressionListener,
  debug: DebugLogger(),
  integrations: [],
  streamingEnabled: true,
  sync: {
    splitFilters: splitFilters,
    impressionsMode: 'DEBUG',
    localhostMode: LocalhostFromObject(),
    enabled: true,
  },
  userConsent: 'GRANTED',
};

// debug property can be a boolean, log level or Logger instance
fullReactNativeConfig.debug = false;
fullReactNativeConfig.debug = 'ERROR';
fullReactNativeConfig.debug = DebugLogger();
fullReactNativeConfig.debug = InfoLogger();
fullReactNativeConfig.debug = WarnLogger();
fullReactNativeConfig.debug = ErrorLogger();
fullReactNativeConfig.debug = DebugLoggerFull();
fullReactNativeConfig.debug = InfoLoggerFull();
fullReactNativeConfig.debug = WarnLoggerFull();
fullReactNativeConfig.debug = ErrorLoggerFull();

fullReactNativeConfig.userConsent = 'DECLINED';
fullReactNativeConfig.userConsent = 'UNKNOWN';

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
  impressionListener: {
    logImpression: (data: SplitIO.ImpressionData) => {
      console.log(data);
    },
  },
  debug: DebugLogger(),
  integrations: [],
  streamingEnabled: true,
  sync: {
    splitFilters: [
      { type: 'byName', values: ['my_split_1', 'my_split_1'] },
      { type: 'byPrefix', values: ['my_split', 'test_split_'] },
    ],
    impressionsMode: 'DEBUG',
    localhostMode: LocalhostFromObject(),
    enabled: true,
  },
  userConsent: 'GRANTED',
};

fullReactNativeConfig.debug = InfoLogger();
fullReactNativeConfig.debug = WarnLogger();
fullReactNativeConfig.debug = ErrorLogger();
fullReactNativeConfig.debug = DebugLoggerFull();
fullReactNativeConfig.debug = InfoLoggerFull();
fullReactNativeConfig.debug = WarnLoggerFull();
fullReactNativeConfig.debug = ErrorLoggerFull();

const sdkSlim = SplitFactory(fullReactNativeConfig);
const sdkFull = SplitFactoryFull(fullReactNativeConfig);

let client: SplitIO.IClient = sdkSlim.client();
client = sdkSlim.client('other key');
client = sdkFull.client();
client = sdkFull.client('other key');
console.log(client);

let manager: SplitIO.IManager = sdkSlim.manager();
manager = sdkFull.manager();
console.log(manager);

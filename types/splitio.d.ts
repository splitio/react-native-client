// Type definitions for React Native Split Software SDK
// Project: http://www.split.io/
// Definitions by: Nico Zelaya <https://github.com/NicoZelaya/>

export as namespace SplitIO;
export = SplitIO;

/**
 * EventEmitter interface based on a subset of the NodeJS.EventEmitter methods.
 */
interface IEventEmitter {
  addListener(event: string, listener: (...args: any[]) => void): this
  on(event: string, listener: (...args: any[]) => void): this
  once(event: string, listener: (...args: any[]) => void): this
  removeListener(event: string, listener: (...args: any[]) => void): this
  off(event: string, listener: (...args: any[]) => void): this
  removeAllListeners(event?: string): this
  emit(event: string, ...args: any[]): boolean
}
/**
 * @typedef {Object} EventConsts
 * @property {string} SDK_READY The ready event.
 * @property {string} SDK_READY_FROM_CACHE The ready event when fired with cached data.
 * @property {string} SDK_READY_TIMED_OUT The timeout event.
 * @property {string} SDK_UPDATE The update event.
 */
type EventConsts = {
  SDK_READY: 'init::ready',
  SDK_READY_FROM_CACHE: 'init::cache-ready',
  SDK_READY_TIMED_OUT: 'init::timeout',
  SDK_UPDATE: 'state::update'
};
/**
 * Storage types.
 * @typedef {string} StorageType
 */
type StorageType = 'MEMORY' | 'LOCALSTORAGE';
/**
 * Settings interface. This is a representation of the settings the SDK expose, that's why
 * most of it's props are readonly. Only features should be rewritten when localhost mode is active.
 * @interface ISettings
 */
interface ISettings {
  readonly core: {
    authorizationKey: string,
    key: SplitIO.SplitKey,
    labelsEnabled: boolean,
    IPAddressesEnabled: boolean
  },
  readonly scheduler: {
    featuresRefreshRate: number,
    impressionsRefreshRate: number,
    impressionsQueueSize: number,
    telemetryRefreshRate: number,
    segmentsRefreshRate: number,
    offlineRefreshRate: number,
    eventsPushRate: number,
    eventsQueueSize: number,
    pushRetryBackoffBase: number
  },
  readonly startup: {
    readyTimeout: number,
    requestTimeoutBeforeReady: number,
    retriesOnFailureBeforeReady: number,
    eventsFirstPushWindow: number
  },
  readonly storage?: SplitIO.StorageSyncFactory,
  readonly urls: {
    events: string,
    sdk: string,
    auth: string,
    streaming: string,
    telemetry: string
  },
  readonly integrations?: SplitIO.IntegrationFactory[],
  readonly debug: boolean | LogLevel | SplitIO.ILogger,
  readonly version: string,
  /**
   * Mocked features map.
   */
  features?: SplitIO.MockedFeaturesMap,
  readonly streamingEnabled: boolean,
  readonly sync: {
    splitFilters: SplitIO.SplitFilter[],
    impressionsMode: SplitIO.ImpressionsMode,
    enabled: boolean,
    flagSpecVersion: string,
    requestOptions?: {
      getHeaderOverrides?: (context: { headers: Record<string, string> }) => Record<string, string>
    },
  },
  readonly userConsent: SplitIO.ConsentStatus
}
/**
 * Log levels.
 * @typedef {string} LogLevel
 */
type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'NONE';
/**
 * Logger API
 * @interface ILoggerAPI
 */
interface ILoggerAPI {
  /**
   * Enables SDK logging to the console.
   * @function enable
   * @returns {void}
   */
  enable(): void,
  /**
   * Disables SDK logging.
   * @function disable
   * @returns {void}
   */
  disable(): void,
  /**
   * Sets a log level for the SDK logs.
   * @function setLogLevel
   * @returns {void}
   */
  setLogLevel(logLevel: LogLevel): void,
  /**
   * Log level constants. Use this to pass them to setLogLevel function.
   */
  LogLevel: {
    [level in LogLevel]: LogLevel
  }
}
/**
 * User consent API
 * @interface IUserConsentAPI
 */
interface IUserConsentAPI {
  /**
   * Sets or updates the user consent status. Possible values are `true` and `false`, which represent user consent `'GRANTED'` and `'DECLINED'` respectively.
   * - `true ('GRANTED')`: the user has granted consent for tracking events and impressions. The SDK will send them to Split cloud.
   * - `false ('DECLINED')`: the user has declined consent for tracking events and impressions. The SDK will not send them to Split cloud.
   *
   * NOTE: calling this method updates the user consent at a factory level, affecting all clients of the same factory.
   *
   * @function setStatus
   * @param {boolean} userConsent The user consent status, true for 'GRANTED' and false for 'DECLINED'.
   * @returns {boolean} Whether the provided param is a valid value (i.e., a boolean value) or not.
   */
  setStatus(userConsent: boolean): boolean;
  /**
   * Gets the user consent status.
   *
   * @function getStatus
   * @returns {ConsentStatus} The user consent status.
   */
  getStatus(): SplitIO.ConsentStatus;
  /**
   * Consent status constants. Use this to compare with the getStatus function result.
   */
  Status: {
    [status in SplitIO.ConsentStatus]: SplitIO.ConsentStatus
  }
}
/**
 * Common settings between React Native, Browser and NodeJS settings interface.
 * @interface ISharedSettings
 */
interface ISharedSettings {
  /**
   * Boolean value to indicate whether the logger should be enabled or disabled by default, or a log level string or a Logger object.
   * Passing a logger object is required to get descriptive log messages. Otherwise most logs will print with message codes.
   * @see {@link https://help.split.io/hc/en-us/articles/4406066357901#logging}
   *
   * Examples:
   * ```typescript
   * config.debug = true
   * config.debug = 'WARN'
   * config.debug = ErrorLogger()
   * ```
   * @property {boolean | LogLevel | ILogger} debug
   * @default false
   */
  debug?: boolean | LogLevel | SplitIO.ILogger,
  /**
   * The impression listener, which is optional. Whatever you provide here needs to comply with the SplitIO.IImpressionListener interface,
   * which will check for the logImpression method.
   * @property {IImpressionListener} impressionListener
   * @default undefined
   */
  impressionListener?: SplitIO.IImpressionListener,
  /**
   * Boolean flag to enable the streaming service as default synchronization mechanism. In the event of any issue with streaming,
   * the SDK would fallback to the polling mechanism. If false, the SDK would poll for changes as usual without attempting to use streaming.
   * @property {boolean} streamingEnabled
   * @default true
   */
  streamingEnabled?: boolean,
  /**
   * SDK synchronization settings.
   * @property {Object} sync
   */
  sync?: {
    /**
     * List of feature flag filters. These filters are used to fetch a subset of the feature flag definitions in your environment, in order to reduce the delay of the SDK to be ready.
     *
     * Example:
     *  `splitFilter: [
     *    { type: 'byName', values: ['my_feature_flag_1', 'my_feature_flag_2'] }, // will fetch feature flags named 'my_feature_flag_1' and 'my_feature_flag_2'
     *  ]`
     * @property {SplitIO.SplitFilter[]} splitFilters
     */
    splitFilters?: SplitIO.SplitFilter[]
    /**
     * Impressions Collection Mode. Option to determine how impressions are going to be sent to Split servers.
     * Possible values are 'DEBUG', 'OPTIMIZED', and 'NONE'.
     * - DEBUG: will send all the impressions generated (recommended only for debugging purposes).
     * - OPTIMIZED: will send unique impressions to Split servers, avoiding a considerable amount of traffic that duplicated impressions could generate.
     * - NONE: will send unique keys evaluated per feature to Split servers instead of full blown impressions, avoiding a considerable amount of traffic that impressions could generate.
     *
     * @property {String} impressionsMode
     * @default 'OPTIMIZED'
     */
    impressionsMode?: SplitIO.ImpressionsMode,
    /**
     * Controls the SDK continuous synchronization flags.
     *
     * When `true` a running SDK will process rollout plan updates performed on the UI (default).
     * When false it'll just fetch all data upon init.
     *
     * @property {boolean} enabled
     * @default true
     */
    enabled?: boolean
    /**
     * Custom options object for HTTP(S) requests.
     * If provided, this object is merged with the options object passed by the SDK for EventSource and Fetch calls.
     */
    requestOptions?: {
      /**
       * Custom function called before each request, allowing you to add or update headers in SDK HTTP requests.
       * Some headers, such as `SplitSDKVersion`, are required by the SDK and cannot be overridden.
       * To pass multiple headers with the same name, combine their values into a single line, separated by commas. Example: `{ 'Authorization': 'value1, value2' }`
       * Or provide keys with different case since headers are case-insensitive. Example: `{ 'authorization': 'value1', 'Authorization': 'value2' }`
       *
       * NOTE: to pass custom headers to the streaming connection in Browser, you should polyfill the `window.EventSource` object with a library that supports headers,
       * like https://www.npmjs.com/package/event-source-polyfill, since native EventSource does not support them and will be ignored.
       *
       * @property getHeaderOverrides
       * @default undefined
       *
       * @param context - The context for the request.
       * @param context.headers - The current headers in the request.
       * @returns A set of headers to be merged with the current headers.
       *
       * @example
       * const getHeaderOverrides = (context) => {
       *   return {
       *     'Authorization': context.headers['Authorization'] + ', other-value',
       *     'custom-header': 'custom-value'
       *   };
       * };
       */
      getHeaderOverrides?: (context: { headers: Record<string, string> }) => Record<string, string>
    },
  }
}
/**
 * Common API for entities that expose status handlers.
 * @interface IStatusInterface
 * @extends IEventEmitter
 */
interface IStatusInterface extends IEventEmitter {
  /**
   * Constant object containing the SDK events for you to use.
   * @property {EventConsts} Event
   */
  Event: EventConsts,
  /**
   * Returns a promise that resolves once the SDK has finished loading (`SDK_READY` event emitted) or rejected if the SDK has timedout (`SDK_READY_TIMED_OUT` event emitted).
   * As it's meant to provide similar flexibility to the event approach, given that the SDK might be eventually ready after a timeout event, the `ready` method will return a resolved promise once the SDK is ready.
   *
   * Caveats: the method was designed to avoid an unhandled Promise rejection if the rejection case is not handled, so that `onRejected` handler is optional when using promises.
   * However, when using async/await syntax, the rejection should be explicitly propagated like in the following example:
   * ```
   * try {
   *   await client.ready().catch((e) => { throw e; });
   *   // SDK is ready
   * } catch(e) {
   *   // SDK has timedout
   * }
   * ```
   *
   * @function ready
   * @returns {Promise<void>}
   */
  ready(): Promise<void>
}
/**
 * Common definitions between clients for different environments interface.
 * @interface IBasicClient
 * @extends IStatusInterface
 */
interface IBasicClient extends IStatusInterface {
  /**
   * Destroys the client instance.
   * This method will flush any pending impressions and events, and stop the synchronization of feature flag definitions with the backend.
   *
   * @function destroy
   * @returns {Promise<void>} A promise that resolves once the client is destroyed.
   */
  destroy(): Promise<void>
}
/**
 * Common definitions between SDK instances for different environments interface.
 * @interface IBasicSDK
 */
interface IBasicSDK {
  /**
   * Current settings of the SDK instance.
   * @property settings
   */
  settings: ISettings,
  /**
   * Logger API.
   * @property Logger
   */
  Logger: ILoggerAPI,
  /**
   * Destroys all the clients created by this factory.
   * @function destroy
   * @returns {Promise<void>}
   */
  destroy(): Promise<void>
}
/****** Exposed namespace ******/
/**
 * Types and interfaces for @splitsoftware/splitio-react-native package for usage when integrating React Native SDK on typescript apps.
 * For the SDK package information see {@link https://www.npmjs.com/package/@splitsoftware/splitio-react-native}
 */
declare namespace SplitIO {
  /**
   * Feature flag treatment value, returned by getTreatment.
   * @typedef {string} Treatment
   */
  type Treatment = string;
  /**
   * Feature flag treatment promise that resolves to actual treatment value.
   * @typedef {Promise<string>} AsyncTreatment
   */
  type AsyncTreatment = Promise<string>;
  /**
   * An object with the treatments for a bulk of feature flags, returned by getTreatments. For example:
   *   {
   *     feature1: 'on',
   *     feature2: 'off
   *   }
   * @typedef {Object.<Treatment>} Treatments
   */
  type Treatments = {
    [featureName: string]: Treatment
  };
  /**
   * Feature flags treatments promise that resolves to the actual SplitIO.Treatments object.
   * @typedef {Promise<Treatments>} AsyncTreatments
   */
  type AsyncTreatments = Promise<Treatments>;
  /**
   * Feature flag evaluation result with treatment and configuration, returned by getTreatmentWithConfig.
   * @typedef {Object} TreatmentWithConfig
   * @property {string} treatment The treatment result
   * @property {string | null} config The stringified version of the JSON config defined for that treatment, null if there is no config for the resulting treatment.
   */
  type TreatmentWithConfig = {
    treatment: string,
    config: string | null
  };
  /**
   * Feature flag treatment promise that resolves to actual treatment with config value.
   * @typedef {Promise<TreatmentWithConfig>} AsyncTreatmentWithConfig
   */
  type AsyncTreatmentWithConfig = Promise<TreatmentWithConfig>;
  /**
   * An object with the treatments with configs for a bulk of feature flags, returned by getTreatmentsWithConfig.
   * Each existing configuration is a stringified version of the JSON you defined on the Split user interface. For example:
   *   {
   *     feature1: { treatment: 'on', config: null }
   *     feature2: { treatment: 'off', config: '{"bannerText":"Click here."}' }
   *   }
   * @typedef {Object.<TreatmentWithConfig>} Treatments
   */
  type TreatmentsWithConfig = {
    [featureName: string]: TreatmentWithConfig
  };
  /**
   * Feature flags treatments promise that resolves to the actual SplitIO.TreatmentsWithConfig object.
   * @typedef {Promise<TreatmentsWithConfig>} AsyncTreatmentsWithConfig
   */
  type AsyncTreatmentsWithConfig = Promise<TreatmentsWithConfig>;
  /**
   * Possible Split SDK events.
   * @typedef {string} Event
   */
  type Event = 'init::timeout' | 'init::ready' | 'init::cache-ready' | 'state::update';
  /**
   * Attributes should be on object with values of type string or number (dates should be sent as millis since epoch).
   * @typedef {Object.<AttributeType>} Attributes
   * @see {@link https://help.split.io/hc/en-us/articles/4406066357901#attribute-syntax}
   */
  type Attributes = {
    [attributeName: string]: AttributeType
  };
  /**
   * Type of an attribute value
   * @typedef {string | number | boolean | Array<string | number>} AttributeType
   */
  type AttributeType = string | number | boolean | Array<string | number>;
  /**
   * Properties should be an object with values of type string, number, boolean or null. Size limit of ~31kb.
   * @typedef {Object.<number, string, boolean, null>} Attributes
   * @see {@link https://help.split.io/hc/en-us/articles/4406066357901#track
   */
  type Properties = {
    [propertyName: string]: string | number | boolean | null
  };
  /**
   * The customer identifier represented by a string.
   * @typedef {string} SplitKey
   */
  type SplitKey = string;
  /**
   * Path to file with mocked features (for node).
   * @typedef {string} MockedFeaturesFilePath
   */
  type MockedFeaturesFilePath = string;
  /**
   * Object with mocked features mapping (for React Native). We need to specify the featureName as key, and the mocked treatment as value.
   * @typedef {Object} MockedFeaturesMap
   */
  type MockedFeaturesMap = {
    [featureName: string]: string | TreatmentWithConfig
  };
  /**
   * Object with information about an impression. It contains the generated impression DTO as well as
   * complementary information around where and how it was generated in that way.
   * @typedef {Object} ImpressionData
   */
  type ImpressionData = {
    impression: {
      feature: string,
      keyName: string,
      treatment: string,
      time: number,
      bucketingKey?: string,
      label: string,
      changeNumber: number,
      pt?: number,
    },
    attributes?: SplitIO.Attributes,
    ip: string,
    hostname: string,
    sdkLanguageVersion: string
  };
  /**
   * Data corresponding to one feature flag view.
   * @typedef {Object} SplitView
   */
  type SplitView = {
    /**
     * The name of the feature flag.
     * @property {string} name
     */
    name: string,
    /**
     * The traffic type of the feature flag.
     * @property {string} trafficType
     */
    trafficType: string,
    /**
     * Whether the feature flag is killed or not.
     * @property {boolean} killed
     */
    killed: boolean,
    /**
     * The list of treatments available for the feature flag.
     * @property {Array<string>} treatments
     */
    treatments: Array<string>,
    /**
     * Current change number of the feature flag.
     * @property {number} changeNumber
     */
    changeNumber: number,
    /**
     * Map of configurations per treatment.
     * Each existing configuration is a stringified version of the JSON you defined on the Split user interface.
     * @property {Object.<string>} configs
     */
    configs: {
      [treatmentName: string]: string
    },
    /**
     * List of sets of the feature flag.
     * @property {string[]} sets
     */
    sets: string[],
    /**
     * The default treatment of the feature flag.
     * @property {string} defaultTreatment
     */
    defaultTreatment: string,
  };
  /**
   * A promise that resolves to a feature flag view.
   * @typedef {Promise<SplitView>} SplitView
   */
  type SplitViewAsync = Promise<SplitView>;
  /**
   * An array containing the SplitIO.SplitView elements.
   */
  type SplitViews = Array<SplitView>;
  /**
   * A promise that resolves to an SplitIO.SplitViews array.
   * @typedef {Promise<SplitViews>} SplitViewsAsync
   */
  type SplitViewsAsync = Promise<SplitViews>;
  /**
   * An array of feature flag names.
   * @typedef {Array<string>} SplitNames
   */
  type SplitNames = Array<string>;
  /**
   * A promise that resolves to an array of feature flag names.
   * @typedef {Promise<SplitNames>} SplitNamesAsync
   */
  type SplitNamesAsync = Promise<SplitNames>;
  /**
   * Storage for synchronous (standalone) SDK.
   * Its interface details are not part of the public API.
   */
  type StorageSync = {};
  /**
   * Storage builder for synchronous (standalone) SDK.
   * By returning undefined, the SDK will use the default IN MEMORY storage.
   * Input parameter details are not part of the public API.
   */
  type StorageSyncFactory = {
    readonly type: StorageType
    (params: {}): (StorageSync | undefined)
  }
  /**
   * Impression listener interface. This is the interface that needs to be implemented
   * by the element you provide to the SDK as impression listener.
   * @interface IImpressionListener
   * @see {@link https://help.split.io/hc/en-us/articles/4406066357901#listener}
   */
  interface IImpressionListener {
    logImpression(data: SplitIO.ImpressionData): void
  }
  /**
   * SDK integration instance.
   * Its interface details are not part of the public API.
   */
  type Integration = {};
  /**
   * SDK integration factory.
   * By returning an integration, the SDK will queue events and impressions into it.
   * Input parameter details are not part of the public API.
   */
  type IntegrationFactory = {
    readonly type: string
    (params: {}): (Integration | void)
  }
  /**
   * A pair of user key and it's trafficType, required for tracking valid Split events.
   * @typedef {Object} Identity
   * @property {string} key The user key.
   * @property {string} trafficType The key traffic type.
   */
  type Identity = {
    key: string;
    trafficType: string;
  };
  /**
   * Object with information about a Split event.
   * @typedef {Object} EventData
   */
  type EventData = {
    eventTypeId: string;
    value?: number;
    properties?: Properties;
    trafficTypeName?: string;
    key?: string;
    timestamp?: number;
  };
  /**
   * Object representing the data sent by Split (events and impressions).
   * @typedef {Object} IntegrationData
   * @property {string} type The type of Split data, either 'IMPRESSION' or 'EVENT'.
   * @property {ImpressionData | EventData} payload The data instance itself.
   */
  type IntegrationData = { type: 'IMPRESSION', payload: SplitIO.ImpressionData } | { type: 'EVENT', payload: SplitIO.EventData };
  /**
   * Available URL settings for the SDKs.
   */
  type UrlSettings = {
    /**
     * String property to override the base URL where the SDK will get rollout plan related data, like feature flags and segments definitions.
     * @property {string} sdk
     * @default 'https://sdk.split.io/api'
     */
    sdk?: string,
    /**
     * String property to override the base URL where the SDK will post event-related information like impressions.
     * @property {string} events
     * @default 'https://events.split.io/api'
     */
    events?: string,
    /**
     * String property to override the base URL where the SDK will get authorization tokens to be used with functionality that requires it, like streaming.
     * @property {string} auth
     * @default 'https://auth.split.io/api'
     */
    auth?: string,
    /**
     * String property to override the base URL where the SDK will connect to receive streaming updates.
     * @property {string} streaming
     * @default 'https://streaming.split.io'
     */
    streaming?: string,
    /**
     * String property to override the base URL where the SDK will post telemetry data.
     * @property {string} telemetry
     * @default 'https://telemetry.split.io/api'
     */
    telemetry?: string
  };

  /**
   * SplitFilter type.
   *
   * @typedef {string} SplitFilterType
   */
  type SplitFilterType = 'bySet' | 'byName' | 'byPrefix';
  /**
   * Defines a feature flag filter, described by a type and list of values.
   */
  interface SplitFilter {
    /**
     * Type of the filter.
     *
     * @property {SplitFilterType} type
     */
    type: SplitFilterType,
    /**
     * List of values: feature flag names for 'byName' filter type, and feature flag name prefixes for 'byPrefix' type.
     *
     * @property {string[]} values
     */
    values: string[],
  }
  /**
  * ImpressionsMode type
  * @typedef {string} ImpressionsMode
  */
  type ImpressionsMode = 'OPTIMIZED' | 'DEBUG' | 'NONE';
  /**
   * User consent status.
   * @typedef {string} ConsentStatus
   */
  type ConsentStatus = 'GRANTED' | 'DECLINED' | 'UNKNOWN';
  /**
   * Logger
   * Its interface details are not part of the public API. It shouldn't be used directly.
   * @interface ILogger
   */
  interface ILogger {
    setLogLevel(logLevel: LogLevel): void
  }
  /**
   * Settings interface for SDK instances created on React Native.
   * @interface IReactNativeSettings
   * @extends ISharedSettings
   * @see {@link https://help.split.io/hc/en-us/articles/4406066357901#configuration}
   */
  interface IReactNativeSettings extends ISharedSettings {
    /**
     * SDK Startup settings for React Native.
     * @property {Object} startup
     */
    startup?: {
      /**
       * Maximum amount of time used before notify a timeout.
       * @property {number} readyTimeout
       * @default 1.5
       */
      readyTimeout?: number,
      /**
       * Time to wait for a request before the SDK is ready. If this time expires, JS Sdk will retry 'retriesOnFailureBeforeReady' times before notifying its failure to be 'ready'.
       * @property {number} requestTimeoutBeforeReady
       * @default 1.5
       */
      requestTimeoutBeforeReady?: number,
      /**
       * How many quick retries we will do while starting up the SDK.
       * @property {number} retriesOnFailureBeforeReady
       * @default 1
       */
      retriesOnFailureBeforeReady?: number,
      /**
       * For SDK posts the queued events data in bulks with a given rate, but the first push window is defined separately,
       * to better control on mobile. This number defines that window before the first events push.
       *
       * @property {number} eventsFirstPushWindow
       * @default 10
       */
      eventsFirstPushWindow?: number,
    },
    /**
     * SDK scheduler settings.
     * @property {Object} scheduler
     */
    scheduler?: {
      /**
       * The SDK polls Split servers for changes to feature flag definitions. This parameter controls this polling period in seconds.
       * @property {number} featuresRefreshRate
       * @default 60
       */
      featuresRefreshRate?: number,
      /**
       * The SDK sends information on who got what treatment at what time back to Split servers to power analytics. This parameter controls how often this data is sent to Split servers. The parameter should be in seconds.
       * @property {number} impressionsRefreshRate
       * @default 60
       */
      impressionsRefreshRate?: number,
      /**
       * The maximum number of impression items we want to queue. If we queue more values, it will trigger a flush and reset the timer.
       * If you use a 0 here, the queue will have no maximum size.
       * @property {number} impressionsQueueSize
       * @default 30000
       */
      impressionsQueueSize?: number,
      /**
       * The SDK sends diagnostic metrics to Split servers. This parameters controls this metric flush period in seconds.
       * @property {number} telemetryRefreshRate
       * @default 3600
       */
      telemetryRefreshRate?: number,
      /**
       * The SDK polls Split servers for changes to segment definitions. This parameter controls this polling period in seconds.
       * @property {number} segmentsRefreshRate
       * @default 60
       */
      segmentsRefreshRate?: number,
      /**
       * The SDK posts the queued events data in bulks. This parameter controls the posting rate in seconds.
       * @property {number} eventsPushRate
       * @default 60
       */
      eventsPushRate?: number,
      /**
       * The maximum number of event items we want to queue. If we queue more values, it will trigger a flush and reset the timer.
       * If you use a 0 here, the queue will have no maximum size.
       * @property {number} eventsQueueSize
       * @default 500
       */
      eventsQueueSize?: number,
      /**
       * For mocking/testing only. The SDK will refresh the features mocked data when mode is set to "localhost" by defining the key.
       * For more information see {@link https://help.split.io/hc/en-us/articles/4406066357901#localhost-mode}
       * @property {number} offlineRefreshRate
       * @default 15
       */
      offlineRefreshRate?: number,
      /**
       * When using streaming mode, seconds to wait before re attempting to connect for push notifications.
       * Next attempts follow intervals in power of two: base seconds, base x 2 seconds, base x 4 seconds, ...
       * @property {number} pushRetryBackoffBase
       * @default 1
       */
      pushRetryBackoffBase?: number,
    },
    /**
     * SDK Core settings for React Native.
     * @property {Object} core
     */
    core: {
      /**
       * Your SDK key.
       * @see {@link https://help.split.io/hc/en-us/articles/360019916211-API-keys}
       * @property {string} authorizationKey
       */
      authorizationKey: string,
      /**
       * Customer identifier. Whatever this means to you.
       * @see {@link https://help.split.io/hc/en-us/articles/360019916311-Traffic-type}
       * @property {SplitKey} key
       */
      key: SplitKey,
      /**
       * Disable labels from being sent to Split backend. Labels may contain sensitive information.
       * @property {boolean} labelsEnabled
       * @default true
       */
      labelsEnabled?: boolean
    },
    /**
     * Mocked features map. For testing purposes only. For using this you should specify "localhost" as authorizationKey on core settings.
     * @see {@link https://help.split.io/hc/en-us/articles/4406066357901#localhost-mode}
     */
    features?: MockedFeaturesMap,
    /**
     * Defines the factory function to instantiate the storage. If not provided, the default IN MEMORY storage is used.
     * @property {Object} storage
     * @todo at the moment there are not storages to plug in React Native SDK.
     */
    storage?: StorageSyncFactory,
    /**
     * List of URLs that the SDK will use as base for it's synchronization functionalities, applicable only when running as standalone.
     * Do not change these settings unless you're working an advanced use case, like connecting to the Split proxy.
     * @property {Object} urls
     */
    urls?: UrlSettings,
    /**
     * Defines an optional list of factory functions used to instantiate SDK integrations.
     * @property {Object} integrations
     * @todo at the moment there are not integrations to plug in React Native SDK.
     */
    integrations?: IntegrationFactory[],
    /**
     * User consent status. Possible values are `'GRANTED'`, which is the default, `'DECLINED'` or `'UNKNOWN'`.
     * - `'GRANTED'`: the user grants consent for tracking events and impressions. The SDK sends them to Split cloud.
     * - `'DECLINED'`: the user declines consent for tracking events and impressions. The SDK does not send them to Split cloud.
     * - `'UNKNOWN'`: the user neither grants nor declines consent for tracking events and impressions. The SDK tracks them in its internal storage, and eventually either sends
     * them or not if the consent status is updated to 'GRANTED' or 'DECLINED' respectively. The status can be updated at any time with the `UserConsent.setStatus` factory method.
     *
     * @typedef {string} userConsent
     * @default 'GRANTED'
     */
    userConsent?: ConsentStatus
  }
  /**
   * This represents the interface for the SDK instance with synchronous storage and client-side API,
   * i.e., where client instances have a bound user key.
   * @interface ISDK
   * @extends IBasicSDK
   */
  export interface ISDK extends IBasicSDK {
    /**
     * Returns the default client instance of the SDK, associated with the key provided on settings.
     * @function client
     * @returns {IClient} The client instance.
     */
    client(): IClient,
    /**
     * Returns a shared client of the SDK, associated with the given key.
     * @function client
     * @param {SplitKey} key The key for the new client instance.
     * @returns {IClient} The client instance.
     */
    client(key: SplitKey): IClient,
    /**
     * Returns a manager instance of the SDK to explore available information.
     * @function manager
     * @returns {IManager} The manager instance.
     */
    manager(): IManager,
    /**
     * User consent API.
     * @property UserConsent
     */
    UserConsent: IUserConsentAPI
  }

  /**
   * This represents the interface for the Client instance with synchronous storage for server-side SDK, where we don't have only one key.
   * @interface IClient
   * @extends IBasicClient
   */
  interface IClientSS extends IBasicClient {
    /**
     * Returns a Treatment value, which is the treatment string for the given feature.
     * @function getTreatment
     * @param {string} key - The string key representing the consumer.
     * @param {string} featureFlagName - The string that represents the feature flag we want to get the treatment.
     * @param {Attributes=} attributes - An object of type Attributes defining the attributes for the given key.
     * @returns {Treatment} The treatment string.
     */
    getTreatment(key: SplitKey, featureFlagName: string, attributes?: Attributes): Treatment,
    /**
     * Returns a TreatmentWithConfig value, which is an object with both treatment and config string for the given feature.
     * @function getTreatmentWithConfig
     * @param {string} key - The string key representing the consumer.
     * @param {string} featureFlagName - The string that represents the feature flag we want to get the treatment.
     * @param {Attributes=} attributes - An object of type Attributes defining the attributes for the given key.
     * @returns {TreatmentWithConfig} The TreatmentWithConfig, the object containing the treatment string and the
     *                                configuration stringified JSON (or null if there was no config for that treatment).
     */
    getTreatmentWithConfig(key: SplitKey, featureFlagName: string, attributes?: Attributes): TreatmentWithConfig,
    /**
     * Returns a Treatments value, which is an object map with the treatments for the given features.
     * @function getTreatments
     * @param {string} key - The string key representing the consumer.
     * @param {Array<string>} featureFlagNames - An array of the feature flag names we want to get the treatments.
     * @param {Attributes=} attributes - An object of type Attributes defining the attributes for the given key.
     * @returns {Treatments} The treatments object map.
     */
    getTreatments(key: SplitKey, featureFlagNames: string[], attributes?: Attributes): Treatments,
    /**
     * Returns a TreatmentsWithConfig value, which is an object map with the TreatmentWithConfig (an object with both treatment and config string) for the given features.
     * @function getTreatmentsWithConfig
     * @param {string} key - The string key representing the consumer.
     * @param {Array<string>} featureFlagNames - An array of the feature flag names we want to get the treatments.
     * @param {Attributes=} attributes - An object of type Attributes defining the attributes for the given key.
     * @returns {TreatmentsWithConfig} The map with all the TreatmentWithConfig objects
     */
    getTreatmentsWithConfig(key: SplitKey, featureFlagNames: string[], attributes?: Attributes): TreatmentsWithConfig,
    /**
   * Returns a Treatments value, which is an object map with the treatments for the feature flags related to the given flag set.
   * @function getTreatmentsByFlagSet
   * @param {string} key - The string key representing the consumer.
   * @param {string} flagSet - The flag set name we want to get the treatments.
   * @param {Attributes=} attributes - An object of type Attributes defining the attributes for the given key.
   * @returns {Treatments} The map with all the Treatment objects
   */
    getTreatmentsByFlagSet(key: SplitKey, flagSet: string, attributes?: Attributes): Treatments,
    /**
     * Returns a TreatmentsWithConfig value, which is an object map with the TreatmentWithConfig (an object with both treatment and config string) for the feature flags related to the given flag set.
     * @function getTreatmentsWithConfigByFlagSet
     * @param {string} key - The string key representing the consumer.
     * @param {string} flagSet - The flag set name we want to get the treatments.
     * @param {Attributes=} attributes - An object of type Attributes defining the attributes for the given key.
     * @returns {TreatmentsWithConfig} The map with all the TreatmentWithConfig objects
     */
    getTreatmentsWithConfigByFlagSet(key: SplitKey, flagSet: string, attributes?: Attributes): TreatmentsWithConfig,
    /**
     * Returns a Treatments value, which is an object with both treatment and config string for to the feature flags related to the given flag sets.
     * @function getTreatmentsByFlagSets
     * @param {string} key - The string key representing the consumer.
     * @param {Array<string>} flagSets - An array of the flag set names we want to get the treatments.
     * @param {Attributes=} attributes - An object of type Attributes defining the attributes for the given key.
     * @returns {Treatments} The map with all the Treatment objects
     */
    getTreatmentsByFlagSets(key: SplitKey, flagSets: string[], attributes?: Attributes): Treatments,
    /**
     * Returns a TreatmentsWithConfig value, which is an object map with the TreatmentWithConfig (an object with both treatment and config string) for the feature flags related to the given flag sets.
     * @function getTreatmentsWithConfigByFlagSets
     * @param {string} key - The string key representing the consumer.
     * @param {Array<string>} flagSets - An array of the flag set names we want to get the treatments.
     * @param {Attributes=} attributes - An object of type Attributes defining the attributes for the given key.
     * @returns {TreatmentsWithConfig} The map with all the TreatmentWithConfig objects
     */
    getTreatmentsWithConfigByFlagSets(key: SplitKey, flagSets: string[], attributes?: Attributes): TreatmentsWithConfig,
    /**
     * Tracks an event to be fed to the results product on Split user interface.
     * @function track
     * @param {SplitKey} key - The key that identifies the entity related to this event.
     * @param {string} trafficType - The traffic type of the entity related to this event.
     * @param {string} eventType - The event type corresponding to this event.
     * @param {number=} value - The value of this event.
     * @param {Properties=} properties - The properties of this event. Values can be string, number, boolean or null.
     * @returns {boolean} Whether the event was added to the queue successfully or not.
     */
    track(key: SplitIO.SplitKey, trafficType: string, eventType: string, value?: number, properties?: Properties): boolean,
  }
  /**
   * This represents the interface for the Client instance with asynchronous storage for server-side SDK, where we don't have only one key.
   * @interface IAsyncClientSS
   * @extends IBasicClient
   */
  interface IAsyncClientSS extends IBasicClient {
    /**
     * Returns a Treatment value, which will be (or eventually be) the treatment string for the given feature.
     * For usage on NodeJS as we don't have only one key.
     * NOTE: Treatment will be a promise only in async storages, like REDIS.
     * @function getTreatment
     * @param {string} key - The string key representing the consumer.
     * @param {string} featureFlagName - The string that represents the feature flag we want to get the treatment.
     * @param {Attributes=} attributes - An object of type Attributes defining the attributes for the given key.
     * @returns {AsyncTreatment} Treatment promise that resolves to the treatment string.
     */
    getTreatment(key: SplitKey, featureFlagName: string, attributes?: Attributes): AsyncTreatment,
    /**
     * Returns a TreatmentWithConfig value, which will be (or eventually be) an object with both treatment and config string for the given feature.
     * For usage on NodeJS as we don't have only one key.
     * NOTE: Treatment will be a promise only in async storages, like REDIS.
     * @function getTreatmentWithConfig
     * @param {string} key - The string key representing the consumer.
     * @param {string} featureFlagName - The string that represents the feature flag we want to get the treatment.
     * @param {Attributes=} attributes - An object of type Attributes defining the attributes for the given key.
     * @returns {AsyncTreatmentWithConfig} TreatmentWithConfig promise that resolves to the TreatmentWithConfig object.
     */
    getTreatmentWithConfig(key: SplitKey, featureFlagName: string, attributes?: Attributes): AsyncTreatmentWithConfig,
    /**
     * Returns a Treatments value, which will be (or eventually be) an object map with the treatments for the given features.
     * For usage on NodeJS as we don't have only one key.
     * @function getTreatments
     * @param {string} key - The string key representing the consumer.
     * @param {Array<string>} featureFlagNames - An array of the feature flag names we want to get the treatments.
     * @param {Attributes=} attributes - An object of type Attributes defining the attributes for the given key.
     * @returns {AsyncTreatments} Treatments promise that resolves to the treatments object map.
     */
    getTreatments(key: SplitKey, featureFlagNames: string[], attributes?: Attributes): AsyncTreatments,
    /**
     * Returns a TreatmentsWithConfig value, which will be (or eventually be) an object map with the TreatmentWithConfig (an object with both treatment and config string) for the given features.
     * For usage on NodeJS as we don't have only one key.
     * @function getTreatmentsWithConfig
     * @param {string} key - The string key representing the consumer.
     * @param {Array<string>} featureFlagNames - An array of the feature flag names we want to get the treatments.
     * @param {Attributes=} attributes - An object of type Attributes defining the attributes for the given key.
     * @returns {AsyncTreatmentsWithConfig} TreatmentsWithConfig promise that resolves to the map of TreatmentsWithConfig objects.
     */
    getTreatmentsWithConfig(key: SplitKey, featureFlagNames: string[], attributes?: Attributes): AsyncTreatmentsWithConfig,
    /**
     * Returns a Treatments value, which is an object map with the treatments for the feature flags related to the given flag set.
     * For usage on NodeJS as we don't have only one key.
     * @function getTreatmentsByFlagSet
     * @param {string} key - The string key representing the consumer.
     * @param {string} flagSet - The flag set name we want to get the treatments.
     * @param {Attributes=} attributes - An object of type Attributes defining the attributes for the given key.
     * @returns {AsyncTreatments} Treatments promise that resolves to the treatments object map.
     */
    getTreatmentsByFlagSet(key: SplitKey, flagSet: string, attributes?: Attributes): AsyncTreatments,
    /**
     * Returns a TreatmentsWithConfig value, which is an object map with the TreatmentWithConfig (an object with both treatment and config string) for the feature flags related to the given flag set.
     * For usage on NodeJS as we don't have only one key.
     * @function getTreatmentsWithConfigByFlagSet
     * @param {string} key - The string key representing the consumer.
     * @param {string} flagSet - The flag set name we want to get the treatments.
     * @param {Attributes=} attributes - An object of type Attributes defining the attributes for the given key.
     * @returns {AsyncTreatmentsWithConfig} TreatmentsWithConfig promise that resolves to the map of TreatmentsWithConfig objects.
     */
    getTreatmentsWithConfigByFlagSet(key: SplitKey, flagSet: string, attributes?: Attributes): AsyncTreatmentWithConfig,
    /**
     * Returns a Treatments value, which is an object with both treatment and config string for to the feature flags related to the given flag sets.
     * For usage on NodeJS as we don't have only one key.
     * @function getTreatmentsByFlagSets
     * @param {string} key - The string key representing the consumer.
     * @param {Array<string>} flagSets - An array of the flag set names we want to get the treatments.
     * @param {Attributes=} attributes - An object of type Attributes defining the attributes for the given key.
     * @returns {AsyncTreatments} Treatments promise that resolves to the treatments object map.
     */
    getTreatmentsByFlagSets(key: SplitKey, flagSets: string[], attributes?: Attributes): AsyncTreatments,
    /**
     * Returns a TreatmentsWithConfig value, which is an object map with the TreatmentWithConfig (an object with both treatment and config string) for the feature flags related to the given flag sets.
     * For usage on NodeJS as we don't have only one key.
     * @function getTreatmentsWithConfigByFlagSets
     * @param {string} key - The string key representing the consumer.
     * @param {Array<string>} flagSets - An array of the flag set names we want to get the treatments.
     * @param {Attributes=} attributes - An object of type Attributes defining the attributes for the given key.
     * @returns {AsyncTreatmentsWithConfig} TreatmentsWithConfig promise that resolves to the map of TreatmentsWithConfig objects.
     */
    getTreatmentsWithConfigByFlagSets(key: SplitKey, flagSets: string[], attributes?: Attributes): AsyncTreatmentWithConfig,
    /**
     * Tracks an event to be fed to the results product on Split user interface, and returns a promise to signal when the event was successfully queued (or not).
     * @function track
     * @param {SplitKey} key - The key that identifies the entity related to this event.
     * @param {string} trafficType - The traffic type of the entity related to this event.
     * @param {string} eventType - The event type corresponding to this event.
     * @param {number=} value - The value of this event.
     * @param {Properties=} properties - The properties of this event. Values can be string, number, boolean or null.
     * @returns {Promise<boolean>} A promise that resolves to a boolean indicating if the event was added to the queue successfully or not.
     */
    track(key: SplitIO.SplitKey, trafficType: string, eventType: string, value?: number, properties?: Properties): Promise<boolean>
  }
  /**
   * This represents the interface for the Client instance with synchronous storage for client-side SDK, where each client has associated a key.
   * @interface IClient
   * @extends IBasicClient
   */
  interface IClient extends IBasicClient {
    /**
     * Returns a Treatment value, which is the treatment string for the given feature.
     * @function getTreatment
     * @param {string} featureFlagName - The string that represents the feature flag we want to get the treatment.
     * @param {Attributes=} attributes - An object of type Attributes defining the attributes for the given key.
     * @returns {Treatment} The treatment string.
     */
    getTreatment(featureFlagName: string, attributes?: Attributes): Treatment,
    /**
     * Returns a TreatmentWithConfig value, which is an object with both treatment and config string for the given feature.
     * @function getTreatmentWithConfig
     * @param {string} featureFlagName - The string that represents the feature flag we want to get the treatment.
     * @param {Attributes=} attributes - An object of type Attributes defining the attributes for the given key.
     * @returns {TreatmentWithConfig} The map containing the treatment and the configuration stringified JSON (or null if there was no config for that treatment).
     */
    getTreatmentWithConfig(featureFlagName: string, attributes?: Attributes): TreatmentWithConfig,
    /**
     * Returns a Treatments value, which is an object map with the treatments for the given features.
     * @function getTreatments
     * @param {Array<string>} featureFlagNames - An array of the feature flag names we want to get the treatments.
     * @param {Attributes=} attributes - An object of type Attributes defining the attributes for the given key.
     * @returns {Treatments} The treatments object map.
     */
    getTreatments(featureFlagNames: string[], attributes?: Attributes): Treatments,
    /**
     * Returns a TreatmentsWithConfig value, which is an object map with the TreatmentWithConfig (an object with both treatment and config string) for the given features.
     * @function getTreatmentsWithConfig
     * @param {Array<string>} featureFlagNames - An array of the feature flag names we want to get the treatments.
     * @param {Attributes=} attributes - An object of type Attributes defining the attributes for the given key.
     * @returns {TreatmentsWithConfig} The map with all the TreatmentWithConfig objects
     */
    getTreatmentsWithConfig(featureFlagNames: string[], attributes?: Attributes): TreatmentsWithConfig,
    /**
     * Returns a Treatments value, which is an object map with the treatments for the feature flags related to the given flag set.
     * @function getTreatmentsByFlagSet
     * @param {string} flagSet - The flag set name we want to get the treatments.
     * @param {Attributes=} attributes - An object of type Attributes defining the attributes for the given key.
     * @returns {Treatments} The map with all the Treatments objects
     */
    getTreatmentsByFlagSet(flagSet: string, attributes?: Attributes): Treatments,
    /**
     * Returns a TreatmentsWithConfig value, which is an object map with the TreatmentWithConfig (an object with both treatment and config string) for the feature flags related to the given flag set.
     * @function getTreatmentsWithConfigByFlagSet
     * @param {string} flagSet - The flag set name we want to get the treatments.
     * @param {Attributes=} attributes - An object of type Attributes defining the attributes for the given key.
     * @returns {TreatmentsWithConfig} The map with all the TreatmentWithConfig objects
     */
    getTreatmentsWithConfigByFlagSet(flagSet: string, attributes?: Attributes): TreatmentsWithConfig,
    /**
     * Returns a Returns a Treatments value, which is an object with both treatment and config string for to the feature flags related to the given flag sets.
     * @function getTreatmentsByFlagSets
     * @param {Array<string>} flagSets - An array of the flag set names we want to get the treatments.
     * @param {Attributes=} attributes - An object of type Attributes defining the attributes for the given key.
     * @returns {Treatments} The map with all the Treatments objects
     */
    getTreatmentsByFlagSets(flagSets: string[], attributes?: Attributes): Treatments,
    /**
     * Returns a TreatmentsWithConfig value, which is an object map with the TreatmentWithConfig (an object with both treatment and config string) for the feature flags related to the given flag sets.
     * @function getTreatmentsWithConfigByFlagSets
     * @param {Array<string>} flagSets - An array of the flag set names we want to get the treatments.
     * @param {Attributes=} attributes - An object of type Attributes defining the attributes for the given key.
     * @returns {TreatmentsWithConfig} The map with all the TreatmentWithConfig objects
     */
    getTreatmentsWithConfigByFlagSets(flagSets: string[], attributes?: Attributes): TreatmentsWithConfig,
    /**
     * Tracks an event to be fed to the results product on Split user interface.
     * @function track
     * @param {string} trafficType - The traffic type of the entity related to this event.
     * @param {string} eventType - The event type corresponding to this event.
     * @param {number=} value - The value of this event.
     * @param {Properties=} properties - The properties of this event. Values can be string, number, boolean or null.
     * @returns {boolean} Whether the event was added to the queue successfully or not.
     */
    track(trafficType: string, eventType: string, value?: number, properties?: Properties): boolean,
    /**
     * Add an attribute to client's in memory attributes storage.
     *
     * @param {string} attributeName Attribute name
     * @param {AttributeType} attributeValue Attribute value
     * @returns {boolean} true if the attribute was stored and false otherwise
     */
    setAttribute(attributeName: string, attributeValue: AttributeType): boolean,
    /**
     * Returns the attribute with the given name.
     *
     * @param {string} attributeName Attribute name
     * @returns {AttributeType} Attribute with the given name
     */
    getAttribute(attributeName: string): AttributeType,
    /**
     * Removes from client's in memory attributes storage the attribute with the given name.
     *
     * @param {string} attributeName
     * @returns {boolean} true if attribute was removed and false otherwise
     */
    removeAttribute(attributeName: string): boolean,
    /**
     * Add to client's in memory attributes storage the attributes in 'attributes'.
     *
     * @param {Attributes} attributes Object with attributes to store
     * @returns true if attributes were stored an false otherwise
     */
    setAttributes(attributes: Attributes): boolean,
    /**
     * Return all the attributes stored in client's in memory attributes storage.
     *
     * @returns {Attributes} returns all the stored attributes
     */
    getAttributes(): Attributes,
    /**
     * Remove all the stored attributes in the client's in memory attribute storage.
     *
     * @returns {boolean} true if all attribute were removed and false otherwise
     */
    clearAttributes(): boolean,
  }
  /**
   * Representation of a manager instance with synchronous storage of the SDK.
   * @interface IManager
   * @extends IStatusInterface
   */
  interface IManager extends IStatusInterface {
    /**
     * Get the array of feature flag names.
     * @function names
     * @returns {SplitNames} The list of feature flag names.
     */
    names(): SplitNames,
    /**
     * Get the array of feature flags data in SplitView format.
     * @function splits
     * @returns {SplitViews} The list of SplitIO.SplitView.
     */
    splits(): SplitViews,
    /**
     * Get the data of a split in SplitView format.
     * @function split
     * @param {string} featureFlagName The name of the feature flag we want to get info of.
     * @returns {SplitView} The SplitIO.SplitView of the given split.
     */
    split(featureFlagName: string): SplitView,
  }
  /**
   * Representation of a manager instance with asynchronous storage of the SDK.
   * @interface IAsyncManager
   * @extends IStatusInterface
   */
  interface IAsyncManager extends IStatusInterface {
    /**
     * Get the array of feature flag names.
     * @function names
     * @returns {SplitNamesAsync} A promise that resolves to the list of feature flag names.
     */
    names(): SplitNamesAsync,
    /**
     * Get the array of feature flags data in SplitView format.
     * @function splits
     * @returns {SplitViewsAsync} A promise that resolves to the SplitIO.SplitView list.
     */
    splits(): SplitViewsAsync,
    /**
     * Get the data of a split in SplitView format.
     * @function split
     * @param {string} featureFlagName The name of the feature flag we want to get info of.
     * @returns {SplitViewAsync} A promise that resolves to the SplitIO.SplitView value.
     */
    split(featureFlagName: string): SplitViewAsync,
  }
}

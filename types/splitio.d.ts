// Type definitions for React Native Split Software SDK v1.0.0
// Project: http://www.split.io/
// Definitions by: Nico Zelaya <https://github.com/NicoZelaya/>

/// <reference types="google.analytics" />

export as namespace SplitIO;
export = SplitIO;

/**
 * EventEmitter interface based on a subset of the NodeJS.EventEmitter methods.
 */
interface IEventEmitter {
  addListener(event: string, listener: (...args: any[]) => void): this;
  on(event: string, listener: (...args: any[]) => void): this
  once(event: string, listener: (...args: any[]) => void): this
  removeListener(event: string, listener: (...args: any[]) => void): this;
  off(event: string, listener: (...args: any[]) => void): this;
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
 * Settings interface. This is a representation of the settings the SDK expose, that's why
 * it's props are readonly.
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
    segmentsRefreshRate: number,
    eventsPushRate: number,
    eventsQueueSize: number,
    pushRetryBackoffBase: number,
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
    streaming: string
  },
  readonly integrations?: SplitIO.IntegrationFactory[],
  readonly debug: boolean | LogLevel | SplitIO.ILogger,
  readonly version: string,
  readonly streamingEnabled: boolean,
  readonly sync: {
    splitFilters: SplitIO.SplitFilter[],
    impressionsMode: SplitIO.ImpressionsMode,
  }
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
    [level: string]: LogLevel
  }
}
/**
 * Common settings between React Native, Browser and NodeJS settings interface.
 * @interface ISharedSettings
 */
interface ISharedSettings {
  /**
   * Boolean value to indicate whether the logger should be enabled or disabled by default, or a Logger object.
   * Passing a logger object is required to get descriptive log messages. Otherwise most logs will print with message codes.
   * @see {@link https://help.split.io/hc/en-us/articles/360058730852#logging}
   *
   * @property {boolean | ILogger} debug
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
     * List of Split filters. These filters are used to fetch a subset of the Splits definitions in your environment, in order to reduce the delay of the SDK to be ready.
     * This configuration is only meaningful when the SDK is working in "standalone" mode.
     *
     * At the moment, two types of split filters are supported: by name and by prefix.
     * Example:
     *  `splitFilter: [
     *    { type: 'byName', values: ['my_split_1', 'my_split_2'] }, // will fetch splits named 'my_split_1' and 'my_split_2'
     *    { type: 'byPrefix', values: ['testing'] } // will fetch splits whose names start with 'testing__' prefix
     *  ]`
     * @property {SplitIO.SplitFilter[]} splitFilters
     */
    splitFilters?: SplitIO.SplitFilter[]
    /**
     * Impressions Collection Mode. Option to determine how impressions are going to be sent to Split Servers.
     * Possible values are 'DEBUG' and 'OPTIMIZED'.
     * - DEBUG: will send all the impressions generated (recommended only for debugging purposes).
     * - OPTIMIZED: will send unique impressions to Split Servers avoiding a considerable amount of traffic that duplicated impressions could generate.
     * @property {String} impressionsMode
     * @default 'OPTIMIZED'
     */
    impressionsMode?: SplitIO.ImpressionsMode,
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
   * Returns a promise that will be resolved once the SDK has finished loading (SDK_READY event emitted) or rejected if the SDK has timedout (SDK_READY_TIMED_OUT event emitted).
   * As it's meant to provide similar flexibility to the event approach, given that the SDK might be eventually ready after a timeout event, calling the `ready` method after the
   * SDK had timed out will return a new promise that should eventually resolve if the SDK gets ready.
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
   * Destroy the client instance.
   * @function destroy
   * @returns {Promise<void>}
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
  Logger: ILoggerAPI
}
/****** Exposed namespace ******/
/**
 * Types and interfaces for @splitsoftware/splitio-react-native package for usage when integrating React Native SDK on typescript apps.
 * For the SDK package information
 * @see {@link https://www.npmjs.com/package/@splitsoftware/splitio-react-native}
 */
declare namespace SplitIO {
  /**
   * Split treatment value, returned by getTreatment.
   * @typedef {string} Treatment
   */
  type Treatment = string;
  /**
   * Split treatment promise that will resolve to actual treatment value.
   * @typedef {Promise<string>} AsyncTreatment
   */
  type AsyncTreatment = Promise<string>;
  /**
   * An object with the treatments for a bulk of splits, returned by getTreatments. For example:
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
   * Split treatments promise that will resolve to the actual SplitIO.Treatments object.
   * @typedef {Promise<Treatments>} AsyncTreatments
   */
  type AsyncTreatments = Promise<Treatments>;
  /**
   * Split evaluation result with treatment and configuration, returned by getTreatmentWithConfig.
   * @typedef {Object} TreatmentWithConfig
   * @property {string} treatment The treatment result
   * @property {string | null} config The stringified version of the JSON config defined for that treatment, null if there is no config for the resulting treatment.
   */
  type TreatmentWithConfig = {
    treatment: string,
    config: string | null
  };
  /**
   * Split treatment promise that will resolve to actual treatment with config value.
   * @typedef {Promise<TreatmentWithConfig>} AsyncTreatmentWithConfig
   */
  type AsyncTreatmentWithConfig = Promise<TreatmentWithConfig>;
  /**
   * An object with the treatments with configs for a bulk of splits, returned by getTreatmentsWithConfig.
   * Each existing configuration is a stringified version of the JSON you defined on the Split web console. For example:
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
   * Split treatments promise that will resolve to the actual SplitIO.TreatmentsWithConfig object.
   * @typedef {Promise<TreatmentsWithConfig>} AsyncTreatmentsWithConfig
   */
  type AsyncTreatmentsWithConfig = Promise<TreatmentsWithConfig>;
  /**
   * Possible Split SDK events.
   * @typedef {string} Event
   */
  type Event = 'init::timeout' | 'init::ready' | 'init::cache-ready' | 'state::update';
  /**
   * Split attributes should be on object with values of type string or number (dates should be sent as millis since epoch).
   * @typedef {Object.<number, string, boolean, string[], number[]>} Attributes
   * @see {@link https://help.split.io/hc/en-us/articles/360058730852#attribute-syntax}
   */
  type Attributes = {
    [attributeName: string]: string | number | boolean | Array<string | number>
  };
  /**
   * Split properties should be an object with values of type string, number, boolean or null. Size limit of ~31kb.
   * @typedef {Object.<number, string, boolean, null>} Attributes
   * @see {@link https://help.split.io/hc/en-us/articles/360058730852#track
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
   * Data corresponding to one Split view.
   * @typedef {Object} SplitView
   */
  type SplitView = {
    /**
     * The name of the split.
     * @property {string} name
     */
    name: string,
    /**
     * The traffic type of the split.
     * @property {string} trafficType
     */
    trafficType: string,
    /**
     * Whether the split is killed or not.
     * @property {boolean} killed
     */
    killed: boolean,
    /**
     * The list of treatments available for the split.
     * @property {Array<string>} treatments
     */
    treatments: Array<string>,
    /**
     * Current change number of the split.
     * @property {number} changeNumber
     */
    changeNumber: number,
    /**
     * Map of configurations per treatment.
     * Each existing configuration is a stringified version of the JSON you defined on the Split web console.
     * @property {Object.<string>} configs
     */
    configs: {
      [treatmentName: string]: string
    }
  };
  /**
   * A promise that will be resolved with that SplitView.
   * @typedef {Promise<SplitView>} SplitView
   */
  type SplitViewAsync = Promise<SplitView>;
  /**
   * An array containing the SplitIO.SplitView elements.
   */
  type SplitViews = Array<SplitView>;
  /**
   * A promise that will be resolved with an SplitIO.SplitViews array.
   * @typedef {Promise<SplitViews>} SplitViewsAsync
   */
  type SplitViewsAsync = Promise<SplitViews>;
  /**
   * An array of split names.
   * @typedef {Array<string>} SplitNames
   */
  type SplitNames = Array<string>;
  /**
   * A promise that will be resolved with an array of split names.
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
  type StorageSyncFactory = (params: {}) => (StorageSync | undefined)
  /**
   * Impression listener interface. This is the interface that needs to be implemented
   * by the element you provide to the SDK as impression listener.
   * @interface IImpressionListener
   * @see {@link https://help.split.io/hc/en-us/articles/360058730852#listener}
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
  type IntegrationFactory = (params: {}) => (Integration | void)
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
     * String property to override the base URL where the SDK will get feature flagging related data like a Split rollout plan or segments information.
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
    streaming?: string
  };

  /**
   * SplitFilter type.
   * @typedef {string} SplitFilterType
   */
  type SplitFilterType = 'byName' | 'byPrefix';
  /**
   * Defines a split filter, described by a type and list of values.
   */
  interface SplitFilter {
    /**
     * Type of the filter.
     * @property {SplitFilterType} type
     */
    type: SplitFilterType,
    /**
     * List of values: split names for 'byName' filter type, and split prefixes for 'byPrefix' type.
     * @property {string[]} values
     */
    values: string[],
  }
  /**
  * ImpressionsMode type
  * @typedef {string} ImpressionsMode
  */
  type ImpressionsMode = 'OPTIMIZED' | 'DEBUG';
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
   * @see {@link https://help.split.io/hc/en-us/articles/360058730852#configuration}
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
       * The SDK polls Split servers for changes to feature roll-out plans. This parameter controls this polling period in seconds.
       * @property {number} featuresRefreshRate
       * @default 30
       */
      featuresRefreshRate?: number,
      /**
       * The SDK sends information on who got what treatment at what time back to Split servers to power analytics. This parameter controls how often this data is sent to Split servers. The parameter should be in seconds.
       * @property {number} impressionsRefreshRate
       * @default 60
       */
      impressionsRefreshRate?: number,
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
       * Your API key. More information: @see {@link https://help.split.io/hc/en-us/articles/360019916211-API-keys}
       * @property {string} authorizationKey
       */
      authorizationKey: string,
      /**
       * Customer identifier. Whatever this means to you. @see {@link https://help.split.io/hc/en-us/articles/360019916311-Traffic-type}
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
     * Defines the factory function to instanciate the storage. If not provided, the default IN MEMORY storage is used.
     * @property {Object} storage
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
     */
    integrations?: IntegrationFactory[],
  }
  /**
   * This represents the interface for the SDK instance with synchronous storage and client-side API,
   * i.e., where client instances have a bound user key.
   * @interface ISDK
   * @extends IBasicSDK
   */
  export interface ISDK extends IBasicSDK {
    /**
     * Returns the default client instance of the SDK, associated with the key and optional traffic type from settings.
     * @function client
     * @returns {IClient} The client instance.
     */
    client(): IClient,
    /**
     * Returns a shared client of the SDK, associated with the given key and optional traffic type.
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
    manager(): IManager
  }

  /**
   * This represents the interface for the Client instance with synchronous storage for server-side SDK, where we don't have only one key.
   * @interface IClient
   * @extends IBasicClient
   */
  interface IClientSS extends IBasicClient {
    /**
     * Returns a Treatment value, which will be (or eventually be) the treatment string for the given feature.
     * @function getTreatment
     * @param {string} key - The string key representing the consumer.
     * @param {string} splitName - The string that represents the split we wan't to get the treatment.
     * @param {Attributes=} attributes - An object of type Attributes defining the attributes for the given key.
     * @returns {Treatment} The treatment or treatment promise which will resolve to the treatment string.
     */
    getTreatment(key: SplitKey, splitName: string, attributes?: Attributes): Treatment,
    /**
     * Returns a TreatmentWithConfig value (a map of treatment and config), which will be (or eventually be) the map with treatment and config for the given feature.
     * @function getTreatmentWithConfig
     * @param {string} key - The string key representing the consumer.
     * @param {string} splitName - The string that represents the split we wan't to get the treatment.
     * @param {Attributes=} attributes - An object of type Attributes defining the attributes for the given key.
     * @returns {TreatmentWithConfig} The TreatmentWithConfig or TreatmentWithConfig promise which will resolve to the map containing
     *                                the treatment and the configuration stringified JSON (or null if there was no config for that treatment).
     */
    getTreatmentWithConfig(key: SplitKey, splitName: string, attributes?: Attributes): TreatmentWithConfig,
    /**
     * Returns a Treatments value, whick will be (or eventually be) an object with the treatments for the given features.
     * @function getTreatments
     * @param {string} key - The string key representing the consumer.
     * @param {Array<string>} splitNames - An array of the split names we wan't to get the treatments.
     * @param {Attributes=} attributes - An object of type Attributes defining the attributes for the given key.
     * @returns {Treatments} The treatments or treatments promise which will resolve to the treatments object.
     */
    getTreatments(key: SplitKey, splitNames: string[], attributes?: Attributes): Treatments,
    /**
     * Returns a TreatmentsWithConfig value, whick will be an object with the TreatmentWithConfig (a map with both treatment and config string) for the given features.
     * @function getTreatmentsWithConfig
     * @param {string} key - The string key representing the consumer.
     * @param {Array<string>} splitNames - An array of the split names we wan't to get the treatments.
     * @param {Attributes=} attributes - An object of type Attributes defining the attributes for the given key.
     * @returns {TreatmentsWithConfig} The map with all the TreatmentWithConfig objects
     */
    getTreatmentsWithConfig(key: SplitKey, splitNames: string[], attributes?: Attributes): TreatmentsWithConfig,
    /**
     * Tracks an event to be fed to the results product on Split Webconsole.
     * @function track
     * @param {SplitKey} key - The key that identifies the entity related to this event.
     * @param {string} trafficType - The traffic type of the entity related to this event.
     * @param {string} eventType - The event type corresponding to this event.
     * @param {number=} value - The value of this event.
     * @param {Properties=} properties - The properties of this event. Values can be string, number, boolean or null.
     * @returns {boolean} Whether the event was added to the queue succesfully or not.
     */
    track(key: SplitIO.SplitKey, trafficType: string, eventType: string, value?: number, properties?: Properties): boolean,
  }
  /**
   * This represents the interface for the Client instance with asynchronous storage for server-side SDK, where we don't have only one key.
   * @interface IAsyncClient
   * @extends IBasicClient
   */
  interface IAsyncClientSS extends IBasicClient {
    /**
     * Returns a Treatment value, which will be (or eventually be) the treatment string for the given feature.
     * For usage on NodeJS as we don't have only one key.
     * NOTE: Treatment will be a promise only in async storages, like REDIS.
     * @function getTreatment
     * @param {string} key - The string key representing the consumer.
     * @param {string} splitName - The string that represents the split we wan't to get the treatment.
     * @param {Attributes=} attributes - An object of type Attributes defining the attributes for the given key.
     * @returns {AsyncTreatment} Treatment promise which will resolve to the treatment string.
     */
    getTreatment(key: SplitKey, splitName: string, attributes?: Attributes): AsyncTreatment,
    /**
     * Returns a TreatmentWithConfig value, which will be (or eventually be) a map with both treatment and config string for the given feature.
     * For usage on NodeJS as we don't have only one key.
     * NOTE: Treatment will be a promise only in async storages, like REDIS.
     * @function getTreatmentWithConfig
     * @param {string} key - The string key representing the consumer.
     * @param {string} splitName - The string that represents the split we wan't to get the treatment.
     * @param {Attributes=} attributes - An object of type Attributes defining the attributes for the given key.
     * @returns {AsyncTreatmentWithConfig} TreatmentWithConfig promise which will resolve to the TreatmentWithConfig object.
     */
    getTreatmentWithConfig(key: SplitKey, splitName: string, attributes?: Attributes): AsyncTreatmentWithConfig,
    /**
     * Returns a Treatments value, whick will be (or eventually be) an object with the treatments for the given features.
     * For usage on NodeJS as we don't have only one key.
     * @function getTreatments
     * @param {string} key - The string key representing the consumer.
     * @param {Array<string>} splitNames - An array of the split names we wan't to get the treatments.
     * @param {Attributes=} attributes - An object of type Attributes defining the attributes for the given key.
     * @returns {AsyncTreatments} Treatments promise which will resolve to the treatments object.
     */
    getTreatments(key: SplitKey, splitNames: string[], attributes?: Attributes): AsyncTreatments,
    /**
     * Returns a Treatments value, whick will be (or eventually be) an object with all the maps of treatment and config string for the given features.
     * For usage on NodeJS as we don't have only one key.
     * @function getTreatmentsWithConfig
     * @param {string} key - The string key representing the consumer.
     * @param {Array<string>} splitNames - An array of the split names we wan't to get the treatments.
     * @param {Attributes=} attributes - An object of type Attributes defining the attributes for the given key.
     * @returns {AsyncTreatmentsWithConfig} TreatmentsWithConfig promise which will resolve to the map of TreatmentsWithConfig objects.
     */
    getTreatmentsWithConfig(key: SplitKey, splitNames: string[], attributes?: Attributes): AsyncTreatmentsWithConfig,
    /**
     * Tracks an event to be fed to the results product on Split Webconsole and returns a promise to signal when the event was successfully queued (or not).
     * @function track
     * @param {SplitKey} key - The key that identifies the entity related to this event.
     * @param {string} trafficType - The traffic type of the entity related to this event.
     * @param {string} eventType - The event type corresponding to this event.
     * @param {number=} value - The value of this event.
     * @param {Properties=} properties - The properties of this event. Values can be string, number, boolean or null.
     * @returns {Promise<boolean>} A promise that resolves to a boolean indicating if the event was added to the queue succesfully or not.
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
     * Returns a Treatment value, which will be the treatment string for the given feature.
     * @function getTreatment
     * @param {string} splitName - The string that represents the split we wan't to get the treatment.
     * @param {Attributes=} attributes - An object of type Attributes defining the attributes for the given key.
     * @returns {Treatment} The treatment result.
     */
    getTreatment(splitName: string, attributes?: Attributes): Treatment,
    /**
     * Returns a TreatmentWithConfig value, which will be a map of treatment and the config for that treatment.
     * @function getTreatment
     * @param {string} splitName - The string that represents the split we wan't to get the treatment.
     * @param {Attributes=} attributes - An object of type Attributes defining the attributes for the given key.
     * @returns {TreatmentWithConfig} The treatment or treatment promise which will resolve to the treatment string.
     */
    getTreatmentWithConfig(splitName: string, attributes?: Attributes): TreatmentWithConfig,
    /**
     * Returns a Treatments value, whick will be (or eventually be) an object with the treatments for the given features.
     * @function getTreatments
     * @param {Array<string>} splitNames - An array of the split names we wan't to get the treatments.
     * @param {Attributes=} attributes - An object of type Attributes defining the attributes for the given key.
     * @returns {Treatments} The treatments or treatments promise which will resolve to the treatments object.
     */
    getTreatments(splitNames: string[], attributes?: Attributes): Treatments,
    /**
     * Returns a TreatmentsWithConfig value, whick will be an object with the TreatmentWithConfig (a map with both treatment and config string) for the given features.
     * @function getTreatmentsWithConfig
     * @param {Array<string>} splitNames - An array of the split names we wan't to get the treatments.
     * @param {Attributes=} attributes - An object of type Attributes defining the attributes for the given key.
     * @returns {TreatmentsWithConfig} The map with all the TreatmentWithConfig objects
     */
    getTreatmentsWithConfig(splitNames: string[], attributes?: Attributes): TreatmentsWithConfig,
    /**
     * Tracks an event to be fed to the results product on Split Webconsole.
     * @function track
     * @param {string} trafficType - The traffic type of the entity related to this event.
     * @param {string} eventType - The event type corresponding to this event.
     * @param {number=} value - The value of this event.
     * @param {Properties=} properties - The properties of this event. Values can be string, number, boolean or null.
     * @returns {boolean} Whether the event was added to the queue succesfully or not.
     */
    track(trafficType: string, eventType: string, value?: number, properties?: Properties): boolean,
  }
  /**
   * Representation of a manager instance with synchronous storage of the SDK.
   * @interface IManager
   * @extends IStatusInterface
   */
  interface IManager extends IStatusInterface {
    /**
     * Get the array of Split names.
     * @function names
     * @returns {SplitNames} The lists of Split names.
     */
    names(): SplitNames;
    /**
     * Get the array of splits data in SplitView format.
     * @function splits
     * @returns {SplitViews} The list of SplitIO.SplitView.
     */
    splits(): SplitViews;
    /**
     * Get the data of a split in SplitView format.
     * @function split
     * @param {string} splitName The name of the split we wan't to get info of.
     * @returns {SplitView} The SplitIO.SplitView of the given split.
     */
    split(splitName: string): SplitView;
  }
  /**
   * Representation of a manager instance with asynchronous storage of the SDK.
   * @interface IAsyncManager
   * @extends IStatusInterface
   */
  interface IAsyncManager extends IStatusInterface {
    /**
     * Get the array of Split names.
     * @function names
     * @returns {SplitNamesAsync} A promise that will resolve to the array of Splitio.SplitNames.
     */
    names(): SplitNamesAsync;
    /**
     * Get the array of splits data in SplitView format.
     * @function splits
     * @returns {SplitViewsAsync} A promise that will resolve to the SplitIO.SplitView list.
     */
    splits(): SplitViewsAsync;
    /**
     * Get the data of a split in SplitView format.
     * @function split
     * @param {string} splitName The name of the split we wan't to get info of.
     * @returns {SplitViewAsync} A promise that will resolve to the SplitIO.SplitView value.
     */
    split(splitName: string): SplitViewAsync;
  }
}

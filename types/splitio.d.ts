// Type definitions for React Native Split Software SDK
// Project: http://www.split.io/
// Definitions by: Nico Zelaya <https://github.com/NicoZelaya/>

/// <reference types="@splitsoftware/splitio-commons/src/types" />

/****** Exposed namespace ******/
/**
 * Types and interfaces for @splitsoftware/splitio-react-native package for usage when integrating React Native SDK on Typescript apps.
 * For the SDK package information
 * @see {@link https://www.npmjs.com/package/@splitsoftware/splitio-react-native}
 */
declare namespace SplitIO {
  /**
   * Settings interface for SDK instances created on React Native.
   * @interface IReactNativeSettings
   * @see {@link https://help.split.io/hc/en-us/articles/4406066357901-React-Native-SDK#configuration}
   */
  interface IReactNativeSettings extends IClientSideSharedSettings, IPluggableSettings {
    sync?: IClientSideSharedSettings['sync'] & {
      /**
       * Defines the factory function to instantiate the SDK in localhost mode.
       *
       * NOTE: this is only required if using the slim entry point of the library to init the SDK in localhost mode.
       *
       * For more information @see {@link https://help.split.io/hc/en-us/articles/4406066357901-React-Native-SDK#localhost-mode}.
       *
       * Example:
       * ```typescript
       * SplitFactory({
       *   ...
       *   sync: {
       *     localhostMode: LocalhostFromObject()
       *   }
       * })
       * ```
       * @property {Object} localhostMode
       */
      localhostMode?: SplitIO.LocalhostFactory
    },
    /**
     * Defines the factory function to instantiate the storage. If not provided, the default IN MEMORY storage is used.
     * @property {Object} storage
     * @TODO at the moment there are not storages to plug in React Native SDK.
     */
    storage?: StorageSyncFactory,
    /**
     * Defines an optional list of factory functions used to instantiate SDK integrations.
     * @property {Object} integrations
     * @TODO at the moment there are not integrations to plug in React Native SDK.
     */
    integrations?: IntegrationFactory[],
  }

  /**
   * This represents the interface for the Client instance with attributes binding, synchronous method calls, and client-side API, where each client has a key associated.
   * @interface IClient
   */
  interface IClient extends IClientWithKey { }
  /**
   * This represents the interface for the SDK instance with synchronous method calls and client-side API, where client instances have a bound user key.
   * @interface ISDK
   */
  interface ISDK extends ISDKWithUserConsent<IClient, IManager> {
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
  }
}

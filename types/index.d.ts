// Declaration file for React Native Split Software SDK
// Project: https://www.split.io/
// Definitions by: Nico Zelaya <https://github.com/NicoZelaya/>

/// <reference path="./splitio.d.ts" />

export = JsSdk;

declare module JsSdk {
  /**
   * Split.io SDK factory function.
   *
   * The settings parameter should be an object that complies with the SplitIO.IReactNativeSettings.
   * For more information read the corresponding article: @see {@link https://developer.harness.io/docs/feature-management-experimentation/sdks-and-infrastructure/client-side-sdks/react-native-sdk/#configuration}
   */
  export function SplitFactory(settings: SplitIO.IReactNativeSettings): SplitIO.IBrowserSDK;

  /**
   * Persistent storage. By default, it uses the browser's LocalStorage API if available.
   *
   * @see {@link https://developer.harness.io/docs/feature-management-experimentation/sdks-and-infrastructure/client-side-sdks/react-native-sdk/#configuring-persistent-cache-for-the-sdk}
   */
  export function InLocalStorage(options?: SplitIO.InLocalStorageOptions): SplitIO.StorageSyncFactory;

  /**
   * Creates a logger instance that enables descriptive log messages with DEBUG log level when passed in the factory settings.
   *
   * @see {@link https://developer.harness.io/docs/feature-management-experimentation/sdks-and-infrastructure/client-side-sdks/react-native-sdk/#logging}
   */
  export function DebugLogger(): SplitIO.ILogger;

  /**
   * Creates a logger instance that enables descriptive log messages with INFO log level when passed in the factory settings.
   *
   * @see {@link https://developer.harness.io/docs/feature-management-experimentation/sdks-and-infrastructure/client-side-sdks/react-native-sdk/#logging}
   */
  export function InfoLogger(): SplitIO.ILogger;

  /**
   * Creates a logger instance that enables descriptive log messages with WARN log level when passed in the factory settings.
   *
   * @see {@link https://developer.harness.io/docs/feature-management-experimentation/sdks-and-infrastructure/client-side-sdks/react-native-sdk/#logging}
   */
  export function WarnLogger(): SplitIO.ILogger;

  /**
   * Creates a logger instance that enables descriptive log messages with ERROR log level when passed in the factory settings.
   *
   * @see {@link https://developer.harness.io/docs/feature-management-experimentation/sdks-and-infrastructure/client-side-sdks/react-native-sdk/#logging}
   */
  export function ErrorLogger(): SplitIO.ILogger;
}

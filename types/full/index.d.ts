// Declaration file for React Native Split Software SDK
// Project: http://www.split.io/
// Definitions by: Nico Zelaya <https://github.com/NicoZelaya/>

/// <reference path="../splitio.d.ts" />

declare module '@splitsoftware/splitio-react-native/full' {
  /**
   * Full version of the Split.io sdk factory function.
   *
   * Unlike the slim version, it does include localhost mode out-of-the-box @see {@link https://help.split.io/hc/en-us/articles/4406066357901#localhost-mode}.
   *
   * The settings parameter should be an object that complies with the SplitIO.IReactNativeSettings.
   * For more information read the corresponding article: @see {@link https://help.split.io/hc/en-us/articles/4406066357901#configuration}
   */
  export function SplitFactory(settings: SplitIO.IReactNativeSettings): SplitIO.ISDK;

  /**
   * Creates a logger instance that enables descriptive log messages with DEBUG log level when passed in the factory settings.
   *
   * @see {@link https://help.split.io/hc/en-us/articles/4406066357901#logging}
   */
  export function DebugLogger(): SplitIO.ILogger;

  /**
   * Creates a logger instance that enables descriptive log messages with INFO log level when passed in the factory settings.
   *
   * @see {@link https://help.split.io/hc/en-us/articles/4406066357901#logging}
   */
  export function InfoLogger(): SplitIO.ILogger;

  /**
   * Creates a logger instance that enables descriptive log messages with WARN log level when passed in the factory settings.
   *
   * @see {@link https://help.split.io/hc/en-us/articles/4406066357901#logging}
   */
  export function WarnLogger(): SplitIO.ILogger;

  /**
   * Creates a logger instance that enables descriptive log messages with ERROR log level when passed in the factory settings.
   *
   * @see {@link https://help.split.io/hc/en-us/articles/4406066357901#logging}
   */
  export function ErrorLogger(): SplitIO.ILogger;
}

// Declaration file for React Native Split Software SDK
// Project: https://www.split.io/
// Definitions by: Nico Zelaya <https://github.com/NicoZelaya/>

/// <reference path="../splitio.d.ts" />

export = JsSdk;

declare module JsSdk {
  /**
   * Split.io SDK factory function.
   *
   * The settings parameter should be an object that complies with the SplitIO.IReactNativeSettings.
   * For more information read the corresponding article: @see {@link https://help.split.io/hc/en-us/articles/4406066357901#configuration}
   */
  export function SplitFactory(settings: SplitIO.IReactNativeSettings): SplitIO.IBrowserSDK;

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

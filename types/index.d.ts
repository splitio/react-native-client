// Declaration file for React Native Split Software SDK v1.0.0
// Project: http://www.split.io/
// Definitions by: Nico Zelaya <https://github.com/NicoZelaya/>

/// <reference path="./splitio.d.ts" />
export = JsSdk;

declare module JsSdk {
  /**
   * Slim version of the Split.io sdk factory function.
   *
   * Recommended to use for bundle size reduction in production, since it doesn't include localhost mode out-of-the-box
   * @see {@link https://help.split.io/hc/en-us/articles/4406066357901#localhost-mode}.
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

  /**
   * Required to enable localhost mode when importing the SDK from the slim entry point of the library.
   * It uses the mocked features map defined in the 'features' config object.
   *
   * @see {@link https://help.split.io/hc/en-us/articles/4406066357901#localhost-mode}
   */
  export function LocalhostFromObject(): SplitIO.LocalhostFactory;
}

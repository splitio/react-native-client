import reactNative from 'react-native';
// @ts-expect-error no declaration file provided
import { EventSourceXHR } from './EventSourceXHR/EventSourceXHR';

let _RNEventSource: typeof EventSource | undefined;

// Try-catch to avoid Jest error `Invariant Violation: __fbBatchedBridgeConfig is not set, cannot invoke native modules`
try {
  if (reactNative.NativeModules && reactNative.NativeModules.RNEventSource) _RNEventSource = require('./EventSource/EventSource');
} catch (e) {}

/**
 * Returns native implementation of EventSource.
 * If not available (e.g., incomplete linking, Expo projects or other runtimes than Android and iOS), checks if global EventSource is available and returns it.
 * If not available, returns an EventSource polyfill based on XMLHttpRequest.
 *
 * The EventSource polyfill is the last option because it doesn't work on Android in debug mode in RN below v0.74,
 * due to Flipper network interceptor (https://github.com/NepeinAV/rn-eventsource-reborn#eventsource-dont-works-on-android-in-debug-mode).
 * In RN 0.74 (https://reactnative.dev/blog/2024/04/22/release-0.74#removal-of-flipper-react-native-plugin) and Expo 51 (https://github.com/expo/expo/issues/27526#issuecomment-2113893318),
 * Flipper was removed from new app templates and replaced by the new React Native DevTools, so the Android-debug interception that broke SSE disappears.
 *
 * @TODO breaking change: drop support for RN < 0.74 and remove native EventSource modules
 */
export function getEventSource(): typeof EventSource | undefined {
  return _RNEventSource || (typeof EventSource === 'function' ? EventSource : EventSourceXHR);
}

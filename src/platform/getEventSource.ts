import reactNative from 'react-native';

let _RNEventSource: typeof EventSource | undefined;

// Try-catch to avoid Jest error `Invariant Violation: __fbBatchedBridgeConfig is not set, cannot invoke native modules`
try {
  if (reactNative.NativeModules && reactNative.NativeModules.RNEventSource) _RNEventSource = require('./EventSource/EventSource');
} catch (e) {}

/**
 * Returns native implementation of EventSource. If not available (e.g., Expo or other runtime than Android and iOS),
 * checks if global EventSource is available and returns it.
 */
export function getEventSource(): typeof EventSource | undefined {
  return _RNEventSource || (typeof EventSource === 'function' ? EventSource : undefined);
}

/* eslint-disable no-undef */
import { NativeModules } from 'react-native';

let _RNEventSource: typeof EventSource | undefined;
if (NativeModules.RNEventSource) _RNEventSource = require('./EventSource/EventSource');

/**
 * Returns native implementation of EventSource. If not available (e.g., Expo or other runtime than Android and iOS),
 * checks if global EventSource is available and returns it.
 */
export function getEventSource(): typeof EventSource | undefined {
  return _RNEventSource || (typeof EventSource === 'function' ? EventSource : undefined);
}

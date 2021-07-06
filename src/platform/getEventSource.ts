import { NativeModules } from 'react-native';

let RNEventSource: EventSource | undefined;
if (NativeModules.RNEventSource) RNEventSource = require('./EventSource/EventSource');

/**
 * Returns native implementation of EventSource. If not available (e.g., Expo or other runtime than Android and iOS),
 * checks if global EventSource is available and returns it.
 */
export function getEventSource() {
  // eslint-disable-next-line no-undef
  return RNEventSource || typeof EventSource === 'function' ? EventSource : undefined;
}

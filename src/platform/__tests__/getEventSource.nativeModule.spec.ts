// Mock RNEventSource native module
jest.mock('react-native', () => {
  return {
    NativeModules: {
      RNEventSource: {
        connect: jest.fn(),
        close: jest.fn(),
      },
    },
    DeviceEventEmitter: {
      addListener: jest.fn(),
    },
  };
});

const EventSourceImpl = require('../EventSource/EventSource');
const {
  NativeModules: { RNEventSource },
} = require('react-native');

// Test target:
import { getEventSource } from '../getEventSource';

test('Returns EventSource implementation if RNEventSource native module is available', () => {
  const EventSource = getEventSource();
  expect(EventSource).toBe(EventSourceImpl);

  // @ts-expect-error. EventSource is not undefined
  const connection = new EventSource('fake-url');
  expect(RNEventSource.connect).toBeCalledTimes(1);

  connection.close();
  expect(RNEventSource.close).toBeCalled();
});

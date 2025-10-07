// No mocking RNEventSource native module.

import { getEventSource } from '../getEventSource';
import { EventSourceXHR } from '../EventSourceXHR/EventSourceXHR';

test('Returns global EventSource if native module RNEventSource is not available', () => {
  const mockEventSource = jest.fn();
  const original = global.EventSource; // @ts-ignore
  global.EventSource = mockEventSource;

  expect(getEventSource()).toBe(mockEventSource);

  global.EventSource = original;
});

test('Returns EventSourceXHR polyfill if global EventSource and native module RNEventSource are not available', () => {
  expect(getEventSource()).toBe(EventSourceXHR);
});

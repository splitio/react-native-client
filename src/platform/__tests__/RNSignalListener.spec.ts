import { RNSignalListener } from '../RNSignalListener';
import { AppStateMock } from './AppState.mock';

jest.doMock('react-native/Libraries/AppState/AppState', () => AppStateMock);

const syncManagerMockWithPushManager = {
  flush: jest.fn(),
  pushManager: { start: jest.fn(), stop: jest.fn() },
};
const settingsMock = {
  log: { debug: jest.fn() },
  flushDataOnBackground: true,
};

describe('RNSignalListener', () => {
  beforeEach(() => {
    AppStateMock.mockClear();
    syncManagerMockWithPushManager.flush.mockClear();
    syncManagerMockWithPushManager.pushManager.stop.mockClear();
    syncManagerMockWithPushManager.pushManager.start.mockClear();
  });

  test('starting in foreground', () => {
    // @ts-expect-error. SyncManager mock partially implemented
    const signalListener = new RNSignalListener(syncManagerMockWithPushManager, settingsMock);

    // Starting with app in foreground
    AppStateMock.currentState = 'active';
    signalListener.start();
    expect(AppStateMock.addEventListener).toBeCalledTimes(1);
    expect(syncManagerMockWithPushManager.pushManager.start).toBeCalledTimes(1);

    // Going to background should be handled
    AppStateMock._emitChangeEvent('background');
    expect(syncManagerMockWithPushManager.flush).toBeCalledTimes(1);
    expect(syncManagerMockWithPushManager.pushManager.stop).toBeCalledTimes(1);

    // Handling another background event, which shouldn't happen, have no effect
    AppStateMock._emitChangeEvent('background');
    expect(syncManagerMockWithPushManager.flush).toBeCalledTimes(1);
    expect(syncManagerMockWithPushManager.pushManager.stop).toBeCalledTimes(1);
    expect(syncManagerMockWithPushManager.pushManager.stop).toBeCalledTimes(1);

    // Going to foreground should be handled
    AppStateMock._emitChangeEvent('inactive');
    expect(syncManagerMockWithPushManager.pushManager.start).toBeCalledTimes(2);

    // Handling another foreground event, have no effect
    AppStateMock._emitChangeEvent('active');
    AppStateMock._emitChangeEvent('inactive');
    AppStateMock._emitChangeEvent('inactive');
    expect(syncManagerMockWithPushManager.pushManager.start).toBeCalledTimes(2);

    // Going to background should be handled again
    AppStateMock._emitChangeEvent('background');
    expect(syncManagerMockWithPushManager.flush).toBeCalledTimes(2);
    expect(syncManagerMockWithPushManager.pushManager.stop).toBeCalledTimes(2);

    // Going to foreground should be handled again
    AppStateMock._emitChangeEvent('active');
    expect(syncManagerMockWithPushManager.pushManager.start).toBeCalledTimes(3);

    // Stopping RNSignalListener
    signalListener.stop(); // @ts-ignore access private property
    expect(signalListener._appStateSubscription.remove).toBeCalledTimes(1);
    expect(syncManagerMockWithPushManager.flush).toBeCalledTimes(2);
    expect(syncManagerMockWithPushManager.pushManager.stop).toBeCalledTimes(2);
    expect(syncManagerMockWithPushManager.pushManager.start).toBeCalledTimes(3);
  });

  test('starting in background & without flushDataOnBackground', () => {
    // @ts-expect-error. SyncManager mock partially implemented
    const signalListener = new RNSignalListener(syncManagerMockWithPushManager, { ...settingsMock, flushDataOnBackground: undefined });

    // Starting with app in background
    AppStateMock.currentState = 'background';
    signalListener.start();
    expect(AppStateMock.addEventListener).toBeCalledTimes(1);
    expect(syncManagerMockWithPushManager.flush).toBeCalledTimes(0);
    expect(syncManagerMockWithPushManager.pushManager.stop).toBeCalledTimes(1);
    expect(syncManagerMockWithPushManager.pushManager.start).toBeCalledTimes(0);
  });
});

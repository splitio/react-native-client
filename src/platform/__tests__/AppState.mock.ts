import { AppStateStatus } from 'react-native';

export const AppStateMock = {
  _changeListeners: new Set<(state: AppStateStatus) => void>(),
  _emitChangeEvent(event: AppStateStatus) {
    AppStateMock._changeListeners.forEach((listener) => {
      listener(event);
    });
  },
  mockClear() {
    AppStateMock._changeListeners.clear();
    AppStateMock.addEventListener.mockClear();
    AppStateMock.removeEventListener.mockClear();
  },

  // AppState API:
  currentState: 'active',
  addEventListener: jest.fn((type, listener) => {
    if (type === 'change') {
      AppStateMock._changeListeners.add(listener);
    }
  }),
  removeEventListener: jest.fn((type, listener) => {
    if (type === 'change') {
      AppStateMock._changeListeners.delete(listener);
    }
  }),
};

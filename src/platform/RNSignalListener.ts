import { ISignalListener } from '@splitsoftware/splitio-commons/src/listeners/types';
import { ISyncManager } from '@splitsoftware/splitio-commons/src/sync/types';
import { ISettings } from '@splitsoftware/splitio-commons/src/types';
import { AppState, AppStateStatus } from 'react-native';

type Transition = undefined | 'TO_FOREGROUND' | 'TO_BACKGROUND';
const TO_FOREGROUND = 'TO_FOREGROUND';
const TO_BACKGROUND = 'TO_BACKGROUND';

// const BACKGROUND_STOP_DELAY_MILLIS = 60000; // 1 minute
const FOREGROUND_MATCHER = /active/;

/**
 * In ReactNative, we listen app state (foreground/background) to pause/resume synchronization.
 */
export class RNSignalListener implements ISignalListener {
  private _lastTransition: Transition | undefined;

  constructor(private syncManager: ISyncManager, private settings: ISettings & { flushDataOnBackground?: boolean }) {}

  private _getTransition(nextAppState: AppStateStatus): Transition {
    // 'inactive' iOS state and 'active' state are considered foreground states.
    // In both states, the features used by the SDK (fetch, timers, EventSource, NetInfo) work fine.
    // https://developer.apple.com/documentation/uikit/app_and_environment/managing_your_app_s_life_cycle

    let transition: Transition =
      FOREGROUND_MATCHER.test(nextAppState) && this._lastTransition !== TO_FOREGROUND
        ? TO_FOREGROUND
        : nextAppState === 'background' && this._lastTransition !== TO_FOREGROUND
        ? TO_BACKGROUND
        : undefined;

    if (transition) this._lastTransition = transition;
    return transition;
  }

  private _handleAppStateChange(nextAppState: AppStateStatus) {
    const action = this._getTransition(nextAppState);

    switch (action) {
      case TO_FOREGROUND:
        // This branch is called when app transition to foreground or it is launched,
        // in which case calling pushManager.start has no effect (it has been already started).
        // Here, synchronization is resumed.

        if (this.syncManager.pushManager) this.syncManager.pushManager.start();
        break;
      case TO_BACKGROUND:
        // This branch is called when the app transition to background.
        // Here, pushManager is stopped to close streaming connections for Android.
        // In iOS, connections are automatically closed/resumed by the OS.
        // Polling mode is paused during background, since JS timers callbacks are executed only
        // when the app is in the foreground. Therefore, stopping syncManager is not necessary.
        // Other features like Fetch, AsyncStorage, AppState and NetInfo listeners, can be used.

        if (this.syncManager.pushManager) this.syncManager.pushManager.stop();

        // We cannot listen when the app is evicted by the OS or the user, but it always transitions to background before that.
        // So we should not flush events and impressions in the background, except that they cannot be stored in a persistent storage.
        if (this.settings.flushDataOnBackground) this.syncManager.flush();
        break;
    }
  }

  /**
   * start method.
   * Called when SplitFactory is initialized.
   */
  start() {
    // Checking currentState in the rare case that the SDK is instantiated in the background, where streaming should not connect.
    // The SDK should be instantiated when React Native JS context is initiated or the root componentDidMount method is called, where the app is in the foreground.
    this._handleAppStateChange(AppState.currentState);
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  /**
   * stop method.
   * Called when client is destroyed.
   */
  stop() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }
}

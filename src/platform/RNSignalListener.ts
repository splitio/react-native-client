import { ISignalListener } from '@splitsoftware/splitio-commons/src/listeners/types';
import { CLEANUP_REGISTERING, CLEANUP_DEREGISTERING } from '@splitsoftware/splitio-commons/src/logger/constants';
import { ISyncManager } from '@splitsoftware/splitio-commons/src/sync/types';
import { ISettings } from '@splitsoftware/splitio-commons/src/types';
import { AppState, AppStateStatus } from 'react-native';

type Transition = undefined | 'TO_FOREGROUND' | 'TO_BACKGROUND';
const TO_FOREGROUND = 'TO_FOREGROUND';
const TO_BACKGROUND = 'TO_BACKGROUND';

// const BACKGROUND_STOP_DELAY_MILLIS = 60000; // 1 minute
const FOREGROUND_MATCHER = /active/;

const EVENT_NAME = 'for AppState change events.';

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
        : nextAppState === 'background' && this._lastTransition !== TO_BACKGROUND
        ? TO_BACKGROUND
        : undefined;

    if (transition) this._lastTransition = transition;
    return transition;
  }

  private _handleAppStateChange = (nextAppState: AppStateStatus) => {
    const action = this._getTransition(nextAppState);

    switch (action) {
      case TO_FOREGROUND:
        this.settings.log.debug(`App transition to foreground${this.syncManager.pushManager ? '. Attempting to resume streaming' : ''}`);

        // This branch is called when (1) app is launched, or (2) app transitions to foreground.
        // In 1, calling pushManager.start has no effect, since it has already been started.
        // In 2, PushManager is resumed in case it was paused and the SDK is running in push mode.
        // If running in polling mode, either pushManager is not defined (e.g., streamingEnabled is false)
        // or calling pushManager.start has no effect because it was disabled (PUSH_NONRETRYABLE_ERROR).
        if (this.syncManager.pushManager) this.syncManager.pushManager.start();

        break;
      case TO_BACKGROUND:
        this.settings.log.debug(
          `App transition to background${this.syncManager.pushManager ? '. Pausing streaming' : ''}${
            this.settings.flushDataOnBackground ? '. Flushing events and impressions' : ''
          }`
        );

        // This branch is called when the app transition to background.
        // Here, PushManager is paused in case the SDK is running in push mode, to close streaming connection for Android.
        // In iOS it is not strictly required, since connections are automatically closed/resumed by the OS.
        // The remaining SyncManager components (PollingManager and Submitter) don't need to be stopped, even if running in
        // polling mode, because sync tasks are "delayed" during background, since JS timers callbacks are executed only
        // when the app is in foreground (https://github.com/facebook/react-native/issues/12981#issuecomment-652745831).
        // Other features like Fetch, AsyncStorage, AppState and NetInfo listeners, can be used in background.
        if (this.syncManager.pushManager) this.syncManager.pushManager.stop();

        // We cannot listen when the app is evicted by the OS or the user, but it always transitions to background before that.
        // So we should not flush events and impressions in background, except that they cannot be stored in a persistent storage.
        if (this.settings.flushDataOnBackground) this.syncManager.flush();

        break;
    }
  };

  /**
   * start method.
   * Called when SplitFactory is initialized.
   */
  start() {
    this.settings.log.debug(CLEANUP_REGISTERING, [EVENT_NAME]);
    // Checking currentState in the rare case that the SDK is instantiated in background, where streaming should not connect.
    // The SDK should be instantiated when React Native JS context is initiated or the root componentDidMount method is called, where the app is in the foreground.
    this._handleAppStateChange(AppState.currentState);
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  /**
   * stop method.
   * Called when client is destroyed.
   */
  stop() {
    this.settings.log.debug(CLEANUP_DEREGISTERING, [EVENT_NAME]);
    AppState.removeEventListener('change', this._handleAppStateChange);
  }
}

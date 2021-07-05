import { ISignalListener } from '@splitsoftware/splitio-commons/src/listeners/types';
import { ISplitApi } from '@splitsoftware/splitio-commons/src/services/types';
import { IStorageSync } from '@splitsoftware/splitio-commons/src/storages/types';
import { ISyncManager } from '@splitsoftware/splitio-commons/src/sync/types';
import { ISettings } from '@splitsoftware/splitio-commons/src/types';
import { AppState, AppStateStatus } from 'react-native';

type Transition = undefined | 'TO_FOREGROUND' | 'TO_BACKGROUND';
const TO_FOREGROUND = 'TO_FOREGROUND';
const TO_BACKGROUND = 'TO_BACKGROUND';

const BACKGROUND_STOP_DELAY_MILLIS = 60000; // 1 minute
const FOREGROUND_MATCHER = /active/;

export interface IBackgroundTimer {
  setTimeout(callback: (...args: any[]) => void, timeout: number): number;
  clearTimeout(timeoutId: number): void;
}

/**
 * In mobile, unlike browser, we cannot listen
 */
export class RNSignalListener implements ISignalListener {
  private _timeoutId: number | undefined;
  private _lastTransition: Transition | undefined;

  constructor(
    private syncManager: ISyncManager,
    private settings: ISettings & { flushDataOnBackground?: boolean },
    storage: IStorageSync,
    serviceApi: ISplitApi,
    private platform: {
      backgroundTimer?: IBackgroundTimer;
    } = {}
  ) {}

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
        // This branch is called when app transition to foreground.
        // Here, synchronization is started or resumed.

        if (this.platform.backgroundTimer && this._timeoutId) {
          this.platform.backgroundTimer.clearTimeout(this._timeoutId);
        }
        this.syncManager.start();
        break;
      case TO_BACKGROUND:
        // This branch is called when the app transition to background.
        // Here, synchronization is stopped to reduce battery consumption, particularly because of streaming connections
        // in Android: we need to close it. In iOS, connections are automatically closed/resumed by the OS.
        // JS timers callbacks are not executed in the background and thus polling mode doesn't work.
        // Other features like Fetch, AsyncStorage, AppState and NetInfo listeners, can be used.

        // If background timer is available, the syncManager is stopped with a delay.
        if (this.platform.backgroundTimer) {
          this._timeoutId = this.platform.backgroundTimer.setTimeout(this.syncManager.stop, BACKGROUND_STOP_DELAY_MILLIS);
        } else {
          this.syncManager.stop();
        }

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
    // Cannot start the syncManager without checking the app state, because the SDK
    // might be initiated in the background and should not connect to streaming.
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

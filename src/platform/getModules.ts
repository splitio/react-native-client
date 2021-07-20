import { splitApiFactory } from '@splitsoftware/splitio-commons/src/services/splitApi';
import { syncManagerOnlineFactory } from '@splitsoftware/splitio-commons/src/sync/syncManagerOnline';
import pushManagerFactory from '@splitsoftware/splitio-commons/src/sync/streaming/pushManager';
import pollingManagerCSFactory from '@splitsoftware/splitio-commons/src/sync/polling/pollingManagerCS';
import { sdkManagerFactory } from '@splitsoftware/splitio-commons/src/sdkManager/index';
import { sdkClientMethodCSFactory } from '@splitsoftware/splitio-commons/src/sdkClient/sdkClientMethodCS';
import { impressionObserverCSFactory } from '@splitsoftware/splitio-commons/src/trackers/impressionObserver/impressionObserverCS';
import EventEmitter from '@splitsoftware/splitio-commons/src/utils/MinEvents';

import { shouldAddPt } from '@splitsoftware/splitio-commons/src/trackers/impressionObserver/utils';
import { ISettingsInternal } from '@splitsoftware/splitio-commons/src/utils/settingsValidation/types';
import { ISdkFactoryParams } from '@splitsoftware/splitio-commons/src/sdkFactory/types';

import { RNSignalListener } from './RNSignalListener';
import { getEventSource } from './getEventSource';

const rnPlatform = {
  // Return global fetch which is always available in RN runtime
  getFetch() {
    return fetch;
  },
  EventEmitter,
  getEventSource,
};

const syncManagerOnlineCSFactory = syncManagerOnlineFactory(pollingManagerCSFactory, pushManagerFactory);

/**
 * Get minimal modules for RN client-side SDK in standalone mode and with online syncManager.
 */
export function getModules(settings: ISettingsInternal): ISdkFactoryParams {
  return {
    settings,

    platform: rnPlatform,

    storageFactory: settings.storage,

    splitApiFactory,

    syncManagerFactory: syncManagerOnlineCSFactory,

    sdkManagerFactory,

    sdkClientMethodFactory: sdkClientMethodCSFactory,

    SignalListener: settings.mode === 'localhost' ? undefined : (RNSignalListener as ISdkFactoryParams['SignalListener']),
    // @ts-ignore
    impressionListener: settings.impressionListener,

    impressionsObserverFactory: shouldAddPt(settings) ? impressionObserverCSFactory : undefined,
  };
}

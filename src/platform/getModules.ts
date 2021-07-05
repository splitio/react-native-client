import { splitApiFactory } from '@splitsoftware/splitio-commons/src/services/splitApi';
import { syncManagerOnlineFactory } from '@splitsoftware/splitio-commons/src/sync/syncManagerOnline';
import pushManagerFactory from '@splitsoftware/splitio-commons/src/sync/streaming/pushManager';
import pollingManagerCSFactory from '@splitsoftware/splitio-commons/src/sync/polling/pollingManagerCS';
import { sdkManagerFactory } from '@splitsoftware/splitio-commons/src/sdkManager/index';
import { sdkClientMethodCSFactory } from '@splitsoftware/splitio-commons/src/sdkClient/sdkClientMethodCS';
import { impressionObserverCSFactory } from '@splitsoftware/splitio-commons/src/trackers/impressionObserver/impressionObserverCS';
// import integrationsManagerFactory from '@splitsoftware/splitio-commons/src/integrations/pluggable';
import EventEmitter from '@splitsoftware/splitio-commons/src/utils/MinEvents';

import { shouldAddPt } from '@splitsoftware/splitio-commons/src/trackers/impressionObserver/utils';
import { ISettingsInternal } from '@splitsoftware/splitio-commons/src/utils/settingsValidation/types';
import { ISdkFactoryParams } from '@splitsoftware/splitio-commons/src/sdkFactory/types';

const rnPlatform = {
  // Return global fetch which is always available in RN runtime
  getFetch() {
    return fetch;
  },
  EventEmitter,
  // @TODO provide `getEventSource` implementation
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
    // @TODO provide RN signal listener
    SignalListener: undefined,
    // @ts-ignore
    impressionListener: settings.impressionListener,

    // integrationsManagerFactory: settings.integrations && settings.integrations.length > 0 ? integrationsManagerFactory.bind(null, settings.integrations) : undefined,

    impressionsObserverFactory: shouldAddPt(settings) ? impressionObserverCSFactory : undefined,
  };
}

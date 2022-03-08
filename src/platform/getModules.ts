import { splitApiFactory } from '@splitsoftware/splitio-commons/src/services/splitApi';
import { syncManagerOnlineFactory } from '@splitsoftware/splitio-commons/src/sync/syncManagerOnline';
import { pushManagerFactory } from '@splitsoftware/splitio-commons/src/sync/streaming/pushManager';
import { pollingManagerCSFactory } from '@splitsoftware/splitio-commons/src/sync/polling/pollingManagerCS';
import { sdkManagerFactory } from '@splitsoftware/splitio-commons/src/sdkManager/index';
import { sdkClientMethodCSFactory } from '@splitsoftware/splitio-commons/src/sdkClient/sdkClientMethodCS';
import { impressionObserverCSFactory } from '@splitsoftware/splitio-commons/src/trackers/impressionObserver/impressionObserverCS';
import { EventEmitter } from '@splitsoftware/splitio-commons/src/utils/MinEvents';

import { shouldAddPt } from '@splitsoftware/splitio-commons/src/trackers/impressionObserver/utils';
import { ISdkFactoryParams } from '@splitsoftware/splitio-commons/src/sdkFactory/types';
import { SplitIO, ISettings } from '@splitsoftware/splitio-commons/src/types';
import { LOCALHOST_MODE } from '@splitsoftware/splitio-commons/src/utils/constants';
import { userConsentProps } from '@splitsoftware/splitio-commons/src/sdkFactory/userConsentProps';

import { RNSignalListener } from './RNSignalListener';
import { getEventSource } from './getEventSource';

const platform = {
  // Return global fetch which is always available in RN runtime
  getFetch() {
    return fetch;
  },
  EventEmitter,
  getEventSource,
};

const syncManagerOnlineCSFactory = syncManagerOnlineFactory(pollingManagerCSFactory, pushManagerFactory);

export function getModules(settings: ISettings): ISdkFactoryParams {
  const modules: ISdkFactoryParams = {
    settings,

    platform,

    storageFactory: settings.storage,

    splitApiFactory,

    syncManagerFactory: syncManagerOnlineCSFactory,

    sdkManagerFactory,

    sdkClientMethodFactory: sdkClientMethodCSFactory,

    SignalListener: RNSignalListener as ISdkFactoryParams['SignalListener'],

    impressionListener: settings.impressionListener as SplitIO.IImpressionListener,

    impressionsObserverFactory: shouldAddPt(settings) ? impressionObserverCSFactory : undefined,

    extraProps: userConsentProps,
  };

  if (settings.mode === LOCALHOST_MODE) {
    modules.splitApiFactory = undefined;
    modules.syncManagerFactory = settings.sync.localhostMode;
    modules.SignalListener = undefined;
  }

  return modules;
}

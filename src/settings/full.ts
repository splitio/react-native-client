import { settingsValidation } from '@splitsoftware/splitio-commons/src/utils/settingsValidation/index';
import { defaults } from './defaults';
import { validateRuntime } from '@splitsoftware/splitio-commons/src/utils/settingsValidation/runtime';
import { validateStorageCS } from '@splitsoftware/splitio-commons/src/utils/settingsValidation/storage/storageCS';
import { validatePluggableIntegrations } from '@splitsoftware/splitio-commons/src/utils/settingsValidation/integrations/pluggable';
import { validateLogger } from '@splitsoftware/splitio-commons/src/utils/settingsValidation/logger/pluggableLogger';
import { validateLocalhostWithDefault } from '@splitsoftware/splitio-commons/src/utils/settingsValidation/localhost/builtin';
import { validateConsent } from '@splitsoftware/splitio-commons/src/utils/settingsValidation/consent';
import { STANDALONE_MODE } from '@splitsoftware/splitio-commons/src/utils/constants';

const params = {
  defaults,
  acceptKey: true, // Client with bound key
  runtime: validateRuntime,
  storage: validateStorageCS,
  integrations: validatePluggableIntegrations,
  logger: validateLogger,
  localhost: validateLocalhostWithDefault, // Full SplitFactory provides a default localhost module, except a valid one is provided
  consent: validateConsent,
};

export function settingsFactory(config: any) {
  const settings = settingsValidation(config, params);
  // @ts-ignore. For internal use, flush data on background until a persistent storage is provided.
  settings.flushDataOnBackground = true;

  // Override in localhost mode to properly emit SDK_READY
  if (settings.mode !== STANDALONE_MODE) settings.sync.largeSegmentsEnabled = false;

  return settings;
}

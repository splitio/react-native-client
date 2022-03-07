import { settingsValidation } from '@splitsoftware/splitio-commons/src/utils/settingsValidation/index';
import { defaults } from './defaults';
import { validateRuntime } from '@splitsoftware/splitio-commons/src/utils/settingsValidation/runtime';
import { validateStorageCS } from '@splitsoftware/splitio-commons/src/utils/settingsValidation/storage/storageCS';
import { validatePluggableIntegrations } from '@splitsoftware/splitio-commons/src/utils/settingsValidation/integrations/pluggable';
import { validateLogger } from '@splitsoftware/splitio-commons/src/utils/settingsValidation/logger/pluggableLogger';
import { validateLocalhost } from '@splitsoftware/splitio-commons/src/utils/settingsValidation/localhost/pluggable';

const params = {
  defaults,
  runtime: validateRuntime,
  storage: validateStorageCS,
  integrations: validatePluggableIntegrations,
  logger: validateLogger,
  // Slim SplitFactory validates that the localhost module is passed in localhost mode
  localhost: validateLocalhost,
};

export function settingsValidator(config: any) {
  const settings = settingsValidation(config, params);
  // @ts-ignore. For internal use, flush data on background until a persistent storage is provided.
  settings.flushDataOnBackground = true;
  return settings;
}

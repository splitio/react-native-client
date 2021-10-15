import { settingsValidator } from './settings';
import { getModules } from './platform/getModules';
import { sdkFactory } from '@splitsoftware/splitio-commons/src/sdkFactory/index';
import type { ISdkFactoryParams } from '@splitsoftware/splitio-commons/src/sdkFactory/types';
import { merge } from '@splitsoftware/splitio-commons/src/utils/lang';

/**
 * Slim SplitFactory for React Native.
 * Doesn't include localhost mode out-of-the-box.
 *
 * @param config         Configuration object used to instantiates the SDK
 * @param customModules  Optional object of SDK modules to overwrite default ones. Use with caution since, unlike `config`, this param is not validated.
 * @throws Will throw an error if the provided config is invalid.
 */
export function SplitFactory(config: any, customModules?: Partial<ISdkFactoryParams>) {
  const settings = settingsValidator(config);
  const modules = getModules(settings);
  return sdkFactory(customModules ? (merge(modules, customModules) as ISdkFactoryParams) : modules);
}

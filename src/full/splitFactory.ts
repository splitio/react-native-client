import { settingsValidator } from '../settings/full';
import { getModules } from '../platform/getModules';
import { sdkFactory } from '@splitsoftware/splitio-commons/src/sdkFactory/index';
import type { ISdkFactoryParams } from '@splitsoftware/splitio-commons/src/sdkFactory/types';

/**
 * SplitFactory for React Native.
 * Includes localhost mode.
 *
 * @param config           Configuration object used to instantiate the SDK
 * @param __updateModules  Optional function that lets redefine internal SDK modules. Use with
 * caution since, unlike `config`, this param is not validated neither considered part of the public API.
 * @throws Will throw an error if the provided config is invalid.
 */
export function SplitFactory(config: any, __updateModules: (modules: ISdkFactoryParams) => void) {
  const settings = settingsValidator(config);
  const modules = getModules(settings);
  if (__updateModules) __updateModules(modules);
  return sdkFactory(modules);
}

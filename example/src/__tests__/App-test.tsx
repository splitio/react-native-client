/**
 * @format
 */

import 'react-native';
import React from 'react';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

// @TODO fix `Invariant Violation: TurboModuleRegistry.getEnforcing(...): 'AppState' could not be found. Verify that a module by this name is registered in the native binary.`
// import { AppStateMock } from '../../../src/platform/__tests__/AppState.mock';
// jest.doMock('react-native/Libraries/AppState/AppState', () => AppStateMock);

import 'isomorphic-fetch';
// Note: '../App' must be required after polyfilling `global.fetch` to properly instantiate the SDK
import App from '../App';

it('renders correctly', async () => {
  renderer.create(<App />);
});

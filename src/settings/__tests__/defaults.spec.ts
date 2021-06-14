import { defaults } from '../defaults';
import { version } from '../../../package.json';

test('sdk version should contain the package.json version', () => {
  expect(defaults.version).toBe(`reactnative-${version}`);
});

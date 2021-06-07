import { packageVersion } from '../defaults';
import { version } from '../../../package.json';

test('sdk version should be the package.json version', () => {
  expect(packageVersion).toBe(version);
});

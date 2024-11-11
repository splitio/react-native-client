# Migrating to React Native SDK v1

React Native SDK v1.0.0 has a few breaking changes that you should consider when migrating from version 0.x.x.

## Renamed some TypeScript definitions in the `SplitIO` namespace to avoid conflicts with other Split packages

The renamed types are:
- `SplitIO.ISDK` -> `SplitIO.IBrowserSDK`
- `SplitIO.IClient` -> `SplitIO.IBrowserClient`

For example, you should replace:

```ts
import { SplitFactory } from '@splitsoftware/splitio-react-native';

const config: SplitIO.IReactNativeSettings = { ... };
const factory: SplitIO.ISDK = SplitFactory(config);
```

with:

```ts
import { SplitFactory } from '@splitsoftware/splitio-react-native';

const config: SplitIO.IReactNativeSettings = { ... };
const factory: SplitIO.IBrowserSDK = SplitFactory(config);
```

## Removed the `LocalhostFromObject` export from the default import

In order to simplify the SDK API, the `LocalhostFromObject` export was removed from the default import (`import { LocalhostFromObject } from '@splitsoftware/splitio-react-native'`), and it is no longer necessary to manually pass it to the `sync.localhostMode` configuration option to enable localhost mode.

If you were using the `LocalhostFromObject` export, you should remove it from your code. For example, replace:

```js
import { SplitFactory, LocalhostFromObject } from '@splitsoftware/splitio-react-native';

const factory = SplitFactory({
  core: {
    authorizationKey: 'localhost',
    key: SOME_KEY
  },
  features: {
    'feature1': 'on'
  },
  sync: {
    localhostMode: LocalhostFromObject()
  }
});
```

with:

```js
import { SplitFactory } from '@splitsoftware/splitio-react-native';

const factory = SplitFactory({
  core: {
    authorizationKey: 'localhost',
    key: SOME_KEY
  },
  features: {
    'feature1': 'on'
  }
});
```

## Dropped support for Split Proxy below version 5.9.0. The SDK now requires Split Proxy 5.9.0 or above

If using the Split Proxy with the SDK, make sure to update it to version 5.9.0 or above. This is required due to the introduction of Large Segments matchers in the React Native SDK, which uses a new HTTP endpoint to retrieve the segments data and is only supported by Split Proxy 5.9.0.

# App example

App example used for debugging, testing and checking type definitions of Split SDK for React Native.

## Setup

Follow React Native guide for [Setting up the development environment](https://reactnative.dev/docs/environment-setup).

Then run:

```bash
> npm install
> cd ios/ && pod install && cd .. # CocoaPods on iOS needs this extra step, if changes were made in iOS native modules
> npm start -- --reset-cache # start metro bundler server, cleaning cache in case `react-native-client` has been rebuilt or dependencies updated
> npm run android # requires an Android emulator or device to be running
> npm run ios
```

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useState } from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
  LogBox
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import { SplitFactory, DebugLogger } from 'splitio-react-native-private';

// Ignore Android JS timers warning. No need to worry about it: https://github.com/facebook/react-native/issues/12981#issuecomment-652745831
LogBox.ignoreLogs(['Setting a timer']);

const config: SplitIO.IReactNativeSettings = {
  core: {
    authorizationKey: 'CLIENT-SIDE-API-KEY',
    key: 'main_user_key',
  },
  scheduler: {
    featuresRefreshRate: 30000,
    segmentsRefreshRate: 30000,
    impressionsRefreshRate: 30000,
    eventsPushRate: 30000
  },
  debug: DebugLogger(),
  streamingEnabled: true,
}

const factory = SplitFactory(config);
const client = factory.client();
let isReady = false;
client.once(client.Event.SDK_READY, () => { isReady = true; });
let hasTimedout = false;
client.once(client.Event.SDK_READY_TIMED_OUT, () => { hasTimedout = true; });

// const Section: React.FC<{
//   title: string;
// }> = ({ children, title }) => {
//   const isDarkMode = useColorScheme() === 'dark';
//   return (
//     <View style={styles.sectionContainer}>
//       <Text
//         style={[
//           styles.sectionTitle,
//           {
//             color: isDarkMode ? Colors.white : Colors.black,
//           },
//         ]}>
//         {title}
//       </Text>
//       <Text
//         style={[
//           styles.sectionDescription,
//           {
//             color: isDarkMode ? Colors.light : Colors.dark,
//           },
//         ]}>
//         {children}
//       </Text>
//     </View>
//   );
// };

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [sdkState, setSdkState] = useState<string>(isReady ? 'SDK is ready' : hasTimedout ? 'SDK has timedout' : 'SDK not ready')
  if (!isReady) client.once(client.Event.SDK_READY, () => { setSdkState('SDK is ready') });
  if (!isReady && !hasTimedout) client.once(client.Event.SDK_READY_TIMED_OUT, () => { setSdkState('SDK has timedout') });

  // const [userKey, setUserKey] = useState<string>();
  const [splitName, setSplitName] = useState<string>();
  const [treatment, setTreatment] = useState<string>();
  const [eventType, setEventType] = useState<string>();
  const [trackResult, setTrackResult] = useState<boolean>();

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Text>SDK state: {sdkState}</Text>

          {/* <Text>User key:</Text>
          <TextInput
            onChangeText={(etKey) => setUserKey(etKey)}
            value={userKey}
            underlineColorAndroid='#0000ff'
            autoCapitalize='none'
          /> */}
          <Text>Split name:</Text>
          <TextInput
            onChangeText={(etSplitName) => setSplitName(etSplitName)}
            value={splitName}
            underlineColorAndroid='#0000ff'
            autoCapitalize='none'
          />
          <Button
            title='Get Treatment'
            onPress={() => { setTreatment(client.getTreatment(splitName as string)) }}
          />
          <Text>Treatment: {treatment}</Text>

          <Text>Track event:</Text>
          <TextInput
            onChangeText={(etEventType) => setEventType(etEventType)}
            value={eventType}
            underlineColorAndroid='#0000ff'
            autoCapitalize='none'
          />
          <Button
            title='Track'
            onPress={() => { setTrackResult(client.track('user', eventType as string)) }}
          />
          <Text>Track result: {new String(trackResult)}</Text>

          {/* <Section title="Step One">
            Edit <Text style={styles.highlight}>App.js</Text> to change this
             screen and then come back to see your edits.
           </Section>
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
           </Section>
          <LearnMoreLinks /> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;

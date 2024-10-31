import { settingsFactory as slimSettingsFactory } from '../index';
import { settingsFactory as fullSettingsFactory } from '../full';

test('SETTINGS / Consent is overwritable and "GRANTED" by default', () => {
  [slimSettingsFactory, fullSettingsFactory].forEach((settingsFactory) => {
    let settings = settingsFactory({});
    expect(settings.userConsent).toEqual('GRANTED'); // userConsent defaults to granted if not provided

    settings = settingsFactory({ userConsent: 'INVALID-VALUE' });
    expect(settings.userConsent).toEqual('GRANTED'); // userConsent defaults to granted if a wrong value is provided

    settings = settingsFactory({ userConsent: 'UNKNOWN' });
    expect(settings.userConsent).toEqual('UNKNOWN'); // userConsent can be overwritten

    settings = settingsFactory({ userConsent: 'declined' });
    expect(settings.userConsent).toEqual('DECLINED'); // userConsent can be overwritten
  });
});

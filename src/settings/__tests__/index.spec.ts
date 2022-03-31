import { settingsValidator as slimSettingsValidator } from '../index';
import { settingsValidator as fullSettingsValidator } from '../index';

test('SETTINGS / Consent is overwritable and "GRANTED" by default', () => {
  [slimSettingsValidator, fullSettingsValidator].forEach((settingsValidator) => {
    let settings = settingsValidator({});
    expect(settings.userConsent).toEqual('GRANTED'); // userConsent defaults to granted if not provided

    settings = settingsValidator({ userConsent: 'INVALID-VALUE' });
    expect(settings.userConsent).toEqual('GRANTED'); // userConsent defaults to granted if a wrong value is provided

    settings = settingsValidator({ userConsent: 'UNKNOWN' });
    expect(settings.userConsent).toEqual('UNKNOWN'); // userConsent can be overwritten

    settings = settingsValidator({ userConsent: 'declined' });
    expect(settings.userConsent).toEqual('DECLINED'); // userConsent can be overwritten
  });
});

import moduleraid from 'moduleraid';

import {BTDSettings} from './btdSettingsTypes';
import {TweetDeckObject} from './tweetdeckTypes';

export type BTDModuleOptions = {
  settings: BTDSettings;
  TD: TweetDeckObject;
  jq: JQueryStatic;
  mR: moduleraid;
};
type UniversalBTDModule = (opts: BTDModuleOptions) => void;

export function makeBTDModule(btdModule: UniversalBTDModule) {
  return (opts: BTDModuleOptions) => {
    try {
      btdModule(opts);
    } catch (e) {
      console.error(e);
    }
  };
}

export const BTDSettingsAttribute = 'data-btd-settings';
export const BTDUuidAttribute = 'data-btd-uuid';
export const BTDModalUuidAttribute = 'data-btd-modal-uuid';

export const getFullscreenNodeRoot = () => document.getElementById('btd-fullscreen-portal-root');
export const getFullscreenNode = () => document.getElementById('btd-fullscreen-portal-target');

const UuidSelectors = [BTDUuidAttribute, BTDModalUuidAttribute] as const;

export function makeBtdUuidSelector(
  uuidSelectors: typeof UuidSelectors[number],
  uuid?: string,
  suffix = ''
) {
  if (!uuid) {
    return `[${uuidSelectors}] ${suffix}`.trim();
  }
  return `[${uuidSelectors}="${uuid}"] ${suffix}`.trim();
}
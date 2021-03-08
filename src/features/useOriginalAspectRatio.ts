import './useOriginalAspectRatio.css';

import {isHTMLElement} from '../helpers/domHelpers';
import {ChirpAddedPayload} from '../inject/chirpHandler';
import {makeBtdUuidSelector} from '../types/betterTweetDeck/btdCommonTypes';
import {BTDSettings} from '../types/betterTweetDeck/btdSettingsTypes';
import {TweetDeckChirp, TweetDeckColumnMediaPreviewSizesEnum} from '../types/tweetdeckTypes';

export function useOriginalAspectRatio(settings: BTDSettings, addedChirp: ChirpAddedPayload) {
  if (!settings.useOriginalAspectRatioForSingleImages) {
    return;
  }

  if (
    addedChirp.columnMediaSize === TweetDeckColumnMediaPreviewSizesEnum.OFF ||
    addedChirp.columnMediaSize === TweetDeckColumnMediaPreviewSizesEnum.SMALL
  ) {
    return;
  }

  const chirp = addedChirp.chirp;
  const actualChirp = getUsefulChirp(chirp);
  const chirpNode = document.querySelector(makeBtdUuidSelector('data-btd-uuid', addedChirp.uuid));

  // If the chirp isn't in the DOM, skip.
  if (!chirpNode) {
    return;
  }

  if (!actualChirp.entities) {
    return;
  }

  const mediaEntities = actualChirp.entities.media;

  // If we don't have any media or we have more than one, skip.
  if (!mediaEntities.length || mediaEntities.length > 1) {
    return;
  }

  const singleMedia = mediaEntities[0];

  if (!singleMedia || singleMedia.type !== 'photo') {
    return;
  }

  const sizeObject = {
    width: singleMedia.sizes.large.w,
    height: singleMedia.sizes.large.h,
  };

  const mediaImageLink = chirpNode.querySelector('.js-media-image-link');

  if (!isHTMLElement(mediaImageLink)) {
    return;
  }

  mediaImageLink.classList.add('btd-aspect-ratio-thumbnail');
  mediaImageLink.style.setProperty('--btd-thumb-height', sizeObject.height.toString());
  mediaImageLink.style.setProperty('--btd-thumb-width', sizeObject.width.toString());
}

const getUsefulChirp = (chirp: TweetDeckChirp) => {
  if (chirp.retweetedStatus) {
    return chirp.retweetedStatus;
  }

  if (chirp.targetTweet) {
    return chirp.targetTweet;
  }

  return chirp;
};
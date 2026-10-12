/**
 * Centralized content repository for MAA — A Cinematic Birthday Story.
 * All text is now centralized in `/src/content/siteContent.ts`.
 * This file maintains backwards compatibility for components referencing `birthdayContent`.
 */

import { siteContent } from "../content/siteContent";

export const birthdayContent = {
  opening: siteContent.chapterOne,
  memoriesHeader: siteContent.chapterFour,
  letter: {
    envelopeTitle: siteContent.chapterThree.envelope.title,
    openButton: siteContent.chapterThree.envelope.openButton,
    letterSalutation: siteContent.chapterThree.letter.salutation,
    paragraphs: siteContent.chapterThree.letter.paragraphs,
    signature: siteContent.chapterThree.letter.signature
  },
  specialReasons: siteContent.specialReasons,
  prayer: {
    headline: siteContent.chapterFive.headline,
    introduction: siteContent.chapterFive.introduction,
    body: siteContent.chapterFive.body,
    verse: siteContent.chapterFive.verse
  },
  countdown: {
    headline: siteContent.chapterSix.headline,
    supportingText: siteContent.chapterSix.supportingText,
    startButton: "LIGHT THE CANDLES",
    wishButton: siteContent.chapterSix.wishButton
  },
  reveal: {
    greeting: siteContent.chapterSeven.greeting,
    name: siteContent.chapterSeven.name,
    portraitPath: siteContent.chapterSeven.portraitPath,
    paragraphs: siteContent.chapterSeven.paragraphs,
    closingSignature: siteContent.chapterSeven.closingSignature
  }
};

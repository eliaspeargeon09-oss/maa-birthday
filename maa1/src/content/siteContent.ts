/**
 * =======================================================================
 * 💖 MAA BIRTHDAY WEBSITE - CENTRAL TEXT & SENTENCE CONFIGURATION
 * =======================================================================
 * 
 * Edit ANY text, sentence, quote, prayer, message, or button label here!
 * Every single piece of text displayed on the website is collected in this file.
 * 
 * Changes you make here will automatically reflect across the entire site.
 */

export const siteContent = {
  // ---------------------------------------------------------------------
  // 🌐 GLOBAL NAVIGATION & HEADER BAR
  // ---------------------------------------------------------------------
  navigation: {
    brandName: "For Maa",
    scenePrefix: "Scene",
    backButton: "Back",
    continueButton: "Continue",
    // Titles displayed in the top progress bar for each scene
    chapterTitles: [
      "The Opening Film",
      "To Our Beloved Maa",
      "A Letter for Maa",
      "Our Sunlit Memories",
      "A Prayer for Maa",
      "The Birthday Countdown",
      "The Grand Birthday Reveal"
    ],
    // Labels for the bottom-right forward navigation button
    nextButtonLabels: {
      chapter2: "Read Her Letter",
      chapter3: "Sunlit Memories",
      chapter4: "A Prayer for Maa",
      chapter5: "The Birthday Countdown",
      chapter6: "The Grand Reveal",
      default: "Continue"
    }
  },

  // ---------------------------------------------------------------------
  // 🎬 CHAPTER 1: THE OPENING FILM
  // ---------------------------------------------------------------------
  chapterOne: {
    videoSrc: "/videos/maa-intro.mp4",
    posterSrc: "/images/greenery-bg.jpg",
    // First 3 lines that appear smoothly one by one
    sequenceOne: [
      "To the best of best",
      "in my time of worst",
      "Till the threshold of your love"
    ],
    // Next 2 lines that follow
    sequenceTwo: [
      "in midst of the darkness",
      "Till the light of your prayer"
    ],
    // Emotional Climax / Special Two-Line Title
    sequenceThree: {
      line1: "u r always my best",
      line2: "mom ever and ever"
    },
    continueButton: "CONTINUE OUR STORY",
    skipButton: "Skip to Message →"
  },

  // ---------------------------------------------------------------------
  // 🌿 CHAPTER 2: TO OUR BELOVED MAA (PORTRAIT & 6 CORE ATTRIBUTES)
  // ---------------------------------------------------------------------
  chapterTwo: {
    badge: "An Immersive Portrait",
    title: "Only For My Mom",
    subtitle: "Every memory, every blessing, and every breath of love in my life begins with you.",
    // The 6 qualities surrounding Maa's portrait
    messages: [
      {
        id: 1,
        title: "YOUR HEART",
        quote: "A love that makes our house feel like home.",
        position: "upper-left" as const,
        iconType: "heart" as const,
        line: { x1: 290, y1: 70, x2: 445, y2: 170 }
      },
      {
        id: 2,
        title: "YOUR KINDNESS",
        quote: "The little things you do mean more than words can say.",
        position: "upper-right" as const,
        iconType: "sun" as const,
        line: { x1: 710, y1: 70, x2: 555, y2: 170 }
      },
      {
        id: 3,
        title: "YOUR STRENGTH",
        quote: "A beautiful strength that carries us through difficult days.",
        position: "middle-left" as const,
        iconType: "shield" as const,
        line: { x1: 290, y1: 240, x2: 440, y2: 270 }
      },
      {
        id: 4,
        title: "YOUR SMILE",
        quote: "A smile that makes ordinary moments feel special.",
        position: "middle-right" as const,
        iconType: "smile" as const,
        line: { x1: 710, y1: 240, x2: 560, y2: 270 }
      },
      {
        id: 5,
        title: "YOUR PRESENCE",
        quote: "The beautiful feeling of knowing you are there.",
        position: "lower-left" as const,
        iconType: "award" as const,
        line: { x1: 290, y1: 410, x2: 445, y2: 380 }
      },
      {
        id: 6,
        title: "YOUR PRAYER",
        quote: "The efforts of your prayer is all my protection.",
        position: "lower-right" as const,
        iconType: "church" as const,
        line: { x1: 710, y1: 410, x2: 555, y2: 380 }
      }
    ],
    continueButton: "Continue The Celebration"
  },

  // ---------------------------------------------------------------------
  // 💌 CHAPTER 3: AN INTIMATE LETTER FOR MAA
  // ---------------------------------------------------------------------
  chapterThree: {
    badge: "An Intimate Message",
    title: "A Letter for Maa",
    subtitle: "Words from the deepest corners of the heart",
    envelope: {
      stampText: "FOR MAA",
      monogram: "M",
      title: "A Letter for you Maa",
      subtitle: "Written with infinite gratitude",
      clickHint: "Click envelope to open",
      openButton: "READ HER LETTER"
    },
    letter: {
      salutation: "Dearest Maa,",
      paragraphs: [
        "U r a special element in my life maa, without u this life would have missed many things",
        "In a world that moves so fast, where days blur into nights, you have always been our still point. Our sanctuary. The gentle branch that sheltered us from the fiercest storms.",
        "You loved us when you were weary. You prayed for us in the quiet hours when no one was watching. You planted hope into our hearts and taught us to look up with faith.",
        "Today, we celebrate the gift of your life. Not merely for what you do, but for the radiant grace of who you are.",
        "May this new year be filled with the warmth of morning sunlight, the peace of quiet waters, laughter that fills your soul, and blessings in every step you take.",
        "Happy Birthday, Maa. You are deeply and endlessly cherished."
      ],
      closingLabel: "Forever Your Child",
      signature: "With love, always.",
      foldBackButton: "Fold letter back",
      continueButton: "Sunlit Memories →"
    }
  },

  // ---------------------------------------------------------------------
  // 📸 CHAPTER 4: SUNLIT MEMORIES (PHOTOGRAPHIC KEEPSAKE ALBUM)
  // ---------------------------------------------------------------------
  chapterFour: {
    badge: "Keepsake Album",
    headline: "Memories That Bloom Forever",
    subheading: "Every photograph holds a sunlit piece of our story.",
    hoverOverlayText: "View Photo",
    footerHint: "Click any photograph to view in full resolution",
    continueButton: "A Prayer for Maa →",
    lightbox: {
      counterPrefix: "Photograph",
      fallbackTitle: "A Precious Beginning",
      fallbackText: "A photograph of love, laughter, and timeless warmth"
    }
  },

  // ---------------------------------------------------------------------
  // 🕊️ CHAPTER 5: A PRAYER FOR MAA
  // ---------------------------------------------------------------------
  chapterFive: {
    headline: "A PRAYER FOR YOUR LIFE, MAA",
    introduction: "Before we celebrate another year, we pause to thank God for the blessing of your life.",
    body: [
      "Heavenly Father,",
      "Thank You for the precious gift my mother's life.",
      "Thank You for her gentle hands, her patient spirit, and the boundless love she pours into our family.",
      "Lord, protect her footsteps in the year ahead. Grant her health, divine peace, and profound joy.",
      "When she is tired, be her rest. When she is uncertain, be her light.",
      "Surround her with Your unfailing presence, and let her always know how treasured she is in Your eyes and in ours.",
      "In Jesus' name, Amen."
    ],
    scriptureBadge: "A Blessing from Scripture",
    verse: {
      lines: [
        "O give thanks unto the LORD",
        "for he is good",
        "for his mercy endureth for ever."
      ],
      reference: "— Psalm 107:1"
    },
    continueButton: "The Birthday Countdown →"
  },

  // ---------------------------------------------------------------------
  // 🎂 CHAPTER 6: THE BIRTHDAY COUNTDOWN & 3D CAKE WISH
  // ---------------------------------------------------------------------
  chapterSix: {
    badge: "Anticipation",
    headline: "Maa, Make A Heartfelt Wish",
    supportingText: "A new dawn. A year of blessings. A special moment just for you.",
    // Step 1: Cake reveal
    revealMessage: "A little celebration, just for you, Maa.",
    wishButton: "LET'S MAKE A WISH",
    // Step 2: Countdown & Wish Prompt
    countdownSubtitle: "Make your wish in...",
    countdownHint: "Gathering your heartfelt prayers...",
    closeEyesTitle: "CLOSE YOUR EYES AND MAKE A WISH, MAA.",
    closeEyesSubtitle: "Take a quiet moment in your heart...",
    readyButton: "I'M READY",
    // Step 3: Candle blowing
    breezeTitle: "A gentle breeze passes across the candles...",
    breezeSubtitle: "Flames softly extinguishing...",
    // Step 4: Cake cutting
    cutCakeTitle: "NOW, LET'S CUT YOUR BIRTHDAY CAKE!",
    cutCakeSubtitle: "Slicing your delicious birthday cake...",
    // Step 5: Celebration
    celebrationTitle: "HAPPY BIRTHDAY, MAA!",
    celebrationMessage: "May your days be filled with love, joy, peace, and countless beautiful reasons to smile.",
    replayButton: "REPLAY THE CELEBRATION",
    proceedButton: "GRAND REVEAL"
  },

  // ---------------------------------------------------------------------
  // 👑 CHAPTER 7: THE GRAND BIRTHDAY REVEAL
  // ---------------------------------------------------------------------
  chapterSeven: {
    greeting: "HAPPY BIRTHDAY",
    name: "MAA ❤️",
    portraitPath: "/images/maa-portrait.jpg",
    portraitCaption: "Our Heart, Our Anchor, Our Maa",
    fallbackMat: {
      monogram: "M",
      title: "Maa",
      quote: "You are one of the most precious blessings in our lives.",
      photoSlotNotice: "Photo slot: /public/images/maa-portrait.jpg"
    },
    paragraphs: [
      "Today, we celebrate the most wonderful mother in the world.",
      "Your life is a blessing, your love is our compass, and your prayers are our greatest shield.",
      "May God crown this year with His goodness, overflow your days with peace, and bring a thousand smiles to your face.",
      "Happy Birthday, Maa. You are loved beyond words."
    ],
    closingSignature: "With all our love, today and forever.",
    buttons: {
      revisitMemories: "RELIVE OUR MEMORIES",
      watchAgain: "WATCH THE REVEAL AGAIN",
      startAgain: "START OUR JOURNEY AGAIN"
    }
  },

  // ---------------------------------------------------------------------
  // 🎁 EXTRA / COMPATIBILITY: SIX REASONS CARDS
  // ---------------------------------------------------------------------
  specialReasons: {
    headline: "Six Reasons You Are So Irreplaceable",
    subheading: "Tap each token of love to reflect upon her grace",
    tapToOpen: "Tap to open",
    revealed: "Revealed",
    progressCompleted: "All six reasons explored with deep love and gratitude.",
    progressPrefix: "of 6 reasons opened. Explore each one at your own pace.",
    continueButton: "A Prayer for Maa →",
    cards: [
      {
        id: "heart",
        number: "01",
        title: "YOUR HEART",
        message: "A sanctuary of unconditional love, forgiving endlessly and welcoming us home without condition."
      },
      {
        id: "kindness",
        number: "02",
        title: "YOUR KINDNESS",
        message: "Quiet, gentle gestures that brighten heavy days and make everyone around you feel deeply valued."
      },
      {
        id: "strength",
        number: "03",
        title: "YOUR STRENGTH",
        message: "A quiet resilience like deep roots beneath great trees, standing unshaken through life's storms."
      },
      {
        id: "presence",
        number: "04",
        title: "YOUR PRESENCE",
        message: "A calming comfort in every room. When you are near, fears soften and ordinary moments become precious."
      },
      {
        id: "smile",
        number: "05",
        title: "YOUR SMILE",
        message: "Like morning sunlight breaking through trees, your joy brings warmth and peace to our entire family."
      },
      {
        id: "faith",
        number: "06",
        title: "YOUR FAITH",
        message: "An anchor of hope and steady prayer that has guided us through darkness into light."
      }
    ]
  }
};

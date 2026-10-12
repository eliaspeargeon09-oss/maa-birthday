# A Cinematic Birthday Experience for Maa

A cinematic, interactive, and emotional storytelling website created especially to celebrate Maa's birthday. Built as a 5–7 minute guided journey across eight beautifully designed chapters.

---

## 📸 Adding Your Personal Photographs

To replace the archival placeholders with real photographs of your mother, simply add your image files to the `public/images/` directory:

| Filename | Used In | Description |
| :--- | :--- | :--- |
| `public/images/maa-portrait.jpg` | **Chapter 8** (Grand Reveal) | Her main centerpiece birthday portrait |
| `public/images/maa-1.jpg` | **Chapter 3** (Memory Gallery) | Memory Photo 1 ("A moment worth remembering") |
| `public/images/maa-2.jpg` | **Chapter 3** (Memory Gallery) | Memory Photo 2 ("The smile that brightens our home") |
| `public/images/maa-3.jpg` | **Chapter 3** (Memory Gallery) | Memory Photo 3 ("A memory we will always treasure") |
| `public/images/maa-4.jpg` | **Chapter 3** (Memory Gallery) | Memory Photo 4 ("A beautiful part of our story") |
| `public/images/maa-5.jpg` | **Chapter 3** (Memory Gallery) | Memory Photo 5 ("Grace and kindness in every step") |
| `public/images/maa-6.jpg` | **Chapter 3** (Memory Gallery) | Memory Photo 6 ("The love that holds our family together") |

> **Graceful Fallbacks**: If you run the website before adding these files, the website displays warm, elegant museum-grade archival keepsakes and monograms with zero broken image icons or layout distortion.

### Editing Captions & Adding More Photos
All gallery data is centralized in:
`src/data/memories.ts`

You can edit any caption, subheading, or add more photos directly in this file.

---

## 🎵 Adding Custom Background Music

To play your mother's favorite song or ambient acoustic instrumental:
1. Place an audio file at:
   `public/audio/birthday-background.mp3`
2. You can also customize the audio filename or volume in `src/data/audioTracks.ts`.

> **Smart Audio Fallback**: If no audio file is provided, clicking the music button plays a soothing, emotional acoustic ambient harmonic chime progression generated in real time using the Web Audio API.

---

## ✍️ Customizing the Letter & Personal Messages

All text, prayer lines, affirmations, and letters are stored in one clean data file:
`src/data/birthdayContent.ts`

- **Chapter 4 Letter**: Edit paragraphs or sign your personal name.
- **Chapter 5 Reminders**: Customize the six affirmations.
- **Chapter 6 Prayer**: Customize the prayer lines.
- **Chapter 8 Reveal**: Tailor the celebration message.

---

## 🌟 The Eight Chapters

1. **Chapter 1: The Mysterious Beginning** — Cinematic dark wine atmosphere with glowing particles and staged reveals.
2. **Chapter 2: A Story Written in Love** — Warm ivory storytelling celebrating Maa's selfless everyday acts.
3. **Chapter 3: Her Beautiful Memories** — Interactive physical scrapbook gallery with full-screen lightbox modal.
4. **Chapter 4: A Letter for Maa** — Realistic interactive envelope that unfolds to reveal an intimate heartfelt letter.
5. **Chapter 5: Six Special Reminders** — Two-column discovery cards highlighting her heart, kindness, strength, presence, smile, and faith.
6. **Chapter 6: A Prayer for Maa** — Reverent, faith-filled prayer and Numbers 6:24–26 blessing.
7. **Chapter 7: The Birthday Countdown** — Handcrafted multi-tier cake with glowing flicking candles and a wish ceremony.
8. **Chapter 8: The Grand Birthday Reveal** — The emotional climax with gold and champagne confetti, portrait frame, heartfelt message, and replay controls.

---

## ⌨️ Controls & Accessibility

- **Continue / Back**: Discreet navigation at the bottom of the screen.
- **Chapter Dots**: Jump directly to any chapter using the top progress indicator.
- **Keyboard Navigation**:
  - `Arrow Right` / `Arrow Left`: Navigate forward and backward.
  - `Escape`: Closes the memory lightbox.
  - `Tab`, `Enter`, `Space`: Fully keyboard-accessible controls.
- **Pacing**: Does not automatically advance, allowing you to guide Maa at her own reading pace.
- **Reduced Motion**: Automatically respects `prefers-reduced-motion` settings.

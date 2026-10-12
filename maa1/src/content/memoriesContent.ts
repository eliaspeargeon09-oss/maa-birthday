/**
 * =======================================================================
 * 📸 KEEPSAKE PHOTO GALLERY - MEMORIES & CAPTIONS
 * =======================================================================
 * 
 * Edit your photo paths, captions, and titles here!
 * Photos are stored in the `/public/images/` folder.
 * 
 * To add more photos in the future:
 * 1. Drop your new image file into `/public/images/` (e.g. `maa-11.jpg`)
 * 2. Add a new entry to the array below!
 */

export interface MemoryItem {
  id: string;
  image: string;
  caption: string;
  placeholderTitle: string;
  dateOrTag?: string;
  objectPosition?: string;
}

export const memoriesContent: MemoryItem[] = [
  {
    id: "mem-1",
    image: "/images/maa-1.jpg",
    caption: "Your warmth turns every ordinary day into sunshine.",
    placeholderTitle: "Sunlit Smiles",
    dateOrTag: "Cherished Moment",
    objectPosition: "center 22%"
  },
  {
    id: "mem-2",
    image: "/images/maa-2.jpg",
    caption: "The loving anchor of our home, forever flanked by her boys.",
    placeholderTitle: "Our Heart & Anchor",
    dateOrTag: "Family First",
    objectPosition: "center center"
  },
  {
    id: "mem-3",
    image: "/images/maa-3.jpg",
    caption: "A beautiful bond of devotion, companionship, and endless care.",
    placeholderTitle: "Love & Togetherness",
    dateOrTag: "Together in Love",
    objectPosition: "center 25%"
  },
  {
    id: "mem-4",
    image: "/images/maa-4.jpg",
    caption: "Dressed in elegance and radiating pure celebratory joy.",
    placeholderTitle: "Grace & Celebration",
    dateOrTag: "Celebration",
    objectPosition: "center 20%"
  },
  {
    id: "mem-5",
    image: "/images/maa-5.jpg",
    caption: "A quiet moment of serene grace and calm beauty.",
    placeholderTitle: "Serenity & Peace",
    dateOrTag: "Quiet Grace",
    objectPosition: "center 25%"
  },
  {
    id: "mem-6",
    image: "/images/maa-6.jpg",
    caption: "The tender hands that held us close and guided our steps.",
    placeholderTitle: "Tender Beginnings",
    dateOrTag: "Sweet Throwback",
    objectPosition: "center 25%"
  },
  {
    id: "mem-7",
    image: "/images/maa-7.jpg",
    caption: "Every joyous season is made sacred and warm by your prayers.",
    placeholderTitle: "Faith & Blessings",
    dateOrTag: "Festive Joy",
    objectPosition: "center 25%"
  },
  {
    id: "mem-8",
    image: "/images/maa-8.jpg",
    caption: "That carefree, joyful smile that brings light to everyone!",
    placeholderTitle: "Joy in Motion",
    dateOrTag: "Pure Happiness",
    objectPosition: "center 20%"
  },
  {
    id: "mem-9",
    image: "/images/maa-9.jpg",
    caption: "Elegance, gentleness, and a radiant soul that never dims.",
    placeholderTitle: "Timeless Radiance",
    dateOrTag: "Timeless Grace",
    objectPosition: "center 18%"
  },
  {
    id: "mem-10",
    image: "/images/maa-10.jpg",
    caption: "Every chapter of our story is sweeter because of you, Maa.",
    placeholderTitle: "A Lifetime of Love",
    dateOrTag: "Milestone",
    objectPosition: "center 25%"
  }
];

/**
 * Audio configuration and track list for Maa's Birthday experience.
 * 
 * Tracks:
 * 1. "Maa's Special Melody" - extracted high-quality audio track from 1.mp4
 * 2. "A Gentle Melody for Maa" - peaceful acoustic ambient background
 */

export interface AudioTrack {
  id: string;
  title: string;
  subtitle?: string;
  src: string;
}

export const AUDIO_TRACKS: AudioTrack[] = [
  {
    id: "special-melody",
    title: "Maa's Special Melody",
    subtitle: "Original audio melody",
    src: "/audio/birthday-track-1.mp3"
  },
  {
    id: "ambient-melody",
    title: "A Gentle Melody for Maa",
    subtitle: "Acoustic background melody",
    src: "/audio/birthday-background.mp3"
  }
];

export const AUDIO_CONFIG = {
  src: "/audio/birthday-track-1.mp3",
  title: "Maa's Special Melody",
  defaultVolume: 0.65,
  tracks: AUDIO_TRACKS
};

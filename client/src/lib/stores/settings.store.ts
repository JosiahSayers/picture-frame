import { persistentStore } from '$lib/stores/persistent-store';
import {
  blur,
  crossfade,
  draw,
  fade,
  fly,
  scale,
  slide,
} from 'svelte/transition';

export const supportedTransitions = {
  blur,
  fade,
  fly,
  slide,
  scale,
  draw,
  crossfade,
};

interface SettingsStore {
  transition: {
    name: keyof typeof supportedTransitions;
    duration: number;
  };
  autoplay: boolean;
  imageShownDuration: number;
}

export const settingsStore = persistentStore<SettingsStore>(
  {
    key: 'settings',
    type: 'object',
  },
  {
    transition: {
      name: 'slide',
      duration: 0.5,
    },
    autoplay: false,
    imageShownDuration: 10,
  }
);

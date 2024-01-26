import { derived, writable, type Writable } from 'svelte/store';

function create() {
  const images = writable<string[]>([]);
  const currentIndex = writable(0);
  const currentImage = derived<[Writable<string[]>, Writable<number>], string>(
    [images, currentIndex],
    ([imageValues, currentIndexValue], set) => {
      if (currentIndexValue < imageValues.length) {
        set(imageValues[currentIndexValue]);
      } else {
        currentIndex.set(0);
      }
    }
  );
  const intervalRef = writable(0);

  const next = () => currentIndex.update((index) => index + 1);

  return {
    subscribe: currentImage.subscribe,
    set: (newImages: string[]) => {
      images.set(newImages);
    },
    next,
    start: (displaySeconds = 10) => {
      const displayMilliseconds = displaySeconds * 1000;
      const interval = setInterval(() => next(), displayMilliseconds);
      intervalRef.set(interval as any);
    },
    stop: () => {
      intervalRef.update((ref) => {
        clearInterval(ref);
        currentIndex.set(0);
        return 0;
      });
    },
  };
}

export const slideshowStore = create();

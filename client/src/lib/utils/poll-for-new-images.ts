import { invalidate } from '$app/navigation';
import { lastImageUpload } from '$lib/stores/last-image-upload.store';

const sixtySeconds = 10 * 1000;

function setupPollForNewImages() {
  let interval: any;

  return {
    start: async (initialLastUpdate: string) => {
      lastImageUpload.set(initialLastUpdate);
      interval = setInterval(async () => {
        const res = await fetch('/api/images/last-upload');
        if (!res.ok) {
          console.log({ status: res.status, statusText: res.statusText });
        }
        const json = await res.json();
        if (json.date === null) {
          return;
        }
        const unsubscribe = lastImageUpload.subscribe((last) => {
          const lastUpdate = new Date(last);
          const newLastUpdate = new Date(json.date);
          console.log({
            shouldUpdate: newLastUpdate > lastUpdate,
          });
          if (newLastUpdate > lastUpdate) {
            console.log('Loading new images');
            invalidate('custom:new-file-uploaded');
            lastImageUpload.set(newLastUpdate.toISOString());
          }
        });
        unsubscribe();
      }, sixtySeconds);
    },
    stop: () => {
      clearInterval(interval);
    },
  };
}

export const pollForNewImages = setupPollForNewImages;

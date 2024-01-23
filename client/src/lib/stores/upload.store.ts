import { allowPageClose, confirmPageClose } from '$lib/confirm-page-clost';
import { writable, derived } from 'svelte/store';

let currentlyProcessingPromise = false;
const fileQueue: FileProgress[] = [];
const fileQueueStore = writable(fileQueue);
const failedUploads = writable<FileProgress[]>([]);
const uploadCompleted = writable<FileProgress>();
const allUploadsCompleted = writable<Date>();
const uploadHistory = writable<FileProgress[]>([]);
const queueStatus = derived<typeof fileQueueStore, QueueStatus>(
  fileQueueStore,
  (val, set) => {
    let text: QueueStatusText = 'empty';

    if (val.some((f) => f.status === 'uploading' || f.status === 'waiting')) {
      text = 'uploading';
    } else if (val.length) {
      text = 'complete';
    }
    const completed = val.filter(
      (f) => f.status === 'complete' || f.status === 'failed'
    );

    set({
      text,
      totalFiles: val.length,
      completedFiles: completed.length,
      percentComplete: ((completed.length || 0) / (val.length || 1)) * 100,
    });
  }
);

const addToQueue = (file: File) => {
  const fileProgress: FileProgress = {
    status: 'waiting',
    name: file.name,
    file: file,
  };

  if (fileQueue.length === 0) {
    confirmPageClose();
    failedUploads.set([]);
  }

  fileQueue.push(fileProgress);
  fileQueueStore.set(fileQueue);
  startUpload();
};

const updateFile = (name: string, options: { status?: FileStatus }) => {
  const file = fileQueue.find((f) => f.name === name);
  if (file) {
    file.status = options.status ?? file.status;
  }
  fileQueueStore.set(fileQueue);
};

const startUpload = async () => {
  const currentUpload =
    fileQueue.find((f) => f.status === 'uploading') ||
    fileQueue.find((f) => f.status === 'waiting');

  if (currentlyProcessingPromise) {
    return;
  }

  if (currentUpload) {
    updateFile(currentUpload.name, { status: 'uploading' });

    try {
      currentlyProcessingPromise = true;
      await uploadFile(currentUpload.file);
      currentlyProcessingPromise = false;
      updateFile(currentUpload.name, {
        status: 'complete',
      });
    } catch (e) {
      console.log(e);
      updateFile(currentUpload.name, { status: 'failed' });
      failedUploads.update((failed) => [...failed, currentUpload]);
    }
    uploadCompleted.set(currentUpload);
    await startUpload();
  } else {
    allUploadsCompleted.set(new Date());
    uploadHistory.update((history) => [...fileQueue, ...history]);
    fileQueue.splice(0, fileQueue.length);
    fileQueueStore.set(fileQueue);
    allowPageClose();
    return;
  }
};

function uploadFile(file: File) {
  const formData = new FormData();
  formData.append('name', file.name);
  formData.append('file', file);

  return fetch('/api/images', {
    method: 'post',
    body: formData,
  });
}

export const uploads = {
  addToQueue,
  fileQueue: fileQueueStore,
  uploadCompleted,
  allUploadsCompleted,
  queueStatus,
  failedUploads,
  uploadHistory,
};

export type QueueStatusText = 'empty' | 'uploading' | 'complete';

export interface QueueStatus {
  text: QueueStatusText;
  percentComplete?: number;
  totalFiles: number;
  completedFiles: number;
}

export type FileStatus = 'waiting' | 'uploading' | 'failed' | 'complete';

export interface FileProgress {
  status: FileStatus;
  name: string;
  file: File;
}

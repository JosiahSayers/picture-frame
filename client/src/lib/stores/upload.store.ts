import { allowPageClose, confirmPageClose } from '$lib/confirm-page-close';
import { writable, derived } from 'svelte/store';
import { v4 as uuid } from 'uuid';

let currentlyProcessingPromise = false;
const fileQueue: FileProgress[] = [];
const fileQueueStore = writable(fileQueue);
const uploadHistory = writable<FileProgress[]>([]);

const addToQueue = (file: File | File[]) => {
  const files = Array.isArray(file) ? file : [file];
  const fileProgresses = files.map<FileProgress>((file) => ({
    status: 'waiting',
    file,
    id: uuid(),
  }));

  const lengthBeforeNewElements = fileQueue.length;

  fileQueue.push(...fileProgresses);
  fileQueueStore.set(fileQueue);

  if (lengthBeforeNewElements === 0 && fileQueue.length > 0) {
    confirmPageClose();
    startUpload();
  }
};

const updateFile = (id: string, newStatus: FileStatus) => {
  const file = fileQueue.find((f) => f.id === id);
  if (file) {
    file.status = newStatus;
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
    updateFile(currentUpload.id, 'uploading');

    try {
      currentlyProcessingPromise = true;
      await uploadFile(currentUpload.file);
      updateFile(currentUpload.id, 'complete');
    } catch (e) {
      console.log(e);
      updateFile(currentUpload.id, 'failed');
    } finally {
      currentlyProcessingPromise = false;
    }
    startUpload();
  } else {
    uploadHistory.update((history) => [...fileQueue, ...history]);
    fileQueue.splice(0, fileQueue.length);
    fileQueueStore.set(fileQueue);
    allowPageClose();
    return;
  }
};

async function uploadFile(file: File) {
  const formData = new FormData();
  formData.append('name', file.name);
  formData.append('file', file);

  const res = await fetch('/api/images', {
    method: 'post',
    body: formData,
  });
  if (!res.ok || res.status !== 200) {
    throw new Error(`Failed to upload ${file.name}`);
  }
}

function retryFailedItems() {
  const unsubscribe = uploadHistory.subscribe((history) => {
    const failed = history.filter((file) => file.status === 'failed');
    const failedFiles = failed.map((fileProgress) => fileProgress.file);
    if (failedFiles.length > 0) {
      addToQueue(failedFiles);
    }
  });
  unsubscribe();
}

export const uploads = {
  addToQueue,
  fileQueue: fileQueueStore,
  uploadHistory,
  retryFailedItems,
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
  id: string;
  status: FileStatus;
  file: File;
}

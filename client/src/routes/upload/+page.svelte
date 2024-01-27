<script lang="ts">
  import Title from '$lib/components/title.svelte';
  import UploadStatus from '$lib/components/upload/UploadStatus.svelte';
  import { uploads } from '$lib/stores/upload.store';
  let files: FileList;
  let fileInput: HTMLInputElement;
  const queue = uploads.fileQueue;
  const uploadHistoryQueue = uploads.uploadHistory;

  queue.subscribe(console.log);

  $: {
    if (files) {
      for (const file of files) {
        uploads.addToQueue(file);
      }
      fileInput.value = '';
    }
  }
</script>

<Title>Upload</Title>

<form class="mb-24">
  <input
    type="file"
    bind:files
    bind:this={fileInput}
    multiple
    class="file-input w-full max-w-xs"
  />
</form>

<p class="text-xl mb-2">Currently Uploading</p>
<ul class="mb-20">
  {#each $queue as upload (upload.id)}
    <li>
      <UploadStatus {upload} />
    </li>
  {/each}
</ul>

<p class="text-xl mb-2">Upload History</p>
<ul>
  {#each $uploadHistoryQueue as upload (upload.id)}
    <li>
      <UploadStatus {upload} />
    </li>
  {/each}
</ul>

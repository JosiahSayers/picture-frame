<script lang="ts">
  import Title from '$lib/components/title.svelte';
  import UploadStatus from '$lib/components/upload/UploadStatus.svelte';
  import { uploads } from '$lib/stores/upload.store';
  let files: FileList;
  let fileInput: HTMLInputElement;
  const { fileQueue, uploadHistory, retryFailedItems } = uploads;

  $: {
    if (files) {
      uploads.addToQueue(Array.from(files));
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
  {#each $fileQueue as upload (upload.id)}
    <li>
      <UploadStatus {upload} />
    </li>
  {/each}
</ul>

<div class="flex items-center mb-2">
  <p class="text-xl mr-3">Upload History</p>
  <button class="btn btn-primary" on:click={retryFailedItems}
    >Retry Failed Items</button
  >
</div>
<ul>
  {#each $uploadHistory as upload (upload.id)}
    <li>
      <UploadStatus {upload} />
    </li>
  {/each}
</ul>

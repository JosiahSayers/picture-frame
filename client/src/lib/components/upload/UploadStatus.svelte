<script lang="ts">
  import CheckIcon from '$lib/components/icons/CheckIcon.svelte';
  import XIcon from '$lib/components/icons/XIcon.svelte';
  import type { FileProgress } from '$lib/stores/upload.store';

  export let upload: FileProgress;
</script>

<p class="flex items-center mb-3">
  {#if upload.status === 'uploading' || upload.status === 'waiting'}
    <span class="loading loading-bars loading-md inline-block" />
  {:else if upload.status === 'complete'}
    <CheckIcon />
  {:else}
    <XIcon />
  {/if}
  <span class="ml-1 text-lg">{upload.file.name}</span>
</p>

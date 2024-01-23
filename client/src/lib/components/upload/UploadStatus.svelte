<script lang="ts">
  import CheckIcon from '$lib/components/icons/CheckIcon.svelte';
  import XIcon from '$lib/components/icons/XIcon.svelte';
  import type { FileProgress } from '$lib/stores/upload.store';

  export let upload: FileProgress;
</script>

<p>
  <span>{upload.file.name}</span>
  {#if upload.status === 'uploading' || upload.status === 'waiting'}
    <span class="loading loading-bars loading-md inline-block" />
  {:else if upload.status === 'complete'}
    <CheckIcon />
  {:else}
    <XIcon />
  {/if}
</p>

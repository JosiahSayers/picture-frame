<script lang="ts">
  import { invalidate } from '$app/navigation';
  import TrashIcon from '$lib/components/icons/TrashIcon.svelte';
  import { clickOutside } from '$lib/utils/use-click-outside';
  import { onMount } from 'svelte';

  export let name: string;
  let showOverlay = false;
  let hoveringOnDelete = false;

  function hideOverlay() {
    showOverlay = false;
  }

  async function deleteImage() {
    try {
      const res = await fetch(`/api/images/${name}`, { method: 'DELETE' });
      invalidate('custom:new-file-uploaded');
    } catch (e) {
      console.error(e);
    }
  }

  onMount(() => {
    document.body.addEventListener('scroll', hideOverlay);
    return () => document.body.removeEventListener('scroll', hideOverlay);
  });
</script>

<button
  class="relative"
  on:click={() => (showOverlay = true)}
  use:clickOutside={hideOverlay}
>
  <img
    class="object-cover aspect-square"
    src={`/api/images/${name}`}
    loading="lazy"
    alt={name}
  />
  {#if showOverlay}
    <div class="absolute top-0 w-full text-right px-4 py-3">
      <button
        on:mouseenter={() => (hoveringOnDelete = true)}
        on:mouseleave={() => (hoveringOnDelete = false)}
        on:click={deleteImage}
      >
        <TrashIcon bold={hoveringOnDelete} />
      </button>
    </div>
  {/if}
</button>

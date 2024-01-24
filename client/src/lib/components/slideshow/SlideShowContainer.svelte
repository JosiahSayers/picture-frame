<script lang="ts">
  import { slideshowStore } from '$lib/stores/slideshow.store';
  import { createEventDispatcher, onMount } from 'svelte';

  export let show: boolean;
  let modal: HTMLDialogElement;
  const dispatch = createEventDispatcher();

  $: {
    if (show) {
      modal.show();
      slideshowStore.start(1);
    }
  }

  function keyListener(e: KeyboardEvent) {
    console.log(e.key);
    if (e.key === 'Escape') {
      slideshowStore.stop();
      modal.close();
      dispatch('close');
    }
  }

  onMount(() => {
    document.addEventListener('keydown', keyListener);
  });
</script>

<dialog bind:this={modal} class="slide-show-container modal bg-white">
  {#if show && $slideshowStore}
    <div class="modal-content">
      <img
        class="object-cover aspect-square"
        src={`/api/images/${$slideshowStore}`}
        loading="lazy"
        alt={$slideshowStore}
      />
    </div>
  {/if}
</dialog>

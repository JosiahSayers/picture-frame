<script lang="ts">
  import {
    settingsStore,
    supportedTransitions,
  } from '$lib/stores/settings.store';
  import { slideshowStore } from '$lib/stores/slideshow.store';
  import { createEventDispatcher, onMount } from 'svelte';

  export let show: boolean;
  let modal: HTMLDialogElement;
  let selectedTransition: any;
  const dispatch = createEventDispatcher();

  $: {
    if (show) {
      modal.show();
      slideshowStore.start($settingsStore.imageShownDuration);
    }
  }

  $: {
    selectedTransition = supportedTransitions[$settingsStore.transition.name];
  }

  function keyListener(e: KeyboardEvent) {
    console.log(e.key);
    if (e.key === 'Escape') {
      slideshowStore.stop();
      closeModal();
    }
  }

  function closeModal() {
    modal.close();
    dispatch('close');
  }

  onMount(() => {
    document.addEventListener('keydown', keyListener);
  });
</script>

<dialog bind:this={modal} class="slide-show-container modal bg-black">
  {#if show && $slideshowStore}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="modal-content" on:click={closeModal}>
      {#key $slideshowStore}
        <img
          class="object-contain"
          src={`/api/images/${$slideshowStore}`}
          loading="lazy"
          alt={$slideshowStore}
          transition:selectedTransition={{
            duration: $settingsStore.transition.duration * 1000,
          }}
        />
      {/key}
    </div>
  {/if}
</dialog>

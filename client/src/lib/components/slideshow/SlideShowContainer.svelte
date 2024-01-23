<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';

  export let images: string[];
  export let show: boolean;
  let modal: HTMLDialogElement;
  const dispatch = createEventDispatcher();

  $: {
    if (show) {
      modal.show();
    }
  }

  function keyListener(e: KeyboardEvent) {
    console.log(e.key);
    if (e.key === 'Escape') {
      modal.close();
      dispatch('close');
    }
  }

  onMount(() => {
    document.addEventListener('keydown', keyListener);
  });
</script>

<dialog bind:this={modal} class="slide-show-container modal bg-white">
  {#if show}
    <div class="modal-content">
      <p>{images}</p>
    </div>
  {/if}
</dialog>

<script lang="ts">
  import SlideShowContainer from '$lib/components/slideshow/SlideShowContainer.svelte';
  import Title from '$lib/components/title.svelte';
  import { slideshowStore } from '$lib/stores/slideshow.store.js';
  import { pollForNewImages } from '$lib/utils/poll-for-new-images.js';
  import { onMount } from 'svelte';
  export let data;

  $: slideshowStore.set(data.props.files);
  let showSlideshow = false;

  onMount(() => {
    const { start, stop } = pollForNewImages();
    start(data.props.lastUpdated);
    return () => stop();
  });

  async function requestFullscreen() {
    try {
      // await document.getElementById('app')!.requestFullscreen();
    } catch (e) {
      console.error("Couldn't start slideshow", e);
    } finally {
      showSlideshow = true;
    }
  }
</script>

<div class="mb-10 flex justify-between items-center w-full">
  <Title>Photos</Title>
  <div class="flex flex-wrap flex-shrink items-center justify-end gap-3">
    <a href="/upload" class="btn btn-neutral">Add Images</a>
    <a href="/settings" class="btn btn-neutral">Slideshow Settings</a>
    <button class="btn btn-primary" on:click={requestFullscreen}
      >Start Slideshow</button
    >
  </div>
</div>

<div class="grid grid-cols-2 md:grid-cols-4 gap-5 justify-center">
  {#each data.props.files as file}
    <div>
      <img
        class="object-cover aspect-square"
        src={`/api/images/${file}`}
        loading="lazy"
        alt={file}
      />
    </div>
  {/each}
</div>

<SlideShowContainer
  show={showSlideshow}
  on:close={() => (showSlideshow = false)}
/>

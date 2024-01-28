<script lang="ts">
  import { applyAction } from '$app/forms';
  import ImageListItem from '$lib/components/ImageListItem.svelte';
  import SlideShowContainer from '$lib/components/slideshow/SlideShowContainer.svelte';
  import Title from '$lib/components/title.svelte';
  import { settingsStore } from '$lib/stores/settings.store.js';
  import { slideshowStore } from '$lib/stores/slideshow.store.js';
  import { pollForNewImages } from '$lib/utils/poll-for-new-images.js';
  import { onMount } from 'svelte';
  export let data;

  $: slideshowStore.set(data.props.files);
  let showSlideshow = false;

  onMount(() => {
    const { start, stop } = pollForNewImages();
    start(data.props.lastUpdated);
    if ($settingsStore.autoplay) {
      startSlideshow();
    }
    return () => stop();
  });

  async function startSlideshow() {
    try {
      const element = document.getElementById('app') as any; // Fix for webkit functions not existing on type
      if (typeof element.webkitEnterFullscreen !== undefined) {
        await element.webkitEnterFullscreen();
      } else if (typeof element.webkitRequestFullscreen !== undefined) {
        await element.webkitRequestFullscreen();
      } else {
        await document.getElementById('app')!.requestFullscreen();
      }
    } catch (e) {
      console.error("Couldn't start fullscreen", e);
    } finally {
      showSlideshow = true;
    }
  }

  async function endSlideshow() {
    try {
      await document.exitFullscreen();
    } catch (e) {
      console.error("Couldn't exit fullscreen", e);
    } finally {
      showSlideshow = false;
    }
  }
</script>

<div class="mb-10 flex justify-between items-center w-full">
  <Title>Photos</Title>
  <div class="flex flex-wrap flex-shrink items-center justify-end gap-3">
    <a href="/upload" class="btn btn-neutral">Add Images</a>
    <a href="/settings" class="btn btn-neutral">Slideshow Settings</a>
    <button class="btn btn-primary" on:click={startSlideshow}
      >Start Slideshow</button
    >
  </div>
</div>

<div class="grid grid-cols-2 md:grid-cols-4 gap-5 justify-center">
  {#each data.props.files as file (file)}
    <ImageListItem name={file} />
  {/each}
</div>

<SlideShowContainer show={showSlideshow} on:close={endSlideshow} />

<script lang="ts">
  import SlideShowContainer from '$lib/components/slideshow/SlideShowContainer.svelte';
  import Title from '$lib/components/title.svelte';
  export let data;
  let showSlideshow = false;

  async function requestFullscreen() {
    try {
      await document.getElementById('app')!.requestFullscreen();
      showSlideshow = true;
    } catch (e) {
      console.error("Couldn't start slideshow", e);
    }
  }
</script>

<div class="mb-10 flex justify-between items-center w-full">
  <Title>Photos</Title>
  <div class="flex flex-wrap flex-shrink items-center justify-end gap-3">
    <a href="/upload" class="btn btn-primary">Add Images</a>
    <button class="btn btn-primary" on:click={requestFullscreen}
      >Start Slideshow</button
    >
  </div>
</div>

<div class="grid grid-cols-2 md:grid-cols-4 gap-5 justify-center">
  {#each data.files as file}
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
  images={data.files}
  show={showSlideshow}
  on:close={() => (showSlideshow = false)}
/>

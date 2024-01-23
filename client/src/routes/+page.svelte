<script lang="ts">
  import Title from '$lib/components/title.svelte';
  export let data;
</script>

<div class="mb-10 flex justify-between w-full">
  <Title>Photos</Title>
  <a href="/upload" class="btn btn-primary">Add Images</a>
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

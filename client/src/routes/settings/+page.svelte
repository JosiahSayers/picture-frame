<script lang="ts">
  import {
    settingsStore,
    supportedTransitions,
  } from '$lib/stores/settings.store';

  const supportedTransitionValues = Object.keys(supportedTransitions);
</script>

<label for="transition" class="form-control w-full max-w-xs">
  <div class="label">Slideshow Transition Type</div>
  <select
    name="transition"
    id="transition"
    class="select select-bordered"
    bind:value={$settingsStore.transition.name}
  >
    {#each supportedTransitionValues as transition}
      <option>{transition}</option>
    {/each}
  </select>
</label>

<label for="transition-duration" class="form-control w-full max-w-xs">
  <div class="label">
    <span class="label-text">Transition Duration Seconds</span>
  </div>
  <input
    name="transition-duration"
    id="transition-duration"
    type="number"
    class="input input-bordered w-full max-w-xs"
    step="0.1"
    bind:value={$settingsStore.transition.duration}
  />
</label>

<label for="show-image-duration" class="form-control w-full max-w-xs">
  <div class="label">
    <span class="label-text">Show Each Image For Seconds</span>
  </div>
  <input
    name="show-image-duration"
    id="show-image-duration"
    type="number"
    class="input input-bordered w-full max-w-xs"
    bind:value={$settingsStore.imageShownDuration}
  />
</label>

<div class="flex flex-col">
  <div class="form-control w-52">
    <label for="autoplay" class="cursor-pointer label">
      <span class="label-text">Autoplay Slideshow</span>
      <input
        name="autoplay"
        id="autoplay"
        type="checkbox"
        class="toggle toggle-primary"
        bind:checked={$settingsStore.autoplay}
      />
    </label>
  </div>
</div>

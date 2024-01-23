<script>
  import Navbar from '$lib/components/navbar.svelte';
  import 'tailwindcss/tailwind.css';
</script>

<Navbar />
<main class="p-6">
  <slot />
</main>

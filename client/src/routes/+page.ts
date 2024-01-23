export const ssr = false;

export async function load() {
  const images = await fetch('/api/images');
  return images.json();
}

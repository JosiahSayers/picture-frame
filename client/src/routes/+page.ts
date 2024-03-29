export const ssr = false;
export const prerender = true;

export async function load({ depends, fetch }) {
  const images = await fetch('/api/images');
  const json = await images.json();
  depends('custom:new-file-uploaded');
  return {
    props: json,
  };
}

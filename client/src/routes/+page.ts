export const ssr = false;

export async function load({ depends }) {
  const images = await fetch('/api/images');
  const json = await images.json();
  depends('custom:new-file-uploaded');
  return {
    props: json,
  };
}

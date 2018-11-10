export default function getAsset(filename, ext) {
  return require(`../assets/${filename}.${ext || 'svg'}`);
}

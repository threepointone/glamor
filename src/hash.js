// https://github.com/darkskyapp/string-hash

export default function doHash(str) {
  var hash = 5381,
    i = str.length;
  while(i) {
    hash = (hash * 33) ^ str.charCodeAt(--i);
  }
  return hash >>> 0;
}

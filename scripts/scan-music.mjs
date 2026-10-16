import { readdir, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const musicRoot = fileURLToPath(new URL('../public/music/', import.meta.url));
const supported = new Set(['.mp3', '.ogg', '.wav', '.m4a', '.aac', '.opus', '.webm']);
await mkdir(musicRoot, { recursive: true });
const catalog = {};
for (const entry of await readdir(musicRoot, { withFileTypes: true })) {
  if (!entry.isDirectory() || entry.name.startsWith('.')) continue;
  catalog[entry.name] = (await readdir(path.join(musicRoot, entry.name), { withFileTypes: true }))
    .filter((file) => file.isFile() && supported.has(path.extname(file.name).toLowerCase()))
    .map((file) => file.name)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
}
await writeFile(path.join(musicRoot, 'catalog.json'), `${JSON.stringify(catalog, null, 2)}\n`);
console.log(`Scanned ${Object.keys(catalog).length} biome music folders.`);

import { readdir, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Plugin } from 'vite';

const musicRoot = fileURLToPath(new URL('./public/music/', import.meta.url));
const audioExtensions = new Set(['.mp3', '.ogg', '.wav', '.m4a', '.aac', '.opus', '.webm']);

async function scanMusic() {
  const catalog: Record<string, string[]> = {};
  await mkdir(musicRoot, { recursive: true });
  for (const entry of await readdir(musicRoot, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name.startsWith('.')) continue;
    const files = await readdir(path.join(musicRoot, entry.name), { withFileTypes: true });
    catalog[entry.name] = files
      .filter((file) => file.isFile() && audioExtensions.has(path.extname(file.name).toLowerCase()))
      .map((file) => file.name)
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
  }
  await writeFile(path.join(musicRoot, 'catalog.json'), `${JSON.stringify(catalog, null, 2)}\n`);
  return catalog;
}

function musicCatalogPlugin(): Plugin {
  let refreshTimer: ReturnType<typeof setTimeout> | undefined;
  return {
    name: 'ishibako-music-catalog',
    async buildStart() { await scanMusic(); },
    async configureServer(server) {
      await scanMusic();
      server.watcher.add(path.join(musicRoot, '**/*'));
      const refresh = (file: string) => {
        if (!file.startsWith(musicRoot) || path.basename(file) === 'catalog.json') return;
        if (refreshTimer) clearTimeout(refreshTimer);
        refreshTimer = setTimeout(async () => {
          await scanMusic();
          server.ws.send({ type: 'custom', event: 'ishibako:music-catalog-updated', data: {} });
        }, 100);
      };
      server.watcher.on('add', refresh);
      server.watcher.on('unlink', refresh);
    },
  };
}

export default { plugins: [musicCatalogPlugin()] };

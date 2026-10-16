# Biome soundtrack folders

Put audio files directly inside a folder matching the biome/music folder. Number them `1.mp3`, `2.mp3`, `3.mp3`, and so on. You can have 3 to 8 tracks, or more. Supported formats are MP3, OGG, WAV, M4A, AAC, OPUS, and WEBM. The game scans the files actually present and selects by level seed modulo the available track count. Keep the same folder contents and seed if you want the same level to use the same song.

Example:

```text
public/music/
  meadow/1.mp3
  meadow/2.mp3
  meadow/3.mp3
  meadow/4.ogg
  snowMountain/1.mp3
  snowMountain/2.mp3
  medievalCastle/1.mp3
  smallVillage/1.mp3
  witchHut/1.mp3
```

`npm run dev` watches the folders and refreshes `catalog.json` when tracks are added or removed. `npm run build` records the tracks present at build time. No real soundtrack files are bundled in this project copy; `.gitkeep` files only preserve the empty folders.

Menu soundtrack: place the main-menu track at `public/music/menu/1.mp3`. It fades into the selected biome soundtrack when gameplay starts.

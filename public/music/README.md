# Biome soundtrack layout

Add three audio files to each biome folder using these exact filenames:

```text
public/music/
  meadow/1.mp3
  meadow/2.mp3
  meadow/3.mp3
  hills/1.mp3
  hills/2.mp3
  hills/3.mp3
  temple/1.mp3
  temple/2.mp3
  temple/3.mp3
  lavaLake/1.mp3
  lavaLake/2.mp3
  lavaLake/3.mp3
```

The runtime selects one track deterministically from the level seed:
`((seed % 3) + 3) % 3 + 1`. A given level seed and music folder therefore always resolve to the same track. By default, the folder is the exact `environment.type` string. Set `environment.musicFolder` in JSON to override it. The repository includes routing and fallback messaging, but not the user's actual music tracks yet.

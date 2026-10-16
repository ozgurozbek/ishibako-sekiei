import type { Level, LevelObject } from './types';

export type RunFrame = {
  index: number;
  action: string;
  elapsedMs?: number;
  player: LevelObject;
  objects: LevelObject[];
  attached: string[];
  moves: number;
  keyCount: number;
  shardCount?: number;
  won: boolean;
};

export type RunRecording = {
  format: 'ishibako-run-recording';
  version: number;
  level: { id: string; name: string; seed: number };
  initialLevel: Level;
  startedAt?: string;
  completed?: boolean;
  frames: RunFrame[];
};

export function parseRunRecording(input: unknown): RunRecording {
  if (!input || typeof input !== 'object') throw new Error('Recording must be a JSON object.');
  const value = input as Partial<RunRecording>;
  if (value.format !== 'ishibako-run-recording') throw new Error('This file is not an Ishibako run recording.');
  if (value.version !== 1) throw new Error(`Unsupported run recording version: ${String(value.version)}.`);
  if (!value.initialLevel || typeof value.initialLevel !== 'object' || !Array.isArray(value.frames) || value.frames.length === 0) {
    throw new Error('Recording is missing its initial level or frames.');
  }
  if (!value.level || typeof value.level.id !== 'string' || typeof value.level.name !== 'string' || !Number.isFinite(value.level.seed)) {
    throw new Error('Recording metadata is incomplete.');
  }
  for (const [index, frame] of value.frames.entries()) {
    if (!frame || typeof frame !== 'object' || !frame.player || typeof frame.player !== 'object' ||
        !Array.isArray(frame.objects) || !Array.isArray(frame.attached) ||
        !Number.isInteger(frame.index) || frame.index !== index ||
        !Number.isFinite(frame.moves) || frame.moves < 0 ||
        !Number.isFinite(frame.keyCount) || frame.keyCount < 0 ||
        (frame.shardCount !== undefined && (!Number.isFinite(frame.shardCount) || frame.shardCount < 0)) ||
        typeof frame.won !== 'boolean' || typeof frame.action !== 'string' ||
        (frame.elapsedMs !== undefined && (!Number.isFinite(frame.elapsedMs) || frame.elapsedMs < 0)) ||
        !frame.objects.every((object) => object && typeof object === 'object' && typeof object.id === 'string' && typeof object.type === 'string') ||
        !frame.attached.every((id) => typeof id === 'string')) {
      throw new Error(`Recording frame ${index} is incomplete or invalid.`);
    }
  }
  return value as RunRecording;
}

export function frameAt(recording: RunRecording, index: number): RunFrame {
  const safe = Math.max(0, Math.min(recording.frames.length - 1, Math.floor(index)));
  return recording.frames[safe];
}

export function recordingDurationMs(recording: RunRecording): number {
  return recording.frames[recording.frames.length - 1]?.elapsedMs ?? 0;
}

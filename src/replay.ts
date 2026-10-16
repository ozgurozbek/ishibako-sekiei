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
  if (!value.initialLevel || !Array.isArray(value.frames) || value.frames.length === 0) throw new Error('Recording is missing its initial level or frames.');
  for (const [index, frame] of value.frames.entries()) {
    if (!frame || typeof frame !== 'object' || !frame.player || !Array.isArray(frame.objects) || !Array.isArray(frame.attached)) {
      throw new Error(`Recording frame ${index} is incomplete.`);
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

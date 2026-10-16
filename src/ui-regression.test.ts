import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const mainSource = await readFile(new URL('./main.ts', import.meta.url), 'utf8');

test('startup layout never appends the removed bottom bar as a null node', () => {
  assert.doesNotMatch(mainSource, /appendChild\(document\.querySelector\('\.bottom'\)!\)/);
  assert.match(mainSource, /if\(topbarElement\)stageElement\.appendChild\(topbarElement\)/);
  assert.match(mainSource, /if\(levelInfoElement\)stageElement\.appendChild\(levelInfoElement\)/);
});

test('completion screen prioritizes continue and keeps replay download secondary', () => {
  const continueIndex = mainSource.indexOf('id="closeCompletion"');
  const downloadIndex = mainSource.indexOf('id="downloadRun"');
  const replayIndex = mainSource.indexOf('id="completionReplay"');
  assert.ok(continueIndex >= 0 && downloadIndex > continueIndex && replayIndex > downloadIndex);
  assert.match(mainSource.slice(continueIndex - 80, continueIndex + 120), /button id="closeCompletion"(?! class="quiet")/);
  assert.match(mainSource.slice(downloadIndex - 40, downloadIndex + 100), /button id="downloadRun" class="quiet"/);
});

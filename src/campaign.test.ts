import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { campaignDefinitions, campaignNodes, campaignNodeState, completeCampaignNode, initialCampaignProgress, nextAvailableNode } from './campaign.ts';

test('campaign starts with one available level and gates dependent nodes', () => {
  const progress = initialCampaignProgress();
  assert.equal(campaignNodeState(campaignNodes[0], progress), 'available');
  assert.equal(campaignNodeState(campaignNodes[1], progress), 'locked');
  assert.equal(nextAvailableNode(campaignNodes, progress)?.id, 'movement-01');
});

test('players may choose any available branch, while a convergence waits for every prerequisite', () => {
  let progress = completeCampaignNode(initialCampaignProgress(), 'movement-01', 7);
  progress = completeCampaignNode(progress, 'movement-02', 6);
  progress = completeCampaignNode(progress, 'rotation-01', 5);
  progress = completeCampaignNode(progress, 'rotation-02', 4);
  progress = completeCampaignNode(progress, 'lift-route', 8);
  assert.equal(campaignNodeState(campaignNodes.find((n) => n.id === 'heavy-route')!, progress), 'available');
  assert.equal(campaignNodeState(campaignNodes.find((n) => n.id === 'fragile-route')!, progress), 'available');
  assert.equal(campaignNodeState(campaignNodes.find((n) => n.id === 'laser-route')!, progress), 'available');
  assert.equal(campaignNodeState(campaignNodes.find((n) => n.id === 'convergence')!, progress), 'locked');
  progress = completeCampaignNode(progress, 'heavy-route', 12);
  progress = completeCampaignNode(progress, 'fragile-route', 9);
  assert.equal(campaignNodeState(campaignNodes.find((n) => n.id === 'convergence')!, progress), 'locked');
  progress = completeCampaignNode(progress, 'laser-route', 10);
  assert.equal(campaignNodeState(campaignNodes.find((n) => n.id === 'convergence')!, progress), 'available');
});

test('secret challenges unlock from their own prerequisite but do not become the default next level', () => {
  let progress = initialCampaignProgress();
  for (const id of ['movement-01', 'movement-02', 'rotation-01', 'rotation-02']) progress = completeCampaignNode(progress, id, 5);
  assert.equal(campaignNodeState(campaignNodes.find((n) => n.id === 'secret-orbit')!, progress), 'available');
  assert.equal(nextAvailableNode(campaignNodes, progress)?.id, 'lift-route');
});

test('campaign progress retains completion and improves best move counts', () => {
  let progress = completeCampaignNode(initialCampaignProgress(), 'movement-01', 9);
  progress = completeCampaignNode(progress, 'movement-01', 6);
  progress = completeCampaignNode(progress, 'movement-01', 8);
  assert.deepEqual(progress.completed, ['movement-01']);
  assert.equal(progress.bestMoves['movement-01'], 6);
});

test('campaign map nodes reference distinct bundled level files and have authored map coordinates', () => {
  for (const node of campaignNodes) {
    assert.ok(node.levelId.length > 0, `${node.id} needs a bundled level ID`);
    assert.ok(Number.isFinite(node.x) && Number.isFinite(node.y), `${node.id} needs hand-authored coordinates`);
    assert.ok(existsSync(new URL(`../levels/${node.levelId}.json`, import.meta.url)), `${node.id} level file should exist`);
  }
  assert.equal(new Set(campaignNodes.map((node) => node.id)).size, campaignNodes.length);
});


test('multiple campaigns have independent node graphs and every node points to a bundled level', () => {
  assert.equal(campaignDefinitions.length, 2);
  assert.notEqual(campaignDefinitions[0].id, campaignDefinitions[1].id);
  for (const campaign of campaignDefinitions) {
    const ids = new Set(campaign.nodes.map(node => node.id));
    assert.equal(ids.size, campaign.nodes.length, `${campaign.id} node IDs should be unique`);
    for (const node of campaign.nodes) {
      assert.ok(existsSync(new URL(`../levels/${node.levelId}.json`, import.meta.url)), `${campaign.id}:${node.id} level file should exist`);
      for (const prerequisite of node.requires) assert.ok(ids.has(prerequisite), `${campaign.id}:${node.id} references unknown prerequisite ${prerequisite}`);
    }
  }
});

test('Cartographer convergence requires all three mechanic branches and secrets do not block the finale', () => {
  const nodes = campaignDefinitions.find(c => c.id === 'cartographers-trials')!.nodes;
  const byId = (id: string) => nodes.find(n => n.id === id)!;
  let progress = initialCampaignProgress();
  for (const id of ['atlas-compass','atlas-prism','atlas-foundation','atlas-orbit']) progress = completeCampaignNode(progress,id,5);
  assert.equal(campaignNodeState(byId('atlas-heavy-1'), progress), 'available');
  assert.equal(campaignNodeState(byId('atlas-signal-1'), progress), 'available');
  assert.equal(campaignNodeState(byId('atlas-transit-1'), progress), 'available');
  for (const id of ['atlas-heavy-1','atlas-heavy-2','atlas-heavy-3','atlas-signal-1','atlas-signal-2','atlas-transit-1','atlas-transit-2','atlas-transit-3']) progress = completeCampaignNode(progress,id,8);
  assert.equal(campaignNodeState(byId('atlas-seal'), progress), 'locked');
  progress = completeCampaignNode(progress,'atlas-signal-3',8);
  assert.equal(campaignNodeState(byId('atlas-seal'), progress), 'available');
  assert.equal(campaignNodeState(byId('atlas-secret-triad'), progress), 'available');
  assert.equal(campaignNodeState(byId('atlas-secret-no-turn'), progress), 'locked');
});

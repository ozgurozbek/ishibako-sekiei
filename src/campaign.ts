export type CampaignNode = {
  id: string;
  title: string;
  subtitle: string;
  levelId: string;
  x: number;
  y: number;
  region: string;
  mechanics: string[];
  requires: string[];
  secret?: boolean;
  final?: boolean;
};

// Hand-authored coordinates are intentionally separate from unlock logic.
// Add, remove, or reorder nodes here without changing the campaign UI.
export const campaignNodes: CampaignNode[] = [
  { id: 'movement-01', title: 'First Steps', subtitle: 'Find your footing', levelId: 'first-steps', x: 100, y: 555, region: 'THE LOWLANDS', mechanics: ['Movement', 'Attachment'], requires: [] },
  { id: 'movement-02', title: 'Gap Garden', subtitle: 'Cross the broken path', levelId: 'gap-garden', x: 220, y: 465, region: 'THE LOWLANDS', mechanics: ['Bridges', 'Elevation'], requires: ['movement-01'] },
  { id: 'rotation-01', title: 'Plate Practice', subtitle: 'Turn the prism', levelId: 'plate-practice', x: 330, y: 375, region: 'THE OLD TEMPLE', mechanics: ['Rotation', 'Pressure plates'], requires: ['movement-02'] },
  { id: 'rotation-02', title: 'Orbit Vault I', subtitle: 'Rotate as one', levelId: 'orbit-vault-01', x: 430, y: 285, region: 'THE OLD TEMPLE', mechanics: ['Assembly rotation'], requires: ['rotation-01'] },
  { id: 'secret-orbit', title: 'Orbit Vault II', subtitle: 'The hidden triad', levelId: 'orbit-vault-02', x: 420, y: 115, region: 'SEALED SHRINE', mechanics: ['Advanced rotation'], requires: ['rotation-02'], secret: true },
  { id: 'lift-route', title: 'Two Plates, One Lift', subtitle: 'A higher route', levelId: 'plate-and-lift', x: 540, y: 285, region: 'THE OLD TEMPLE', mechanics: ['Gates', 'Lifts'], requires: ['rotation-02'] },
  { id: 'heavy-route', title: 'Advanced Mechanics', subtitle: 'Move the heavy', levelId: 'advanced-lab', x: 650, y: 155, region: 'IRONWOOD RIDGE', mechanics: ['Heavy blocks', 'Gloves', 'Belts'], requires: ['lift-route'] },
  { id: 'fragile-route', title: 'Fragile Footing', subtitle: 'Choose each step', levelId: 'fragile-footing', x: 670, y: 345, region: 'MISTFALL', mechanics: ['Fragile floor', 'Hazards'], requires: ['lift-route'] },
  { id: 'laser-route', title: 'Mechanics Lab', subtitle: 'Guide the beam', levelId: 'mechanics-lab', x: 650, y: 535, region: 'THE OLD TEMPLE', mechanics: ['Lasers', 'Mirrors', 'Lifts'], requires: ['lift-route'] },
  { id: 'convergence', title: 'Clockwork Garden', subtitle: 'Everything connects', levelId: 'mechanics-showcase', x: 800, y: 345, region: 'THE CONFLUENCE', mechanics: ['Combined mechanics'], requires: ['heavy-route', 'fragile-route', 'laser-route'], final: true },
];

export type CampaignProgress = { completed: string[]; bestMoves: Record<string, number>; lastNode?: string };
export type CampaignNodeState = 'locked' | 'available' | 'completed';

export function campaignNodeState(node: CampaignNode, progress: CampaignProgress): CampaignNodeState {
  if (progress.completed.includes(node.id)) return 'completed';
  return node.requires.every((id) => progress.completed.includes(id)) ? 'available' : 'locked';
}

export function completeCampaignNode(progress: CampaignProgress, nodeId: string, moves: number): CampaignProgress {
  const completed = progress.completed.includes(nodeId) ? [...progress.completed] : [...progress.completed, nodeId];
  const bestMoves = { ...progress.bestMoves };
  if (bestMoves[nodeId] === undefined || moves < bestMoves[nodeId]) bestMoves[nodeId] = moves;
  return { completed, bestMoves, lastNode: nodeId };
}

export function nextAvailableNode(nodes: CampaignNode[], progress: CampaignProgress): CampaignNode | undefined {
  return nodes.find((node) => !node.secret && campaignNodeState(node, progress) === 'available');
}

export function initialCampaignProgress(): CampaignProgress { return { completed: [], bestMoves: {} }; }

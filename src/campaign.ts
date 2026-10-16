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

export type CampaignDefinition = {
  id: string;
  title: string;
  tagline: string;
  footerTitle: string;
  footerTagline: string;
  regionLabels: [string, string, string, string];
  nodes: CampaignNode[];
};

const cartographerNodes: CampaignNode[] = [
  { id: 'atlas-compass', title: 'The Compass Walk', subtitle: 'Learn the lay of the land', levelId: 'atlas-compass-run', x: 95, y: 555, region: 'THE GREEN REACH', mechanics: ['Movement', 'Collectibles'], requires: [] },
  { id: 'atlas-prism', title: 'The Prism Lesson', subtitle: 'Turn a simple idea', levelId: 'atlas-prism-lesson', x: 210, y: 465, region: 'THE GREEN REACH', mechanics: ['Attachment', 'Rotation', 'Plates'], requires: ['atlas-compass'] },
  { id: 'atlas-foundation', title: 'A Broken Causeway', subtitle: 'Make a route from pieces', levelId: 'gap-garden', x: 330, y: 380, region: 'THE SUNKEN ARCHIVE', mechanics: ['Bridges', 'Elevation', 'Gloves'], requires: ['atlas-prism'] },
  { id: 'atlas-orbit', title: 'Orbit of the Pair', subtitle: 'Rotate a small assembly', levelId: 'orbit-vault-01', x: 445, y: 300, region: 'THE SUNKEN ARCHIVE', mechanics: ['Assembly rotation', 'Pressure plates'], requires: ['atlas-foundation'] },
  { id: 'atlas-secret-triad', title: 'The Cartographer’s Triad', subtitle: 'Three prisms, one turn', levelId: 'atlas-secret-triad', x: 430, y: 125, region: 'THE SEALED OBSERVATORY', mechanics: ['Advanced rotation', 'Three-block assembly'], requires: ['atlas-orbit'], secret: true },

  { id: 'atlas-heavy-1', title: 'Belt and Brawn', subtitle: 'Unlock the heavy prism', levelId: 'atlas-belt-and-brawn', x: 570, y: 160, region: 'IRONWOOD RIDGE', mechanics: ['Heavy blocks', 'Belt pickup'], requires: ['atlas-orbit'] },
  { id: 'atlas-heavy-2', title: 'The Double Draw', subtitle: 'Rotate a pair together', levelId: 'atlas-double-drag', x: 650, y: 125, region: 'IRONWOOD RIDGE', mechanics: ['Multi-block attachment', 'Rotation'], requires: ['atlas-heavy-1'] },
  { id: 'atlas-heavy-3', title: 'The Weight of Two', subtitle: 'Master both weights', levelId: 'atlas-weight-of-two', x: 720, y: 180, region: 'IRONWOOD RIDGE', mechanics: ['Heavy blocks', 'Multi-block rotation'], requires: ['atlas-heavy-2'] },

  { id: 'atlas-signal-1', title: 'The Switchback', subtitle: 'Open the way', levelId: 'atlas-switchback', x: 530, y: 360, region: 'THE SIGNAL MARSH', mechanics: ['Toggle switches', 'Gates'], requires: ['atlas-orbit'] },
  { id: 'atlas-signal-2', title: 'Lantern Line', subtitle: 'Send light across the marsh', levelId: 'atlas-lantern-line', x: 640, y: 370, region: 'THE SIGNAL MARSH', mechanics: ['Lasers', 'Receivers'], requires: ['atlas-signal-1'] },
  { id: 'atlas-signal-3', title: 'Signal Confluence', subtitle: 'Satisfy two conditions', levelId: 'atlas-signal-confluence', x: 720, y: 330, region: 'THE SIGNAL MARSH', mechanics: ['Pressure plates', 'Lasers', 'AND-gates'], requires: ['atlas-signal-2'] },

  { id: 'atlas-transit-1', title: 'Two Doors', subtitle: 'Take the impossible shortcut', levelId: 'atlas-two-doors', x: 530, y: 555, region: 'THE HIGH PASS', mechanics: ['Teleporters', 'Route planning'], requires: ['atlas-orbit'] },
  { id: 'atlas-transit-2', title: 'The Lifted Verse', subtitle: 'Cross the vertical divide', levelId: 'atlas-lifted-verse', x: 640, y: 575, region: 'THE HIGH PASS', mechanics: ['Elevation', 'Linked lifts'], requires: ['atlas-transit-1'] },
  { id: 'atlas-transit-3', title: 'Current and Crumble', subtitle: 'Keep moving forward', levelId: 'atlas-current-and-crumble', x: 720, y: 535, region: 'THE HIGH PASS', mechanics: ['Conveyors', 'Fragile floors'], requires: ['atlas-transit-2'] },

  { id: 'atlas-seal', title: 'The Threefold Seal', subtitle: 'Every signal matters', levelId: 'atlas-threefold-seal', x: 750, y: 360, region: 'THE CONFLUENCE', mechanics: ['Rotation', 'Pressure plates', 'Lasers', 'AND-gates'], requires: ['atlas-heavy-3', 'atlas-signal-3', 'atlas-transit-3'] },
  { id: 'atlas-machinery', title: 'Quiet Machinery', subtitle: 'Coordinate the moving parts', levelId: 'atlas-quiet-machinery', x: 800, y: 260, region: 'THE CONFLUENCE', mechanics: ['Multi-block rotation', 'Switches', 'Gates'], requires: ['atlas-seal'] },
  { id: 'atlas-finale', title: 'A World in Miniature', subtitle: 'Everything you have learned', levelId: 'atlas-world-in-miniature', x: 850, y: 365, region: 'THE LAST ATLAS', mechanics: ['Heavy blocks', 'Teleporters', 'Gates', 'Exploration'], requires: ['atlas-machinery'], final: true },
  { id: 'atlas-secret-no-turn', title: 'No Turning Back', subtitle: 'A fragile secret route', levelId: 'atlas-secret-no-turning-back', x: 800, y: 510, region: 'THE ASHEN MARGIN', mechanics: ['Fragile floors', 'Route planning'], requires: ['atlas-seal'], secret: true },
];

export const campaignDefinitions: CampaignDefinition[] = [
  {
    id: 'shattered-paths', title: 'The Shattered Paths', tagline: 'One world. Many ways through.', footerTitle: 'THE SHATTERED PATHS', footerTagline: 'Explore the routes. Master the mechanisms.',
    regionLabels: ['THE LOWLANDS', 'THE OLD TEMPLE', 'MISTFALL / IRONWOOD', 'THE CONFLUENCE'], nodes: campaignNodes,
  },
  {
    id: 'cartographers-trials', title: 'The Cartographer’s Trials', tagline: 'Chart every mechanism. Earn the final map.', footerTitle: 'THE CARTOGRAPHER’S TRIALS', footerTagline: 'Three routes diverge. Every route must return.',
    regionLabels: ['THE GREEN REACH', 'THE SUNKEN ARCHIVE', 'IRONWOOD / SIGNAL MARSH', 'THE CONFLUENCE'], nodes: cartographerNodes,
  },
  {
    id: 'frontier-mechanics', title: 'The Frontier Mechanisms', tagline: 'Beyond the atlas, new systems await.', footerTitle: 'THE FRONTIER MECHANISMS', footerTagline: 'Keys, signals, portals, and perilous crossings.',
    regionLabels: ['THE LOCKED MARCH', 'THE REFLECTION FEN', 'THE HIGH WORKS', 'THE LAST SURVEY'], nodes: [
      { id: 'frontier-key', title: 'The Keyed Causeway', subtitle: 'A locked route', levelId: 'frontier-key', x: 95, y: 555, region: 'THE LOCKED MARCH', mechanics: ['Keys', 'Gates'], requires: [] },
      { id: 'frontier-mirror', title: 'The Mirror Maze', subtitle: 'Bend the light', levelId: 'frontier-mirror-maze', x: 210, y: 465, region: 'THE REFLECTION FEN', mechanics: ['Mirrors', 'Receivers', 'Bridges'], requires: ['frontier-key'] },
      { id: 'frontier-heavy', title: 'The Heavy Seal', subtitle: 'Weight has a purpose', levelId: 'frontier-heavy-seal', x: 335, y: 365, region: 'THE HIGH WORKS', mechanics: ['Heavy blocks', 'Heavy-only plates'], requires: ['frontier-mirror'] },
      { id: 'frontier-signals', title: 'Two Signals', subtitle: 'Both conditions matter', levelId: 'frontier-two-signals', x: 455, y: 275, region: 'THE HIGH WORKS', mechanics: ['Switches', 'AND-gates'], requires: ['frontier-heavy'] },
      { id: 'frontier-lift', title: 'The Lift Warden', subtitle: 'Earn the ascent', levelId: 'frontier-lift-lock', x: 560, y: 180, region: 'THE HIGH WORKS', mechanics: ['Enabled lifts', 'Elevation'], requires: ['frontier-signals'] },
      { id: 'frontier-portal', title: 'Portal Freight', subtitle: 'Bring the assembly', levelId: 'frontier-portal-weight', x: 565, y: 380, region: 'THE PORTAL REACH', mechanics: ['Teleporters', 'Attached blocks'], requires: ['frontier-signals'] },
      { id: 'frontier-current', title: 'Current of Stone', subtitle: 'Let the floor carry you', levelId: 'frontier-conveyor-cross', x: 670, y: 465, region: 'THE PORTAL REACH', mechanics: ['Conveyors', 'Collectibles'], requires: ['frontier-portal'] },
      { id: 'frontier-fragile', title: 'The Last Anchor', subtitle: 'Keep the assembly whole', levelId: 'frontier-fragile-assembly', x: 690, y: 280, region: 'THE HIGH WORKS', mechanics: ['Fragile blocks', 'Assemblies'], requires: ['frontier-lift'] },
      { id: 'frontier-spikes', title: 'The Quiet Detour', subtitle: 'Choose the safe line', levelId: 'frontier-spike-detour', x: 775, y: 185, region: 'THE ASHEN MARGIN', mechanics: ['Spikes', 'Route planning'], requires: ['frontier-fragile'], secret: true },
      { id: 'frontier-bridge', title: 'Bridge on Demand', subtitle: 'Open the crossing', levelId: 'frontier-bridge-timing', x: 785, y: 390, region: 'THE REFLECTION FEN', mechanics: ['Switches', 'Bridges'], requires: ['frontier-current'] },
      { id: 'frontier-shards', title: 'The Shard Circuit', subtitle: 'Key and signal', levelId: 'frontier-shard-circuit', x: 845, y: 300, region: 'THE LAST SURVEY', mechanics: ['Keys', 'Plates', 'Gates', 'Shards'], requires: ['frontier-bridge', 'frontier-fragile'] },
      { id: 'frontier-finale', title: 'The Unfinished Map', subtitle: 'A final synthesis', levelId: 'frontier-cartographers-end', x: 850, y: 450, region: 'THE LAST SURVEY', mechanics: ['Heavy blocks', 'Lasers', 'Enabled lifts'], requires: ['frontier-shards'], final: true },
    ]
  }
];

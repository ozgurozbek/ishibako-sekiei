export type Hex = { q:number; r:number; h:number };
export type Cell = Hex & { kind?: 'normal'|'wall'|'void'|'fragile'; color?: string; support?: boolean };
export type LevelObject = Hex & { id:string; type:'player'|'block'|'plate'|'goal'|'wall'|'lift'|'laser'|'mirror'|'bridge'|'gate'|'switch'|'receiver'|'key'|'conveyor'|'teleporter'|'shard'; kind?:string; color?:string; attached?:boolean; assemblyId?:string; active?:boolean; linkedTo?:string; linkedToAll?:string[]; enabledBy?:string; direction?:number; requiresKey?:boolean };
export type Level = { version:number; metadata:{id:string;name:string;author?:string;description?:string}; rules:{moveLimit:number;rotationsCostMoves:boolean;gravity:boolean;moveLimitEnabled?:boolean}; board:{radius:number;cellSize:number;cells:Cell[]}; objects:LevelObject[]; environment:{type:string;seed:number;radius:number;density:number;palette?:string;musicFolder?:string;customization?:{tileColor?:string;fogColor?:string;lightX?:number;lightY?:number;lightZ?:number}}; presentation?:Record<string,unknown>; objectives:{requiredPlateIds:string[];requiredReceiverIds?:string[];requiredKeyIds?:string[];goalId:string} };
export const key = (p:Hex) => `${p.q},${p.r},${p.h}`;
export const xyKey = (q:number,r:number,h:number) => `${q},${r},${h}`;
export const DIRS = [{q:1,r:0},{q:1,r:-1},{q:0,r:-1},{q:-1,r:0},{q:-1,r:1},{q:0,r:1}];
export const hexDistance = (a:Hex,b:Hex) => (Math.abs(a.q-b.q)+Math.abs(a.q+a.r-b.q-b.r)+Math.abs(a.r-b.r))/2;

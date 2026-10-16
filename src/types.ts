export type Hex = { q:number; r:number; h:number };
export type Cell = Hex & { kind?: 'normal'|'wall'|'void'; color?: string; support?: boolean };
export type LevelObject = Hex & { id:string; type:'player'|'block'|'plate'|'goal'|'wall'|'lift'|'laser'|'mirror'|'bridge'|'gate'|'switch'|'receiver'; kind?:string; color?:string; attached?:boolean; assemblyId?:string; active?:boolean; linkedTo?:string; direction?:number };
export type Level = { version:number; metadata:{id:string;name:string;author?:string;description?:string}; rules:{moveLimit:number;rotationsCostMoves:boolean;gravity:boolean}; board:{radius:number;cellSize:number;cells:Cell[]}; objects:LevelObject[]; environment:{type:string;seed:number;radius:number;density:number;palette?:string;musicFolder?:string}; presentation?:Record<string,unknown>; objectives:{requiredPlateIds:string[];requiredReceiverIds?:string[];goalId:string} };
export const key = (p:Hex) => `${p.q},${p.r},${p.h}`;
export const xyKey = (q:number,r:number,h:number) => `${q},${r},${h}`;
export const DIRS = [{q:1,r:0},{q:1,r:-1},{q:0,r:-1},{q:-1,r:0},{q:-1,r:1},{q:0,r:1}];
export const hexDistance = (a:Hex,b:Hex) => (Math.abs(a.q-b.q)+Math.abs(a.q+a.r-b.q-b.r)+Math.abs(a.r-b.r))/2;

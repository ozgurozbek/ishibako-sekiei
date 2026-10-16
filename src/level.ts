import type { Level } from './types';
export const starterLevel: Level = {
  version:1,
  metadata:{id:'first-light',name:'First Light',author:'Ishibako Web',description:'Collect the key, attach the prism block, carry it onto the pressure plate, then reach the exit.'},
  rules:{moveLimit:6,rotationsCostMoves:false,gravity:true},
  board:{radius:3,cellSize:1,cells:[]},
  objects:[
    {id:'player',type:'player',q:0,r:0,h:0,color:'#f3f1e8'},
    {id:'prism-1',type:'block',kind:'standard',q:1,r:0,h:0,color:'#f0b45b'},
    {id:'key-1',type:'key',q:0,r:1,h:0,color:'#ffe58a'},
    {id:'plate-1',type:'plate',q:1,r:1,h:0,color:'#5de0c1'},
    {id:'exit-1',type:'goal',q:-2,r:1,h:0,color:'#a6a1ff'}
  ],
  environment:{type:'meadow',seed:1207,radius:10,density:.65,palette:'mint'},
  presentation:{camera:'isometric',showCoordinates:false},
  objectives:{requiredPlateIds:['plate-1'],goalId:'exit-1'}
};
export function normalizeLevel(input:Level):Level {
  const l=structuredClone(input);
  if (!l.board.cells?.length) {
    const rad=l.board.radius??3;
    for(let q=-rad;q<=rad;q++) for(let r=Math.max(-rad,-q-rad);r<=Math.min(rad,-q+rad);r++) l.board.cells.push({q,r,h:0});
  }
  return l;
}
export function validateLevel(l:Level):string[] {
  const errors:string[]=[];
  if(!l.metadata?.name) errors.push('Level needs a name.');
  if(!Array.isArray(l.board?.cells)||!l.board.cells.length) errors.push('Board needs at least one cell.');
  if((l.objects??[]).filter(o=>o.type==='player').length!==1) errors.push('Place exactly one player spawn.');
  if(!l.objects?.some(o=>o.type==='goal')) errors.push('Place a goal.');
  const ids=new Set<string>(); for(const o of l.objects??[]){if(ids.has(o.id))errors.push(`Duplicate object id: ${o.id}`);ids.add(o.id);}
  const cellKeys=new Set<string>();
  for(const c of l.board.cells??[]){const k=`${c.q},${c.r},${c.h}`;if(cellKeys.has(k))errors.push(`Duplicate board cell: ${k}`);cellKeys.add(k);}
  for(const id of l.objectives?.requiredPlateIds??[]) if(!l.objects.some(o=>o.id===id&&o.type==='plate')) errors.push(`Required plate not found: ${id}`);
  for(const id of l.objectives?.requiredReceiverIds??[]) if(!l.objects.some(o=>o.id===id&&o.type==='receiver')) errors.push(`Required receiver not found: ${id}`);
  if(l.objectives?.goalId&&!l.objects.some(o=>o.id===l.objectives.goalId&&o.type==='goal')) errors.push('Objective goalId does not reference a goal.');
  const solidKeys=new Set<string>();
  for(const o of l.objects??[]){
    if(['player','block','goal','plate','wall','lift','bridge','gate','switch','laser','mirror','receiver','key'].includes(o.type)&&!cellKeys.has(`${o.q},${o.r},${o.h}`)) errors.push(`${o.id} is outside the board.`);
    if(['block','wall','lift','bridge','gate'].includes(o.type)){const k=`${o.q},${o.r},${o.h}`;if(solidKeys.has(k))errors.push(`Multiple solid objects occupy ${k}.`);solidKeys.add(k);}
    if(['gate','bridge'].includes(o.type)&&o.linkedTo&&!l.objects.some(p=>p.id===o.linkedTo&&(p.type==='plate'||p.type==='receiver'||p.type==='key'))) errors.push(`${o.id} linkedTo must reference a pressure plate, laser receiver or key.`);
    if(o.type==='gate'&&o.requiresKey&&!l.objects.some(p=>p.type==='key')) errors.push(`${o.id} requiresKey but the level has no key collectible.`);
    if(o.type==='lift'&&o.linkedTo&&!l.objects.some(p=>p.id===o.linkedTo&&p.type==='lift')) errors.push(`${o.id} linkedTo must reference another lift.`);
    if(o.type==='block'&&o.assemblyId&&l.objects.some(p=>p.assemblyId===o.assemblyId&&p.type!=='block')) errors.push(`${o.id} assemblyId can only be shared by blocks.`);
    if(o.direction!==undefined&&(!Number.isInteger(o.direction)||o.direction<0||o.direction>5)) errors.push(`${o.id} direction must be an integer from 0 to 5.`);
  }
  return [...new Set(errors)];
}

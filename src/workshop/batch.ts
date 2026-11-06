import * as THREE from 'three';
import {mergeGeometries} from 'three/examples/jsm/utils/BufferGeometryUtils.js';
/** Bake only static, opaque, default-layer meshes. Animated pivots and contact cards remain independent. */
export function batchStatic(root:THREE.Group){
 root.updateMatrixWorld(true);
 const pools=new Map<string,{mat:THREE.Material;geo:THREE.BufferGeometry[];meshes:THREE.Mesh[]}>();
 root.traverse(o=>{
  if(!(o instanceof THREE.Mesh)||Array.isArray(o.material)||o.material.transparent||o.layers.mask!==1)return;
  let node:THREE.Object3D|null=o;while(node&&node!==root){if(node.userData.dynamic)return;node=node.parent;}
  const key=o.material.uuid;
  let pool=pools.get(key);if(!pool){pool={mat:o.material,geo:[],meshes:[]};pools.set(key,pool);}
  const geo=o.geometry.clone().applyMatrix4(o.matrixWorld);geo.deleteAttribute('tangent');
  pool.geo.push(geo);pool.meshes.push(o);
 });
 for(const pool of pools.values()){
  // All primitives have position, normal and UV; indices are normalized by mergeGeometries.
  const geo=mergeGeometries(pool.geo.map(g=>g.index?g.toNonIndexed():g),false);
  if(!geo)throw Error('Static batch geometry mismatch');
  const mesh=new THREE.Mesh(geo,pool.mat);mesh.castShadow=true;mesh.receiveShadow=true;root.add(mesh);
  for(const m of pool.meshes)m.removeFromParent();
  pool.geo.forEach(g=>g.dispose());
 }
}

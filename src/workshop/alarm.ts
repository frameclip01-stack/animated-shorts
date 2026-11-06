import * as THREE from 'three';
import {dial,brass,timber} from './textures';
export function createAlarm(){
 const root=new THREE.Group();root.position.set(.15,1.46,-.55);root.userData.dynamic=true;
 const brassMat=new THREE.MeshStandardMaterial({map:brass(),color:'#e1b973',metalness:.18,roughness:.62});
 const dark=new THREE.MeshStandardMaterial({color:'#3f3849',roughness:.8});
 const enamel=new THREE.MeshStandardMaterial({color:'#3e7976',roughness:.7});
 const add=(g:THREE.BufferGeometry,m:THREE.Material,p:[number,number,number],parent:THREE.Object3D=root)=>{const mesh=new THREE.Mesh(g,m);mesh.position.set(...p);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;};
 add(new THREE.BoxGeometry(.92,.11,.57),new THREE.MeshStandardMaterial({map:timber('alarm','#ab7855'),roughness:.8}),[0,.055,0]);
 const caseMesh=add(new THREE.CylinderGeometry(.35,.35,.23,48),enamel,[0,.47,0]);caseMesh.rotation.x=Math.PI/2;
 add(new THREE.TorusGeometry(.315,.032,8,48),brassMat,[0,.47,.13]);
 add(new THREE.CircleGeometry(.29,48),new THREE.MeshStandardMaterial({map:dial('invention',10,8,true),roughness:.9}),[0,.47,.145]);
 const hands:THREE.Group[]=[];
 for(const [length,ang] of [[.19,-1],[.24,.5]]){
  const pivot=new THREE.Group();pivot.position.set(0,.47,.155);pivot.rotation.z=ang;root.add(pivot);hands.push(pivot);
  add(new THREE.BoxGeometry(.018,length,.015),dark,[0,length*.3,0],pivot);
 }
 add(new THREE.SphereGeometry(.025,12,8),brassMat,[0,.47,.18]);
 for(const x of [-.21,.21])add(new THREE.CylinderGeometry(.028,.035,.17,12),brassMat,[x,.17,0]);
 const bells:THREE.Group[]=[];
 for(const side of [-1,1]){
  const bell=new THREE.Group();bell.position.set(side*.29,.80,0);bell.rotation.z=side*-.25;root.add(bell);bells.push(bell);
  add(new THREE.SphereGeometry(.20,24,12,0,Math.PI*2,0,Math.PI*.58),brassMat,[0,0,0],bell);
  const rim=add(new THREE.TorusGeometry(.195,.018,6,36),dark,[0,-.045,0],bell);rim.rotation.x=Math.PI/2;
  add(new THREE.SphereGeometry(.035,12,8),brassMat,[0,.205,0],bell);
 }
 const button=add(new THREE.CylinderGeometry(.078,.09,.075,20),new THREE.MeshStandardMaterial({color:'#c3514e',roughness:.6}),[0,.95,0]);
 const striker=add(new THREE.BoxGeometry(.025,.21,.025),dark,[0,.83,0]);
 // An intentionally absurd, exposed winding spring beside the case.
 const spring=new THREE.Group();spring.position.set(.45,.17,0);root.add(spring);
 const points:THREE.Vector3[]=[];for(let i=0;i<100;i++){const a=i/99*Math.PI*16;points.push(new THREE.Vector3(Math.cos(a)*.055,i/99*.4,Math.sin(a)*.055));}
 add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),100,.008,5,false),brassMat,[0,0,0],spring);
 function update(f:number){
  const on=f>=120;const t=Math.max(0,(f-120)/30),k=on?Math.min(1,t*5):0;
  root.rotation.z=k*.025*Math.sin(t*61);root.position.y=1.46+k*.008*Math.abs(Math.sin(t*53));
  bells.forEach((b,i)=>b.rotation.z=(i?-.25:.25)+k*.19*Math.sin(t*70+i*Math.PI));
  hands.forEach((h,i)=>h.rotation.z=(i?.5:-1)-t*(i?18:7));
  button.position.y=.95-(f>=120?.038:Math.sin(Math.max(0,(f-90))/30)*.005);
  striker.rotation.z=k*.3*Math.sin(t*70);spring.rotation.z=k*.11*Math.sin(t*15);spring.scale.y=1+k*.18*Math.sin(t*23);
 }
 return {root,update,button};
}

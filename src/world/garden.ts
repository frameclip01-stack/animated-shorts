import * as THREE from 'three';
import {ctex,rep,planksHD,stoneHD,grassHD,roofHD,cloudHD} from '../../templates/bridge/paint';
import {twoTone} from '../../templates/bridge/shade';
import {NOINK} from '../../templates/bridge/ink';

/** Entire set is procedural; shared painters are from the repository's bridge engine. */
export function createGarden() {
 const root=new THREE.Group();
 const material=(color:string,map?:THREE.Texture)=>twoTone(new THREE.MeshLambertMaterial({color,map:map??null}));
 const cream=material('#f1d29e'), wood=material('#ffffff',planksHD()), teal=material('#40958e');
 const stone=material('#ffffff',rep(stoneHD(),3,3));
 const add=(geo:THREE.BufferGeometry,mat:THREE.Material,pos:[number,number,number],parent:THREE.Object3D=root)=>{
  const m=new THREE.Mesh(geo,mat);m.position.set(...pos);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;
 };
 const box=(size:[number,number,number],pos:[number,number,number],mat:THREE.Material,parent=root)=>add(new THREE.BoxGeometry(...size),mat,pos,parent);
 box([14,.3,14],[0,-.18,-2],stone);
 // A warm little potting shed with a tiled gable, window trim, shutter and planked door.
 const shed=new THREE.Group();shed.position.set(-2,0,-3.5);root.add(shed);
 box([3.6,3.1,2.5],[0,1.55,0],cream,shed);
 const gable=new THREE.Shape();gable.moveTo(-1.8,0);gable.lineTo(1.8,0);gable.lineTo(0,.9);gable.closePath();
 add(new THREE.ExtrudeGeometry(gable,{depth:2.5,bevelEnabled:false}),cream,[0,3.1,-1.25],shed);
 const roofmat=material('#ffffff',roofHD('#c86d54'));
 for(const s of [-1,1]){const r=box([2.25,.16,3],[s*.95,3.56,0],roofmat,shed);r.rotation.z=s*-.44;}
 const window=material('#4b779c');
 box([1.12,1.28,.08],[.64,1.9,1.28],window,shed);
 for(const x of [.03,.65,1.26])box([.07,1.43,.12],[x,1.9,1.35],wood,shed);
 for(const y of [1.2,1.9,2.6])box([1.3,.07,.12],[.65,y,1.35],wood,shed);
 box([1.08,2.3,.12],[-1,1.16,1.29],teal,shed);
 for(let y=.25;y<2.3;y+=.26)box([1,.025,.025],[-1,y,1.37],wood,shed);
 add(new THREE.SphereGeometry(.06,10,8),material('#ffd87f'),[-.69,1.2,1.4],shed);
 box([1.75,.19,.38],[.65,1.06,1.49],wood,shed);
 // Raised beds and repeating pickets establish depth behind the character.
 for(let x=-5;x<6;x+=.34)box([.13,1.15,.13],[x,.62,-5],material('#e6c59c'));
 for(const y of [.35,.9])box([11,.1,.1],[0,y,-5.05],wood);
 box([2.4,.6,1.5],[2.7,.3,-2.5],wood);
 box([2.16,.05,1.26],[2.7,.64,-2.5],material('#664953'));
 const leaf=material('#78b446');const stalk=material('#487b42');
 function plant(x:number,y:number,z:number,scale=1){
   add(new THREE.CylinderGeometry(.025*scale,.04*scale,.65*scale,8),stalk,[x,y+.3*scale,z]);
   for(let i=0;i<4;i++){
    const s=i%2?1:-1;const m=add(new THREE.SphereGeometry(1,12,8),leaf,[x+s*.15*scale,y+(.2+i*.12)*scale,z]);
    m.scale.set(.24*scale,.075*scale,.1*scale);m.rotation.z=s*.45;
   }
 }
 for(let i=0;i<6;i++)plant(1.8+(i%3)*.65,.65,-2.8+Math.floor(i/3)*.6,.65);
 // Oversized seedling in an ochre terracotta pot, beside Mira's raised hand.
 const potmat=material('#cf7452');
 add(new THREE.CylinderGeometry(.39,.26,.66,16),potmat,[1.13,.36,.65]);
 add(new THREE.TorusGeometry(.39,.065,8,24),potmat,[1.13,.69,.65]).rotation.x=Math.PI/2;
 add(new THREE.CylinderGeometry(.34,.34,.035,16),material('#58404b'),[1.13,.68,.65]);
 plant(1.13,.7,.65,1.65);
 // Hand-built stepping stones and loose terracotta pots.
 for(let i=0;i<5;i++)box([.7,.045,.48],[-1.2+i*.15,.005,2.3+i*.65],material(i%2?'#cdbbaf':'#ead3b3'));
 for(const [x,z] of [[-2.4,.2],[2.1,-.2]]){
  add(new THREE.CylinderGeometry(.27,.18,.42,12),potmat,[x,.23,z]);plant(x,.43,z,.7);
 }
 // Distant greenery, roof silhouettes and softer blue hills.
 const grass=material('#ffffff',grassHD());
 for(let i=0;i<7;i++){
  const m=add(new THREE.SphereGeometry(1,20,12),grass,[i*3-9,.1,-9-(i%2)*3]);m.scale.set(3,2+(i%3),2);
 }
 for(let i=0;i<5;i++){
  box([1.5,2+i%2,1.2],[i*2-5,1,-11],material(['#c996a8','#9eacc4','#e7bb8b'][i%3]));
 }
 // Clouds are painted Canvas2D sprites, excluded from geometric ink.
 for(let i=0;i<3;i++){
  const m=add(new THREE.PlaneGeometry(4,2),new THREE.MeshBasicMaterial({map:cloudHD(i+8),transparent:true,depthWrite:false}),[i*6-7,7+i*.8,-13]);m.layers.set(NOINK);
 }
 // Ground contact pool: a smooth elliptical alpha gradient, no rectangular edge.
 const blob=ctex('mira-contact',128,128,g=>{
  const gr=g.createRadialGradient(64,64,4,64,64,64);gr.addColorStop(0,'rgba(57,39,78,.44)');gr.addColorStop(1,'rgba(57,39,78,0)');g.fillStyle=gr;g.fillRect(0,0,128,128);
 });
 const shadow=add(new THREE.PlaneGeometry(1.1,.7),new THREE.MeshBasicMaterial({map:blob,transparent:true,depthWrite:false}),[-.28,.006,.91]);shadow.rotation.x=-Math.PI/2;shadow.layers.set(NOINK);
 return root;
}

import * as THREE from 'three';
import {ctex,rep,rng} from '../../templates/bridge/paint';
import {NOINK} from '../../templates/bridge/ink';
import {timber,wallpaper,brass,dial} from './textures';

export function workshop(animated=false){
 const root=new THREE.Group();
 const rig={clocks:[] as THREE.Group[],hands:[] as THREE.Group[],gears:[] as THREE.Mesh[],loose:[] as THREE.Mesh[],lamp:new THREE.Group()};
 root.userData.rig=rig;

 const mat=(color:string,map:THREE.Texture|null=null,metalness=0)=>new THREE.MeshStandardMaterial({color,map,roughness:metalness?.42:.86,metalness});
 const walnut=mat('#ffffff',timber('walnut','#76503e'));
 const honey=mat('#ffffff',timber('edge','#ae7951'));
 const darkwood=mat('#ffffff',timber('dark','#483a39'));
 const gold=mat('#ffffff',brass(),.22);const steel=mat('#858b9d',null,.65);
 const black=mat('#32333d');const velvet=mat('#496a65');
 const add=(geo:THREE.BufferGeometry,m:THREE.Material,x:number,y:number,z:number,parent:THREE.Object3D=root)=>{
  const mesh=new THREE.Mesh(geo,m);mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;
 };
 const box=(w:number,h:number,d:number,x:number,y:number,z:number,m=walnut,parent:THREE.Object3D=root)=>add(new THREE.BoxGeometry(w,h,d),m,x,y,z,parent);
 const cylinder=(r:number,h:number,x:number,y:number,z:number,m=gold,parent:THREE.Object3D=root)=>{
  const mesh=add(new THREE.CylinderGeometry(r,r,h,24),m,x,y,z,parent);
  if(animated&&parent===root&&y>1.48&&y<2.02&&h<.32){rig.loose.push(mesh);mesh.userData.dynamic=true;}
  return mesh;
 };
 const torus=(r:number,t:number,x:number,y:number,z:number,m=gold,parent:THREE.Object3D=root)=>add(new THREE.TorusGeometry(r,t,8,48),m,x,y,z,parent);
 function rod(a:THREE.Vector3,b:THREE.Vector3,r:number,m:THREE.Material,parent=root){const mesh=add(new THREE.CylinderGeometry(r,r,a.distanceTo(b),12),m,0,0,0,parent);mesh.position.copy(a).add(b).multiplyScalar(.5);mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),b.clone().sub(a).normalize());return mesh;}
 // Broad real planks, separate geometry and subdued joints: no game-like grid.
 const floorMaps=['#a99076','#9b7f67','#b3997f','#8f796b'].map((color,i)=>mat('#ffffff',timber('floor'+i,color,1))); 
 const rand=rng(1871);
 for(let iz=0;iz<16;iz++)for(let ix=0;ix<6;ix++){
  const x=-5.25+ix*2.1+(iz%2)*1.05,z=4.3-iz*.55;
  box(2.085,.08,.54,x,-.06,z,floorMaps[Math.floor(rand()*4)]);
 }
 // Room shell, aged paper, wainscot and ceiling trim.
 const paper=mat('#ffffff',rep(wallpaper(),4,2));
 box(12,5.5,.16,0,2.7,-4.5,paper);box(.16,5.5,12,-4.7,2.7,-.4,paper);
 box(12,1.08,.14,0,.54,-4.35,darkwood);
 for(let x=-5.5;x<6;x+=.55)box(.055,1.05,.05,x,.52,-4.25,honey);
 for(const y of [.12,1.08,4.85])box(12,.09,.18,0,y,-4.23,honey);
 box(.18,1.08,12,-4.56,.54,-.4,darkwood);
 box(.22,.22,12,-4.51,4.9,-.4,darkwood);
 // Bench: substantial slab, chamfered edging, legs, drawers, pegs, stretchers.
 box(4.55,.24,1.65,0,1.24,-.6,honey);
 box(4.32,.11,1.52,0,1.39,-.6,walnut);
 for(const x of [-1.92,1.92])for(const z of [-1.16,-.04]){
  box(.22,1.17,.22,x,.59,z,walnut);box(.27,.12,.27,x,.13,z,darkwood);
 }
 box(3.98,.18,.16,0,.28,-1.16,darkwood);
 box(.16,.16,1.2,-1.92,.28,-.6,honey);box(.16,.16,1.2,1.92,.28,-.6,honey);
 box(4.2,.4,.17,0,.94,.15,darkwood);
 for(let i=0;i<4;i++){
  const x=-1.56+i*1.04;box(.97,.32,.10,x,.95,.26,walnut);
  for(const y of [.82,1.08])box(.91,.018,.025,x,y,.32,honey);
  cylinder(.035,.07,x,.96,.35,gold).rotation.x=Math.PI/2;
 }
 // Worn green repair mat leaves timber edges visible.
 box(1.45,.025,.88,.26,1.46,-.37,velvet);
 // Contact occlusion decals: local soft pools under props/legs, also under the bench.
 const ao=ctex('workshop-occlusion',128,128,g=>{
  const q=g.createRadialGradient(64,64,3,64,64,63);q.addColorStop(0,'rgba(25,19,32,.58)');q.addColorStop(.5,'rgba(25,19,32,.21)');q.addColorStop(1,'rgba(25,19,32,0)');g.fillStyle=q;g.fillRect(0,0,128,128);
 });
 function contact(x:number,y:number,z:number,w:number,d:number,opacity=.7){const m=add(new THREE.PlaneGeometry(w,d),new THREE.MeshBasicMaterial({map:ao,transparent:true,opacity,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2}),x,y,z);m.rotation.x=-Math.PI/2;m.layers.set(NOINK);}
 contact(0,.002,-.6,4.9,2.5,.7);contact(1.35,.006,1.0,.68,.4,.9);
 // Reusable actual toothed gears: bevelled metal, open hub, radial spokes.
 function gear(radius:number,teeth:number,x:number,y:number,z:number,rotation=0,parent:THREE.Object3D=root){
  const s=new THREE.Shape();for(let i=0;i<teeth*4;i++){const a=i/(teeth*4)*Math.PI*2;const rr=radius*(i%4===1||i%4===2?1:.82);const px=Math.cos(a)*rr,py=Math.sin(a)*rr;if(i===0)s.moveTo(px,py);else s.lineTo(px,py);}s.closePath();
  const hole=new THREE.Path();hole.absarc(0,0,radius*.3,0,Math.PI*2,true);s.holes.push(hole);
  const m=add(new THREE.ExtrudeGeometry(s,{depth:radius*.15,bevelEnabled:true,bevelSize:.008,bevelThickness:.008,bevelSegments:1,steps:1}),gold,x,y,z,parent);m.rotation.z=rotation;if(animated){rig.gears.push(m);m.userData.dynamic=true;}return m;
 }
 function clock(x:number,y:number,z:number,r:number,key:string,material=walnut,parent:THREE.Object3D=root){
  if(animated){const group=new THREE.Group();group.position.set(x,y,z);parent.add(group);parent=group;x=0;y=0;z=0;group.userData.dynamic=true;rig.clocks.push(group);}
  const body=cylinder(r,r*.3,x,y,z,material,parent);body.rotation.x=Math.PI/2;
  torus(r*.91,r*.07,x,y,z+r*.18,gold,parent);
  const face=add(new THREE.CircleGeometry(r*.82,64),mat('#ffffff',dial(key,10,8,animated)),x,y,z+r*.22,parent);
  if(animated){
   for(const [len,width,angle] of [[r*.49,r*.045,-Math.PI/3],[r*.65,r*.025,Math.PI/4]]){
    const hand=new THREE.Group();hand.position.set(0,0,r*.235);parent.add(hand);hand.rotation.z=angle;
    box(width,len,.018,0,len*.33,.0,black,hand);rig.hands.push(hand);
   }
   const hub=add(new THREE.SphereGeometry(r*.045,12,8),gold,0,0,r*.25,parent);hub.scale.z=.3;
  }
  face.receiveShadow=true;
  return face;
 }
 // Three hanging clocks, each with a distinct silhouette.
 clock(-1.65,3.37,-4.18,.56,'regulator');
 box(.85,1.1,.27,-1.65,2.42,-4.08,walnut);
 const glass=mat('#2f484e');box(.59,.73,.025,-1.65,2.43,-3.92,glass);
 rod(new THREE.Vector3(-1.65,2.82,-3.86),new THREE.Vector3(-1.65,2.2,-3.86),.018,gold);
 const pend=cylinder(.14,.025,-1.65,2.2,-3.83,gold);pend.rotation.x=Math.PI/2;
 for(const x of [-2.1,-1.2])box(.045,.85,.05,x,2.43,-3.86,honey);
 clock(.15,3.8,-4.18,.43,'wall-round',darkwood);
 box(1.05,.08,.40,.15,3.26,-4.05,honey);
 clock(2.1,3.3,-4.18,.53,'ornate');
 for(let i=0;i<16;i++){const a=i*Math.PI/8;cylinder(.035,.05,2.1+Math.cos(a)*.61,3.3+Math.sin(a)*.61,-4.17,gold).rotation.x=Math.PI/2;}
 // Tall longcase clock in the right-back alcove.
 box(.88,2.9,.48,3.25,1.48,-3.65,darkwood);
 box(1.02,.15,.60,3.25,3,-3.65,honey);clock(3.25,2.59,-3.37,.36,'longcase');
 box(.59,1.6,.04,3.25,1.33,-3.37,glass);
 rod(new THREE.Vector3(3.25,2,-3.31),new THREE.Vector3(3.25,.9,-3.31),.022,gold);
 cylinder(.2,.035,3.25,.9,-3.29,gold).rotation.x=Math.PI/2;
 for(const x of [2.87,3.63])box(.07,2.9,.08,x,1.48,-3.32,honey);
 // Rear shelves: jars of screws, books, coiled wire, clock blanks and pigeonholes.
 for(const y of [1.65,2.35])box(2.8,.09,.45,-.1,y,-4.0,honey);
 for(let i=0;i<7;i++){
  const x=-1.3+i*.38;
  cylinder(.11,.29,x,1.84,-3.96,mat(i%2?'#536b70':'#98775c'));
  cylinder(.12,.035,x,2.0,-3.96,gold);
  box(.28,.16,.28,x,2.49,-3.96,i%2?darkwood:walnut);
 }
 // Tools hung from a board on the left, each made from working parts.
 box(.95,1.25,.09,-3.12,2.28,-4.1,walnut);
 for(let i=0;i<4;i++){
  const x=-3.42+i*.19;box(.055,.29,.055,x,2.35,-4.0,mat(['#a9694e','#aa954f','#62596c','#8f6051'][i]));
  box(.022,.24,.022,x,2.09,-4.0,steel);torus(.027,.007,x,2.57,-4.0,steel);
 }
 // Open clock movement on a wooden cradle, not an untextured box.
 box(.75,.13,.41,animated?-2.0:-1.22,1.53,-.65,darkwood);
 const movement=new THREE.Group();movement.position.set(animated?-2.0:-1.22,1.62,-.65);root.add(movement);
 box(.57,.64,.055,0,.3,0,mat('#6d6252'),movement);
 for(const [x,y,r,t] of [[-.15,.35,.18,16],[.15,.43,.15,14],[.1,.13,.12,12]])gear(r,t,x,y,.05,.2,movement);
 for(const x of [-.25,.25])for(const y of [.05,.6])add(new THREE.SphereGeometry(.023,8,8),gold,x,y,.09,movement);
 // Mantel clock on left tabletop, winding key and feet.
 box(.64,.12,.37,-1.96,1.55,-.75,walnut);clock(-1.96,1.93,-.76,.29,'mantel');
 for(const x of [-2.19,-1.73])cylinder(.042,.07,x,1.49,-.73,gold);
 // Loose gears lie on the mat, physically touching it.
 for(const [x,z,r] of [[-.1,-.25,.16],[.37,-.47,.19],[.7,-.17,.11]]){
  const m=gear(r,16,x,1.49,z,.5);m.rotation.x=-Math.PI/2;contact(x,1.477,z,r*3,r*3);
 }
 // Tweezers, jeweller's hammer, screwdriver, loupe, oil bottle, cup and tray.
 box(.07,.055,.58,.9,1.53,-.85,walnut).rotation.y=.3;box(.25,.10,.09,1,1.55,-1.09,steel);
 box(.055,.045,.29,1.13,1.53,-.12,mat('#91534a')).rotation.y=-.5;
 box(.023,.018,.33,1.27,1.53,.15,steel).rotation.y=-.5;
 for(const x of [-.02,.045])box(.012,.012,.45,x+.35,1.51,-.85,steel).rotation.y=-.4;
 torus(.10,.025,1.55,1.52,-.9,black).rotation.x=-Math.PI/2;
 cylinder(.07,.18,1.77,1.55,-.14,mat('#3d756f'));cylinder(.04,.08,1.77,1.68,-.14,gold);
 cylinder(.13,.20,1.93,1.56,-.7,mat('#b8c3b4'));torus(.12,.018,1.93,1.67,-.7,honey).rotation.x=-Math.PI/2;
 box(.59,.055,.34,-.67,1.52,.0,darkwood);
 for(let i=0;i<18;i++)cylinder(.015,.012,-.89+rand()*.43,1.56,-.12+rand()*.24,steel);
 for(const [x,z,w,d] of [[-1.22,-.65,.9,.6],[-1.96,-.75,.8,.6],[1.8,-.14,.3,.3],[1.93,-.7,.4,.4]])contact(x,1.455,z,w,d,.8);
 // Mechanical drawings on cream paper (original diagram, no captions).
 const drawing=ctex('clock-blueprint',512,512,g=>{
  g.fillStyle='#cfc3a6';g.fillRect(0,0,512,512);g.strokeStyle='#7e7b78';g.lineWidth=2;
  for(let i=0;i<4;i++){g.beginPath();g.arc(120+(i%2)*200,120+Math.floor(i/2)*220,60+i*6,0,7);g.stroke();g.beginPath();g.moveTo(25,120+i*80);g.lineTo(485,120+i*80);g.stroke();}
 });
 const paperMesh=add(new THREE.PlaneGeometry(.7,.55),mat('#ffffff',drawing),.94,1.48,-.53);paperMesh.rotation.set(-Math.PI/2,0,.15);
 // Foreground crop: a vise and blurred wooden storage case add near depth.
 box(.35,.13,.3,-2.03,1.49,.06,steel);box(.25,.4,.21,-2.03,1.13,.35,steel);
 rod(new THREE.Vector3(-2.25,.98,.42),new THREE.Vector3(-1.84,.98,.42),.019,steel);
 box(1.4,.58,.85,-.65,.29,3.0,darkwood);box(1.5,.08,.92,-.65,.62,3,honey);
 for(const x of [-1.13,-.17])box(.035,.63,.91,x,.31,3,gold);
 for(const y of [.2,.4]){box(1.25,.022,.025,-.65,y,3.44,honey);box(.17,.035,.045,-.65,y+.07,3.47,gold);}
 cylinder(.17,.16,-.45,.74,3.04,walnut);cylinder(.22,.035,-.45,.67,3.04,honey);cylinder(.22,.035,-.45,.83,3.04,honey);
 for(let i=0;i<8;i++)torus(.175,.007,-.45,.68+i*.019,3.04,gold).rotation.x=Math.PI/2;
 for(let i=0;i<45;i++){
  const x=-.7+rand()*1.8,z=.8+rand()*1.7;
  const shaving=add(new THREE.PlaneGeometry(.025+rand()*.065,.008+rand()*.014),mat(i%3?'#c09b6e':'#e1bd89'),x,.004,z);shaving.rotation.set(-Math.PI/2,0,rand()*Math.PI);
 }

 // Overhead practical: brass cap, enamel bell shade, glowing bulb and focused pool.
 const cord=rod(new THREE.Vector3(-.1,5,0),new THREE.Vector3(-.1,3.82,0),.016,black);
 const shade=add(new THREE.ConeGeometry(.45,.3,40,1,true),mat('#384d4e'),-.1,3.84,0);shade.material.side=THREE.DoubleSide;
 const bulb=add(new THREE.SphereGeometry(.095,20,16),new THREE.MeshStandardMaterial({color:'#fff0ce',emissive:'#ffcf81',emissiveIntensity:4}),-.1,3.66,0);bulb.layers.set(NOINK);
 const spot=new THREE.SpotLight('#ffe4b5',30,11,.95,.65,1.8);spot.position.set(-.1,3.63,0);spot.target.position.set(0,0,-.3);spot.castShadow=true;spot.shadow.mapSize.set(animated?1024:2048,animated?1024:2048);spot.shadow.bias=-.0002;spot.shadow.normalBias=.015;root.add(spot,spot.target);
 if(animated){
  rig.lamp.position.set(-.1,5,0);root.add(rig.lamp);rig.lamp.userData.dynamic=true;
  for(const item of [cord,shade,bulb,spot]){item.position.sub(rig.lamp.position);rig.lamp.add(item);}
 }

 // Directional side key suggests a high window out of shot; cool low fill preserves colored darks.
 const key=new THREE.DirectionalLight('#ffead1',2.0);key.position.set(-3.2,5,4);key.castShadow=true;key.shadow.mapSize.set(animated?1024:2048,animated?1024:2048);
 Object.assign(key.shadow.camera,{left:-7,right:7,top:7,bottom:-7,near:.1,far:28});key.shadow.bias=-.0002;key.shadow.normalBias=.025;root.add(key);
 const wallBounce=new THREE.PointLight('#d1b69b',6,7,2);wallBounce.position.set(-.6,2.8,-2.65);root.add(wallBounce);
 root.add(new THREE.HemisphereLight('#b9b6d9','#8b777b',.95));
 const fill=new THREE.PointLight('#a5b7ec',8,10,2);fill.position.set(3,2.8,2);root.add(fill);
 if(animated){
  for(const light of [key,spot])light.shadow.camera.layers.enable(NOINK);
  for(const item of [...rig.clocks,...rig.hands,...rig.gears,...rig.loose]){
   item.userData.basePosition=item.position.clone();item.userData.baseRotation=item.rotation.clone();
  }
 }
 return root;
}

import * as THREE from 'three';
import {NOINK} from '../../templates/bridge/ink';
/** Height and microsurface variation come from the same painted pixels, so grain and shading stay registered. */
export function improveSurfaces(root:THREE.Group,groundContact=true){
 const done=new Set<THREE.Material>();
 root.traverse(o=>{
  if(!(o instanceof THREE.Mesh))return;
  for(const m of (Array.isArray(o.material)?o.material:[o.material])){
   if(done.has(m)||!(m instanceof THREE.MeshStandardMaterial))continue;done.add(m);
   if(!m.map||!m.map.image||m.emissiveIntensity>1)continue;
   const map=m.map,source=map.image as HTMLCanvasElement;
   const cv=document.createElement('canvas');cv.width=cv.height=512;const g=cv.getContext('2d')!;g.drawImage(source,0,0,512,512);
   const pixels=g.getImageData(0,0,512,512);const rough=g.createImageData(512,512),height=g.createImageData(512,512);
   for(let i=0;i<pixels.data.length;i+=4){
    const l=(pixels.data[i]*.2126+pixels.data[i+1]*.7152+pixels.data[i+2]*.0722)/255;
    const h=Math.max(0,Math.min(255,Math.round(128+(l-.5)*275)));
    const r=Math.max(105,Math.min(248,Math.round((m.metalness>.1?122:170)+l*64)));
    for(let k=0;k<3;k++){rough.data[i+k]=r;height.data[i+k]=h;}
    rough.data[i+3]=height.data[i+3]=255;
   }
   const texture=(data:ImageData)=>{const c=document.createElement('canvas');c.width=c.height=512;c.getContext('2d')!.putImageData(data,0,0);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.NoColorSpace;t.wrapS=map.wrapS;t.wrapT=map.wrapT;t.repeat.copy(map.repeat);t.anisotropy=4;return t;};
   m.roughnessMap=texture(rough);m.bumpMap=texture(height);m.bumpScale=m.metalness>.1?.0015:.014;m.roughness=m.metalness>.1?.85:.96;m.needsUpdate=true;
  }
 });
 // Fine directional light, softer colored fill and a distinct practical pool; no added geometric clutter.
 root.traverse(o=>{
  if(o instanceof THREE.DirectionalLight){o.intensity=2.3;o.color.set('#ffe3bf');}
  if(o instanceof THREE.HemisphereLight)o.intensity=.78;
  if(o instanceof THREE.SpotLight){o.intensity=39;o.penumbra=.75;}
 });
 if(!groundContact)return;
 const cv=document.createElement('canvas');cv.width=cv.height=128;const g=cv.getContext('2d')!;
 const gradient=g.createRadialGradient(64,64,3,64,64,64);gradient.addColorStop(0,'rgba(38,23,49,.5)');gradient.addColorStop(1,'rgba(38,23,49,0)');g.fillStyle=gradient;g.fillRect(0,0,128,128);
 const tex=new THREE.CanvasTexture(cv);tex.colorSpace=THREE.SRGBColorSpace;
 const contact=new THREE.Mesh(new THREE.PlaneGeometry(.8,.5),new THREE.MeshBasicMaterial({map:tex,transparent:true,depthWrite:false}));contact.position.set(1.55,.007,1);contact.rotation.x=-Math.PI/2;contact.layers.set(NOINK);root.add(contact);
}

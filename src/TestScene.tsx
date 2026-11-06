import {useEffect,useMemo} from 'react';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {EffectComposer} from '@react-three/postprocessing';
import * as THREE from 'three';
import {ToneMappingEffect,ToneMappingMode} from 'postprocessing';
import {InkPass,NOINK} from '../templates/bridge/ink';
import {LensBlur} from '../templates/bridge/lensblur';
import {TONE,CHAR} from '../templates/bridge/shade';
import {createMira} from './character/mira';
import {createGarden} from './world/garden';

function GardenSet() {
 const {scene,camera}=useThree();
 const assets=useMemo(()=>{
  const root=createGarden();root.add(createMira());
  const key=new THREE.DirectionalLight('#fff0d5',2.4);key.position.set(-3.5,7,5);key.castShadow=true;
  key.shadow.mapSize.set(2048,2048);key.shadow.camera.left=-8;key.shadow.camera.right=8;
  key.shadow.camera.top=9;key.shadow.camera.bottom=-8;key.shadow.camera.near=.1;key.shadow.camera.far=35;
  key.shadow.bias=-.0003;key.shadow.normalBias=.025;root.add(key);root.add(key.target);
  root.add(new THREE.HemisphereLight('#dce7ff','#bca091',1));
  TONE.uLitCol.value.set(1.5,1.42,1.3);TONE.uShadeCol.value.set(.58,.58,.84);
  CHAR.uCharTint.value.set(1,.97,.95);CHAR.uGrad.value=.04;CHAR.uBodyGrad.value=.12;
  const ink=new InkPass(scene,camera as THREE.PerspectiveCamera,{widthNear:3.4,widthFar:2.4,distNear:3,distFar:25,color:'#241726'});
  const lens=new LensBlur({maxCoC:18});lens.focus=camera.position.distanceTo(new THREE.Vector3(-.28,1.9,.9));lens.cInf=8;
  const tone=new ToneMappingEffect({mode:ToneMappingMode.NEUTRAL});
  return {root,ink,lens,tone};
 },[scene,camera]);
 useEffect(()=>()=>{
  assets.ink.dispose();assets.lens.dispose();assets.tone.dispose();
  const geometries=new Set<THREE.BufferGeometry>();const materials=new Set<THREE.Material>();
  assets.root.traverse(o=>{if(o instanceof THREE.Mesh){geometries.add(o.geometry);(Array.isArray(o.material)?o.material:[o.material]).forEach((m:THREE.Material)=>materials.add(m));}});
  geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());
 },[assets]);
 return <>
  <color attach="background" args={['#83b9e5']}/>
  <fog attach="fog" args={['#b2c7df',12,45]}/>
  <primitive object={assets.root}/>
  <EffectComposer multisampling={4}>
   <primitive object={assets.ink}/><primitive object={assets.lens.pre}/><primitive object={assets.lens.main}/><primitive object={assets.tone}/>
  </EffectComposer>
 </>;
}
export function TestScene(){
 return <ThreeCanvas width={360} height={640} shadows camera={{position:[4,3.15,8],fov:37,near:.1,far:100}}
  onCreated={({camera})=>{camera.lookAt(-.1,1.55,0);camera.layers.enable(NOINK);}}
  gl={{antialias:false,stencil:false,powerPreference:'high-performance'}}><GardenSet/></ThreeCanvas>;
}

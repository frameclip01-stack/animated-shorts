import {useEffect,useMemo} from 'react';
import {useVideoConfig} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {EffectComposer} from '@react-three/postprocessing';
import * as THREE from 'three';
import {ToneMappingEffect,ToneMappingMode,BloomEffect} from 'postprocessing';
import {InkPass,NOINK} from '../../templates/bridge/ink';
import {LensBlur} from '../../templates/bridge/lensblur';
import {CHAR} from '../../templates/bridge/shade';
import {character} from './characters';
import {workshop} from './environment';
import {STYLE} from './palette';
function Interior(){
 const {scene,camera}=useThree();
 const set=useMemo(()=>{
  const root=workshop();
  root.add(character('visitor',[1.35,0,1.0],camera));
  const maker=character('maker',[-.95,0,-2.0],camera);maker.scale.setScalar(1.08);root.add(maker);
  CHAR.uCharTint.value.set(1,.96,.98);CHAR.uGrad.value=.065;CHAR.uBodyGrad.value=.16;CHAR.uCharShade.value=.9;
  const ink=new InkPass(scene,camera as THREE.PerspectiveCamera,{widthNear:STYLE.worldInk,widthFar:1.8,distNear:4,distFar:18,color:STYLE.ink,strength:.85});
  const lens=new LensBlur({maxCoC:18});lens.focus=STYLE.focus;lens.cInf=STYLE.blur;
  const tone=new ToneMappingEffect({mode:ToneMappingMode.NEUTRAL});
  const bloom=new BloomEffect({intensity:.18,luminanceThreshold:1.3,mipmapBlur:true});
  return {root,ink,lens,tone,bloom};
 },[scene,camera]);
 useEffect(()=>()=>{set.ink.dispose();set.lens.dispose();set.tone.dispose();set.bloom.dispose();},[set]);
 return <>
  <color attach="background" args={['#242936']}/><fog attach="fog" args={['#333141',10,30]}/>
  <primitive object={set.root}/>
  <EffectComposer multisampling={4}>
   <primitive object={set.ink}/><primitive object={set.lens.pre}/><primitive object={set.lens.main}/><primitive object={set.bloom}/><primitive object={set.tone}/>
  </EffectComposer>
 </>;
}
export function WorkshopScene(){
 const {width,height}=useVideoConfig();
 return <ThreeCanvas width={width} height={height} shadows camera={{position:[4.6,3.3,9.2],fov:36,near:.1,far:60}}
  onCreated={({camera})=>{camera.lookAt(0,1.7,-.4);camera.layers.enable(NOINK);}}
  gl={{antialias:false,stencil:false,powerPreference:'high-performance'}}><Interior/></ThreeCanvas>;
}

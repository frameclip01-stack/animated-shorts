import {useEffect,useMemo} from 'react';
import {useCurrentFrame,useVideoConfig} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {EffectComposer} from '@react-three/postprocessing';
import * as THREE from 'three';
import {ToneMappingEffect,ToneMappingMode,BloomEffect} from 'postprocessing';
import {InkPass,NOINK} from '../../templates/bridge/ink';
import {LensBlur} from '../../templates/bridge/lensblur';
import {CHAR} from '../../templates/bridge/shade';
import {workshop} from './environment';
import {createAlarm} from './alarm';
import {batchStatic} from './batch';
import {elasticCharacter} from './elastic-character';
import {cameraV4,elasticAt,ease4,ACTIVATION_FRAME} from './timeline-v4';
import {improveSurfaces} from './materials-v4';
import {STYLE} from './palette';
function ElasticInterior(){
 const f=useCurrentFrame(),{scene,camera}=useThree();
 const set=useMemo(()=>{
  const root=workshop(true,true);improveSurfaces(root);batchStatic(root);
  const alarm=createAlarm();improveSurfaces(alarm.root,false);root.add(alarm.root);
  const maker=elasticCharacter('maker',[-1.65,0,-2],camera),visitor=elasticCharacter('visitor',[1.55,0,1],camera);maker.root.scale.setScalar(1.08);root.add(maker.root,visitor.root);
  CHAR.uCharTint.value.set(1,.96,.98);CHAR.uGrad.value=.05;CHAR.uBodyGrad.value=.14;CHAR.uCharShade.value=.9;
  const ink=new InkPass(scene,camera as THREE.PerspectiveCamera,{widthNear:2.4,widthFar:1.5,distNear:3,distFar:18,color:STYLE.ink,strength:.85});
  const lens=new LensBlur({maxCoC:18});const tone=new ToneMappingEffect({mode:ToneMappingMode.NEUTRAL});const bloom=new BloomEffect({intensity:.14,luminanceThreshold:1.4,mipmapBlur:true});
  return {root,alarm,maker,visitor,ink,lens,tone,bloom};
 },[scene,camera]);
 const c=cameraV4(f),cam=camera as THREE.PerspectiveCamera;cam.position.set(...c.pos);cam.up.set(0,1,0);cam.lookAt(...c.look);cam.fov=c.fov;cam.updateProjectionMatrix();cam.updateMatrixWorld();cam.layers.enable(NOINK);
 set.lens.focus=cam.position.distanceTo(new THREE.Vector3(...c.look));set.lens.cInf=c.blur;
 set.maker.apply(elasticAt(f,'maker'));set.visitor.apply(elasticAt(f,'visitor'));
 const t=f/30,active=ease4((f-ACTIVATION_FRAME)/8),room=ease4((f-119)/12),rig=set.root.userData.rig;
 set.alarm.update(120+Math.max(0,f-ACTIVATION_FRAME));
 if(f<ACTIVATION_FRAME){set.alarm.update(119);set.alarm.root.rotation.z=.018*Math.sin(f*.8);set.alarm.root.position.y=1.46+.006*Math.abs(Math.sin(f*.9));}
 set.root.rotation.z=room*.003*Math.sin((f-120)*.7);set.root.position.y=room*.007*Math.sin((f-120)*.8);
 rig.clocks.forEach((o:THREE.Group,i:number)=>o.rotation.z=active*.05*Math.sin(t*38+i));
 rig.hands.forEach((o:THREE.Group,i:number)=>o.rotation.z=o.userData.baseRotation.z-active*Math.max(0,f-62)*(.22+.07*(i%2)));
 rig.gears.forEach((o:THREE.Mesh,i:number)=>{o.rotation.copy(o.userData.baseRotation);o.rotation.z+=active*Math.max(0,f-62)*.12*(i%2?1:-1);});
 rig.loose.forEach((o:THREE.Mesh,i:number)=>{o.position.copy(o.userData.basePosition);o.rotation.copy(o.userData.baseRotation);o.position.y+=active*.025*Math.abs(Math.sin(f*.8+i));o.rotation.z+=active*.06*Math.sin(f*.6+i);});
 rig.lamp.rotation.z=active*.032*Math.sin((t-2)*7)+room*.02*Math.sin(t*9);
 useEffect(()=>()=>{set.ink.dispose();set.lens.dispose();set.tone.dispose();set.bloom.dispose();},[set]);
 return <><color attach="background" args={['#2b2531']}/><fog attach="fog" args={['#594653',10,28]}/><primitive object={set.root}/>
  <EffectComposer multisampling={4}><primitive object={set.ink}/><primitive object={set.lens.pre}/><primitive object={set.lens.main}/><primitive object={set.bloom}/><primitive object={set.tone}/></EffectComposer></>;
}
export function ExpressiveScene(){const {width,height}=useVideoConfig();return <ThreeCanvas width={width} height={height} shadows camera={{position:[2.3,2.9,5.2],fov:38,near:.1,far:60}} gl={{antialias:false,stencil:false,powerPreference:'high-performance'}}><ElasticInterior/></ThreeCanvas>;}

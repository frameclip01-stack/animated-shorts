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
import {character} from './characters';
import {workshop} from './environment';
import {createAlarm} from './alarm';
import {cameraAt,actingAt,ease} from './timeline';
import {batchStatic} from './batch';
import {STYLE} from './palette';
function AnimatedInterior(){
 const f=useCurrentFrame();const {scene,camera}=useThree();
 const set=useMemo(()=>{
  const root=workshop(true);batchStatic(root);
  const alarm=createAlarm();root.add(alarm.root);
  const visitor=character('visitor',[1.55,0,1],camera),maker=character('maker',[-1.65,0,-2],camera);maker.scale.setScalar(1.08);root.add(visitor,maker);
  CHAR.uCharTint.value.set(1,.96,.98);CHAR.uGrad.value=.06;CHAR.uBodyGrad.value=.16;CHAR.uCharShade.value=.9;
  const ink=new InkPass(scene,camera as THREE.PerspectiveCamera,{widthNear:2.5,widthFar:1.6,distNear:3,distFar:18,color:STYLE.ink,strength:.85});
  const lens=new LensBlur({maxCoC:18});
  const tone=new ToneMappingEffect({mode:ToneMappingMode.NEUTRAL});const bloom=new BloomEffect({intensity:.16,luminanceThreshold:1.3,mipmapBlur:true});
  // The activation arm is drawn as a thin plum stroke in the world to land exactly on the 3D button.
  const arm=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([
   new THREE.Vector3(-1.30,1.61,-1.97),new THREE.Vector3(-.66,1.96,-1.21),new THREE.Vector3(.15,2.48,-.55)
  ]),24,.018,6,false),new THREE.MeshBasicMaterial({color:STYLE.ink}));arm.layers.set(NOINK);root.add(arm);
  const hand=new THREE.Mesh(new THREE.SphereGeometry(.043,12,8),arm.material);hand.layers.set(NOINK);root.add(hand);
  return {root,alarm,visitor,maker,ink,lens,tone,bloom,arm,hand};
 },[scene,camera]);
 const c=cameraAt(f),cam=camera as THREE.PerspectiveCamera;
 cam.position.set(...c.pos);cam.up.set(0,1,0);cam.lookAt(...c.look);cam.rotateZ(c.roll);cam.fov=c.fov;cam.near=.1;cam.far=60;cam.updateProjectionMatrix();cam.updateMatrixWorld();cam.layers.enable(NOINK);
 set.lens.focus=cam.position.distanceTo(new THREE.Vector3(...c.look));set.lens.cInf=c.blur;
 const t=f/30,active=ease((f-120)/18),final=ease((f-255)/12);
 set.root.rotation.z=final*.0025*Math.sin(t*32);set.root.position.y=final*.005*Math.sin(t*44);
 const rig=set.root.userData.rig;
 rig.clocks.forEach((o:THREE.Group,i:number)=>{const k=ease((f-120-i*6)/9);o.rotation.z=k*.045*Math.sin(t*37+i);});
 rig.hands.forEach((o:THREE.Group,i:number)=>o.rotation.z=o.userData.baseRotation.z-active*(f-120)*(.17+.06*(i%2)));
 rig.gears.forEach((o:THREE.Mesh,i:number)=>{const base=o.userData.baseRotation as THREE.Euler;o.rotation.copy(base);o.rotation.z=base.z+active*(f-120)*.09*(i%2?1:-1);if(o.parent===set.root){o.position.copy(o.userData.basePosition);o.position.y+=active*.018*Math.abs(Math.sin(t*31+i));}});
 rig.loose.forEach((o:THREE.Mesh,i:number)=>{o.position.copy(o.userData.basePosition);o.rotation.copy(o.userData.baseRotation);o.position.y+=active*(.012+.015*final)*Math.abs(Math.sin(t*29+i*2));o.rotation.z+=active*.055*Math.sin(t*23+i);});
 rig.lamp.rotation.z=active*.025*Math.sin((t-4)*5)+final*.025*Math.sin(t*8);
 set.alarm.update(f);
 for(const [mesh,kind] of [[set.visitor,'visitor'],[set.maker,'maker']] as const){
  mesh.userData.act(actingAt(f,kind));mesh.rotation.y=Math.atan2(cam.position.x-mesh.position.x,cam.position.z-mesh.position.z);
  const hop=(f>=120&&f<139)?.10*Math.sin((f-120)/19*Math.PI):0;mesh.position.y=hop;
 }
 const press=f>=88&&f<=124;set.arm.visible=press;set.hand.visible=press;
 set.hand.position.set(.15,2.49-.04*ease((f-118)/2),-.55);
 set.arm.scale.y=1; // the anticipation finger dips onto the button at exactly f120
 useEffect(()=>()=>{set.ink.dispose();set.lens.dispose();set.tone.dispose();set.bloom.dispose();},[set]);
 return <>
  <color attach="background" args={['#292632']}/><fog attach="fog" args={['#554552',10,28]}/>
  <primitive object={set.root}/>
  <EffectComposer multisampling={4}>
   <primitive object={set.ink}/><primitive object={set.lens.pre}/><primitive object={set.lens.main}/><primitive object={set.bloom}/><primitive object={set.tone}/>
  </EffectComposer>
 </>;
}
export function CinematicScene(){
 const {width,height}=useVideoConfig();
 return <ThreeCanvas width={width} height={height} shadows camera={{position:[4.7,3.15,8.4],fov:36,near:.1,far:60}}
 gl={{antialias:false,stencil:false,powerPreference:'high-performance'}}><AnimatedInterior/></ThreeCanvas>;
}

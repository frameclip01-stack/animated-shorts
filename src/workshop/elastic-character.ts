import * as THREE from 'three';
import {character} from './characters';
import type {FaceControls} from './face-controls';
export type ElasticPose={headX:number;headY:number;headAngle:number;bodyStretch:number;bodyLean:number;leftHand:[number,number];rightHand:[number,number];elbowLift:number;face:FaceControls};
/** Independent head and body cards reuse the existing cast artwork and lit-card/depth shaders. */
export function elasticCharacter(kind:'maker'|'visitor',position:[number,number,number],camera:THREE.Camera){
 const root=new THREE.Group();root.position.set(...position);root.userData.dynamic=true;
 const body=character(kind,[0,0,0],camera),head=character(kind,[0,0,0],camera);
 const headPivot=new THREE.Group();head.geometry.translate(0,-2.019,0);headPivot.position.y=2.019;
 body.rotation.set(0,0,0);head.rotation.set(0,0,0);headPivot.add(head);root.add(body,headPivot);
 function apply(c:ElasticPose){
  const stretch=c.bodyStretch;
  body.scale.set(1/Math.sqrt(stretch),stretch,1);body.rotation.z=c.bodyLean;
  const neckTop=1.662*stretch;
  headPivot.position.set(-Math.sin(c.bodyLean)*neckTop+c.headX*.65,Math.cos(c.bodyLean)*neckTop+.29+c.headY*.28,.008);
  headPivot.rotation.z=c.headAngle;
  const arms:[[number,number][],[number,number][]]=[
   [[225,487],[182,c.elbowLift],c.leftHand],[[370,484],[422,c.elbowLift-10],c.rightHand]
  ];
  body.userData.act({layer:'body',armPoints:arms,poseMix:1});
  head.userData.act({layer:'head',face:c.face});
  root.rotation.y=Math.atan2(camera.position.x-root.position.x,camera.position.z-root.position.z);
 }
 return {root,apply};
}

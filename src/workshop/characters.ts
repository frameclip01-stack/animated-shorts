import * as THREE from 'three';
import {Pen,blobPts,headBlob,thickAngle} from '../../templates/bridge/toon';
import {cardShade,CARD_K} from '../../templates/bridge/cardshade';
import {NOINK} from '../../templates/bridge/ink';
import {STYLE} from './palette';
export type Acting={expression?:'proud'|'sleepy'|'focus'|'shock'|'panic'|'deadpan';pose?:'present'|'press'|'cover'|'raised'|'fold';gaze?:number;blink?:number;tilt?:number;lean?:number;poseFrom?:'present'|'press'|'cover'|'raised'|'fold';poseMix?:number};
export function character(kind:'visitor'|'maker',position:[number,number,number],camera:THREE.Camera){
 const cv=document.createElement('canvas');cv.width=1200;cv.height=2000;
 const g=cv.getContext('2d')!;g.scale(2,2);const p=new Pen(g);
 const maker=kind==='maker';const lit=-2.15;
 function draw(state:Acting={}){
 g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,1200,2000);g.scale(2,2);
 const pose=state.pose??(maker?'fold':'raised'),expr=state.expression??(maker?'deadpan':'shock');
 const tilt=state.tilt??0,lean=state.lean??0,gaze=state.gaze??0,blink=state.blink??0;

 // 3.3 head heights; head diameter 266, thin 13-unit limbs.
 p.stroke([[263,693],[256,824],[244,970],[221,970]],13,STYLE.ink);
 p.stroke([[336,695],[345,826],[348,970],[376,970]],13,STYLE.ink);
 g.save();g.translate(300,690);g.rotate(lean);g.translate(-300,-690);
 const arms:Record<string,[[number,number][],[number,number][]]>={
 fold:[[[225,487],[184,560],[269,582]],[[370,484],[414,542],[329,565]]],
 present:[[[225,487],[178,550],[200,600]],[[370,484],[430,490],[476,435]]],
 press:[[[225,487],[178,550],[202,600]],[[370,484],[411,495],[431,473]]],
 raised:[[[225,481],[186,524],[159,436]],[[369,479],[415,520],[438,423]]],
 cover:[[[225,481],[162,440],[181,306]],[[369,479],[437,429],[416,303]]]
 };
 for(const [index,wanted] of arms[pose].entries()){const source=arms[state.poseFrom??pose][index];const q=state.poseMix??1;const arm=wanted.map((v,i)=>[source[i][0]+(v[0]-source[i][0])*q,source[i][1]+(v[1]-source[i][1])*q] as [number,number]);p.stroke(arm,12,STYLE.ink);const h=arm[arm.length-1];p.dot(h[0],h[1],13,STYLE.ink);}
 const outline=new THREE.Shape();outline.moveTo(251,421);
 outline.bezierCurveTo(231,438,220,491,220,570);outline.bezierCurveTo(217,641,229,690,265,708);
 outline.bezierCurveTo(298,727,337,720,360,696);outline.bezierCurveTo(383,667,381,614,375,554);
 outline.bezierCurveTo(369,489,369,438,345,421);outline.closePath();
 const torso:[number,number][]=outline.getPoints(16).map(v=>[v.x,v.y]);
 p.gradFill(torso,maker?'#7376aa':'#b95d4b',maker?'#46466f':'#773c49',lit,.35);
 p.inkRing(torso,9,thickAngle(lit),.28,STYLE.ink);
 if(maker){
  p.poly([[261,459],[336,459],[354,674],[249,674]],'#b99d76',4);
  p.stroke([[263,462],[252,424]],7,STYLE.ink);p.stroke([[337,462],[347,423]],7,STYLE.ink);
  p.poly([[275,548],[329,548],[326,594],[280,594]],'#8b7360',3);
  p.stroke([[288,548],[287,519]],5,'#d6ba6d');p.stroke([[305,548],[312,506]],4,'#414555');
  p.dot(269,580,12,STYLE.ink);p.dot(330,566,12,STYLE.ink);
 }else{
  p.poly([[264,425],[304,448],[346,424],[335,453],[301,468],[267,450]],'#ebbb6d',4);
  p.stroke([[304,491],[306,652]],4,'#e6a080');p.dot(319,522,4,'#f4c985');p.dot(319,566,4,'#f4c985');
 }
 g.save();g.translate(300,302);g.rotate(tilt);g.translate(-300,-302);
 const pts=blobPts(300,302,{...headBlob(maker?83:67,137,maker?.25:-.2),noise:0.002,rot:maker?.04:-.055,b:128});
 p.shadedFill(pts,STYLE.face,STYLE.faceShadow,lit,140,.42,1.0,1.3);
 p.inkRing(pts,9,thickAngle(lit),.28,STYLE.ink);
 // Original restrained hair silhouettes; no cap, visor, facial hair or copied accessories.
 if(maker){
  p.poly([[167,282],[164,230],[183,200],[214,182],[244,177],[267,165],[290,175],[306,174],[292,199],[252,211],[219,226],[193,267],[183,289]],'#96929c',6);
  p.poly([[404,239],[425,264],[433,304],[420,327],[410,299]],'#96929c',5);
  p.stroke([[186,231],[211,212],[244,201]],4,'#c4bdba');
 }else{
  p.poly([[174,252],[179,221],[198,198],[219,190],[230,170],[260,183],[290,176],[330,180],[355,195],[349,208],[309,205],[275,217],[237,211],[208,233],[192,264]],'#694b48',6);
  p.stroke([[204,210],[231,197],[254,202]],4,'#9b6e57');
 }
 const eyes=[270+gaze*10,334+gaze*10];
 if(expr==='shock'||expr==='panic'){
  for(const x of eyes){p.ell(x,304,22,25,'#fffaf1',5);p.ell(x+gaze*2,305,7,11,STYLE.ink,0);}
  p.stroke([[246,255],[268,244],[288,250]],9,STYLE.ink);p.stroke([[315,247],[337,237],[357,247]],9,STYLE.ink);
  if(expr==='panic'){
   p.poly([[274,350],[338,350],[334,378],[279,378]],'#fff8e9',6);
   for(const x of [291,310,327])p.stroke([[x,352],[x,375]],3,STYLE.ink);
  }else p.ell(304,362,18,25,'#602c43',5);
 }else if(expr==='proud'){
  p.arc(270,306,17,10,195,345,6,STYLE.ink);p.arc(334,306,17,10,195,345,6,STYLE.ink);
  p.stroke([[247,268],[282,264]],8,STYLE.ink);p.stroke([[316,264],[350,271]],8,STYLE.ink);
  p.poly([[278,351],[336,351],[325,375],[300,379],[284,367]],'#602c43',5);
  p.poly([[282,354],[332,354],[327,363],[286,363]],'#fff8ed',0);
 }else{
  const sleepy=expr==='sleepy';
  for(const x of eyes){p.ell(x,306,12,14,STYLE.ink,0);g.fillStyle=STYLE.face;g.fillRect(x-20,280,40,sleepy?28:22);p.stroke([[x-18,302],[x+18,303]],6,STYLE.ink);}
  p.stroke([[249,270],[284,expr==='focus'?281:274]],8,STYLE.ink);
  p.stroke([[316,expr==='deadpan'?261:278],[350,expr==='deadpan'?255:268]],8,STYLE.ink);
  if(sleepy)p.ell(306,356,10,7,'#602c43',3);else p.stroke([[290,357],[321,expr==='focus'?360:354]],6,STYLE.ink);
 }
 if(blink>0){for(const x of eyes){g.fillStyle=STYLE.face;g.fillRect(x-27,278,54,32*blink);if(blink>=.9)p.stroke([[x-19,304],[x+19,304]],6,STYLE.ink);}}
 g.restore();g.restore();
 }
 draw();
 const tex=new THREE.CanvasTexture(cv);tex.colorSpace=THREE.SRGBColorSpace;tex.anisotropy=8;
 const mat=cardShade(new THREE.MeshLambertMaterial({map:tex,alphaTest:.45,side:THREE.DoubleSide}));
 CARD_K.uGradK.value=2.0;CARD_K.uGradKB.value=1;CARD_K.uGain.value=1.02;
 const mesh=new THREE.Mesh(new THREE.PlaneGeometry(1.8,3),mat);mesh.geometry.translate(0,1.425,0);
 mesh.position.set(...position);mesh.rotation.y=Math.atan2(camera.position.x-position[0],camera.position.z-position[2]);
 mesh.layers.set(NOINK);mesh.receiveShadow=true;mesh.castShadow=true;mesh.customDepthMaterial=new THREE.MeshDepthMaterial({map:tex,alphaTest:.45,depthPacking:THREE.RGBADepthPacking,side:THREE.DoubleSide});mesh.renderOrder=1;
 mesh.userData.act=(state:Acting)=>{draw(state);tex.needsUpdate=true;};
 mesh.onBeforeRender=r=>{const rt=r.getRenderTarget();CARD_K.uPx.value=(rt?rt.height:r.domElement.height)/1920;};
 return mesh;
}

import * as THREE from 'three';
import {Pen,INK,headBlob,blobPts,thickAngle} from '../../templates/bridge/toon';
import {cardShade,CARD_K} from '../../templates/bridge/cardshade';
import {NOINK} from '../../templates/bridge/ink';

/** Original cast member: Mira, an optimistic rooftop gardener. No image assets. */
export function createMira() {
  const canvas=document.createElement('canvas'); canvas.width=900; canvas.height=1500;
  const g=canvas.getContext('2d')!; g.scale(1.5,1.5);
  const p=new Pen(g); const light=-2.25;
  // Thin limbs, planted outward feet, asymmetric reaching pose.
  p.stroke([[265,680],[258,805],[247,966],[224,966]],16);
  p.stroke([[335,680],[346,813],[360,966],[387,966]],16);
  p.stroke([[223,465],[176,547],[200,603]],14);
  p.dot(200,603,15);
  p.stroke([[374,472],[416,502],[472,462]],14);
  p.dot(472,462,15);
  const coat: [number,number][]=[[235,415],[353,413],[378,493],[382,641],[361,707],[310,732],[248,707],[219,654],[220,495]];
  p.gradFill(coat,'#289b95','#28546b',light); p.inkRing(coat,12,thickAngle(light));
  // Apron, pocket, cross-back strap and a brass seed pin.
  p.poly([[260,468],[340,468],[357,677],[249,677]],'#e9ad48',5);
  p.stroke([[260,468],[247,425]],9); p.stroke([[340,468],[350,425]],9);
  p.poly([[275,562],[328,562],[326,610],[300,620],[277,608]],'#c4773d',4);
  p.stroke([[285,575],[292,600]],3,'#f6cf7d'); p.dot(340,505,6,'#fff0a8');
  // Broad, slightly asymmetric head; shaded crescent and weighted ink.
  const head=blobPts(298,298,{...headBlob(42,138,0.5),rot:-0.055});
  p.shadedFill(head,'#fff0d6','#d5b6c2',light,145);p.inkRing(head,13,thickAngle(light));
  // Original cloud-shaped auburn hair and swept fringe.
  p.poly([[161,275],[154,219],[177,183],[211,178],[222,144],[264,151],[295,132],[327,150],[365,145],[394,181],[425,207],[430,268],[406,289],[390,242],[354,220],[312,234],[280,208],[241,242],[202,235],[185,276]],'#733f40',10);
  p.stroke([[192,216],[224,197],[252,202]],5,'#af6b4b');
  p.stroke([[293,175],[322,189],[364,182]],5,'#af6b4b');
  // Copper hair clip with tiny leaf silhouette.
  p.poly([[360,207],[396,227],[391,238],[355,220]],'#efbd57',4);
  // Wide-eyed delighted surprise: pupils turn toward the sprout.
  p.ell(271,305,29,34,'#fffefa',6);p.ell(339,302,29,36,'#fffefa',6);
  p.ell(279,308,10,16,INK,0);p.ell(348,305,10,16,INK,0);
  p.stroke([[244,257],[268,247],[290,251]],10);
  p.stroke([[317,245],[341,234],[363,242]],10);
  p.poly([[283,352],[348,347],[340,380],[312,391],[291,376]],'#632c40',6);
  p.poly([[290,354],[341,352],[336,363],[293,365]],'#fffefa',0);
  p.ell(317,380,15,6,'#e57d81',0);
  // Saffron neckerchief: distinct silhouette, no text or logos.
  p.poly([[254,417],[303,436],[354,417],[339,446],[301,454],[267,439]],'#e86e42',6);
  p.poly([[321,446],[346,456],[365,496],[335,483]],'#ef8751',6);
  const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
  texture.anisotropy=4;
  const mat=cardShade(new THREE.MeshLambertMaterial({map:texture,alphaTest:0.4,side:THREE.DoubleSide}));
  CARD_K.uPx.value=640/1920;
  const mesh=new THREE.Mesh(new THREE.PlaneGeometry(1.8,3),mat);
  mesh.geometry.translate(0,1.5-0.075,0); // drawing soles (975/1000) sit at ground level
  mesh.position.set(-0.28,0.025,0.9);mesh.rotation.y=Math.atan2(4,8-0.9);
  mesh.layers.set(NOINK);mesh.renderOrder=1;mesh.receiveShadow=true;
  return mesh;
}

import type {ElasticPose} from './elastic-character';
export const FRAMES_V4=150,FPS_V4=30,ACTIVATION_FRAME=62;
export const QC_V4=[0,15,29,30,45,59,62,75,89,90,98,110,120,135,149];
const clamp=(v:number)=>Math.max(0,Math.min(1,v));
export const ease4=(v:number)=>{const t=clamp(v);return t*t*(3-2*t);};
const pulse=(f:number,at:number,width:number)=>Math.exp(-(((f-at)/width)**2));
/** Damped step response; anticipation and impulses are explicit event curves, never random motion. */
export function spring4(f:number,at:number){const t=Math.max(0,(f-at)/30);return f<at?0:1-Math.exp(-7*t)*(Math.cos(13*t)+(7/13)*Math.sin(13*t));}
const mix=(a:number[],b:number[],q:number)=>a.map((v,i)=>v+(b[i]-v)*q) as [number,number,number];
export function cameraV4(f:number){
 const shot=Math.min(4,Math.floor(f/30)),u=(f%30)/29,q=.22*u+.78*ease4(u);
 const shots=[
  {p0:[2.3,2.9,5.2],p1:[1.05,2.57,3.1],l0:[.15,2,-.55],l1:[.15,2,-.55],fov:38,blur:9},
  {p0:[-.45,2.8,2.7],p1:[-.75,2.72,1.6],l0:[-1.57,2.22,-2],l1:[-1.5,2.28,-2],fov:40,blur:10},
  {p0:[1.65,2.6,3.7],p1:[.9,2.5,2.9],l0:[.15,1.99,-.55],l1:[.15,2.02,-.55],fov:40,blur:10},
  {p0:[2.5,2.55,4.35],p1:[2.2,2.48,3.65],l0:[1.55,2.13,1],l1:[1.57,2.2,1],fov:43,blur:11},
  {p0:[4.6,3.05,8.3],p1:[3.9,2.85,7.2],l0:[.05,1.95,-.5],l1:[.1,2.0,-.5],fov:37,blur:7}
 ];const c=shots[shot];return {pos:mix(c.p0,c.p1,q),look:mix(c.l0,c.l1,q),fov:c.fov,blur:c.blur,shot};
}
export function elasticAt(f:number,kind:'maker'|'visitor'):ElasticPose{
 const opener=ease4(f/29);
 const maker=kind==='maker',approach=ease4((f-26)/30),reaction=spring4(f,maker?62:64),closeReaction=spring4(f,93),final=ease4((f-118)/20);
 const anticipation=pulse(f,59,3.8),flinch=pulse(f,67,5),secondAnt=pulse(f,89,3);
 const secondary=f<64?0:Math.exp(-(f-64)/42)*Math.sin((f-64)*.43)*ease4((f-64)/4);
 let blink=0;for(const at of maker?[12,38,60,111,140]:[18,51,87,124]){const d=Math.abs(f-at);if(d<2.5)blink=Math.max(blink,.5+.5*Math.cos(d/2.5*Math.PI));}
 const open=.18+.36*approach+.44*ease4((f-62)/6),brow=.15+.45*approach+.35*ease4((f-62)/7);
 const armReach=ease4((f-27)/25),armUp=ease4((f-64)/14),cover=ease4((f-97)/14);
 const lh:[number,number]=maker?[202-35*armUp,592-177*armUp]:[204-38*armUp+15*cover,591-141*armUp-142*cover];
 const rh:[number,number]=maker?[395+78*armReach-37*armUp,579-149*armReach-55*armUp]:[397+48*armUp-25*cover,580-140*armUp-137*cover];
 // Small damped hand follow-through after the main motion; no arbitrary periodic idle bob.
 lh[0]+=secondary*9;lh[1]+=secondary*12;rh[0]-=secondary*11;rh[1]+=secondary*8;
 return {
  headX:maker?.026*opener+.075*approach-.10*reaction+.025*secondary:-.025*opener-.045*secondAnt+.11*closeReaction+.02*secondary,
  headY:maker?.012*opener+.025*approach+.065*reaction+.02*secondary:.012*opener+.06*reaction+.045*closeReaction+.018*secondary,
  headAngle:maker?-.035-.045*opener-.10*approach+.18*reaction-.045*secondary:.04-.055*opener-.11*reaction+.10*closeReaction+.04*secondary,
  bodyStretch:1-.085*anticipation+.10*flinch-.065*secondAnt+.055*pulse(f,96,5)+.018*secondary,
  bodyLean:maker?-.015*opener-.065*approach+.09*reaction:-.018-.012*opener+.04*reaction-.045*closeReaction,
  leftHand:lh,rightHand:rh,elbowLift:535-105*armUp-25*cover,
  face:{eyeOpen:Math.min(1,open),browRaise:Math.min(1,brow),browSlant:.14+.35*reaction-.2*final,
   mouthOpen:maker?.10+.55*ease4((f-62)/7)+.07*secondary:.05+.65*ease4((f-64)/8)-.22*final+.12*pulse(f,98,6),
   mouthWide:.35+.10*reaction,smile:maker?.5*(1-ease4((f-60)/7)):0,gaze:maker?.1+.55*opener-.5*ease4((f-67)/10):-.15-.5*opener+.35*ease4((f-96)/10),blink,teeth:.35*final}
 };
}

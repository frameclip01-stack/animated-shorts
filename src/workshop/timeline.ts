import * as THREE from 'three';
import type {Acting} from './characters';
export const FPS=30,FRAMES=300;
export const QC_FRAMES=[0,45,90,135,180,225,270,299];
export const clamp=(v:number)=>Math.max(0,Math.min(1,v));
export const ease=(v:number)=>{const q=clamp(v);return q*q*(3-2*q);};
type V3=[number,number,number];
const mix=(a:V3,b:V3,t:number):V3=>a.map((v,i)=>v+(b[i]-v)*t) as V3;
export function cameraAt(f:number){
 let a=0,b=59,p0:V3=[4.7,3.15,8.4],p1:V3=[3.8,2.95,7.2],l0:V3=[.05,1.95,-.45],l1:V3=[-.05,2.0,-.5],fov=36,blur=8;
 if(f>=60&&f<150){a=60;b=149;p0=[1.7,2.8,3.7];p1=[.9,2.6,2.9];l0=[.15,1.97,-.55];l1=[.15,1.99,-.55];fov=38;blur=11;}
 else if(f>=150&&f<195){a=150;b=194;p0=[1.2,3.7,1.2];p1=[1.5,3.8,.8];l0=[-1,3.5,-4.15];l1=[.8,3.65,-4.15];fov=37;blur=4;}
 else if(f>=195&&f<225){a=195;b=224;p0=[2.35,2.5,4.1];p1=[2.1,2.45,3.5];l0=[1.55,2.1,1];l1=[1.55,2.15,1];fov=39;blur=12;}
 else if(f>=225&&f<255){a=225;b=254;p0=[-2.5,2.82,1.5];p1=[-2.2,2.75,1.0];l0=[-1.65,2.38,-2];l1=[-1.65,2.40,-2];fov=36;blur=12;}
 else if(f>=255){a=255;b=299;p0=[4.2,2.95,7.6];p1=[3.5,2.8,6.8];l0=[.1,1.95,-.5];l1=[.1,2,-.5];fov=36;blur=7;}
 const t=(f-a)/(b-a),q=.25*t+.75*ease(t);
 const pos=mix(p0,p1,q),look=mix(l0,l1,q);
 // Impact kicks are seven frames long with alternating sign and a decay. No random shake.
 let kick=0;for(const hit of [120,195,225,285]){const d=f-hit;if(d>=0&&d<7)kick+=.012*(1-d/7)*(d%2?-1:1);}
 pos[0]+=kick;pos[1]+=kick*.4;
 return {pos,look,fov,blur,roll:kick*.24};
}
export function blinkAt(f:number,which:number){
 for(const start of (which?[31,83,118,164,227,279]:[21,69,116,175,197,264])){const d=f-start;if(d>=0&&d<4)return [.5,1,1,.5][d];}
 return 0;
}
export function actingAt(f:number,kind:'maker'|'visitor'):Acting{
 const maker=kind==='maker',b=blinkAt(f,maker?1:0),t=f/FPS;
 if(f<60)return {expression:maker?'proud':'sleepy',pose:maker?'present':'fold',poseFrom:'fold',poseMix:ease(f/18),gaze:maker?.25:-.4,blink:b,tilt:maker?-.07:.12,lean:maker?-.02:.06};
 if(f<120)return {expression:maker?'focus':'sleepy',pose:maker?'press':'fold',poseFrom:maker?'present':'fold',poseMix:ease((f-72)/26),gaze:maker?.35:-.6,blink:b,tilt:maker?.10:.07,lean:maker?.06:.04};
 if(f<195)return {expression:f<130?'shock':'panic',pose:'raised',poseFrom:maker?'press':'fold',poseMix:ease((f-120)/10),gaze:Math.sin(t*2)*.5,blink:b,tilt:(maker?1:-1)*(.08+.035*Math.sin(t*7)),lean:(maker?1:-1)*.07};
 if(f<225)return {expression:f<210?'shock':'panic',pose:'cover',poseFrom:'raised',poseMix:ease((f-197)/12),gaze:Math.sin(t*3)*.8,blink:b,tilt:-.14,lean:-.09};
 if(f<255)return {expression:maker?(f<238?'panic':'shock'):'panic',pose:maker?'press':'cover',poseFrom:maker?'raised':'cover',poseMix:ease((f-225)/12),gaze:maker?.8:-.8,blink:b,tilt:maker?.15:-.1,lean:maker?.10:-.08};
 return {expression:maker?'shock':(f>=285?'deadpan':'panic'),pose:maker?'raised':'cover',poseFrom:maker?'press':'cover',poseMix:ease((f-255)/11),gaze:maker?-.6:-.9,blink:b,tilt:(maker?1:-1)*(.13+.035*Math.sin(t*5)),lean:(maker?1:-1)*(.055+.018*Math.sin(t*13))};
}

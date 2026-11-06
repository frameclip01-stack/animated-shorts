import {Pen} from '../../templates/bridge/toon';
import {STYLE} from './palette';
export type FaceControls={eyeOpen:number;browRaise:number;browSlant:number;mouthOpen:number;mouthWide:number;smile:number;gaze:number;blink:number;teeth:number};
const clamp=(v:number)=>Math.max(0,Math.min(1,v));
/** One continuous drawing model: no categorical expression swaps, no cross-faded duplicate faces. */
export function drawContinuousFace(p:Pen,g:CanvasRenderingContext2D,c:FaceControls){
 const openness=clamp(c.eyeOpen),blink=clamp(c.blink),white=clamp((openness-.3)*1.7);
 for(const x of [270+c.gaze*12,334+c.gaze*12]){
  const ry=(9+openness*16)*(1-blink);
  if(ry>.5){
   g.save();g.globalAlpha=white;p.ell(x,304,19,Math.max(1,ry),'#fffaf1',0);g.restore();p.ell(x,304,19,Math.max(1,ry),null,4*clamp(white/.12));
   p.ell(x+c.gaze*2,305,7+2*(1-white),Math.max(.5,(6+openness*8)*(1-blink)),STYLE.ink,0);
  }
  if(openness<.5||blink>.1){g.save();g.globalAlpha=Math.max(1-openness*1.7,blink);p.arc(x,300,18,2+4*c.smile,10,170,6,STYLE.ink);g.restore();}
 }
 const by=272-c.browRaise*27;
 p.stroke([[248,by+3-c.browSlant*10],[266,by-2],[286,by+c.browSlant*10]],7.5,STYLE.ink);
 p.stroke([[315,by+c.browSlant*9-2],[335,by-5],[354,by+3-c.browSlant*8]],7.5,STYLE.ink);
 const open=clamp(c.mouthOpen),w=28+c.mouthWide*38,h=2+open*57,blend=clamp(open*12);
 g.save();g.globalAlpha=1-blend;
 const curve:[[number,number],[number,number],[number,number]]=[[304-w*.5,358],[304,358+c.smile*12],[304+w*.5,358]];
 g.strokeStyle=STYLE.ink;g.lineWidth=5.5;g.lineCap='round';g.beginPath();g.moveTo(curve[0][0],curve[0][1]);g.quadraticCurveTo(curve[1][0],curve[1][1],curve[2][0],curve[2][1]);g.stroke();g.restore();
 g.save();g.globalAlpha=blend;
 p.ell(304,361,w*.5,h*.5,'#602c43',5);
 if(c.teeth>0){g.save();g.beginPath();g.ellipse(304,361,w*.5,h*.5,0,0,7);g.clip();g.globalAlpha*=c.teeth;g.fillStyle='#fff5e7';g.fillRect(270,361-h*.5,70,h*.38);g.restore();}
 g.restore();
}

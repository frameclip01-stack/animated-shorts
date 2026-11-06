import * as THREE from 'three';
import {ctex} from '../../templates/bridge/paint';
export const timber=(key:string,base:string,boards=8)=>ctex('clock-timber-'+key,1024,1024,(g,r)=>{
 g.fillStyle=base;g.fillRect(0,0,1024,1024);
 // Broad irregular pigment, rubbed edges and scumbled wear, fixed across frames.
 for(let i=0;i<140;i++){
  const x=r()*1024,y=r()*1024,rx=12+r()*130,ry=4+r()*28;
  g.fillStyle=r()<.5?'rgba(246,201,143,.09)':'rgba(34,21,36,.075)';g.beginPath();
  g.moveTo(x-rx,y);g.bezierCurveTo(x-rx*.6,y-ry,x+rx*.5,y-ry*.7,x+rx,y+ry*.2);
  g.bezierCurveTo(x+rx*.6,y+ry,x-rx*.7,y+ry*.5,x-rx,y);g.fill();
 }

 for(let row=0;row<boards;row++){
  const pitch=1024/boards,y=row*pitch;g.fillStyle=`rgba(244,205,138,${.025+r()*.075})`;g.fillRect(0,y+3,1024,pitch-6);
  g.fillStyle='#392c2e';g.fillRect(0,y,1024,3);g.fillStyle='rgba(255,220,165,.22)';g.fillRect(0,y+4,1024,2);
  for(let j=0;j<18;j++){const gy=y+8+r()*(pitch-18);g.strokeStyle=r()<.5?'rgba(40,20,28,.13)':'rgba(251,211,146,.11)';g.lineWidth=.6+r()*1.4;g.beginPath();g.moveTo(0,gy);g.bezierCurveTo(300,gy+12,650,gy-8,1024,gy+3);g.stroke();}
  const knot=100+r()*800;g.strokeStyle='rgba(55,26,29,.25)';g.lineWidth=2;for(let k=0;k<4;k++){g.beginPath();g.ellipse(knot,y+pitch*.51,13+k*10,3+k*3,0,0,Math.PI*2);g.stroke();}
  for(const x of [18,1004]){g.fillStyle='#493035';g.beginPath();g.arc(x,y+18,2.5,0,7);g.fill();}
 }
 for(let i=0;i<170;i++){g.strokeStyle='rgba(255,224,176,.12)';g.lineWidth=1;const x=r()*1024,y=r()*1024;g.beginPath();g.moveTo(x,y);g.lineTo(x+10+r()*70,y-2);g.stroke();}
});
export const wallpaper=()=>ctex('clock-wallpaper',1024,1024,(g,r)=>{
 g.fillStyle='#78525a';g.fillRect(0,0,1024,1024);
 for(let i=0;i<1800;i++){g.fillStyle=r()<.5?'rgba(12,26,38,.04)':'rgba(194,182,145,.05)';g.fillRect(r()*1024,r()*1024,3+r()*28,3+r()*20);}
 for(let i=0;i<230;i++){
  const x=r()*1024,y=r()*1024,rad=22+r()*95;
  const gr=g.createRadialGradient(x,y,0,x,y,rad);gr.addColorStop(0,r()<.5?'rgba(37,18,40,.17)':'rgba(214,170,130,.16)');gr.addColorStop(1,'rgba(50,60,60,0)');g.fillStyle=gr;g.fillRect(x-rad,y-rad,rad*2,rad*2);
 }
 for(let y=-64;y<1100;y+=128)for(let x=-64;x<1100;x+=128){
  g.strokeStyle='rgba(166,158,119,.15)';g.lineWidth=2;g.beginPath();g.moveTo(x,y-42);g.bezierCurveTo(x+45,y-6,x+24,y+22,x,y+42);g.bezierCurveTo(x-24,y+22,x-45,y-6,x,y-42);g.stroke();
  g.fillStyle='rgba(20,39,49,.16)';g.beginPath();g.ellipse(x,y,5,13,0,0,7);g.fill();
 }
 // Faded plaster, cracks and aged vertical seams.
 g.strokeStyle='rgba(23,30,34,.18)';g.lineWidth=2;g.beginPath();g.moveTo(727,0);g.lineTo(719,180);g.lineTo(737,225);g.lineTo(720,381);g.stroke();
});
export const brass=()=>ctex('clock-brass',256,256,(g,r)=>{
 g.fillStyle='#b99555';g.fillRect(0,0,256,256);
 for(let i=0;i<90;i++){const x=r()*256,y=r()*256,rx=4+r()*25,ry=2+r()*12;g.fillStyle=r()<.5?'rgba(54,36,42,.11)':'rgba(255,222,150,.13)';g.beginPath();g.ellipse(x,y,rx,ry,r()*2,0,7);g.fill();}
 for(let i=0;i<600;i++){g.strokeStyle=r()<.5?'rgba(255,226,162,.12)':'rgba(50,36,37,.08)';g.beginPath();const y=r()*256;g.moveTo(0,y);g.lineTo(256,y+.8);g.stroke();}
});
export const dial=(key:string,hour=10,minute=8,animated=false)=>ctex('clock-dial-'+key+(animated?'-animated':''),512,512,(g,r)=>{
 g.fillStyle='#e4d5ae';g.fillRect(0,0,512,512);
 for(let i=0;i<1800;i++){g.fillStyle='rgba(99,73,48,.055)';g.fillRect(r()*512,r()*512,1+r()*4,1+r()*4);}
 g.strokeStyle='#6b564a';g.lineWidth=3;g.beginPath();g.arc(256,256,232,0,7);g.stroke();
 for(let i=0;i<60;i++){const a=i*Math.PI/30;g.lineWidth=i%5===0?4:1.5;g.beginPath();g.moveTo(256+Math.sin(a)*218,256-Math.cos(a)*218);g.lineTo(256+Math.sin(a)*(i%5===0?199:210),256-Math.cos(a)*(i%5===0?199:210));g.stroke();}
 const numerals=['XII','I','II','III','IV','V','VI','VII','VIII','IX','X','XI'];g.fillStyle='#3a3036';g.font='32px serif';g.textAlign='center';g.textBaseline='middle';
 if(!animated)for(let i=0;i<12;i++){const a=i*Math.PI/6;g.fillText(numerals[i],256+Math.sin(a)*171,256-Math.cos(a)*171);}
 const hand=(a:number,len:number,w:number)=>{g.strokeStyle='#302c39';g.lineWidth=w;g.lineCap='round';g.beginPath();g.moveTo(256-Math.sin(a)*25,256+Math.cos(a)*25);g.lineTo(256+Math.sin(a)*len,256-Math.cos(a)*len);g.stroke();};
 if(!animated){hand((hour+minute/60)*Math.PI/6,111,10);hand(minute*Math.PI/30,155,6);g.fillStyle='#ae7244';g.beginPath();g.arc(256,256,12,0,7);g.fill();}
});

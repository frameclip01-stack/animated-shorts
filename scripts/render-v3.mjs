import fs from 'node:fs/promises';
import path from 'node:path';
import {performance} from 'node:perf_hooks';
import {bundle} from '@remotion/bundler';
import {selectComposition,renderStill,renderMedia,openBrowser} from '@remotion/renderer';
const preview=process.argv.includes('--previews');
await fs.mkdir('output/v3/previews',{recursive:true});
const started=performance.now(),errors=[];
const serveUrl=await bundle({entryPoint:path.resolve('src/index.tsx'),publicDir:null});
const chromiumOptions={gl:'swangle'};
const browser=await openBrowser('chrome',{browserExecutable:'/usr/bin/chromium',chromiumOptions});
const shared={serveUrl,puppeteerInstance:browser,chromiumOptions,timeoutInMilliseconds:240000,
 onBrowserLog:l=>{if(l.type==='error'){errors.push(l.text);console.error(l.text);}}};
try{
 const composition=await selectComposition({...shared,id:'ClockmakerV3'});
 if(composition.width!==360||composition.height!==640||composition.durationInFrames!==300||composition.fps!==30)throw Error('Invalid V3 specification');
 if(preview){
  for(const frame of (process.argv.find(a=>a.startsWith('--frames='))?.split('=')[1].split(',').map(Number)??[0,45,90,135,180,195,225,270,299])){
   const t=performance.now();
   await renderStill({...shared,composition,frame,imageFormat:'png',output:`output/v3/previews/f${String(frame).padStart(3,'0')}.png`});
   console.log('preview',frame,((performance.now()-t)/1000).toFixed(2)+'s');
  }
 }else{
  let last=0;
  await renderMedia({...shared,composition,codec:'h264',crf:18,pixelFormat:'yuv420p',outputLocation:'output/v3/picture.mp4',concurrency:2,
   onProgress:p=>{if(p.renderedFrames>=last+15||p.renderedFrames===300){last=p.renderedFrames;console.log('progress',p.renderedFrames+'/300',p.stitchStage);}}});
 }
 const seconds=(performance.now()-started)/1000;
 const receipt={mode:preview?'previews':'video',seconds,dimensions:[360,640],fps:30,frames:300,errors};
 await fs.writeFile(`output/v3/${preview?'preview':'render'}-receipt.json`,JSON.stringify(receipt,null,2));
 console.log('Completed',receipt.mode,'in',seconds.toFixed(2),'seconds');
 if(errors.length)throw Error('Browser errors during rendering');
}finally{await browser.close({silent:true});}

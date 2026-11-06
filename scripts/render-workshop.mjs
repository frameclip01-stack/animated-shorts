import fs from 'node:fs/promises';
import path from 'node:path';
import {bundle} from '@remotion/bundler';
import {selectComposition,renderStill} from '@remotion/renderer';
await fs.mkdir('output/workshop',{recursive:true});
const serveUrl=await bundle({entryPoint:path.resolve('src/index.tsx'),publicDir:null});
const errors=[];
const shared={serveUrl,browserExecutable:process.env.CHROMIUM_EXECUTABLE||'/usr/bin/chromium',chromiumOptions:{gl:'swangle'},timeoutInMilliseconds:180000,onBrowserLog:l=>{if(l.type==='error'){errors.push(l.text);console.error(l.text);}}};
const composition=await selectComposition({...shared,id:'ClockWorkshop'});
const scales=process.argv.includes('--draft')?[1]:[1,2];
for(const scale of scales){
 const output=`output/workshop/clockmaker-${360*scale}x${640*scale}.png`;
 await renderStill({...shared,composition,frame:0,scale,imageFormat:'png',output});console.log(output);
}
await fs.writeFile('output/workshop/render-info.json',JSON.stringify({composition:composition.id,frame:0,fps:30,scales,browserErrors:errors},null,2));
if(errors.length)throw Error('Browser errors during render');

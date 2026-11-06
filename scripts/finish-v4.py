import json,subprocess,time,shutil
from pathlib import Path
root=Path(__file__).resolve().parents[1];out=root/'output/v4';deliver=root/'deliverables/v4';deliver.mkdir(exist_ok=True)
t=time.perf_counter()
subprocess.run(['ffmpeg','-hide_banner','-y','-i',str(out/'picture.mp4'),'-i',str(out/'mix.wav'),'-map','0:v:0','-map','1:a:0','-map_metadata','-1',
 '-c:v','libx264','-preset','medium','-crf','18','-vf','scale=in_range=pc:out_range=tv:in_color_matrix=bt601:out_color_matrix=bt709,format=yuv420p',
 '-color_range','tv','-colorspace','bt709','-color_primaries','bt709','-color_trc','bt709','-c:a','aac','-b:a','192k','-ar','48000','-t','5','-movflags','+faststart',str(deliver/'clockmaker-v4.mp4')],check=True)
encode=time.perf_counter()-t
subprocess.run(['/workspace/.venvs/alignment/bin/python','scripts/qa-v4.py'],cwd=root,check=True)
receipt=json.loads((out/'render-receipt.json').read_text());receipt['finish_encode_seconds']=encode;receipt['render_and_encode_seconds']=receipt['seconds']+encode
(deliver/'render-report.json').write_text(json.dumps(receipt,indent=2)+'\n');shutil.copyfile(out/'word-timing.json',deliver/'word-timing.json');shutil.copyfile(out/'audio-cues.json',deliver/'audio-cues.json')
print('Render and encode:',receipt['render_and_encode_seconds'],'seconds')

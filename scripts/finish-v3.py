"""Mux the original Foley, preserve exact picture timing, and run decoded-output checks."""
import json,subprocess,time,shutil
from pathlib import Path
root=Path(__file__).resolve().parents[1];out=root/'output/v3';deliver=root/'deliverables';deliver.mkdir(exist_ok=True)
start=time.perf_counter()
subprocess.run(['ffmpeg','-hide_banner','-y','-i',str(out/'picture.mp4'),'-i',str(out/'mix.wav'),
 '-map','0:v:0','-map','1:a:0','-map_metadata','-1','-c:v','libx264','-preset','medium','-crf','18',
 '-vf','scale=in_range=pc:out_range=tv:in_color_matrix=bt601:out_color_matrix=bt709,format=yuv420p',
 '-color_range','tv','-colorspace','bt709','-color_primaries','bt709','-color_trc','bt709','-c:a','aac','-b:a','192k','-ar','48000',
 '-af','loudnorm=I=-16:TP=-1.5:LRA=9','-t','10','-movflags','+faststart',str(deliver/'clockmaker-v3.mp4')],check=True)
seconds=time.perf_counter()-start
subprocess.run(['python3','scripts/qa-v3.py'],cwd=root,check=True)
subprocess.run(['python3','scripts/contact-v3.py','--decoded'],cwd=root,check=True)
receipt=json.loads((out/'render-receipt.json').read_text());receipt['mux_seconds']=seconds
receipt['picture_and_mux_seconds']=receipt['seconds']+seconds
(deliver/'clockmaker-v3-render-report.json').write_text(json.dumps(receipt,indent=2)+'\n')
shutil.copyfile(out/'qa.json',deliver/'clockmaker-v3-qa.json')
shutil.copyfile(out/'audio-cues.json',deliver/'clockmaker-v3-audio-cues.json')
print('Full render and mux:',receipt['picture_and_mux_seconds'],'seconds')

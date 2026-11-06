"""Verify every decoded frame and verify real narration in the actual delivered MP4."""
import json,subprocess,hashlib,wave
from pathlib import Path
import numpy as np
from PIL import Image,ImageDraw,ImageFont
from pocketsphinx import Decoder
root=Path(__file__).resolve().parents[1];out=root/'output/v4';movie=root/'deliverables/v4/clockmaker-v4.mp4'
def run(*a):return subprocess.run(a,check=True,capture_output=True).stdout
probe=json.loads(run('ffprobe','-v','error','-count_frames','-show_streams','-show_format','-of','json',str(movie)))
v=next(s for s in probe['streams'] if s['codec_type']=='video');a=next(s for s in probe['streams'] if s['codec_type']=='audio')
assert v['codec_name']=='h264' and (v['width'],v['height'])==(360,640)
assert v['r_frame_rate']=='30/1' and v['avg_frame_rate']=='30/1' and int(v['nb_read_frames'])==150
assert float(v['duration'])==5 and float(probe['format']['duration'])==5 and v['pix_fmt']=='yuv420p'
assert a['codec_name']=='aac' and int(a['sample_rate'])==48000 and abs(float(a['duration'])-5)<.001
assert abs(float(a.get('start_time','0'))-float(v.get('start_time','0')))<.001
raw=run('ffmpeg','-v','error','-i',str(movie),'-f','rawvideo','-pix_fmt','rgb24','-')
F=np.frombuffer(raw,np.uint8).reshape(-1,640,360,3);assert len(F)==150
luma=(F.astype(np.float32)/255)@np.array([.2126,.7152,.0722],np.float32);black=np.flatnonzero(luma.mean((1,2))<.025).tolist();assert not black
D=np.abs(np.diff(F.astype(np.int16),axis=0)).mean((1,2,3));frozen=[]
for i in range(145):
 if np.all(D[i:i+5]<.06):frozen.append(i)
assert not frozen,frozen
samples=[0,15,29,30,45,59,62,75,89,90,98,110,120,135,149]
(out/'decoded').mkdir(exist_ok=True)
font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',15)
sheet=Image.new('RGB',(360*5,668*3),'#302836');g=ImageDraw.Draw(sheet)
for i,f in enumerate(samples):
 image=Image.fromarray(F[f]);image.save(out/'decoded'/f'f{f:03}.png');x=(i%5)*360;y=(i//5)*668
 g.text((x+10,y+6),f'Frame {f:03} | {f/30:.2f}s',font=font,fill='#f4ead8');sheet.paste(image,(x,y+28))
sheet.save(root/'deliverables/v4/contact-sheet.jpg',quality=93)
# Decode the FINAL AAC stream, not a source WAV, for both recognition and waveform verification.
voice16=run('ffmpeg','-v','error','-i',str(movie),'-vn','-ar','16000','-ac','1','-f','s16le','-')
decoder=Decoder(samprate=16000,loglevel='ERROR');decoder.start_utt();decoder.process_raw(voice16,False,True);decoder.end_utt()
recognized=decoder.hyp().hypstr
expected='he made an alarm so loud it shook the entire workshop';assert recognized==expected,recognized
pcm=run('ffmpeg','-v','error','-i',str(movie),'-vn','-ar','48000','-ac','2','-f','f32le','-')
sound=np.frombuffer(pcm,np.float32).reshape(-1,2)[:240000];assert len(sound)==240000 and np.max(np.abs(sound))<.99
with wave.open(str(out/'narration-placed.wav')) as w:placed=np.frombuffer(w.readframes(w.getnframes()),'<i2').reshape(-1,2).astype(float)/32768
lo=10560;hi=lo+168020
correlation=float(np.corrcoef(placed[lo:hi].mean(1),sound[lo:hi].mean(1))[0,1]);assert correlation>.90,correlation
report={'passed':True,'file':movie.name,'sha256':hashlib.sha256(movie.read_bytes()).hexdigest(),
 'video':{'codec':v['codec_name'],'dimensions':[360,640],'fps':v['avg_frame_rate'],'frames':150,'duration':5,'pixel_format':v['pix_fmt']},
 'audio':{'codec':a['codec_name'],'sample_rate':48000,'channels':a['channels'],'duration':float(a['duration']),'peak':float(np.abs(sound).max())},
 'voiceover':{'source':'assets/audio/AT1.mp3','recognized_from_final_mp4':recognized,'matches_requested_sentence':True,'source_correlation':correlation,'source_retimed':False,'offset_seconds':.22,'verification':'Unconstrained local recognition of decoded final AAC plus waveform comparison against supplied recording.'},
 'black_frames':black,'frozen_windows':frozen,'min_frame_difference':float(D.min()),'mean_frame_difference':float(D.mean()),
 'inspected_frames':samples,'limitations':'Pixel checks do not prove style quality. Preview and decoded-frame visual inspection are also required.'}
(root/'deliverables/v4/qa.json').write_text(json.dumps(report,indent=2)+'\n');(out/'ffprobe.json').write_text(json.dumps(probe,indent=2)+'\n');print(json.dumps(report,indent=2))

"""Decode every delivered frame, check metadata/audio, and extract the requested QC samples."""
import json,subprocess,hashlib
from pathlib import Path
import numpy as np
from PIL import Image
root=Path(__file__).resolve().parents[1];movie=root/'deliverables/clockmaker-v3.mp4';out=root/'output/v3';decoded=out/'decoded';decoded.mkdir(exist_ok=True)
def run(*args):return subprocess.run(args,check=True,capture_output=True)
probe=json.loads(run('ffprobe','-v','error','-count_frames','-show_streams','-show_format','-of','json',str(movie)).stdout)
v=next(s for s in probe['streams'] if s['codec_type']=='video');a=next(s for s in probe['streams'] if s['codec_type']=='audio')
assert v['codec_name']=='h264' and (v['width'],v['height'])==(360,640)
assert v['r_frame_rate']=='30/1' and v['avg_frame_rate']=='30/1' and int(v['nb_read_frames'])==300
assert v['pix_fmt']=='yuv420p' and abs(float(v['duration'])-10)<.0001
assert abs(float(probe['format']['duration'])-10)<.001
assert a['codec_name']=='aac' and int(a['sample_rate'])==48000 and a['channels']==2
assert abs(float(a.get('start_time',0))-float(v.get('start_time',0)))<1/30
raw=run('ffmpeg','-v','error','-i',str(movie),'-map','0:v:0','-f','rawvideo','-pix_fmt','rgb24','-').stdout
F=np.frombuffer(raw,np.uint8).reshape(-1,640,360,3);assert len(F)==300
luma=(F.astype(np.float32)/255)@np.array([.2126,.7152,.0722],np.float32)
mean=luma.mean((1,2));black=np.flatnonzero(mean<.025).tolist()
diff=np.abs(np.diff(F.astype(np.int16),axis=0)).mean((1,2,3))
frozen=[];start=None
for i,d in enumerate(diff):
 if d<.06:start=i if start is None else start
 elif start is not None:
  if i-start>=6:frozen.append([start,i])
  start=None
if start is not None and 299-start>=6:frozen.append([start,299])
assert not black,f'Black frames: {black}'
assert not frozen,f'Frozen spans: {frozen}'
for f in [0,45,90,135,180,195,225,270,299]:Image.fromarray(F[f]).save(decoded/f'f{f:03}.png')
pcm=run('ffmpeg','-v','error','-i',str(movie),'-map','0:a:0','-ar','48000','-f','f32le','-acodec','pcm_f32le','-').stdout
sound=np.frombuffer(pcm,np.float32).reshape(-1,2)[:480000]
assert len(sound)>=479000 and np.isfinite(sound).all()
peak=float(np.max(np.abs(sound)));assert peak<.999,peak
rms=lambda x:float(np.sqrt(np.mean(x*x)))
pre=rms(sound[118*1600:120*1600]);post=rms(sound[120*1600:122*1600]);assert post>pre*2,(pre,post)
report={'passed':True,'file':movie.name,'sha256':hashlib.sha256(movie.read_bytes()).hexdigest(),
 'video':{'codec':v['codec_name'],'dimensions':[360,640],'fps':v['avg_frame_rate'],'decoded_frames':len(F),'duration':float(v['duration']),'pixel_format':v['pix_fmt']},
 'audio':{'codec':a['codec_name'],'sample_rate':a['sample_rate'],'channels':a['channels'],'start_time':a.get('start_time'),'sample_peak':peak,'activation_frame':120,'pre_activation_rms':pre,'post_activation_rms':post},
 'black_frames':black,'frozen_spans_6_frames_or_more':frozen,'min_frame_difference':float(diff.min()),'mean_frame_difference':float(diff.mean()),
 'inspected_frames':[0,45,90,135,180,195,225,270,299],
 'limits':'Pixel checks detect empty/frozen output; facial visibility, clipping and geometry are also reviewed visually on the decoded contact sheet.'}
(out/'qa.json').write_text(json.dumps(report,indent=2)+'\n');(out/'ffprobe.json').write_text(json.dumps(probe,indent=2)+'\n')
print(json.dumps(report,indent=2))

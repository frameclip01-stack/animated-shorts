"""Original deterministic clockwork Foley. Every event starts on an integer video frame."""
import json,wave
from pathlib import Path
import numpy as np
from scipy import signal
OUT=Path(__file__).resolve().parents[1]/'output/v3'
OUT.mkdir(parents=True,exist_ok=True)
SR=48000;N=SR*10;rng=np.random.default_rng(1871)
fx=np.zeros((N,2));room=np.zeros_like(fx);events=[]
def place(x,frame,gain=1,pan=0,label=None):
 start=frame*1600;end=min(N,start+len(x));x=x[:end-start]*gain
 if x.ndim==1:x=np.column_stack((x*np.sqrt((1-pan)/2),x*np.sqrt((1+pan)/2)))
 fx[start:end]+=x
 if label:events.append({'label':label,'frame':frame,'seconds':frame/30,'sample':start})
def bell(dur,freq,decay=2.7):
 t=np.arange(round(dur*SR))/SR;y=np.zeros(len(t))
 for k,(ratio,amp) in enumerate([(1,1),(2.76,.38),(5.4,.16),(8.9,.045)]):
  y+=amp*np.sin(2*np.pi*freq*ratio*t+.16*k)*np.exp(-t*(decay+k*1.5))
 y*=np.minimum(1,t/.0015)
 return y*.22
def click(dur=.06,freq=1700):
 t=np.arange(round(dur*SR))/SR;n=rng.standard_normal(len(t));return (.4*n+.6*np.sin(2*np.pi*freq*t))*np.exp(-t*100)*.17
def impact(freq,dur=.32):
 t=np.arange(round(dur*SR))/SR;noise=signal.sosfilt(signal.butter(2,1600,fs=SR,output='sos'),rng.standard_normal(len(t)))
 return (.5*np.sin(2*np.pi*freq*t)+noise*.8)*np.exp(-t*13)*.4
def whoosh(dur=.2):
 t=np.arange(round(dur*SR))/SR;n=signal.sosfilt(signal.butter(2,[500,3500],btype='bandpass',fs=SR,output='sos'),rng.standard_normal(len(t)))
 return n*np.sin(np.pi*t/dur)**2*.17
# Quiet room and slow mechanism, with stereo asymmetry.
noise=rng.standard_normal((N,2));room=signal.sosfilt(signal.butter(2,1800,fs=SR,output='sos'),noise,axis=0)*.003
for f in range(0,300,15):place(click(freq=1400 if f%30==0 else 2200),f,.55 if f<120 else .16,-.25 if f%30==0 else .25,'tick')
for f in range(70,107,4):place(click(.035,2400),f,.22+(f-70)/200,-.1,'wind')
place(click(.08,900),120,1,0,'activation click')
# Ringing ratchets begin exactly at picture activation; the wall ensemble follows the upward camera cut.
for start,freq,pan,gain in [(120,830,-.05,.42),(150,610,-.65,.37),(156,990,.1,.32),(162,1260,.65,.27)]:
 for f in range(start,300,7 if start==120 else 13):place(bell(.7,freq),f,gain,pan,'alarm strike' if f==start else None)
# Rattling shelf and bouncing parts: multiple materials, localized in the room.
for f in range(132,300,9):place(click(.05,1800),f,.13+.10*(f>=255),np.sin(f)*.65,'parts rattle' if f==132 else None)
for f in [150,168,186,264,276,288]:place(impact(140,.22),f,.30,-.4,'wood jolt')
place(impact(110),195,.68,.1,'visitor impact');place(whoosh(),196,.7,.3,'visitor hands up')
place(bell(.6,1700,7)+np.pad(click(.05), (0,round(.6*SR)-round(.05*SR))),225,.48,-.4,'loose gear clatter')
t=np.arange(int(.55*SR))/SR;place(np.sin(2*np.pi*(250*t+90*(1-np.exp(-t*5))))*np.exp(-t*7)*.18,240,.6,-.3,'spring boing')
# Room rumble is pitched low enough to leave the bell transients clear.
t=np.arange(N-255*1600)/SR
rumble=signal.sosfilt(signal.butter(2,180,fs=SR,output='sos'),rng.standard_normal(len(t)))*.11
place(rumble,255,.6,0,'room shake')
place(impact(85,.45),285,.6,.2,'final comic clunk')
for a in [fx,room]:
 a[-2400:]*=np.linspace(1,0,2400)[:,None]
mix=fx+room
peak=np.max(np.abs(mix));gain=min(1,.86/peak);mix*=gain;fx*=gain;room*=gain
for name,x in [('sound-effects.wav',fx),('room-tone.wav',room),('mix.wav',mix)]:
 with wave.open(str(OUT/name),'wb') as w:w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes((np.clip(x,-1,1)*32767).astype('<i2').tobytes())
(OUT/'audio-cues.json').write_text(json.dumps({'sample_rate':SR,'samples':N,'frames':300,'events':events},indent=2))
print('Original stereo Foley: 480000 samples, 10 seconds, peak',float(np.max(np.abs(mix))))

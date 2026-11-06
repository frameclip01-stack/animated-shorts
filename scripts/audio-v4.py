"""User narration is mandatory and unretimed; original mechanical Foley stays behind it."""
import wave,json,subprocess
from pathlib import Path
import numpy as np
from scipy import signal
root=Path(__file__).resolve().parents[1];out=root/'output/v4';SR=48000;N=SR*5
source=np.frombuffer(subprocess.run(['ffmpeg','-v','error','-i',str(root/'assets/audio/AT1.mp3'),'-ar',str(SR),'-ac','1','-f','f32le','-'],check=True,capture_output=True).stdout,np.float32).astype(float)
voice=np.zeros((N,2));offset=10560;voice[offset:offset+len(source)]=source[:,None]
fx=np.zeros_like(voice);rng=np.random.default_rng(1871);events=[]
def place(x,f,gain=1,pan=0,label=None):
 a=f*1600;b=min(a+len(x),N);x=x[:b-a]*gain
 fx[a:b,0]+=x*np.sqrt((1-pan)/2);fx[a:b,1]+=x*np.sqrt((1+pan)/2)
 if label:events.append({'label':label,'frame':f,'sample':a})
def click(freq=1900,dur=.06):
 t=np.arange(round(dur*SR))/SR;return (rng.standard_normal(len(t))*.4+np.sin(2*np.pi*freq*t)*.6)*np.exp(-t*110)*.12
def bell(freq=850,dur=.65):
 t=np.arange(round(dur*SR))/SR;y=sum(a*np.sin(2*np.pi*freq*k*t)*np.exp(-t*(6+i*2)) for i,(k,a) in enumerate([(1,1),(2.76,.38),(5.4,.13),(8.9,.04)]));return y*np.minimum(1,t/.002)*.2
for f in range(0,150,9):place(click(),f,.28,-.3,'tick' if f==0 else None)
for f in range(0,60,4):place(click(2500,.035),f,.15,0,'shaking mechanism' if f==0 else None)
place(click(800,.07),62,1,0,'activation on shook')
for start,freq,pan in [(62,850,0),(68,620,-.6),(74,1090,.6)]:
 for f in range(start,150,6 if start==62 else 11):place(bell(freq),f,.5,pan,'alarm' if f==start else None)
for f in range(68,150,7):place(click(1400),f,.28,np.sin(f)*.5,'parts rattle' if f==68 else None)
for f in [90,121,136]:
 t=np.arange(int(.25*SR))/SR;y=(np.sin(2*np.pi*110*t)+signal.sosfilt(signal.butter(2,1100,fs=SR,output='sos'),rng.standard_normal(len(t)))*.6)*np.exp(-t*22)*.17
 place(y,f,.65,-.1,'wood jolt')
speech=source[np.abs(source)>.015];voice_rms=np.sqrt(np.mean(speech**2));effect_rms=np.sqrt(np.mean(fx[62*1600:112*1600]**2));fx*=voice_rms*.22/max(effect_rms,1e-9)
# Only the effects rise after the voice has ended; no speech compression or time stretching.
fx[180000:]*=np.linspace(1,1.7,N-180000)[:,None];fx[-4800:]*=np.linspace(1,0,4800)[:,None]
mix=voice+fx;gain=min(.145/max(voice_rms,1e-6),.86/max(np.max(np.abs(mix)),1e-6));mix*=gain;voice*=gain;fx*=gain
for name,a in [('mix.wav',mix),('narration-placed.wav',voice),('effects.wav',fx)]:
 with wave.open(str(out/name),'wb') as w:w.setframerate(SR);w.setnchannels(2);w.setsampwidth(2);w.writeframes((np.clip(a,-1,1)*32767).astype('<i2').tobytes())
(out/'audio-cues.json').write_text(json.dumps({'source':'assets/audio/AT1.mp3','offset_samples':offset,'sample_rate':SR,'samples':N,'voice_source_samples':len(source),'linear_master_gain':gain,'retimed':False,'events':events},indent=2))
print('5-second voiced mix written; source seconds',len(source)/SR,'gain',gain,'peak',float(np.abs(mix).max()))

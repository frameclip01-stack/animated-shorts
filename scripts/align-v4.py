"""Recognize and force-align the user-supplied narration locally. No external upload."""
import json,wave,hashlib
from pathlib import Path
from pocketsphinx import Decoder
root=Path(__file__).resolve().parents[1]
with wave.open(str(root/'output/v4/voice-16k.wav')) as w:
 audio=w.readframes(w.getnframes());duration=w.getnframes()/w.getframerate()
text='he made an alarm so loud it shook the entire workshop'
d=Decoder(samprate=16000,loglevel='ERROR');d.start_utt();d.process_raw(audio,False,True);d.end_utt()
recognized=d.hyp().hypstr
assert recognized==text,recognized
# Two passes: constrain words, then perform phone/state alignment.
d.set_align_text(text);d.start_utt();d.process_raw(audio,False,True);d.end_utt()
d.set_alignment();d.start_utt();d.process_raw(audio,False,True);d.end_utt()
words=[]
for word in d.get_alignment():
 if word.name.startswith('<'):continue
 start=word.start*.01;end=(word.start+word.duration)*.01
 words.append({'word':word.name,'source_start':round(start,3),'source_end':round(end,3),
  'video_start':round(start+.22,3),'video_end':round(end+.22,3),'start_frame':round((start+.22)*30),'end_frame':round((end+.22)*30)})
report={'source':'assets/audio/AT1.mp3','source_sha256':hashlib.sha256((root/'assets/audio/AT1.mp3').read_bytes()).hexdigest(),
 'recognized_transcript':recognized,'expected_transcript':text,'source_duration':duration,'offset_seconds':.22,
 'method':'PocketSphinx 5.0.4 unconstrained recognition followed by two-pass forced phone/word alignment',
 'timing_resolution_seconds':.01,'note':'Acoustic boundary estimates at 10 ms resolution; not claims of human-labelled exact boundaries. Source audio is not time-stretched.','words':words}
(root/'src/workshop/narration-v4.json').write_text(json.dumps(report,indent=2)+'\n')
(root/'output/v4/word-timing.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report,indent=2))

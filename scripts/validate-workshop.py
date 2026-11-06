"""Checks the static pair, their alignment and current render receipt."""
import json,hashlib
from pathlib import Path
import numpy as np
from PIL import Image
root=Path(__file__).resolve().parents[1]/'output/workshop'
receipt=json.loads((root/'render-info.json').read_text())
assert receipt['frame']==0 and receipt['scales']==[1,2]
assert receipt['browserErrors']==[]
results=[]
images=[]
for w,h in [(360,640),(720,1280)]:
 p=root/f'clockmaker-{w}x{h}.png'
 with Image.open(p) as im:
  assert im.format=='PNG' and im.size==(w,h)
  im.verify()
 with Image.open(p) as im:
  assert np.array(im.convert('RGBA'))[:,:,3].min()==255
  rgb=im.convert('RGB');images.append(rgb.copy())
  a=np.asarray(rgb)/255.;l=a@np.array([.2126,.7152,.0722])
  assert l.std()>.12 and (l>.7).mean()>.01 and (l<.2).mean()>.05
  results.append({'file':p.name,'size':[w,h],'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'luma_mean':round(float(l.mean()),4),'luma_std':round(float(l.std()),4)})
# True rerenders differ slightly at edges; large misregistration must fail.
a=np.array(images[0]).astype(float)/255
b=np.array(images[1].resize((360,640),Image.Resampling.LANCZOS)).astype(float)/255
mae=float(np.abs(a-b).mean())
assert mae<.045,f'Unexpected scale disagreement: {mae}'
report={'passed':True,'same_frame_downsample_mae':round(mae,5),'outputs':results,'render_receipt':receipt,'scope':'Static PNG pair only; style remains subject to user review'}
(root/'validation.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps(report,indent=2))

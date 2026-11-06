"""Validate the delivered still and its render receipt; never treats a blank PNG as success."""
import hashlib
import json
from pathlib import Path
import numpy as np
from PIL import Image

root=Path(__file__).resolve().parents[1]
path=root/'output/garden-test.png'
with Image.open(path) as im:
    assert im.format=='PNG', 'Expected PNG'
    im.verify()
with Image.open(path) as im:
    assert im.size==(360,640), f'Wrong dimensions: {im.size}'
    rgba=np.array(im.convert('RGBA'))
assert (rgba[:,:,3]==255).all(), 'Frame contains transparent pixels'
rgb=rgba[:,:,:3].astype(float)/255
luma=rgb@np.array([.2126,.7152,.0722])
assert luma.std()>.10, 'Frame is blank or has inadequate variation'
assert (luma<.25).mean()>.005, 'Missing expected dark ink/details'
assert (luma>.65).mean()>.05, 'Missing expected lit surfaces'
receipt=json.loads((root/'output/render-info.json').read_text())
assert receipt['renderedFrames']==1 and receipt['frame']==0
assert receipt['width']==360 and receipt['height']==640 and receipt['fps']==30
assert receipt['browserErrors']==[], 'Browser errors during rendering'
report={'passed':True,'format':'PNG','dimensions':[360,640],'opaque':True,
        'luma_mean':round(float(luma.mean()),4),'luma_std':round(float(luma.std()),4),
        'sha256':hashlib.sha256(path.read_bytes()).hexdigest(),
        'render_receipt':receipt,'scope':'One static frame; no animation or MP4 validation'}
(root/'output/validation.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps(report,indent=2))

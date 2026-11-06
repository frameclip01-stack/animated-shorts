from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import sys
root=Path(__file__).resolve().parents[1]
source=root/('output/v3/decoded' if '--decoded' in sys.argv else 'output/v3/previews')
frames=[0,45,90,135,180,225,270,299]
sheet=Image.new('RGB',(360*4,668*2),'#302836');draw=ImageDraw.Draw(sheet)
font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',16)
for i,f in enumerate(frames):
 im=Image.open(source/f'f{f:03}.png').convert('RGB');im.load();assert im.size==(360,640)
 x=(i%4)*360;y=(i//4)*668
 draw.text((x+12,y+5),f'Frame {f:03}  |  {f/30:.2f}s',font=font,fill='#f6ead5');sheet.paste(im,(x,y+28))
out=root/('deliverables/clockmaker-v3-contact-sheet.jpg' if '--decoded' in sys.argv else 'output/v3/preview-sheet.jpg')
sheet.save(out,quality=94);print(out)

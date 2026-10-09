from pathlib import Path
from PIL import Image,ImageOps
import json,zipfile,urllib.parse
root=Path(__file__).resolve().parent.parent
source=root/'.work/lab37/originals'
base='https://github.com/adamboy2000/film/releases/download/lab37-media-kit-v1'
# The supplied 68x15 Hopper A file is a text label, not an image asset.
names=[
 ('Front_Render.png','The complete kitchen','Product renders','The complete automated kitchen, shown at human scale.'),
 ('Lab37_JoshCherner_Lab372131.jpg','Kitchen, assembled','Studio photography','A clean view of the complete assembly in the studio.'),
 ('Lab37_JoshCherner_L1100957.jpg','Building the line','Studio photography','People and machinery at work in the studio.'),
 ('Lab37_JoshCherner_L1110776.jpg','On the workshop floor','Studio photography','The team at work on the assembly.'),
 ('Lab37_JoshCherner_L1080866.jpg','Hands on the hardware','Studio photography','A close view of hands, tools, and the physical build.'),
 ('Lab37_JoshCherner_L1080886.jpg','Inside the machine','Studio photography','Hands at work inside the sensing and control hardware.'),
 ('Front_Full_L37.jpg','The full system','Product renders','The complete system against a clean background.'),
 ('Front_Crop_L37.jpg','Across the line','Product renders','A closer view of the kitchen assembly.'),
 ('Bowler.jpg','The bowler','Product renders','A product render of the bowl dispensing module.'),
 ('Lidder.jpg','The lidder','Product renders','A product render of the lid dispensing module.'),
 ('Saucer_Axo.jpg','Saucer, in perspective','Product renders','An angled view of the sauce dispensing module.'),
 ('Saucer_Front.jpg','Saucer, from the front','Product renders','The sauce dispensing module viewed from the front.'),
 ('Saucer_Side.jpg','Saucer, from the side','Product renders','The sauce dispensing module viewed from the side.'),
 ('Hopper_Heat.jpg','Inside the hopper','Product renders','The internal hopper assembly.'),
 ('Hopper_Lid.jpg','Ingredients, in place','Product renders','The hopper with ingredients and an open lid.'),
 ('Lab37_JoshCherner_L1080906.jpg','Mechanical detail','Studio photography','A close view of the machined assembly.'),
 ('Lab37_JoshCherner_L1080966.jpg','Steel, up close','Studio photography','A vertical study of steel and machine details.'),
 ('Lab37_JoshCherner_L1120322.jpg','Assembly in motion','Studio photography','The team moves through the assembly process.'),
 ('Lab37_JoshCherner_L1120347.jpg','Ready for the road','Studio photography','The system being prepared for transport.'),
 ('Lab37_JoshCherner_L1120349.jpg','Loading the system','Studio photography','The kitchen assembly inside the loading bay.'),
 ('Lab37_JoshCherner_L1120358.jpg','Crates and concrete','Studio photography','Packed equipment on the workshop floor.'),
 ('Lab37_JoshCherner_L1120364.jpg','Scale of the workshop','Studio photography','A vertical view of the workshop and packed equipment.'),
 ('Lab37_JoshCherner_L1120368.jpg','Above the workshop','Studio photography','Light and structure above the workshop.'),
 ('Lab37_JoshCherner_L1120436.jpg','A study in steel','Studio photography','A close, monochrome view of the machine structure.'),
 ('Lab37_JoshCherner_L1120518.jpg','Along the assembly','Studio photography','A view along the assembled kitchen line.'),
]
rows=[]
for n,(name,title,category,use) in enumerate(names,101):
 p=source/name;im=ImageOps.exif_transpose(Image.open(p)).convert('RGB');width,height=im.size
 preview=f'/previews/lab37/LAB37_{n-100:02d}.webp';im.thumbnail((1600,1200));im.save(root/'public'/preview.lstrip('/'),quality=88,method=6)
 url=f'{base}/{urllib.parse.quote(name)}';is_png=p.suffix.lower()=='.png'
 rows.append({'id':n,'brand':'lab37','title':title,'category':category,'use':use,'originalName':name,'originalUrl':url,'originalBytes':p.stat().st_size,'variants':[{'orientation':'Original','ratio':'Original','width':width,'height':height,'preview':preview,'jpg':None if is_png else url,'png':url if is_png else None,'jpgBytes':0 if is_png else p.stat().st_size,'pngBytes':p.stat().st_size if is_png else 0}]})
(root/'src/lab37.json').write_text(json.dumps(rows,indent=2)+'\n')
with zipfile.ZipFile(root/'.work/release/Lab37_Media_Kit_Originals.zip','w',compression=zipfile.ZIP_STORED) as z:
 for name,*_ in names:z.write(source/name,f'Lab37/{name}')
(root/'src/lab37-collection.json').write_text(json.dumps({'archive':f'{base}/Lab37_Media_Kit_Originals.zip','archiveBytes':(root/'.work/release/Lab37_Media_Kit_Originals.zip').stat().st_size,'source':'https://drive.google.com/drive/folders/1E6Bhar35kUiYEc96Dhx8IBLuv03MQOZ-'},indent=2)+'\n')
print(f'Prepared {len(rows)} Lab37 originals and web previews.')

from pathlib import Path
from PIL import Image
import json,zipfile
root=Path(__file__).resolve().parent.parent
source=root/'Pronto_Designer_Stills_40'
records=json.loads((source/'04_Review/selection_manifest.json').read_text())
repo='adamboy2000/film'
tag='pronto-copper-mine-v1'
base=f'https://github.com/{repo}/releases/download/{tag}'
category={1:'Machines',2:'Machines',3:'Machines',4:'Environment',5:'Environment',6:'Environment',7:'Technology',8:'Technology',9:'People',10:'Environment',11:'Operations',12:'Operations',13:'Machines',14:'Machines',15:'Technology',16:'People',17:'People',18:'Operations',19:'Operations',20:'Operations',21:'Technology',22:'Technology',23:'Technology',24:'Operations',25:'Machines',26:'Machines',27:'Operations',28:'Operations',29:'Machines',30:'Machines',31:'Environment',32:'Machines',33:'Technology',34:'Environment',35:'Environment',36:'Machines',37:'Operations',38:'Technology',39:'Operations',40:'Environment'}
favorites=[1,4,7,8,11,24]
catalog=[]
for r in records:
    variants=[]
    for v in r['variants']:
        im=Image.open(source/v['jpg']).convert('RGB')
        preview=f'/previews/{r["stem"]}_{v["orientation"].lower()}.webp'
        im.thumbnail((1600,1200))
        
        if not (root/'public'/preview.lstrip('/')).exists():im.save(root/'public'/preview.lstrip('/'),format='WEBP',quality=88,method=6)
        variants.append({'orientation':v['orientation'],'ratio':v['ratio'],'width':v['width'],'height':v['height'],'preview':preview,'jpg':f'{base}/{Path(v["jpg"]).name}','png':f'{base}/{Path(v["png"]).name}','jpgBytes':(source/v['jpg']).stat().st_size,'pngBytes':(source/v['png']).stat().st_size})
    catalog.append({'id':r['id'],'title':r['title'],'seconds':r['seconds'],'frame':r['frame'],'use':r['use'],'category':category[r['id']],'firstPick':r['id'] in favorites,'master':f'{base}/{Path(r["master"]).name}','masterBytes':(source/r['master']).stat().st_size,'variants':variants})
(root/'src/catalog.json').write_text(json.dumps(catalog,indent=2)+'\n')
release=root/'.work/release';release.mkdir(exist_ok=True)
bundles=[]
for orient in ['Landscape','Portrait','Square']:
    name=f'Pronto_40_{orient}_JPG.zip'
    files=list((source/'01_Selects_JPG'/orient).glob('*.jpg'))
    with zipfile.ZipFile(release/name,'w',compression=zipfile.ZIP_STORED) as z:
        for p in files:z.write(p,f'{orient}/{p.name}')
    bundles.append({'orientation':orient,'url':f'{base}/{name}','bytes':(release/name).stat().st_size,'count':40})
(root/'src/collection.json').write_text(json.dumps({'repo':repo,'release':tag,'github':f'https://github.com/{repo}','releaseUrl':f'https://github.com/{repo}/releases/tag/{tag}','archive':f'{base}/Pronto_Designer_Stills_40.zip','archiveBytes':(root/'Pronto_Designer_Stills_40.zip').stat().st_size,'bundles':bundles},indent=2)+'\n')
print(f'Prepared {len(catalog)} shots / {sum(len(r["variants"]) for r in catalog)} previews; {sum(p.stat().st_size for p in (root/"public/previews").glob("*.webp"))/1e6:.1f} MB of web previews.')

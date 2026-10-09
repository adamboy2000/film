from pathlib import Path
import json,urllib.parse
root=Path(__file__).resolve().parent.parent
assets={}
for shot in json.loads((root/'src/catalog.json').read_text()):
 for v in shot['variants']:
  url=v['png'];name=urllib.parse.unquote(url.rsplit('/',1)[1]);assets[name]={'url':url,'size':v['pngBytes'],'type':'image/png'}
for shot in json.loads((root/'src/lab37.json').read_text()):
 name=shot['originalName'];assets[name]={'url':shot['originalUrl'],'size':shot['originalBytes'],'type':'image/png' if name.endswith('.png') else 'image/jpeg'}
(root/'api/asset-map.js').write_text('// Published originals permitted by the clipboard endpoint.\nexport default '+json.dumps(assets,indent=2)+'\n')
print(f'Prepared {len(assets)} clipboard assets.')

from pathlib import Path
import json, urllib.parse

root = Path(__file__).resolve().parent.parent
assets = {}

def add(url, size, mime):
    if not url:
        return
    name = urllib.parse.unquote(url.rsplit('/', 1)[1])
    entry = {'url': url, 'size': size, 'type': mime}
    assert isinstance(size, int) and size > 0, name
    assert name not in assets or assets[name] == entry, name
    assets[name] = entry

for shot in json.loads((root / 'src/catalog.json').read_text()):
    for variant in shot['variants']:
        for extension, mime in [('jpg', 'image/jpeg'), ('png', 'image/png')]:
            add(variant.get(extension), variant.get(extension + 'Bytes'), mime)
    add(shot.get('master'), shot.get('masterBytes'), 'image/png')

for shot in json.loads((root / 'src/lab37.json').read_text()):
    add(shot['originalUrl'], shot['originalBytes'], 'image/png' if shot['originalName'].lower().endswith('.png') else 'image/jpeg')

(root / 'api/asset-map.js').write_text('// Published originals permitted by the clipboard endpoint.\nexport default ' + json.dumps(assets, indent=2) + '\n')
print(f'Prepared {len(assets)} clipboard assets.')

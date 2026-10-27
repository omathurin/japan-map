"""Build local map data from downloaded, pinned sources. See public/data/SOURCES.md.
Usage: PYTHONPATH=/workspace/.python-libs python3 scripts/prepare-geography.py /path/to/Ryoseikoku_20230626_TSV /path/to/japan.geojson
Requires numpy, rasterio, shapely. These are build-time tools, not app dependencies.
"""
import json, math, sys
from pathlib import Path
import numpy as np
from rasterio.features import shapes
from rasterio.transform import Affine
from shapely.geometry import shape, mapping
from shapely.ops import transform, unary_union

root = Path(__file__).resolve().parents[1]
metadata = json.loads((root / 'scripts/province-metadata.json').read_text())
files = list((Path(sys.argv[1]) / '1868/10').glob('*.tsv'))
assert files, 'Missing historical raster tiles'
# At zoom 10 each source tile is 256 x 256. A 4-pixel sample gives ~500 m cells.
step = 4
xy = [tuple(map(int, p.stem.split('_')[-2:])) for p in files]
xmin, xmax = min(x for x,y in xy), max(x for x,y in xy)
ymin, ymax = min(y for x,y in xy), max(y for x,y in xy)
a = np.zeros(((ymax-ymin+1)*64, (xmax-xmin+1)*64), dtype=np.uint8)
for p,(x,y) in zip(files,xy):
    tile = np.loadtxt(p, delimiter='\t', dtype=np.uint8)
    assert tile.shape == (256,256)
    a[(y-ymin)*64:(y-ymin+1)*64,(x-xmin)*64:(x-xmin+1)*64] = tile[2::step,2::step]

def to_geo(x,y,z=None):
    return x / 262144 * 360 - 180, math.degrees(math.atan(math.sinh(math.pi*(1-2*y/262144))))

parts = {}
for geometry, value in shapes(a, mask=a>0, transform=Affine(step,0,xmin*256,0,step,ymin*256)):
    i = str(int(value))
    g = shape(geometry)
    if g.area < 64: continue
    parts.setdefault(i,[]).append(transform(to_geo,g).simplify(.006,preserve_topology=True))
features=[]
for i,polygons in parts.items():
    # 69 is outside the named 68-province set; do not invent an identity.
    if i not in metadata: continue
    geom=unary_union(polygons)
    features.append({'type':'Feature','properties':{'id':int(i),**metadata[i]},'geometry':mapping(geom)})
assert len(features)==69, len(features)
(root/'public/data/provinces-1868.geojson').write_text(json.dumps({'type':'FeatureCollection','features':features},ensure_ascii=False,separators=(',',':')))

pref = json.loads(Path(sys.argv[2]).read_text())
features=[]
for f in pref['features']:
    geom=shape(f['geometry']).simplify(.008,preserve_topology=True)
    if geom.geom_type=='MultiPolygon':
        geom=unary_union([p for p in geom.geoms if p.area>.0004])
    features.append({'type':'Feature','properties':f['properties'],'geometry':mapping(geom)})
assert len(features)==47
(root/'public/data/prefectures.geojson').write_text(json.dumps({'type':'FeatureCollection','features':features},ensure_ascii=False,separators=(',',':')))
print('Saved 69 historical areas and 47 current prefectures.')

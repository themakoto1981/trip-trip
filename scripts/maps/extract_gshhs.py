"""GSHHS（全解像度 'f'）の海岸線から、東南アジア範囲の陸地ポリゴンを抜き出して
scripts/maps/.cache/gshhs-f.json に保存する。build-maps.mjs の島マップが使う。

必要: pip install basemap basemap-data-hires
データ: GSHHG (Wessel & Smith), LGPL
"""
import json, os
from mpl_toolkits.basemap import Basemap

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, ".cache", "gshhs-f.json")
os.makedirs(os.path.dirname(OUT), exist_ok=True)

m = Basemap(llcrnrlon=92, llcrnrlat=-12, urcrnrlon=130, urcrnrlat=22,
            projection="cyl", resolution="f")
polys = []
for (xs, ys), t in zip(m.coastpolygons, m.coastpolygontypes):
    ring = [[round(x, 5), round(y, 5)] for x, y in zip(xs, ys)]
    if len(ring) < 3:
        continue
    polys.append({
        "type": t,  # 1=陸, 2=湖, 3=湖の中の島, 4=池
        "rings": [ring],
        "bb": {"west": min(xs), "east": max(xs), "south": min(ys), "north": max(ys)},
    })
with open(OUT, "w") as f:
    json.dump(polys, f)
print(f"{len(polys)} polygons, {sum(len(p['rings'][0]) for p in polys)} points -> {OUT}")

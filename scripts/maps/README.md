# 地図ジェネレーター（scripts/maps）

TRIP×TRIPの記事用地図（SVG）を生成するスクリプト。出力は `assets/images/maps/` 以下。

| 出力 | 内容 |
|---|---|
| `base/asia.svg` | 日本〜東南アジアのベース地図（国名・海名・主要都市）。使い回し用 |
| `base/asia-destinations.svg` | ベース地図＋`destinations.yml`の全行き先を赤ドットで表示 |
| `islands/<slug>.svg` | 各行き先の島（エリア）拡大図。主役の島を濃く、周辺の島を薄く塗る |
| `routes/<slug>.svg` | 日本→主要ハブ（バンコク等）の経由ルート＋所要時間＋現地アクセス図（または島の拡大図）のインセット（記事に貼る完成形） |

## 使い方

```bash
cd scripts/maps
npm install                                  # world-atlas, topojson-client
pip install basemap basemap-data-hires       # GSHHS全解像度の海岸線（島マップ用）
python extract_gshhs.py                      # .cache/gshhs-f.json を作る（初回のみ）
node build-maps.mjs                          # 全部作り直す
node build-maps.mjs koh-lipe-guide           # 特定の行き先だけ
```

新しい行き先を `destinations.yml` に追加したら `node build-maps.mjs <slug>` を実行するだけで島マップ・ルートマップができる。
島の切り取り範囲がおかしい場合は `build-maps.mjs` の `ISLAND_OVERRIDES` で調整する（`spanKm`=表示範囲、`center`=中心、`marker`=本土の街などにピンを立てる、`highlightKm`=諸島をまとめて主役色にする、`targetAt`=主役にする島を座標で指定）。

## 注意

- ルートマップの経由地は `build-maps.mjs` の `ROUTES` に、各記事の「行き方」に書かれた基本ルートを手で写したもの。記事の行き方を変えたら `ROUTES` も直すこと。新しい行き先は `ROUTES` に無いとエラーで止まる。
- 実線＝飛行機、点線＝陸路・船。全体地図には主要ハブまで、ハブから先の現地の空港・桟橋はインセットに描く。
- 所要時間は `destinations.yml` の `flight_hours` をそのまま表示している。
- パリ島（Pulau Pari）はGSHHSに輪郭が無いほど小さいため、ジャカルタ湾周辺の地図にピンで位置を示している。
- SVG内の文字は `Noto Serif JP`/`Noto Sans JP` → ヒラギノ → 游 の順でフォントを指定。`<img>`で読み込む場合はWebフォントが効かず閲覧端末のフォントになる。

## データ出典

- 国境・陸地（ベース地図）：Natural Earth（パブリックドメイン）via world-atlas
- 島の海岸線：GSHHG（Wessel & Smith, LGPL）via basemap-data-hires

# 地図ジェネレーター（scripts/maps）

TRIP×TRIPの記事用地図（SVG）を生成するスクリプト。出力は `assets/images/maps/` 以下。

| 出力 | 内容 |
|---|---|
| `base/asia.svg` | 日本〜東南アジアのベース地図（国名・海名・主要都市）。使い回し用 |
| `base/asia-destinations.svg` | ベース地図＋`destinations.yml`の全行き先を赤ドットで表示 |
| `islands/<slug>.svg` | 各行き先の島（エリア）拡大図。主役の島を濃く、周辺の島を薄く塗る |
| `routes/<slug>.svg` | 「○○島への行き方」マップ。全体図（日本→乗継空港→最後の空港、区間ごとに手段と所要時間）＋拡大図（空港→桟橋→島の車・船区間）。記事に貼る完成形 |

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

- 行き方マップの区間・手段・所要時間は `build-maps.mjs` の `ROUTES` に、各記事の「行き方」セクション（と `flight_hours`）から手で写したもの。記事に書いていない時間は書かず、手段だけにしている。記事の行き方を変えたら `ROUTES` も直すこと。新しい行き先は `ROUTES` に無いとエラーで止まる。
- 実線＝飛行機、破線＝車・バス、点線＝船。最後に飛行機で着く空港までを全体図、そこから先を拡大図に描く。
- パリ島（Pulau Pari）はGSHHSに輪郭が無いほど小さいため、ジャカルタ湾周辺の地図にピンで位置を示している。
- SVG内の文字は `Noto Serif JP`/`Noto Sans JP` → ヒラギノ → 游 の順でフォントを指定。`<img>`で読み込む場合はWebフォントが効かず閲覧端末のフォントになる。

## データ出典

- 国境・陸地（ベース地図）：Natural Earth（パブリックドメイン）via world-atlas
- 島の海岸線：GSHHG（Wessel & Smith, LGPL）via basemap-data-hires

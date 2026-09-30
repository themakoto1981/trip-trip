# TRIP×TRIP お手本集

新しい記事を作る際、以下を「お手本」として参照する。

## 記事構成のお手本

`_posts/2026-09-28-boracay-guide.md` を標準構成として参照する。見出しの順序は以下で固定する：

1. リード文（1〜2文で島の魅力を要約）
2. `## 行き方`（フライト・乗継・現地移動、総移動時間）
3. `## ベストシーズン`（月別の表＋狙い目シーズンの一文）
4. `## 予算の目安（1人あたり・N泊N+1日）`（内訳の箇条書き＋推奨泊数の理由＋合計金額）
5. `## おすすめ旅程（N泊N+1日の例）`（1日目〜最終日、箇条書き）
6. `## おすすめビーチ・スポット`（地図と連動する箇条書き、各項目の頭に `**スポット名**` を太字で）
7. `## 持ち物チェックリスト`（GFMチェックボックス）
8. 締めの一文（豆知識や実用的な一言）

## destinations.yml エントリのお手本

```yaml
- name: プーケット島
  en_name: "Phuket, Thailand"
  slug: phuket-guide
  country: タイ
  country_slug: thailand
  lat: 7.8804
  lng: 98.3923
  flight_min: 50000
  flight_max: 100000
  hotel_min: 4000
  hotel_max: 18000
  transport_min: 1500
  transport_max: 3000
  food_min: 3000
  food_max: 6000
  flight_hours: "約9〜11時間（バンコク経由）"
  recommended_nights: "3泊以上"
  visa: "不要"
  photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/.../XXXpx-....jpg"
  photo_credit_url: "https://commons.wikimedia.org/wiki/File:...."
  suited_for: [couple, family, friends, solo]
  best_months: [12, 1, 2]
  url: /YYYY/MM/DD/slug/
```

## spots.yml エントリのお手本

```yaml
phuket-guide:
  - name: パトンビーチ
    lat: 7.8965
    lng: 98.2963
    desc: ナイトライフも充実するプーケット随一の繁華ビーチ
```

`name` は記事本文の「おすすめビーチ・スポット」箇条書きの太字部分と一致（または部分一致）させること。地図のピンとリストのクリック連動に使われる。

## 良い文章の例（④書く担当向け）

> 日本からの移動に9〜11時間かかるため、2泊3日では移動だけで終わりがちです。現地で2日はしっかり楽しめる3泊以上が目安。

→ 理由（なぜその泊数か）を具体的な移動時間とセットで説明している。読者が自分で判断材料を持てる書き方。

## 避けるべき表現の例（⑤直す担当向け）

- 「〜という魅力があります」「いかがでしたか」「絶対に外せない」などの定型句・AIっぽい紋切り型
- 断定できない情報の断定（例：ビザ要否や時刻表は必ずWebSearchで裏取りし、不明な場合は「要確認」と書く）
- 予算見出しの泊数と旅程の日数が食い違う書き方（過去に実際に発生した不整合。`learn.md` 参照）

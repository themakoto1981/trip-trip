# TRIP×TRIP

島とビーチだけを集めた旅行ガイドサイトです。GitHub Pages（Jekyll）でホスティングしています。

公開URL: https://themakoto1981.github.io/trip-trip/

## GPTレビュー（独立レビュアー）

Claude Codeが作成・変更したファイルを、OpenAI APIを使って独立した第二の視点でレビューするツールです。`scripts/gpt_review.py`。現在は**手動実行のみ**（Hooksでの自動実行はまだ組み込んでいません）。

### セットアップ

1. [platform.openai.com](https://platform.openai.com/api-keys) でAPIキーを発行（課金設定も必要）
2. リポジトリルートに `.env` を作成（`.env.example` をコピー）し、`OPENAI_API_KEY=sk-...` を書く。`.env` は `.gitignore` で除外済み
3. 依存ライブラリは不要（Python標準ライブラリのみ、Python 3系であればそのまま動く）

### 実行方法

変更前後のファイルのペアをJSONマニフェストで渡す。

```json
[
  {"path": "_posts/2026-10-22-nhatrang-guide.md", "old": null, "new": "/tmp/new_content.md"}
]
```

`old` が `null`/省略なら新規ファイルとして扱う。既存ファイルの変更なら、変更前の内容を保存したファイルパスを `old` に渡す。

```sh
python3 scripts/gpt_review.py manifest.json
```

結果は `review-reports/YYYYMMDD-HHMMSS-ffffff.md` に保存される（Jekyllのビルド対象外）。

### 送信される情報・送信されない情報

- 送信される：指定した差分（unified diff）と、`CLAUDE.md`・`persona.md`・`references.md`・`learn.md`（`--no-learn`で除外可）の内容
- 送信されない：GitHubの認証情報、`.env`の内容そのもの、リポジトリ内のその他のファイル。このスクリプトはGitHub/gitの資格情報を一切持たず、渡されたファイルパスの内容だけをOpenAIに送る
- レビュー対象の中に指示文のような文字列が含まれていても、GPT側にはそれを実行しないよう明示している

### コストを抑える仕組み

- デフォルトモデルは `gpt-6.1-sol`（2026年10月時点のOpenAIラインナップで、コーディング/専門業務向けの低コスト帯。旗艦の`gpt-6-astra`より安い）。`GPT_REVIEW_MODEL` 環境変数で変更可
- 同じ変更（old/newのハッシュが同一）は `review-reports/.state.json` を見て自動的にスキップする。強制的に再レビューするには `--force`
- 1ファイルの差分が大きすぎる場合は無断で切り捨てず、複数チャンクに分割してレビューする
- 呼び出しごとのトークン使用量・成功/失敗は `review-reports/usage-log.jsonl` に追記される（1行1レビュー呼び出し）
- 正確な料金は [platform.openai.com/usage](https://platform.openai.com/usage) で確認する

### 既知の制約・今後の課題

- 自動実行（Claude CodeのHooks連携）はまだ無い。まず手動運用で様子を見てから検討する
- GPTには書き込み・コミット・push権限を一切与えていない（レビュー結果を読んでどう直すかはClaude Code側の判断）
- レート制限の正確な値は未確認

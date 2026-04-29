# Dancer Tower Battle

国際ダンスの日向けに作成した、ダンサー画像版の「どうぶつタワーバトル」風ミニゲームです。

## 遊び方

- `Start` で開始
- `←` `→` で横移動
- `Space` で落下
- `P` で一時停止
- 60秒でどれだけ積めるかを競います

## 画像素材の配置

添付ダンサー画像を `assets/dancers-sheet.png` として保存してください。
ゲームは 5 列 x 5 行のスプライトシートとして扱います。

## ローカル起動

```bash
python3 -m http.server 8080
# http://localhost:8080
```

## GitHub Pages デプロイ

`.github/workflows/deploy-pages.yml` を同梱しています。

1. GitHub リポジトリの `Settings > Pages` を開く
2. Source を `GitHub Actions` に設定
3. `main` または `master` ブランチに push すると自動公開


## デプロイ失敗時のチェック

- `Settings > Pages` の Source が **GitHub Actions** になっているか
- push 先ブランチが `main` / `master` のいずれかか
- Actions の失敗ログで `deploy-pages` ジョブを開き、エラー内容（権限 / 設定 / アーティファクト）を確認

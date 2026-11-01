# Language pack — 日本語 (`ja`)

One row per schema field, in schema order. Read this pack when the conversation is in
Japanese and you need to map the user's words to a field, or to label fields in a rendering.

- **Field** is the key written in the journey file. Keys are always these schema names,
  in every language; never write a label or a synonym as a key.
- **Label** is the display name: column headers, legends and field names in renderings
  and written expressions.
- **Also called** lists words people use for the same concept. When the user's word is
  here, use that row's field. When it fits two rows, ask which one they mean.
- Field values (what the user said) are not translated unless the user asks.
- A custom field has no row. Label it from its registered description, in Japanese.
- `journey.sh validate` reads these packs: a key that matches a label or synonym is
  rejected with the field to use instead.

| Field | Label | Also called |
|---|---|---|
| `journey` | ジャーニー | ジャーニー名, カスタマージャーニー |
| `created` | 作成日 | 作成日時 |
| `last-modified` | 最終更新日 | 更新日 |
| `personas` | ペルソナ定義 | 登場人物 |
| `id` | ID | 識別子 |
| `title` | タイトル | 名称 |
| `description` | 説明 | 概要 |
| `persona` | ペルソナ | 関係者, 誰 |
| `milestone` | フェーズ | マイルストーン, 段階, ステージ |
| `emotion` | 感情 | 気持ち, 心情 |
| `emotionValence` | 感情スコア | 感情の正負, 感情評価 |
| `emotionIntensity` | 感情の強さ | 強度 |
| `thinking` | 思考 | 考えていること, 心の声, メンタルモデル |
| `cognitiveLoad` | 認知負荷 | 頭の負担, 複雑さ |
| `motivation` | 動機 | モチベーション, 目的 |
| `anxiety` | 不安 | 心配, 懸念, 疑念 |
| `expectation` | 期待 | 予想, 想定 |
| `trust` | 信頼 | 信頼度 |
| `effort` | 手間 | 労力, 負担感 |
| `confidence` | 自信 | 確信度 |
| `informationNeed` | 必要な情報 | 情報ニーズ, 知りたいこと, 疑問 |
| `channel` | チャネル | チャンネル, 経路 |
| `touchpoint` | タッチポイント | 接点, 顧客接点 |
| `device` | デバイス | 端末, 機器 |
| `place` | 場所 | 所在地 |
| `environment` | 環境 | 状況, 周囲の状況 |
| `physicalEvidence` | 物的証拠 | 物理的証拠, 有形物 |
| `channelTransition` | チャネル移行 | チャネル間の移動, クロスチャネル |
| `duration` | 所要時間 | かかる時間, 時間 |
| `waitTime` | 待ち時間 | 待機時間, 待ち |
| `frequency` | 頻度 | 回数 |
| `trigger` | きっかけ | トリガー, 発端 |
| `deadline` | 期限 | 締め切り, 時間的プレッシャー |
| `pacing` | ペース | テンポ |
| `coActors` | 同行者 | 他の関係者, 同伴者 |
| `frontlineStaff` | 現場スタッフ | 接客スタッフ, 窓口担当, オペレーター |
| `backstageStaff` | バックオフィススタッフ | 裏方スタッフ |
| `responsibleTeam` | 担当チーム | 担当部署, 部署 |
| `thirdParty` | 第三者 | パートナー, 外部業者, ベンダー |
| `handoff` | 引き継ぎ | 受け渡し |
| `doing` | 行動 | していること, 動作 |
| `frontstageAction` | フロントステージの行動 | 表舞台の行動, 従業員の見える行動 |
| `backstageAction` | バックステージの行動 | 裏方の行動, 見えない作業 |
| `supportProcess` | 支援プロセス | サポートプロセス |
| `inputRequired` | 必要な入力 | 入力事項, 提供が必要なもの |
| `outputProduced` | 成果物 | アウトプット, 出力 |
| `workaround` | 回避策 | ワークアラウンド, 抜け道 |
| `decision` | 意思決定 | 決定, 選択 |
| `systems` | システム | 基幹システム, バックエンド |
| `tools` | ツール | 道具 |
| `technology` | 技術 | テクノロジー |
| `dataFlow` | データフロー | データの流れ |
| `automation` | 自動化 | 自動と手動 |
| `dependencies` | 依存関係 | 前提条件 |
| `notification` | 通知 | お知らせ, プッシュ通知 |
| `policy` | ポリシー | 業務ルール, 規則 |
| `frontstage` | フロントステージ | 表舞台, 顧客から見える部分 |
| `backstage` | バックステージ | 舞台裏 |
| `supportProcesses` | 支援プロセス群 | 組織の支援プロセス |
| `lineOfVisibility` | 可視境界線 | ラインオブビジビリティ, 可視線 |
| `valueExchange` | 価値交換 | やり取りされる価値 |
| `serviceRecovery` | サービスリカバリー | 挽回策, リカバリー策 |
| `orchestration` | オーケストレーション | 連携, 調整 |
| `kpi` | KPI | 重要業績評価指標 |
| `metric` | 指標 | メトリクス, 測定値 |
| `conversionRate` | コンバージョン率 | 転換率, CVR |
| `cost` | コスト | 費用 |
| `revenueImpact` | 収益への影響 | 売上影響, 売上 |
| `dropoffRate` | 離脱率 | 離脱 |
| `volumePerPeriod` | ボリューム | 件数, 取扱量 |
| `owner` | オーナー | 責任者 |
| `painPoint` | ペインポイント | 不満点, 課題, 困りごと |
| `opportunity` | 機会 | 改善機会, 改善の余地 |
| `momentOfTruth` | 真実の瞬間 | 決定的瞬間, MOT |
| `insight` | インサイト | 気づき, 発見 |
| `desiredOutcome` | 望ましい成果 | 理想の結果, ジョブ |
| `recommendation` | 推奨事項 | 提案, 改善提案 |
| `priority` | 優先度 | 重要度 |
| `failureMode` | 失敗モード | 失敗, うまくいかない点 |
| `failureProbability` | 失敗の可能性 | 発生確率 |
| `failureImpact` | 失敗の影響 | 影響度 |
| `recoveryPath` | 回復の道筋 | リカバリー, 復帰経路 |
| `escalation` | エスカレーション | 上申 |
| `fallback` | フォールバック | 代替手段, 予備策 |
| `bottleneck` | ボトルネック | 処理能力の制約 |
| `risk` | リスク | 危険 |
| `next` | 次のステップ | 次 |
| `previous` | 前のステップ | 前 |
| `branchCondition` | 分岐条件 | 条件分岐 |
| `parallelPath` | 並行パス | 並行, 同時進行 |
| `entryPoint` | 入口 | 流入ポイント, エントリーポイント |
| `exitPoint` | 出口 | 離脱ポイント, イグジットポイント |
| `optionality` | 必須か任意か | 任意性 |
| `message` | メッセージ | 伝える内容, 文言 |
| `tone` | トーン | 口調, 語調 |
| `contentType` | コンテンツ種別 | コンテンツの形式 |
| `cta` | CTA | 行動喚起, ボタン |
| `accessibilityBarrier` | アクセシビリティの障壁 | アクセシビリティ |
| `inclusionConsideration` | インクルージョン | 包摂性, 取り残される人 |
| `literacyRequirement` | リテラシー要件 | 読解力, デジタルリテラシー |
| `economicBarrier` | 経済的障壁 | 費用負担 |
| `culturalConsideration` | 文化的配慮 | 文化, 文化的慣習 |

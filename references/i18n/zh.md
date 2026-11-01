# Language pack — 简体中文 (`zh`)

One row per schema field, in schema order. Read this pack when the conversation is in
Chinese and you need to map the user's words to a field, or to label fields in a rendering.

- **Field** is the key written in the journey file. Keys are always these schema names,
  in every language; never write a label or a synonym as a key.
- **Label** is the display name: column headers, legends and field names in renderings
  and written expressions.
- **Also called** lists words people use for the same concept. When the user's word is
  here, use that row's field. When it fits two rows, ask which one they mean.
- Field values (what the user said) are not translated unless the user asks.
- A custom field has no row. Label it from its registered description, in Chinese.
- `journey.sh validate` reads these packs: a key that matches a label or synonym is
  rejected with the field to use instead.

| Field | Label | Also called |
|---|---|---|
| `journey` | 旅程 | 旅程名称, 旅程标题 |
| `created` | 创建日期 | 创建时间 |
| `last-modified` | 最后修改 | 修改日期, 更新日期 |
| `personas` | 人物角色 | 用户画像, 角色设定 |
| `id` | ID | 标识, 编号 |
| `title` | 标题 | 名称 |
| `description` | 描述 | 说明, 简介 |
| `persona` | 角色 | 参与者, 谁 |
| `milestone` | 阶段 | 里程碑, 环节 |
| `emotion` | 情绪 | 感受, 心情, 情感 |
| `emotionValence` | 情绪分值 | 情绪评分, 情绪正负, 情感倾向 |
| `emotionIntensity` | 情绪强度 | 强烈程度 |
| `thinking` | 想法 | 内心独白, 心理活动, 心智模型, 在想什么 |
| `cognitiveLoad` | 认知负荷 | 认知负担, 脑力负担, 复杂度 |
| `motivation` | 动机 | 驱动力, 目的 |
| `anxiety` | 顾虑 | 焦虑, 担心, 担忧, 疑虑 |
| `expectation` | 期望 | 预期, 期待 |
| `trust` | 信任 | 信任度, 可信度 |
| `effort` | 费力程度 | 付出, 麻烦程度, 费劲 |
| `confidence` | 把握 | 信心, 自信, 确定程度 |
| `informationNeed` | 信息需求 | 需要的信息, 知识缺口, 疑问 |
| `channel` | 渠道 | 途径 |
| `touchpoint` | 触点 | 接触点, 交互点 |
| `device` | 设备 | 终端 |
| `place` | 地点 | 场所, 位置 |
| `environment` | 环境 | 情境, 场景 |
| `physicalEvidence` | 有形证据 | 实体证据, 物料, 凭证 |
| `channelTransition` | 渠道切换 | 跨渠道, 渠道转换 |
| `duration` | 耗时 | 持续时间, 用时, 时长 |
| `waitTime` | 等待时间 | 等待, 排队, 排队时间, 等候 |
| `frequency` | 频率 | 频次, 多久一次 |
| `trigger` | 触发点 | 触发, 起因, 诱因 |
| `deadline` | 截止时间 | 时间压力, 期限, 紧迫性 |
| `pacing` | 节奏 | 速度 |
| `coActors` | 同行者 | 其他参与者, 陪同者, 共同参与者 |
| `frontlineStaff` | 一线员工 | 前台员工, 客服, 服务人员 |
| `backstageStaff` | 后台员工 | 后台人员, 幕后人员 |
| `responsibleTeam` | 负责团队 | 团队, 部门, 责任部门 |
| `thirdParty` | 第三方 | 合作方, 供应商, 外部伙伴 |
| `handoff` | 交接 | 转交, 移交 |
| `doing` | 行为 | 动作, 行动, 在做什么 |
| `frontstageAction` | 前台行为 | 前台动作, 员工可见行为 |
| `backstageAction` | 后台行为 | 后台动作, 幕后行为 |
| `supportProcess` | 支持流程 | 支撑流程 |
| `inputRequired` | 所需输入 | 需要提供, 需提供的信息, 输入 |
| `outputProduced` | 产出 | 输出, 交付物, 结果 |
| `workaround` | 变通办法 | 绕行方案, 土办法, 野路子 |
| `decision` | 决策 | 决定, 选择, 决策点 |
| `systems` | 系统 | 后端系统, 业务系统 |
| `tools` | 工具 | 使用的工具 |
| `technology` | 技术 | 技术栈 |
| `dataFlow` | 数据流 | 数据流向, 数据流转 |
| `automation` | 自动化 | 自动还是手动 |
| `dependencies` | 依赖 | 依赖项, 前置条件 |
| `notification` | 通知 | 提醒, 推送, 短信 |
| `policy` | 规则 | 业务规则, 政策, 制度 |
| `frontstage` | 前台 | 前台层, 用户可见部分 |
| `backstage` | 后台 | 后台层, 幕后 |
| `supportProcesses` | 支持流程层 | 组织支持流程 |
| `lineOfVisibility` | 可见线 | 可视线, 可见性分界线 |
| `valueExchange` | 价值交换 | 交换的价值 |
| `serviceRecovery` | 服务补救 | 补救措施, 服务恢复 |
| `orchestration` | 编排 | 协同, 统筹 |
| `kpi` | KPI | 关键绩效指标, 核心指标 |
| `metric` | 指标 | 度量, 数据指标 |
| `conversionRate` | 转化率 | 转化 |
| `cost` | 成本 | 服务成本 |
| `revenueImpact` | 收入影响 | 营收影响, 收入 |
| `dropoffRate` | 流失率 | 跳出率, 放弃率, 流失 |
| `volumePerPeriod` | 业务量 | 交易量, 周期量 |
| `owner` | 负责人 | 业务负责人, 所有者 |
| `painPoint` | 痛点 | 问题点, 卡点, 摩擦 |
| `opportunity` | 机会点 | 机会, 改进机会 |
| `momentOfTruth` | 关键时刻 | 真相时刻, 决定性时刻, MOT |
| `insight` | 洞察 | 发现, 研究洞察 |
| `desiredOutcome` | 期望结果 | 理想结果, 待办任务, JTBD |
| `recommendation` | 建议 | 推荐做法, 改进建议 |
| `priority` | 优先级 | 重要程度, 紧急程度 |
| `failureMode` | 失败模式 | 可能出错, 故障模式, 失败点 |
| `failureProbability` | 失败概率 | 出错概率, 可能性 |
| `failureImpact` | 失败影响 | 影响程度, 后果 |
| `recoveryPath` | 恢复路径 | 恢复, 补救路径 |
| `escalation` | 升级 | 升级路径, 上报 |
| `fallback` | 兜底方案 | 备用方案, 降级方案, 兜底 |
| `bottleneck` | 瓶颈 | 产能瓶颈 |
| `risk` | 风险 | 风险点 |
| `next` | 下一步 | 后续步骤 |
| `previous` | 上一步 | 前序步骤 |
| `branchCondition` | 分支条件 | 分支, 条件 |
| `parallelPath` | 并行路径 | 并行, 同时进行 |
| `entryPoint` | 入口 | 进入点 |
| `exitPoint` | 出口 | 退出点, 离开点 |
| `optionality` | 可选性 | 是否必须, 必选还是可选 |
| `message` | 传达信息 | 文案, 沟通内容, 话术 |
| `tone` | 语气 | 口吻, 调性 |
| `contentType` | 内容类型 | 内容形式 |
| `cta` | 行动号召 | CTA, 按钮 |
| `accessibilityBarrier` | 无障碍问题 | 可访问性障碍, 无障碍 |
| `inclusionConsideration` | 包容性考量 | 包容性, 谁被排除 |
| `literacyRequirement` | 读写能力要求 | 数字素养, 阅读门槛 |
| `economicBarrier` | 经济门槛 | 经济障碍, 负担能力 |
| `culturalConsideration` | 文化考量 | 文化因素, 文化习惯 |

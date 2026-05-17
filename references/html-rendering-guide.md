# HTML Rendering Guide

Interactive HTML expression 的渲染和交互设计参考。此文档作为 sub-skill reference，指导 front-end skill 生成 journey 的 HTML 可视化。

---

## 设计原则

1. **Self-contained**: 单 HTML 文件，内嵌 CSS + JS，无外部依赖。浏览器打开即用。
2. **Progressive disclosure**: Summary 可见，detail on demand。
3. **Print-friendly**: 折叠态可干净打印。
4. **Accessible**: 语义 HTML，键盘可导航，screen-reader 友好。
5. **Data-driven**: 从 journey.md 的 schema 数据直接映射到 DOM，无手工布局。

---

## 渲染模式 × 交互模式 矩阵

### 有效组合（MVP）

| 组合 ID | 渲染模式 | 交互模式 | 适用场景 |
|---------|----------|----------|----------|
| **C1** | Card grid | Scroll-driven | <15 步，简单 journey，mobile-friendly |
| **C2** | Card grid | Focus+Context | 15-60 步，主力场景，workshop reference |
| **C3** | Swimlane | Scroll-driven | Service blueprint 视角，frontstage/backstage 分层 |

### Future（不阻塞 MVP）

| 组合 ID | 渲染模式 | 交互模式 | 适用场景 |
|---------|----------|----------|----------|
| C4 | Timeline（横向） | Scroll-driven | Duration/temporal 维度为主 |
| C5 | Card grid | Multi-view | 多受众需要不同 view 切换 |
| C6 | Swimlane | Focus+Context | 复杂 blueprint >20 phases |
| C7 | Emotion curve | Overlay on C1/C2 | 情绪弧线叠加在卡片视图上 |

### 选择逻辑（SKILL.md 中使用）

```
if step_count <= 15:
    recommend C1 (Card + Scroll)
elif step_count <= 60:
    recommend C2 (Card + Focus+Context)
    
if active_categories includes "service-layers":
    offer C3 (Swimlane + Scroll) as alternative

if active_categories includes "emotional":
    offer C7 (Emotion curve overlay) as enhancement
```

---

## 颜色系统

参考 [j-clegg/service-blueprint-skill](https://github.com/j-clegg/service-blueprint-skill) 的分层颜色逻辑，扩展到 CJM 的多维度需求。

### 语义色板

| 用途 | 颜色 | Hex | 何时用 |
|------|------|-----|--------|
| Customer-facing / 前台 | Warm yellow | `#fff9e6` border `#c9a227` | Step 卡片中用户可见的部分 |
| Backstage / 内部 | Neutral white | `#ffffff` border `#aaaaaa` | 不可见的支撑过程 |
| Support / 基础设施 | Light grey | `#f3f3f3` border `#999999` | 系统、基础设施层 |
| Evidence / 物理证据 | Faint grey | `#fafafa` border `#cccccc` | 有形接触物 |
| Muted / 非活跃 | Dashed border | `#f5f5f5` dashed | 可选步骤、低优先级 |

### 情绪色谱（Category A 激活时）

| Valence | 颜色 | Hex | 用法 |
|---------|------|-----|------|
| Very negative (-2) | Deep red | `#fecaca` | 卡片左边条 / emotion badge |
| Negative (-1) | Orange | `#fed7aa` | 卡片左边条 / emotion badge |
| Neutral (0) | Grey | `#e5e7eb` | 卡片左边条 / emotion badge |
| Positive (+1) | Light green | `#bbf7d0` | 卡片左边条 / emotion badge |
| Very positive (+2) | Deep green | `#86efac` | 卡片左边条 / emotion badge |

### 标记系统

| 标记 | 视觉 | 含义 |
|------|------|------|
| Moment of truth | 🔴 Red dot (top-right) | 关键成败时刻 |
| Failure point | 🟡 Dark yellow dot (top-left) | 已知故障点 |
| Pain point | Orange underline | 用户痛点 |
| Opportunity | Green dashed border | 设计/产品机会 |
| Provenance: source | 📎 Clip icon | 有数据来源的字段 |
| Provenance: user-modified | ✏️ Pencil icon | 用户手动修改的字段 |

### 颜色规则

1. **层级色** > 情绪色：当 Swimlane 模式激活，层级色（frontstage/backstage/support）优先于情绪色。情绪通过左边条表示。
2. **无障碍**：所有颜色编码必须同时有非色觉标识（icon、pattern、text label）。不能仅靠颜色区分含义。
3. **Dark mode**：MVP 不做。Future 版本反转色板。
4. **Print**：打印时所有背景色降低到 50% 透明度，确保文字可读。标记保留。

---

## 用户交互模式

### 核心交互（所有组合通用）

| 交互 | 行为 | 快捷键 |
|------|------|--------|
| **展开/折叠** | 点击卡片展开 detail（backstage, failure, opportunity 等） | `Enter` |
| **导航** | 在 steps 之间移动焦点 | `↑` `↓` 或 `←` `→` |
| **回到顶部** | 回到 minimap / 全局视图 | `Esc` |
| **全部展开** | 展开当前 milestone 所有 steps | `Shift+Enter` |
| **全部折叠** | 折叠所有 expanded steps | `Shift+Esc` |

### 筛选 / Filter

| 交互 | 行为 | UI 位置 |
|------|------|---------|
| **Persona filter** | 按 persona 高亮/dimming steps | 顶部 filter bar |
| **Category filter** | 按 field category 显示/隐藏 detail sections | 顶部 filter bar |
| **Pain point only** | 只显示有 painPoint / failureMode 的 steps | Toggle button |
| **Provenance filter** | 只显示有 source / user-modified 标记的字段 | Toggle button |

### 排序 / Reorder

| 交互 | 行为 | 适用场景 |
|------|------|----------|
| **Default: journey order** | 按 milestone → step 原始顺序 | 默认 |
| **By emotion** | 按 emotionValence 排序（最痛 → 最好） | 找 pain points |
| **By drop-off** | 按 dropoffRate 排序（高 → 低） | 找 funnel leaks |
| **By priority** | 按 priority field 排序 | 决策视图 |
| **By duration** | 按 duration 排序（长 → 短） | 找 bottlenecks |

注意：排序改变卡片呈现顺序，但 flow arrows（next/previous）始终保留原始 journey 逻辑。排序状态显示在 UI 顶部。

### 搜索

| 交互 | 行为 |
|------|------|
| **全文搜索** | 搜索所有字段内容，高亮匹配 steps | 
| **Field-specific search** | `emotion:frustrated` 只搜 emotion 字段 |
| **搜索结果导航** | `Enter` 跳到下一个匹配，`Shift+Enter` 跳到上一个 |
| **搜索时 minimap** | 匹配的 steps 在 minimap 上高亮 |

快捷键：`Cmd/Ctrl + F` 激活搜索栏（覆盖浏览器默认搜索）。

### 缩放 / Zoom

| 交互 | 行为 | 适用组合 |
|------|------|----------|
| **文字缩放** | 整体字号放大/缩小 | 所有组合 |
| **卡片密度** | Compact / Normal / Expanded 三档 | C1, C2 |
| **Minimap zoom** | 点击 minimap 的 milestone segment 放大该 section | C2 |
| **Swimlane zoom** | 点击某 lane 暂时全屏展开该 lane | C3 |

快捷键：`Cmd/Ctrl + =` 放大，`Cmd/Ctrl + -` 缩小，`Cmd/Ctrl + 0` 恢复默认。

### 隐藏 / Show-Hide

| 交互 | 行为 |
|------|------|
| **隐藏 milestone** | 在 minimap 上折叠整个 milestone，卡片消失 |
| **隐藏 field category** | 全局隐藏某类字段（如隐藏 business metrics） |
| **隐藏 specific step** | 右键 → "Hide this step"（仅视图层，不删数据） |
| **Show hidden** | 侧边栏列出所有 hidden items，可恢复 |

### 长图专属交互（C2: Focus+Context）

| 交互 | 行为 |
|------|------|
| **Minimap 跳转** | 点击 minimap 上的 dot 跳到对应 step |
| **Viewport indicator** | Minimap 上高亮当前可见区域的 steps |
| **Scroll spy** | 滚动时 minimap 当前位置实时更新 |
| **Milestone jump** | 点击 milestone label 跳到该 section |
| **Breadcrumb** | 固定显示当前 milestone > step 位置 |
| **Back to top** | 浮动按钮，一键回到 minimap |

---

## 组合 C1: Card + Scroll

### 适用条件

- Step count ≤ 15
- 简单 journey，不需要全局导航
- Mobile-first 场景

### 布局

```
┌────────────────────────────────────┐
│  Journey title + metadata           │
│  [Persona filter] [Category filter] │
├────────────────────────────────────┤
│                                      │
│  ## Milestone: Account Creation      │
│                                      │
│  ┌──────────────────────────────┐   │
│  │ Step card (collapsed)         │   │
│  └──────────────────────────────┘   │
│  ┌──────────────────────────────┐   │
│  │ Step card (collapsed)         │   │
│  └──────────────────────────────┘   │
│         ↓ flow arrow                 │
│  ┌──────────────────────────────┐   │
│  │ Step card (expanded)          │   │
│  │  ├─ Backstage detail          │   │
│  │  ├─ Failure modes             │   │
│  │  └─ Opportunities             │   │
│  └──────────────────────────────┘   │
│                                      │
│  ## Milestone: First Action          │
│  ...                                 │
└────────────────────────────────────┘
```

### 卡片 collapsed 状态

显示：
- Step name (bold)
- Description (1 line, truncated)
- Emotion badge (color + text)
- Key metric (if present: dropoffRate, duration, etc.)
- Markers (moment of truth dot, failure dot)

### 卡片 expanded 状态

追加显示（按 active categories 分 section）：
- Backstage section
- Failure / Risk section
- Opportunities section
- Systems / Technology section
- People / Actors section
- Provenance indicators on relevant fields

### Flow arrows

- 垂直箭头连接相邻 steps（`next` field）
- Dashed 箭头表示 failure/recovery paths
- Branch condition 显示在箭头旁

---

## 组合 C2: Card + Focus+Context

### 适用条件

- Step count 15-60
- Workshop reference / 长期使用
- 需要全局位置感 + 细节

### 布局

```
┌──────────────────────────────────────────────────┐
│  Journey title + metadata                          │
│  [Search] [Persona filter] [Sort] [Density]       │
├──────────────────────────────────────────────────┤
│  MINIMAP (sticky top)                              │
│  ○──○──●──○──○──○──○──○──○──○──○──○──○──○──○     │
│  [Awareness]  [Activation]  [Invitation]  [Collab] │
├──────────────────────────────────────────────────┤
│  Breadcrumb: Activation > face-empty-workspace     │
│                                                    │
│  ## Milestone: Activation                          │
│                                                    │
│  ┌─────────────────────────────┐                  │
│  │ Step card                    │                  │
│  └─────────────────────────────┘                  │
│  ...                                               │
│                                                    │
│  [↑ Back to top]                                   │
└──────────────────────────────────────────────────┘
```

### Minimap 设计

- 每 step 一个 dot（circle）
- Dots grouped by milestone（间距分隔）
- Milestone labels 在 dot groups 下方
- 当前 viewport 内的 dots 填充颜色，其余空心
- Dots 可携带颜色编码（emotion valence 或 priority）
- 点击 dot 跳转到对应 step
- 50+ steps 时 dots 缩小，milestone labels 用 abbreviation

### Scroll spy 行为

- 滚动时 minimap 当前区域实时高亮
- Breadcrumb 实时更新
- URL hash 跟踪当前 step（可 bookmark / share）

### 密度切换

| 密度 | 卡片展示 |
|------|----------|
| Compact | Name + emotion badge only |
| Normal | Name + description (1 line) + emotion + key metric |
| Expanded | All visible fields (equivalent to clicking expand on all) |

---

## 组合 C3: Swimlane + Scroll

### 适用条件

- Active categories 包含 Service Design Layers（frontstage/backstage/support）
- Blueprint 视角需求
- 想看跨 layer 的关系

### 布局

```
┌────────────────────────────────────────────────────────────────┐
│  Journey title                                                   │
│  [Phase navigation pills]                                        │
├────────────────────────────────────────────────────────────────┤
│           │ Phase 1        │ Phase 2        │ Phase 3           │
├───────────┼────────────────┼────────────────┼──────────────────┤
│ CUSTOMER  │ ┌──────┐       │ ┌──────┐       │ ┌──────┐         │
│ ACTIONS   │ │ step │───────│─│ step │───────│─│ step │         │
│           │ └──────┘       │ └──────┘       │ └──────┘         │
├───────────┼─ ─ ─ ─ ─ ─ ─ ─┼─ ─ ─ ─ ─ ─ ─ ─┼─ ─ ─ ─ ─ ─ ─ ──┤
│ FRONTSTAGE│ ┌──────┐       │ ┌──────┐       │                   │
│           │ │ box  │       │ │ box  │       │                   │
│           │ └──────┘       │ └──────┘       │                   │
├───────────┼─ ─ ─ ─ ─ ─ ─ ─┼─ ─ ─ ─ ─ ─ ─ ─┼─ ─ ─ ─ ─ ─ ─ ──┤
│ BACKSTAGE │ ┌──────┐       │ ┌──────┐       │ ┌──────┐         │
│           │ │ box  │       │ │ box  │       │ │ box  │         │
│           │ └──────┘       │ └──────┘       │ └──────┘         │
├───────────┼─ ─ ─ ─ ─ ─ ─ ─┼─ ─ ─ ─ ─ ─ ─ ─┼─ ─ ─ ─ ─ ─ ─ ──┤
│ SUPPORT   │ ┌──────┐       │                 │ ┌──────┐         │
│ PROCESSES │ │ box  │       │                 │ │ box  │         │
│           │ └──────┘       │                 │ └──────┘         │
└───────────┴────────────────┴────────────────┴──────────────────┘
│  Legend                                                           │
└──────────────────────────────────────────────────────────────────┘
```

### Swimlane 映射规则

| Lane | 数据来源 | 颜色 |
|------|----------|------|
| Customer Actions | Step 的 `doing` / `description` | Warm yellow `#fff9e6` |
| Frontstage | Step 的 `frontstageAction` / `frontstage` | Warm yellow `#fff9e6` |
| Backstage | Step 的 `backstageAction` / `backstage` | White `#ffffff` |
| Support Processes | Step 的 `supportProcess` / `systems` | Light grey `#f3f3f3` |

### Line dividers

- **Line of Interaction**: 虚线分隔 Customer ↔ Frontstage
- **Line of Visibility**: 虚线分隔 Frontstage ↔ Backstage
- **Line of Internal Interaction**: 虚线分隔 Backstage ↔ Support

### Swimlane 交互

- Horizontal scroll for many phases（phases 不折行）
- 点击某 box 展开 detail panel（右侧或底部 drawer）
- Lane 可独立 collapse/expand（节省垂直空间）
- Phase navigation pills 跳转到对应列

---

## 响应式规则

| Breakpoint | C1 行为 | C2 行为 | C3 行为 |
|------------|---------|---------|---------|
| Desktop (>1200px) | 正常 | 正常 | 正常 |
| Tablet (768-1200px) | 卡片全宽 | Minimap 缩小 | 横向滚动 |
| Mobile (<768px) | 卡片全宽，flow arrows 隐藏 | Minimap 变为 dropdown | 转为 C1 (Card + Scroll) |

### Print 规则

- 所有 expanded sections 折叠（除非用户选了"print expanded"）
- Minimap 不打印
- Flow arrows 打印
- 每 milestone 一个 page break
- Markers 和 legend 保留

---

## 数据映射总表

Journey schema field → HTML 视觉元素的映射：

| Schema field | 视觉表现 |
|--------------|----------|
| `description` | 卡片主文字 |
| `emotion` | 彩色 badge + 卡片左边条颜色 |
| `emotionValence` | 左边条颜色深浅 |
| `dropoffRate` / `metric` | 右上角数字 badge |
| `painPoint` | Orange 底色标签 |
| `opportunity` | Green dashed border 标签 |
| `momentOfTruth` | Red dot (top-right) |
| `failureMode` | Dark yellow dot (top-left) |
| `backstage` | Expandable section（灰色背景） |
| `frontstage` | Expandable section（黄色背景） |
| `next` / `recoveryPath` | Flow arrows（solid = happy, dashed = failure） |
| `persona` | Avatar/initial 标签 |
| `duration` | 时钟 icon + 文字 |
| `channel` | 小标签/pill |
| `_provenance: source` | 📎 icon，hover 显示来源 |
| `_provenance: user-modified` | ✏️ icon，hover 显示日期 |

---

## 技术约束

- **零外部依赖**：不使用 React/Vue/D3/Tailwind CDN。纯 HTML + embedded CSS + vanilla JS。
- **文件大小**：单文件 < 200KB（含所有 CSS/JS/数据）。
- **浏览器兼容**：Chrome, Safari, Firefox 最近 2 个版本。
- **无 build step**：不需要 npm/webpack/vite。双击 .html 文件即可打开。
- **可离线**：100% self-contained。
- **可嵌入**：可作为 iframe 嵌入其他页面。


---
journey: 临时找一间会议室，把一件事说清楚
created: 2026-08-03
last-modified: 2026-09-14
personas:
  - name: 小林
    role: 工程师，想拉同事当面讨论一个问题
    type: primary
  - name: 行政
    role: 管会议室规则和占用投诉
    type: backstage
  - name: 预订系统
    role: 日历 + 门口屏
    type: system
active-categories: [emotional, channel, temporal, people, actions, systems, service-layers, failure, path, design]
structure: Journey > Milestone > Step
---

## Milestone: need

- title: 需要聊一下
- description: 一个问题在工位上说不清，需要一面白板

### Step: idea-to-talk

- persona: [小林]
- description: 和同事在工位讨论一个 bug，三句话说不清，决定"找个房间画一下"
- emotion: 急，想马上说清楚
- emotionValence: 0
- emotionIntensity: medium
- thinking: "现在就去，五分钟就够"
- trigger: 讨论卡住，需要白板
- frequency: 每人每周 3–4 次
- metric: 61% 的会议在发起后 10 分钟内开始
  - _provenance: source: 门禁 + 日历记录，3 周
- next: → book-ahead

---

## Milestone: find

- title: 找房间
- description: 从"想聊"到"进门"

### Step: book-ahead

- persona: [小林, 预订系统]
- description: 打开预订系统，规则要求至少提前 15 分钟预订
- emotion: 不耐烦
- emotionValence: -1
- emotionIntensity: medium
- channel: 手机日历
- policy: 必须提前 15 分钟预订，杜绝占用
- systems: [预订系统]
- next: → find-room

### Step: find-room

- persona: [小林, 预订系统]
- description: 走到一间空会议室门口，灯没开，门口屏显示"请于 15 分钟后使用"
- emotion: 荒唐，憋气
- emotionValence: -2
- emotionIntensity: high
- thinking: "房间就在眼前，空的，我要在门口等它？"
- place: 会议室门口
- touchpoint: 门口屏
- waitTime: 15 分钟
- pacing: stalled
- momentOfTruth: 空房间就在眼前，却不能用
  - _provenance: source: 走廊观察 2 天，23 次
- painPoint: 规则在防占用，挡住的却是正在需要它的人
- failureMode: 放弃，站在走廊讨论；或订一个"幽灵会议"长期占房
- failureProbability: high
- failureImpact: high
- workaround: 每天早上先把下午的房间全订上
- next: → hold-meeting

---

## Milestone: meet

- title: 开会
- description: 说清楚，然后离开

### Step: hold-meeting

- persona: [小林]
- description: 在白板上画了二十分钟，问题说清楚了
- emotion: 顺了
- emotionValence: 1
- emotionIntensity: medium
- duration: ~20 分钟
- next: → leave-room

### Step: leave-room

- persona: [小林, 预订系统]
- description: 提前散会，预订还剩 40 分钟，房间空着，别人订不到
- emotion: 无感
- emotionValence: 0
- emotionIntensity: low
- painPoint: 预订制本身制造了空占
- metric: 54% 的预订提前结束，平均空置 31 分钟
  - _provenance: source: 门口传感器，2 周
- exitPoint: true

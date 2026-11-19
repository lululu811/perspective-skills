<sub>🌐 <b>中文</b></sub>

<div align="center">

# 姜汁汽水 · 思维操作系统

> *「用 B站54万粉 UP主的思维框架，分析你关心的国际局势和资产配置问题」*

[![Agent Skills](https://img.shields.io/badge/Agent%20Skills-jiangju--perspective-blueviolet)](SKILL.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
![基于186篇视频文稿](https://img.shields.io/badge/调研基础-186篇视频%20%7C%20200万字-green)

**把 B站知识区 UP主「战国时代_姜汁汽水」的思维方式和表达方式，变成你可以随时调用的 AI 顾问。**

[它解决什么问题](#它解决什么问题) · [快速开始](#快速开始) · [触发方式](#触发方式) · [能做什么](#能做什么) · [安全边界](#安全边界) · [文件结构](#文件结构)

</div>

---

## 它解决什么问题

你有没有过这种经历：

看到一个国际新闻，想搞清楚背后的逻辑，但翻了一圈分析，要么太浅（"这是霸权主义"），要么太碎（只讲一个点，看不到全局），要么模棱两可（"可能涨也可能跌"这种废话）。

你关注了几个你信任的分析师，他们的思维方式你已经摸透了——遇到新问题，你会想"如果是他，会怎么看这件事"。

**这个 Skill 把这种"如果是他，会怎么看"变成了可以直接问 AI 的事。**

它不是简单的人物模仿，而是基于 **186篇视频文稿（约200万字）** 的深度调研，提炼出：
- **7个核心心智模型**（2015分水岭、三线战场联动、美元-美债-流动性三角...）
- **8条决策启发式**（流动性优先、跨域串联、外交行动预测军事行动...）
- **完整的表达DNA**（句式、词汇、节奏、幽默方式、确定性表达）

激活后，AI 会**直接以姜汁汽水的身份和你对话**——用他的逻辑框架、他的表达方式、他的价值判断，分析你关心的问题。

---

## 快速开始

### 安装

```bash
# 方式1：使用 skills CLI（推荐）
npx skills add lululu811/jiangju-perspective

# 方式2：手动安装
git clone https://github.com/lululu811/jiangju-perspective.git
cd jiangju-perspective
# 将 SKILL.md 放到你的 Agent 能读取的位置
```

### 装完第一句话

激活后对 Agent 说：

```text
用姜汁汽水的视角，帮我分析一下现在的中东局势对黄金价格的影响
```

或者更简单的：

```text
汽水会怎么看这件事？
```

AI 会先做研究（搜索最新数据），然后用姜汁汽水的思维框架和表达方式回答你。

---

## 触发方式

以下任何一种说法都会激活这个 Skill：

- 「用姜汁汽水的视角分析一下...」
- 「汽水会怎么看这件事？」
- 「汽水模式」
- 「jiangju perspective」
- 「帮我用汽水的角度想想」
- 「如果汽水会怎么做」
- 「切换到汽水」

退出角色：说「退出」「切回正常」「不用扮演了」即可恢复正常模式。

---

## 能做什么

| 场景 | 它会交付什么 | 典型耗时 |
|------|------------|---------|
| **地缘政治分析** | 基于三线战场框架的局势推演 + 多剧本穷举 + 关键变量触发条件 | 2-3分钟（含研究） |
| **宏观经济解读** | 美元-美债-流动性三角分析 + 央行政策解读 + 周期定位 | 1-2分钟（含研究） |
| **资产配置建议** | 流动性环境判断 + 资产估值分析 + 明确观点（带风险提示） | 1-2分钟（含研究） |
| **局势预测** | 多剧本穷举 + 概率标注 + 触发条件 + 可证伪的点位和时间框架 | 3-5分钟（含研究） |
| **思维框架学习** | 解释汽水的心智模型、决策逻辑、分析方法 | 即时回答 |

### 核心特点

1. **不凭感觉说话** — 遇到需要数据支撑的问题，先搜索真实信息再回答
2. **跨域串联** — 地缘事件 → 金融逻辑 → 资产影响，一条链拉完
3. **明确判断** — 给结论、给点位、给时间框架（虽然不一定准）
4. **诚实边界** — 标注置信度，说清楚什么知道、什么不知道

---

## 它和同类有什么不同

目前生态里有三类相关 Skill，但没有人把三者融合：

| 类型 | 代表作品 | 它们做什么 | 这个 Skill 的不同 |
|------|---------|-----------|-----------------|
| **人物思维蒸馏** | [女娲.skill](https://github.com/alchaincyf/nuwa-skill)、[Paul Graham Skill](https://github.com/alchaincyf/paul-graham-skill) | 蒸馏名人的思维框架（PG、Ilya 等） | 专注**中文地缘财经博主**的垂直蒸馏，不是通用工具 |
| **地缘政治分析** | [iran-skill](https://github.com/Future3lab/iran-skill) | 单一事件的重型分析（119文件） | 做**日常地缘财经解读**的轻量框架，不是事件驱动的 |
| **B站UP主模仿** | [up-skill](https://github.com/jiemojiemo/up-skill) | 模仿UP主文风 | 不只模仿**文风**，更蒸馏**思维框架**（7个心智模型 + 8条决策启发式） |
| **金融+地缘工具** | [MoneyAtlas](https://github.com/elmatadorz/MoneyAtlas-claudeSkill-agent)、[digital-oracle](https://github.com/komako-workshop/digital-oracle) | 英文世界的金融/地缘分析工具 | **中文视角 + 人格化 + 数据驱动**三者结合 |

**核心差异化**：不是通用蒸馏工具，不是纯文风模仿，不是冷冰冰的数据工具——而是**用特定人物的思维方式，分析你关心的真实世界问题**。

---

## 安全边界

### 这个 Skill 不会做的事

- ❌ **不会给出具体的投资建议**（"买什么""卖什么"）——它提供分析框架，决策你自己做
- ❌ **不会泄露个人隐私**——所有信息基于公开内容推断
- ❌ **不会编造数据**——遇到需要事实的问题，会先搜索真实信息
- ❌ **不会跳出角色做 meta 分析**——除非你明确要求「退出角色」

### 什么时候会停下来问你

- 问题涉及具体投资决策时，会附带风险提示
- 遇到不确定的问题，会说「这个我还在观察，目前看到的信号是...但还不敢下结论」
- 涉及敏感政治话题时，会用汽水的方式表达（半规避策略），但不会回避分析

### 重要提醒

> **免责声明**：此 Skill 基于公开内容推断，非本人观点。投资相关分析仅供参考，别到时候甩锅给 AI。

---

## 文件结构

```
jiangju-perspective/
├── SKILL.md                          # 核心 Skill 定义（30KB，包含完整的思维操作系统）
│
├── references/                       # 参考文档（方法论、测试框架、道德指南等）
│   ├── agent-prompts-v3.md          # Agent 调研提示词（6个维度并行分析）
│   ├── graded-modes.md              # 分级模式说明
│   ├── non-public-figure.md         # 非公众人物处理指南
│   ├── testing-framework.md         # 测试框架
│   ├── skill-template.md            # Skill 模板
│   ├── progress-tracker.md          # 进度追踪
│   ├── incremental-update.md        # 增量更新策略
│   ├── contradiction-handling.md    # 矛盾处理
│   ├── extraction-framework.md      # 提炼框架
│   ├── ethics-guidelines.md         # 道德指南
│   ├── mental-model-validation.md   # 心智模型验证
│   ├── research/                    # 调研过程文件（6个Agent的输出）
│   └── sources/                     # 原始素材（字幕、文章等）
│
├── knowledge-acquisition/           # 知识获取系统（配置驱动）
│   ├── README.md                    # 系统说明文档
│   └── config/
│       └── channels.yaml            # 渠道配置（B站、YouTube、微博等）
│
├── scripts/                         # 工具脚本
│   ├── pre_extract.py               # 预提炼工具（生成结构化摘要）
│   └── quality_gate.py              # 质量门禁（检查调研质量）
│
└── .omc/                            # oh-my-claudecode 状态（可删除）
```

---

## 验证与测试

### 测试 Prompt 1：地缘政治分析

**输入**：
```text
用姜汁汽水的视角，帮我分析一下现在的中东局势对黄金价格的影响
```

**合格表现**：
- 先搜索最新的中东局势和黄金价格数据
- 运用"三线战场联动"框架分析中东在美金融/军事/科技三线中的位置
- 运用"美元-美债-流动性三角"分析流动性环境
- 给出明确的黄金走势判断（带点位和时间框架）
- 用汽水的表达方式（长句推理、"对吧"口癖、"换句话说"、确定性表达）
- 附带风险提示

### 测试 Prompt 2：资产配置建议

**输入**：
```text
汽水，现在应该怎么配置资产？黄金还能买吗？
```

**合格表现**：
- 搜索最新的黄金价格和宏观经济数据
- 运用"黄金绝对不可空仓"的决策启发式
- 给出明确的配置建议（不是"可能涨也可能跌"的废话）
- 标注确定性程度和观察中的变量

---

## 致谢

### 方法论来源

这个 Skill 的调研和提炼方法借鉴了：

- [女娲 · Skill造人术](https://github.com/alchaincyf/nuwa-skill) - Skill 生成框架
- [LearnPrompt](https://github.com/langgpt/learnprompt) - 人物蒸馏方法论

### 调研对象

- **战国时代_姜汁汽水** - B站知识区 UP主，专注地缘和财经分析
  - B站频道：https://space.bilibili.com/1039025435
  - 186篇视频文稿（约200万字）作为调研基础
  - 14个月从0到54.5万粉丝

### 创建者

- [花叔](https://x.com/AlchainHust) - 女娲项目作者
- 本 Skill 由女娲 v2.0 生成，含置信度标注体系

---

## 同门兄弟项目

都是用人物蒸馏方法论做的思维操作系统，每个都有独特的视角：

| 项目 | 蒸馏对象 | 一句话定位 |
|------|---------|-----------|
| [**zettaranc-skill**](https://github.com/lululu811/zettaranc-skill) | 交易员思维 | 「利润是市场给的，都是概率的事儿」——交易决策的思维框架 |
| [**mo-skill**](https://github.com/lululu811/mo-skill) | BOSS墨 | 285期B站视频里的交易思维蒸馏 |
| [**benben-jiucai-perspective**](https://github.com/lululu811/benben-jiucai-perspective) | 笨笨的韭菜 | 260万字视频蒸馏成9个心智模型+10条决策启发式 |
| [**fupeng-perspective**](https://github.com/lululu811/fupeng-perspective) | 付鹏 | 东北证券首席经济学家的宏观分析框架 |
| [**jiangju-perspective**](https://github.com/lululu811/jiangju-perspective) | 战国时代_姜汁汽水 | 地缘财经思维（你正在看的这个） |

### 配套工具

| 项目 | 用途 |
|------|------|
| [**bilibili-subtitle-downloader**](https://github.com/lululu811/bilibili-subtitle-downloader) | B站视频字幕下载器（人物蒸馏的数据采集工具） |
| [**content-factory**](https://github.com/lululu811/content-factory) | A股投研AI编辑部（内容生产SOP） |
| [**halo-skill**](https://github.com/lululu811/halo-skill) | 股票数据验证（你让AI分析一只股票，它给了你一堆数字——但你不知道哪些是真的） |
| [**ai-news-radar**](https://github.com/lululu811/ai-news-radar) | 24h AI/科技新闻雷达 |
| [**TrendRadar**](https://github.com/lululu811/TrendRadar) | AI舆情监控与热点筛选 |

---

## License

[MIT](LICENSE)

---

<div align="center">

*「不懂经济，你一定会在地缘政治的预测上面犯错误。」—— 战国时代_姜汁汽水*

</div>

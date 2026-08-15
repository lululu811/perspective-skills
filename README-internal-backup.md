# 常士杉视角 · Skill 蒸馏工作目录

> 基于女娲 v3.0 流程建立的思维蒸馏项目

## 蒸馏对象

- **人物**: 常士杉（私募一哥）
- **身份**: 世通资产管理有限公司总裁，私募基金经理
- **主要平台**: YouTube
- **核心标签**: 基本面研究、人性博弈、波段操作、独立思考

## 目录结构

```
changshishan-perspective/
├── SKILL.md                          # 最终产物（蒸馏完成后生成）
├── README.md                         # 本文件
├── scripts/
│   └── pre_extract.py                # Phase 1.5 预提炼工具
├── references/
│   ├── research/                     # 6个维度的Agent调研结果
│   │   ├── 01-writings.md           # 著作与系统思考
│   │   ├── 02-conversations.md      # 对话与访谈素材（YouTube视频）
│   │   ├── 03-expression-dna.md     # 表达DNA
│   │   ├── 04-external-views.md     # 他者视角
│   │   ├── 05-decisions.md          # 决策记录
│   │   └── 06-timeline.md          # 人物时间线
│   ├── sources/                      # 一手素材（用户提供的原始文件）
│   │   ├── books/                    # 书籍/PDF
│   │   ├── transcripts/             # 视频字幕/文字稿
│   │   └── articles/                # 文章/访谈
│   ├── extraction-framework.md      # 思维框架提炼方法论
│   └── skill-template.md            # SKILL.md 构建模板
└── templates/
    └── result-card.html              # 成果展示卡片模板
```

## 工作流程

### Phase 0: 入口确认 ✅
- [x] 确认蒸馏对象：常士杉（私募一哥，YouTube创作者）
- [x] 聚焦方向：投资分析框架 + 人性博弈方法论
- [x] 用途：投资思维顾问
- [x] 检查本地素材：246个transcript + 1篇PDF

### Phase 1: 信息采集 ✅
- [x] Agent 1: 著作与系统思考 → `references/research/01-writings.md`
- [x] Agent 2: 对话与访谈素材 → `references/research/02-conversations.md`
- [x] Agent 3: 表达DNA → `references/research/03-expression-dna.md`
- [x] Agent 4: 他者视角 → `references/research/04-external-views.md`
- [x] Agent 5: 决策记录 → `references/research/05-decisions.md`
- [x] Agent 6: 人物时间线 → `references/research/06-timeline.md`

### Phase 1.5: 预提炼与质量门禁 ✅
- [x] 来源统计通过（246个transcript + 1篇PDF，约260万字）
- [x] 一手来源占比 > 95%（几乎全部为常士杉本人YouTube直接产出）
- [x] 矛盾点已标注（4组内在张力）
- [x] 缺口维度已识别（加密货币/房地产等领域外信息不足）

### Phase 2: 框架提炼 ✅
- [x] 心智模型提取（9个）
- [x] 决策启发式提取（8条）
- [x] 表达DNA分析
- [x] 价值观与反模式
- [x] 内在张力识别（4组）

### Phase 2.5: 提炼确认 ✅
- [x] 用户确认提炼结果

### Phase 3: Skill构建 ✅
- [x] SKILL.md 已生成（含分析工作流 + 示例对话 + 领域外边界处理）

### Phase 4: 质量验证 ✅
- [x] 已知测试（3个）全部通过
- [x] 边缘测试（1个）推断合理
- [x] 风格测试（100字盲测）可辨认

### Phase 5: 双Agent精炼 ✅
- [x] auto-skill-optimizer 评审：66/80 (82.5%)
- [x] skill-creator 评审：10项改进建议
- [x] 已应用高优先级改进（补充3570/温度系统、示例对话、分析工作流、领域外边界、第4组张力、实战注脚）

## 已知关键信息（预填）

### 人物背景
- 世通资产创始人，基地南京（"在南京接收到的噪音少一点"）
- 2010年私募冠军（世通1期年回报83.11%，后升至54.86%半年回报）
- 深爱哲学，专注人性研究
- 独创方法论：「三低买入法」「时空价值交易系统」「滚动复利法」

### 核心投资理念（待验证补充）
1. **随时随市而动，以变应万变** — 投资策略的灵魂
2. **除了基本面，神马都是浮云** — 基本面至上
3. **风险第一，积少成多，聚沙成塔** — 投资风格
4. **人性博弈** — 市场博弈中找到自己的位置
5. **独立思考** — 远离噪音，独立判断
6. **投资与投机并用** — 水无常型，股无常势

### 信息源

#### 优先采集
- YouTube 频道视频（主要平台）
- 新浪财经/英才等媒体访谈
- 中金在线博客/博文
- 世通资产相关公开资料

#### 黑名单（不采集）
- 知乎
- 微信公众号
- 百度百科

## 下一步

当你准备好启动蒸馏时：
1. 将 YouTube 视频字幕/transcript 放入 `references/sources/transcripts/`
2. 将相关文章放入 `references/sources/articles/`
3. 说"开始蒸馏"启动 Phase 1

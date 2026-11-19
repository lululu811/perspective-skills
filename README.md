<div align="center">

# Perspective Skills · 人物视角技能库

> **不是"关于某人"的资料库，而是"成为某人"的思维操作系统。**

把交易者、博主、经济学家的思维方式蒸馏成 `SKILL.md` ——
让 AI 用他们的镜片看世界、用他们的直觉做判断、用他们的语气说话。

[![Skills](https://img.shields.io/badge/skills-10-blue)](skills/)
[![Method](https://img.shields.io/badge/method-女娲%20v2.0-purple)](https://github.com/alchaincyf/nuwa-skill)
[![Node](https://img.shields.io/badge/node-%3E%3D18-green)](package.json)
[![License](https://img.shields.io/badge/license-MIT%20(scaffolding)-yellow)](LICENSE)

[全部 Skill](#-技能清单) · [安装](#-安装) · [怎么用](#-怎么用) · [方法论](#-方法论) · [许可与边界](#-许可与边界)

</div>

---

## 这是什么

每个 Skill 回答的不是「他说过什么」，而是四个问题：

- 🧠 他用什么**心智模型**看世界？（镜片）
- ⚡ 他用什么**决策启发式**做判断？（直觉规则）
- 🗣️ 他怎么**表达**？（表达 DNA）
- 🚫 他**绝对不会**做什么？什么是这个 Skill **做不到**的？（反模式与诚实边界）

装上之后对 AI 说「用 Z 哥的视角看看这个持仓」，它就会切换成那个人的框架和语气，而不是给你一段百科式介绍。

> 本仓库是**聚合分发层**：10 个独立仓库的历史已完整并入 `skills/<slug>/`，各子目录保留原始 LICENSE 与文档。旗舰项目 [zettaranc-skill](https://github.com/lululu811/zettaranc-skill)（534★，可回测的完整工具链）不在本仓库，单独维护。

## 📦 技能清单

| Skill | 人物 / 领域 | 语料规模 | 蒸馏产出 | 许可 |
|---|---|---|---|---|
| [`zettaranc-perspective`](skills/zettaranc-perspective/) | **Z 哥（万千）** · A 股技术面、战法、持仓诊断、职业与人生决策 | ~200 万字 | 60+ 指标 · 30+ 战法 | MIT |
| [`albrooks-perspective`](skills/albrooks-perspective/) | **Al Brooks** · 价格行为、逐根 K 线分析 | 459 集课程 + 68 概念页 + 132 图 | 10 心智模型 / 10 启发式 | 未声明 |
| [`benben-jiucai-perspective`](skills/benben-jiucai-perspective/) | **笨笨的韭菜（笨总）** · A 股景气度、仓位策略 | 216 视频 / 260 万字 | 7 / 10 | MIT |
| [`benbenjiucai-skill`](skills/benbenjiucai-skill/) | **笨笨的韭菜 · 深度版** · 投资思维与决策复盘 | 2,506 问答 + 203 视频 + 1,188 动态 | 24 / 50 | 未声明 |
| [`changshishan-perspective`](skills/changshishan-perspective/) | **常士杉（私募一哥）** · 实战与风控 | 246 视频 + 1 PDF | 9 / 8 | MIT |
| [`fupeng-perspective`](skills/fupeng-perspective/) | **付鹏** · 宏观与资产配置（内含女娲 v2.0 完整流水线） | 公开演讲与访谈 | 12 心智模型 / 6 阶段流程 | MIT |
| [`jiangju-perspective`](skills/jiangju-perspective/) | **姜汁汽水** · 地缘政治、宏观、资产配置 | 186 篇 / 200 万字 | 7 / 8 | MIT |
| [`jianfang-perspective`](skills/jianfang-perspective/) | **简放（焦峰）** · 3L 交易体系、量价择时 | 9 个渐进加载模块 | 14 启发式 / 8 铁律 / 11 反模式 | 未声明 |
| [`mo-skill`](skills/mo-skill/) | **BOSS 墨** · 交易节奏与盈亏比 | 285 期视频 | 6 / 10 | MIT |
| [`sanxian-skill`](skills/sanxian-skill/) | **三线文案大锅饭** · 经济趋势、社会现象、个人选择 | 371 视频 + 1,690 篇文章 | 9 / 15 | 未声明 |

> 多数 Skill 只面向投资/宏观场景，被问到明显超出领域的问题时会主动说「这个超出了他的擅长范围」——这是设计，不是缺陷。

## 🚀 安装

需要 Node.js ≥ 18。直接走 GitHub 源即可，无需等 npm 发布：

```bash
# 看看有哪些、装没装
npx github:lululu811/perspective-skills

# 装一个（安装目录名取自 SKILL.md 的 name 字段）
npx github:lululu811/perspective-skills zettaranc-perspective

# 装多个
npx github:lululu811/perspective-skills albrooks-perspective jianfang-perspective

# 全装
npx github:lululu811/perspective-skills --all

# 只装到当前项目
npx github:lululu811/perspective-skills zettaranc-perspective --project

# 装到别的 agent（Cursor / Codex ...）
npx github:lululu811/perspective-skills --all --dir ~/.cursor/skills

# 先看会做什么，不写文件
npx github:lululu811/perspective-skills --all --dry-run
```

| 选项 | 作用 |
|---|---|
| （无参数） | 列出全部 Skill 及安装状态 |
| `-a, --all` | 安装全部 |
| `-p, --project` | 装到 `./.claude/skills` |
| `-g, --global` | 装到 `~/.claude/skills`（默认） |
| `--dir <path>` | 装到指定目录（精确路径） |
| `-f, --force` | 覆盖同名目录 |
| `--dry-run` | 预演，不写文件 |
| `--json` | JSON 输出，便于脚本调用 |

不用 npx 也行：把 `skills/<slug>/` 整个复制到 agent 的 skills 目录即可，`SKILL.md` 是唯一入口。

> 发布到 npm 后（`npm publish`）短命令 `npx perspective-skills` 也会生效；当前未发布，请用上面的 GitHub 源形式。

## 💬 怎么用

装好后用触发词点名切换视角：

```
用 Z 哥的视角看看 600519.SH 这个位置能不能买
用 Al Brooks 的视角逐根分析这张 K 线图
如果常士杉看到这个回撤，他会怎么处理？
帮我用汽水的角度想想黄金和原油的配置
切到 BOSS 墨，我这笔交易的盈亏比够不够
```

也可以让它当"审稿人"：先写自己的判断，再让某个人格挑毛病——不同人格的盲区正好互补。

## 🔧 方法论

蒸馏流程来自 [女娲 v2.0](https://github.com/alchaincyf/nuwa-skill)：

```
语料采集 → 6 维度并行调研 → 预提炼质量门禁
        → 心智模型提取（跨域复现 / 生成力 / 自创术语 三重验证）
        → 决策启发式 + 表达 DNA + 反模式
        → 诚实边界与可信度标注
        → SKILL.md 装配 + 测试 prompts
```

硬性标准：来源可追溯、每条论断标可信度、写不清的地方写进「边界」而不是编。`fupeng-perspective` 里保留了这条流水线的完整实现，想自己造人可以直接拿它当模板。

## 📄 许可与边界

- **脚手架**（`bin/`、`package.json`、本 README）：MIT，见 [LICENSE](LICENSE)。
- **各 Skill 内容**：以 `skills/<slug>/LICENSE` 为准；部分子目录未声明许可（表中标「未声明」），转载与商用前请自行确认。
- 语料版权归原作者及平台所有，本仓库仅存放**思维框架的提炼结果**，不含原始音视频。
- **全部内容仅供学习研究，不构成任何投资建议。** 人物视角 ≠ 本人观点，模型输出存在幻觉与偏差，交易决策请自行负责。

## 🙏 致谢

女娲 v2.0 流程作者 [@alchaincyf](https://github.com/alchaincyf/nuwa-skill)；感谢被蒸馏的每一位作者，以及所有 upstream 贡献者。

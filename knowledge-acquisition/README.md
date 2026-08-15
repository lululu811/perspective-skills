# 知识获取与工具集成系统 v3.0

> 模块化、可扩展、配置驱动的知识获取系统

## 系统概述

这是一个完全配置驱动的知识获取系统，所有渠道、工具、策略都通过YAML配置文件定义，新增渠道只需添加配置，无需修改代码。

### 核心特性

1. **配置驱动** - 所有配置都在YAML文件中，易于修改和扩展
2. **插件架构** - 新增渠道只需添加配置项
3. **优先级管理** - 每个渠道可配置优先级和权重
4. **质量评估** - 自动评估渠道质量和可信度
5. **失败降级** - 渠道失败时自动切换到备选方案
6. **多语言支持** - 支持中英文人物和跨语言搜索

---

## 系统架构

```
knowledge-acquisition/
├── config/                          # 配置文件目录
│   ├── channels.yaml                # 渠道配置（核心）
│   ├── tools.yaml                   # 工具配置
│   ├── quality-rules.yaml           # 质量评估规则
│   └── strategies.yaml              # 策略配置（待创建）
├── channels/                        # 渠道插件目录（待实现）
│   ├── video/                       # 视频类渠道
│   ├── audio/                       # 音频类渠道
│   ├── text/                        # 文本类渠道
│   └── social/                      # 社交类渠道
├── scripts/                         # 核心脚本
│   ├── channel_manager.py           # 渠道管理器
│   ├── quality_evaluator.py         # 质量评估器
│   └── acquisition_pipeline.py      # 获取流水线（待创建）
└── templates/                       # 模板目录（待创建）
```

---

## 快速开始

### 1. 配置渠道

编辑 `config/channels.yaml`，定义你的渠道：

```yaml
channels:
  video:
    priority: 10
    sub_channels:
      bilibili:
        enabled: true
        priority: 10
        config:
          search_keywords:
            - "{person_name} 访谈"
          tool: bilibili-subtitle-downloader
```

### 2. 配置工具

编辑 `config/tools.yaml`，定义你的工具：

```yaml
video_tools:
  bilibili_subtitle:
    name: bilibili-subtitle-downloader
    command: "bash scripts/download_subtitles.sh {url} {output_dir}"
    input: video_url
    output: subtitle_file
```

### 3. 使用渠道管理器

```python
from pathlib import Path
from scripts.channel_manager import ChannelManager

config_dir = Path("config")
manager = ChannelManager(config_dir)

# 获取中文人物的渠道
channels = manager.get_channels_for_person("chinese_figure")
print(f"推荐渠道: {[c['name'] for c in channels[:3]]}")

# 搜索所有渠道
results = manager.search_all_channels("芒格", "chinese_figure")
print(f"找到 {len(results)} 个结果")
```

### 4. 评估质量

```python
from scripts.quality_evaluator import QualityEvaluator

evaluator = QualityEvaluator(config_dir)

# 评估单个来源
source = {
    'url': 'https://caixin.com/article/123',
    'content': '原文：芒格说...',
    'has_recording': True,
    'is_primary': True
}

assessment = evaluator.assess_source(source)
print(f"可信度: {assessment.credibility_score}")
print(f"建议: {assessment.recommendations}")
```

---

## 配置详解

### channels.yaml - 渠道配置

#### 渠道类型

| 类型 | 说明 | 优先级 |
|------|------|--------|
| video | 视频渠道（B站、YouTube） | 10（最高） |
| audio | 音频渠道（播客） | 9 |
| text | 文本渠道（文章、书籍） | 8 |
| social | 社交渠道（Twitter、微博） | 6 |

#### 人物类型

| 类型 | 说明 | 优先渠道 |
|------|------|---------|
| chinese_figure | 中文人物 | B站、小宇宙、权威媒体 |
| english_figure | 英文人物 | YouTube、Apple Podcast、Twitter |
| academic_figure | 学术人物 | Google Scholar、PDF书籍 |

#### 配置示例

```yaml
channels:
  video:
    priority: 10
    sub_channels:
      bilibili:
        enabled: true              # 是否启用
        priority: 10               # 优先级（1-10）
        config:
          search_keywords:         # 搜索关键词模板
            - "{person_name} 访谈"
            - "{person_name} 演讲"
          filters:                 # 过滤条件
            duration: ">30min"     # 视频时长
            official_account: true # 官方账号
          tool: bilibili-subtitle-downloader  # 使用的工具
```

### tools.yaml - 工具配置

#### 工具类型

| 类型 | 说明 | 示例 |
|------|------|------|
| video_tools | 视频处理 | 字幕下载、语音转文字 |
| audio_tools | 音频处理 | 播客transcript |
| text_tools | 文本处理 | 网页读取、PDF读取 |
| social_tools | 社交处理 | Twitter、微博API |
| search_tools | 搜索工具 | WebSearch、Deep Research |

#### 配置示例

```yaml
video_tools:
  bilibili_subtitle:
    name: bilibili-subtitle-downloader
    description: "B站字幕下载器"
    command: "bash scripts/download_subtitles.sh {url} {output_dir}"
    input: video_url
    output: subtitle_file
    config:
      priority:
        - manual  # 人工字幕优先
        - zh-CN
        - en
```

### quality-rules.yaml - 质量规则

#### 可信度评分

| 来源类型 | 基础分 |
|---------|--------|
| 一手来源 | 95 |
| 权威媒体 | 80 |
| 二手转述 | 50 |
| 社交媒体 | 40 |
| 黑名单 | 0 |

#### 调整因素

| 因素 | 调整 |
|------|------|
| 有录音/原文 | +10 |
| 有引用来源 | +5 |
| 无来源 | -20 |
| 自我宣传 | -15 |
| 利益冲突 | -30 |

---

## 工具选择决策树

### 视频处理

```
有视频URL？
├─ 是 → 有字幕？
│       ├─ 是 → 下载字幕
│       │       └─ bilibili-subtitle-downloader
│       └─ 否 → 需要转写
│               ├─ 视频<1小时 → gemini-video
│               └─ 视频>1小时 → whisper（分批）
└─ 否 → 有本地视频文件？
        ├─ 是 → gemini-video
        └─ 否 → 搜索视频URL
```

### 音频处理

```
有音频URL？
├─ 是 → 有transcript？
│       ├─ 是 → 直接使用
│       └─ 否 → whisper API
└─ 否 → 搜索播客transcript
        └─ podcastnotes.org
```

### 文本处理

```
有文章URL？
├─ 是 → 文章类型？
│       ├─ 新闻/博客 → web-article-reader
│       ├─ 付费墙 → archive.org
│       └─ 需登录 → 用户提供cookie
└─ 否 → 需要搜索？
        └─ websearch → 找到URL → web-article-reader
```

---

## 扩展指南

### 添加新渠道

1. 在 `config/channels.yaml` 中添加配置：

```yaml
channels:
  new_category:
    priority: 7
    sub_channels:
      new_channel:
        enabled: true
        priority: 7
        config:
          search_keywords:
            - "{person_name} keyword"
          tool: new-tool
```

2. 在 `config/tools.yaml` 中添加工具：

```yaml
new_tools:
  new_tool:
    name: new-tool
    command: "command {input}"
    input: input_type
    output: output_type
```

3. 完成！无需修改代码。

### 添加新的人物类型

在 `config/channels.yaml` 中添加：

```yaml
person_types:
  new_type:
    priority_channels:
      - channel1
      - channel2
    search_language: zh-CN
```

### 自定义质量规则

在 `config/quality-rules.yaml` 中修改：

```yaml
credibility_scoring:
  base_scores:
    your_source_type: 85  # 自定义基础分

  adjustments:
    your_factor: +10  # 自定义调整
```

---

## 最佳实践

### 1. 渠道优先级

- **视频**（10）：最丰富的信息来源，包含表情、语调
- **音频**（9）：深度访谈，推理链完整
- **文本**（8）：系统性思考，可精确引用
- **社交**（6）：碎片化表达，风格DNA

### 2. 质量评估

- 一手来源 > 权威媒体 > 二手转述 > 社交媒体
- 交叉验证至少2个独立来源
- 黑名单来源直接排除

### 3. 失败降级

```python
# 渠道失败时的降级策略
try:
    results = search_channel("bilibili", person_name)
except Exception as e:
    # 降级到YouTube
    results = search_channel("youtube", person_name)
```

### 4. 多语言处理

- 中文人物：优先中文渠道，英文作为补充
- 英文人物：优先英文渠道，中文作为补充
- 学术人物：双语并重

---

## 常见问题

### Q1: 如何添加新的视频平台？

A: 在 `channels.yaml` 的 `video.sub_channels` 中添加配置，指定搜索关键词和工具即可。

### Q2: 如何评估来源的可信度？

A: 使用 `quality_evaluator.py`，它会根据来源类型、引用情况、偏见检测等自动评分。

### Q3: 渠道搜索失败怎么办？

A: 系统会自动降级到备选渠道。你也可以在配置中定义降级策略。

### Q4: 如何处理付费内容？

A: 配置中可以提供cookie或token，或者使用archive.org等缓存服务。

### Q5: 如何批量处理多个渠道？

A: 使用 `channel_manager.py` 的 `search_all_channels()` 方法，它会自动按优先级搜索所有渠道。

---

## 下一步

1. **实现渠道插件** - 在 `channels/` 目录实现具体的渠道逻辑
2. **创建获取流水线** - 实现 `acquisition_pipeline.py`，整合所有工具
3. **添加更多模板** - 在 `templates/` 目录添加搜索和提取模板
4. **测试和优化** - 在实际蒸馏项目中测试系统

---

## 参考

- 渠道配置：`config/channels.yaml`
- 工具配置：`config/tools.yaml`
- 质量规则：`config/quality-rules.yaml`
- 渠道管理器：`scripts/channel_manager.py`
- 质量评估器：`scripts/quality_evaluator.py`

#!/usr/bin/env python3
"""Build topic index from transcript filenames for agent sampling"""

import re
from pathlib import Path
from collections import Counter, defaultdict

TRANSCRIPTS_DIR = Path(__file__).parent / "../references/sources/transcripts"

# Topic keyword mapping
TOPIC_MAP = [
    ("地缘_能源", ["海峡", "能源", "石油", "原油", "油价", "中东", "伊朗", "朗子", "王爷",
                    "欧佩克", "霍尔木兹", "停火", "战争", "冲突", "军事", "制裁", "狮驼岭",
                    "凤仙", "懂王", "川普", "关税", "贸易", "博弈", "东大", "鹰酱", "美股"]),
    ("宏观_经济", ["降息", "通胀", "GDP", "经济", "利率", "货币", "债务", "泡沫", "衰退",
                    "周期", "资产", "财政", "信贷", "杠杆", "通缩", "消费", "股市", "大盘",
                    "A股", "牛市", "熊市", "抄底", "筹码", "美联储", "FED"]),
    ("AI_科技", ["AI", "算力", "芯片", "机器人", "智能", "科技", "算法", "大数据", "云计算",
                  "GPU", "CPU", "半导体", "模型", "大模型", "GPT", "自动驾驶", "数字化"]),
    ("房产_成都", ["成都", "楼市", "房产", "买房", "房价", "房贷", "刚需", "改善", "保障房",
                    "土拍", "地王", "中介", "物业", "住宅", "公寓", "租房", "房东", "供改",
                    "置换", "老破小", "新房", "二手房"]),
    ("人生_认知", ["认知", "思维", "人生", "选择", "阶层", "教育", "读书", "工作", "职业",
                    "创业", "财富", "自由", "内卷", "躺平", "焦虑", "成长", "心态"]),
]

def categorize(title: str) -> list[str]:
    """Categorize a video by its title"""
    title_lower = title.lower()
    categories = []
    for cat, keywords in TOPIC_MAP:
        if any(kw.lower() in title_lower for kw in keywords):
            categories.append(cat)
    return categories if categories else ["其他"]

def extract_number(filename: str) -> int | str:
    """Extract sequence number from filename"""
    m = re.match(r'(\d+)', filename)
    return int(m.group(1)) if m else 999

def get_nth_file(files: list, n: int) -> str | None:
    """Get nth file by sequence number"""
    for f in files:
        num = extract_number(f)
        if num is not None and num == n:
            return f
    return None

def main():
    files = sorted([f.name for f in TRANSCRIPTS_DIR.glob("*.md")])
    print(f"Total files: {len(files)}\n")

    # Topic distribution
    topic_files = defaultdict(list)
    for f in files:
        cats = categorize(f)
        for cat in cats:
            topic_files[cat].append(f)

    print("=== Topic Distribution ===")
    for cat, flist in sorted(topic_files.items(), key=lambda x: -len(x[1])):
        print(f"  {cat}: {len(flist)} files")

    print("\n=== Sampling Plan ===")
    print("Selecting ~80 files for 6 agents (13-14 each)\n")

    # Stratified sampling: evenly spaced across sequence numbers
    numbered = []
    na_files = []
    for f in files:
        num = extract_number(f)
        if isinstance(num, int) and num <= 400:
            numbered.append((num, f))
        else:
            na_files.append(f)
    numbered.sort()

    print(f"Numbered files: {len(numbered)}, Unnumbered: {len(na_files)}")

    # Take every 5th file for main sample
    sample_indices = list(range(0, len(numbered), 5))
    sample = [numbered[i] for i in sample_indices]
    
    # Add unnumbered files
    sample.extend([(999, f) for f in na_files])

    print(f"\nSample size: {len(sample)} files")
    print("\n=== Sample File List ===")
    for num, f in sample:
        cats = categorize(f)
        print(f"  [{num:3d}] {f[:70]}  ({','.join(cats)})")

    # Assign to agents
    print("\n\n=== Agent Assignment ===")
    agent_files = defaultdict(list)
    for i, (num, f) in enumerate(sample):
        agent_id = i % 6 + 1
        agent_files[agent_id].append((num, f))

    for agent_id in range(1, 7):
        flist = agent_files[agent_id]
        print(f"\nAgent {agent_id}: {len(flist)} files")
        for num, f in flist:
            cats = categorize(f)
            print(f"    [{num:3d}] {f[:65]}")

    # Write sample files to disk for agent reference
    output = Path(__file__).parent / "../references/sample_files.txt"
    with open(output, "w") as f:
        for num, filename in sample:
            cats = categorize(filename)
            f.write(f"{num:3d}|{filename}|{','.join(cats)}\n")
    print(f"\nSample list written to: {output}")

if __name__ == "__main__":
    main()

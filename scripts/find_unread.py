#!/usr/bin/env python3
"""Identify unread files and batch them for reading"""
from pathlib import Path

TRANSCRIPTS = Path("/home/chenlei/001_AI/skills/sanxian-copywriting-skill/references/sources/transcripts")
all_files = sorted([f.name for f in TRANSCRIPTS.glob("*.md")])

# Files I've already read (manually tracked)
read_keywords = [
    "001_", "006_", "011_", "016_", "021_", "026_", "031_", "036_", "038_", "039_",
    "041_", "046_", "050_", "051_", "056_", "059_", "061_", "063_", "066_",
    "070_", "071_", "072_", "076_", "082_", "087_", "089_", "093_", "098_",
    "100_", "103_", "109_", "116_", "121_", "126_", "127_", "131_", "136_",
    "141_", "146_", "151_", "156_", "161_", "166_", "171_", "176_", "181_",
    "186_", "191_", "196_", "201_", "207_", "211_", "212_", "213_", "217_",
    "219_", "222_", "224_", "227_", "234_", "238_", "240_", "241_", "242_",
    "243_", "244_", "245_", "250_", "256_", "257_", "261_", "267_", "272_",
    "277_", "283_", "288_", "289_", "293_", "298_", "303_", "308_", "310_",
    "313_", "314_", "318_", "322_", "323_", "328_", "333_", "338_", "345_",
    "350_", "355_", "360_", "365_", "370_", "376_",
]

def is_read(filename):
    for kw in read_keywords:
        if filename.startswith(kw):
            return True
    return False

unread = [f for f in all_files if not is_read(f)]
print(f"Total files: {len(all_files)}")
print(f"Read: {len(all_files) - len(unread)}")
print(f"Unread: {len(unread)}")
print()

# Group by number range
ranges = {}
for f in unread:
    num = f.split("_")[0]
    try:
        n = int(num)
        r = (n // 10) * 10
        ranges.setdefault(r, []).append(f)
    except:
        ranges.setdefault(999, []).append(f)

print("=== Unread by range ===")
for r in sorted(ranges.keys()):
    files = ranges[r]
    print(f"  {r:3d}-{r+9}: {len(files)} files")
    
print(f"\n=== Sample of unread files ===")
for f in unread[:30]:
    print(f"  {f[:70]}")
if len(unread) > 30:
    print(f"  ... and {len(unread)-30} more")

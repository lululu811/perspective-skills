#!/usr/bin/env python3
"""
环境检查脚本

检查蒸馏项目所需依赖是否齐全。
"""

import sys
import importlib.util

REQUIRED_PACKAGES = [
    "requests",
]

OPTIONAL_PACKAGES = [
    "beautifulsoup4",
    "lxml",
]


def check_package(package_name: str) -> bool:
    """检查Python包是否已安装"""
    spec = importlib.util.find_spec(package_name)
    return spec is not None


def main():
    print("=" * 50)
    print("三线文案大锅饭 · 蒸馏环境检查")
    print("=" * 50)
    print()

    # 检查Python版本
    print(f"Python版本: {sys.version.split()[0]}")
    print()

    # 检查必需包
    print("必需依赖:")
    all_ok = True
    for pkg in REQUIRED_PACKAGES:
        installed = check_package(pkg)
        status = "✅" if installed else "❌"
        print(f"  {status} {pkg}")
        if not installed:
            all_ok = False
    print()

    # 检查可选包
    print("可选依赖:")
    for pkg in OPTIONAL_PACKAGES:
        installed = check_package(pkg)
        status = "✅" if installed else "⬜"
        print(f"  {status} {pkg}")

    print()
    if all_ok:
        print("✅ 环境就绪，可以开始蒸馏！")
    else:
        print(f"❌ 缺少必需依赖，请运行:")
        print(f"   pip install {' '.join(REQUIRED_PACKAGES)}")

    # 检查目录结构
    print()
    print("目录结构检查:")
    dirs = [
        "../references/research/",
        "../references/sources/transcripts/",
        "../references/sources/books/",
        "../references/sources/articles/",
        "../templates/",
        "../scripts/",
    ]
    from pathlib import Path
    for d in dirs:
        p = Path(__file__).parent / d
        status = "✅" if p.exists() else "❌"
        print(f"  {status} {d}")


if __name__ == "__main__":
    main()

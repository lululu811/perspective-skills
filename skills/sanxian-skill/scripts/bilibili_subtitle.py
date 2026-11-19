#!/usr/bin/env python3
"""
B站视频字幕/文案下载工具

用于获取三线文案大锅饭B站视频的字幕作为一手素材。
B站UID: 12724488

使用方法:
  # 获取UP主所有视频列表
  python bilibili_subtitle.py --list --uid 12724488

  # 下载单个视频字幕
  python bilibili_subtitle.py --bv BV1fVrhYfEHL --output ../references/sources/transcripts/

  # 批量下载最近N个视频的字幕
  python bilibili_subtitle.py --uid 12724488 --limit 20 --output ../references/sources/transcripts/

注意：B站的字幕接口可能需要cookies或会变动，如果脚本失效请手动下载字幕。
"""

import os
import re
import json
import argparse
import requests
from pathlib import Path
from typing import Optional


# B站API
BILIBILI_API = "https://api.bilibili.com"
USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"


def get_video_list(uid: int, limit: int = 20) -> list[dict]:
    """获取UP主视频列表"""
    url = f"{BILIBILI_API}/x/space/wbi/arc/search"
    params = {
        "mid": uid,
        "ps": min(limit, 50),
        "pn": 1,
        "order": "pubdate",
    }
    headers = {"User-Agent": USER_AGENT}

    try:
        resp = requests.get(url, params=params, headers=headers, timeout=15)
        data = resp.json()
        if data.get("code") != 0:
            print(f"API返回错误: {data.get('message', '未知错误')}")
            return []

        vlist = data.get("data", {}).get("list", {}).get("vlist", [])
        videos = []
        for v in vlist:
            videos.append({
                "bv": v.get("bvid", ""),
                "title": v.get("title", ""),
                "description": v.get("description", ""),
                "play": v.get("play", 0),
                "pubdate": v.get("pubdate", 0),
                "length": v.get("length", ""),
            })
        return videos[:limit]
    except Exception as e:
        print(f"获取视频列表失败: {e}")
        return []


def get_subtitle_url(bv: str) -> Optional[dict]:
    """获取视频字幕信息"""
    url = f"{BILIBILI_API}/x/player/v2"
    params = {"bvid": bv}
    headers = {"User-Agent": USER_AGENT, "Referer": "https://www.bilibili.com"}

    try:
        resp = requests.get(url, params=params, headers=headers, timeout=15)
        data = resp.json()
        if data.get("code") != 0:
            return None

        subtitle_data = data.get("data", {}).get("subtitle", {})
        subtitles = subtitle_data.get("subtitles", [])

        if not subtitles:
            print(f"  视频 {bv} 无字幕")
            return None

        # 优先选择中文(zh-CN)字幕
        for sub in subtitles:
            if sub.get("lan_doc") == "中文" or "zh" in sub.get("lan", ""):
                return {
                    "url": sub.get("subtitle_url", ""),
                    "lang": sub.get("lan_doc", "中文"),
                }

        # 没有中文就用第一个
        first = subtitles[0]
        return {
            "url": first.get("subtitle_url", ""),
            "lang": first.get("lan_doc", "未知"),
        }
    except Exception as e:
        print(f"  获取字幕信息失败: {e}")
        return None


def download_subtitle(subtitle_url: str) -> Optional[str]:
    """下载字幕内容并返回文本"""
    if not subtitle_url:
        return None

    # 补全URL
    if subtitle_url.startswith("//"):
        subtitle_url = "https:" + subtitle_url

    headers = {"User-Agent": USER_AGENT}

    try:
        resp = requests.get(subtitle_url, headers=headers, timeout=15)
        data = resp.json()

        if isinstance(data, dict) and "body" in data:
            # 标准B站字幕格式
            text_parts = []
            for item in data["body"]:
                content = item.get("content", "")
                if content.strip():
                    text_parts.append(content.strip())
            return "\n".join(text_parts)
        elif isinstance(data, list):
            text_parts = []
            for item in data:
                if isinstance(item, dict) and "content" in item:
                    text_parts.append(item["content"].strip())
            return "\n".join(text_parts)
        else:
            return str(data)
    except Exception as e:
        print(f"  下载字幕失败: {e}")
        return None


def sanitize_filename(filename: str) -> str:
    """清理文件名中的非法字符"""
    return re.sub(r'[\\/:*?"<>|]', '_', filename)


def main():
    parser = argparse.ArgumentParser(description="B站视频字幕下载工具")
    parser.add_argument("--uid", type=int, default=12724488, help="UP主UID (默认: 12724488)")
    parser.add_argument("--bv", type=str, help="单个视频BV号")
    parser.add_argument("--list", action="store_true", help="列出视频列表")
    parser.add_argument("--limit", type=int, default=10, help="批量下载数量 (默认: 10)")
    parser.add_argument("--output", "-o", type=str, default="../references/sources/transcripts/",
                        help="输出目录")

    args = parser.parse_args()

    output_dir = Path(args.output)
    output_dir.mkdir(parents=True, exist_ok=True)

    if args.bv:
        # 下载单个视频
        print(f"正在获取视频 {args.bv} 的字幕...")
        sub_info = get_subtitle_url(args.bv)
        if sub_info and sub_info["url"]:
            text = download_subtitle(sub_info["url"])
            if text:
                output_file = output_dir / f"{args.bv}.txt"
                output_file.write_text(text, encoding="utf-8")
                print(f"  字幕已保存: {output_file} ({len(text)}字)")
            else:
                print(f"  字幕内容为空")
        else:
            print(f"  无法获取字幕")
        return

    # 获取视频列表
    print(f"正在获取UP主 {args.uid} 的视频列表...")
    videos = get_video_list(args.uid, args.limit)

    if not videos:
        print("未获取到视频列表。")
        return

    print(f"共获取 {len(videos)} 个视频")

    if args.list:
        print(f"\n{'BV号':<25} {'播放量':<10} {'时长':<8} 标题")
        print("-" * 80)
        for v in videos:
            print(f"{v['bv']:<25} {v['play']:<10} {v['length']:<8} {v['title'][:40]}")
        return

    # 批量下载字幕
    success = 0
    for v in videos:
        bv = v["bv"]
        title = v["title"]
        print(f"\n[{success+1}/{len(videos)}] {bv} - {title[:30]}...")

        sub_info = get_subtitle_url(bv)
        if sub_info and sub_info["url"]:
            text = download_subtitle(sub_info["url"])
            if text and len(text.strip()) > 10:
                # 文件名用序号+标题+BV号
                safe_title = sanitize_filename(title[:30])
                filename = f"{success+1:03d}_{safe_title}[{bv}].txt"
                output_file = output_dir / filename
                output_file.write_text(text, encoding="utf-8")
                print(f"  ✅ 已保存 ({len(text)}字)")
                success += 1
            else:
                print(f"  ❌ 字幕内容为空或过短")
        else:
            print(f"  ❌ 无字幕可用")

    print(f"\n下载完成! 成功: {success}/{len(videos)}")
    print(f"字幕文件保存在: {output_dir.resolve()}")


if __name__ == "__main__":
    main()

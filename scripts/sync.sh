#!/usr/bin/env bash
# 把各 Skill 源仓库的最新内容同步进 skills/<slug>/。
#
#   scripts/sync.sh            同步全部（有变化才提交）
#   scripts/sync.sh <slug>...  只同步指定 Skill
#   scripts/sync.sh --check    只报告哪些 Skill 落后于源仓库
#
# 同步方式：fetch 源仓库 → 合并其历史 → 用源仓库的根树整体替换 skills/<slug>/。
# 这样每个 Skill 的独立提交历史仍然保留在 git graph 里，内容与源仓库保持一致。
set -euo pipefail

OWNER="${OWNER:-lululu811}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

check_only=false
targets=()
for arg in "$@"; do
  case "$arg" in
    --check) check_only=true ;;
    -h|--help) sed -n '2,9p' "$0"; exit 0 ;;
    *) targets+=("$arg") ;;
  esac
done

if [[ ${#targets[@]} -eq 0 ]]; then
  while IFS= read -r dir; do
    targets+=("$(basename "$dir")")
  done < <(find skills -mindepth 1 -maxdepth 1 -type d | sort)
fi

drift=0
for slug in "${targets[@]}"; do
  if [[ ! -d "skills/$slug" ]]; then
    echo "跳过：skills/$slug 不存在"
    continue
  fi
  branch="$(gh api "repos/$OWNER/$slug" --jq .default_branch)"
  remote="_sync_$slug"
  git remote remove "$remote" 2>/dev/null || true
  git remote add "$remote" "https://github.com/$OWNER/$slug.git"
  git fetch -q --no-tags "$remote" "$branch"

  if git diff --quiet "$remote/$branch" "HEAD:skills/$slug" 2>/dev/null; then
    printf "%-30s 已是最新\n" "$slug"
    git remote remove "$remote"
    continue
  fi

  drift=$((drift + 1))
  if $check_only; then
    printf "%-30s 有更新\n" "$slug"
    git remote remove "$remote"
    continue
  fi

  sha="$(git rev-parse --short "$remote/$branch")"
  git merge -q -s ours --no-commit --allow-unrelated-histories "$remote/$branch" >/dev/null 2>&1 || true
  git read-tree --prefix="skills/$slug/" -u "$remote/$branch"
  git commit -qm "chore(sync): $slug -> $sha" -m "Sync from https://github.com/$OWNER/$slug ($branch@$sha)"
  git remote remove "$remote"
  printf "%-30s 已同步 (%s)\n" "$slug" "$sha"
done

if $check_only && [[ $drift -gt 0 ]]; then
  echo
  echo "$drift 个 Skill 落后于源仓库，运行 scripts/sync.sh 同步。"
  exit 1
fi

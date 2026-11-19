#!/usr/bin/env node
/**
 * perspective-skills 安装器。
 *
 * 只做一件事：把人物视角 Skill 的文档复制到 agent 的 skills 目录。
 * 不下载数据，不修改宿主配置，不改动任何已有文件（除 --force）。
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..");
const SKILLS_DIR = path.join(ROOT, "skills");
const pkg = readJson(path.join(ROOT, "package.json")) ?? {};
const VERSION = pkg.version ?? "0.0.0";

const SKIP = new Set([
  ".git",
  ".DS_Store",
  "node_modules",
  "__pycache__",
  ".venv",
  ".omc",
  ".pytest_cache",
  ".ruff_cache",
]);

const catalog = readJson(path.join(SKILLS_DIR, "index.json"))?.skills ?? [];

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return null;
  }
}

function exists(p) {
  try {
    fs.lstatSync(p);
    return true;
  } catch {
    return false;
  }
}

function walk(dir, base, out) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, base, out);
    else if (entry.isFile()) out.push(path.relative(base, full));
  }
}

function collect(dir) {
  const out = [];
  walk(dir, dir, out);
  return out.sort();
}

function resolveSkill(query) {
  const q = query.toLowerCase();
  return catalog.find(
    (s) => s.slug === q || s.name === q || s.person.toLowerCase().includes(q),
  );
}

function usage() {
  const lines = catalog.map(
    (s) => `  ${s.slug.padEnd(28)} ${s.name.padEnd(34)} ${s.person}`,
  );
  console.log(`perspective-skills ${VERSION}

把人物思维框架 Skill 安装到 agent 的 skills 目录。

用法：
  npx perspective-skills                       列出全部 Skill 与安装状态
  npx perspective-skills <skill> [skill...]    安装指定 Skill
  npx perspective-skills --all                 安装全部
  npx perspective-skills <skill> --project     安装到当前项目

选项：
  -a, --all           安装全部 Skill
  -p, --project       安装到 ./.claude/skills（默认 ~/.claude/skills）
  -g, --global        安装到 ~/.claude/skills（默认）
      --dir <path>    安装到指定目录（精确路径，不再追加 Skill 名）
  -f, --force         覆盖已存在的同名目录
      --dry-run       只打印将执行的操作，不写文件
      --json          以 JSON 输出结果
  -l, --list          只列出 Skill（默认行为）
  -h, --help          显示帮助
  -v, --version       显示版本

可安装的 Skill：
${lines.join("\n")}

示例：
  npx perspective-skills zettaranc-perspective
  npx perspective-skills albrooks-perspective jianfang-perspective --project
  npx perspective-skills --all --dir ~/.cursor/skills
  npx perspective-skills --all --dry-run`);
}

function parseArgs(argv) {
  const opts = {
    mode: "global",
    dir: null,
    force: false,
    dry: false,
    json: false,
    all: false,
    list: false,
    targets: [],
  };
  let modeSet = false;
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    switch (arg) {
      case "-a":
      case "--all":
        opts.all = true;
        break;
      case "-p":
      case "--project":
        opts.mode = "project";
        modeSet = true;
        break;
      case "-g":
      case "--global":
        opts.mode = "global";
        modeSet = true;
        break;
      case "--dir": {
        const value = argv[i + 1];
        if (!value) fail("--dir 需要一个路径参数");
        opts.dir = path.resolve(value.replace(/^~(?=$|\/)/, os.homedir()));
        opts.mode = "dir";
        modeSet = true;
        i += 1;
        break;
      }
      case "-f":
      case "--force":
        opts.force = true;
        break;
      case "--dry-run":
        opts.dry = true;
        break;
      case "--json":
        opts.json = true;
        break;
      case "-l":
      case "--list":
        opts.list = true;
        break;
      case "-h":
      case "--help":
        usage();
        process.exit(0);
        break;
      case "-v":
      case "--version":
        console.log(VERSION);
        process.exit(0);
        break;
      default:
        if (arg.startsWith("-")) fail(`未知选项：${arg}（用 --help 查看用法）`);
        opts.targets.push(arg);
    }
  }
  if (opts.dir && opts.mode !== "dir") fail("--dir 不能与其他安装位置选项混用");
  if (!modeSet && opts.dir) opts.mode = "dir";
  return opts;
}

function fail(message) {
  console.error(`错误：${message}`);
  process.exit(1);
}

function installRoot(opts) {
  if (opts.mode === "dir") return opts.dir;
  if (opts.mode === "project") return path.join(process.cwd(), ".claude", "skills");
  return path.join(os.homedir(), ".claude", "skills");
}

function main() {
  const opts = parseArgs(process.argv.slice(2));

  if (catalog.length === 0) fail("找不到 skills/index.json，请在仓库根目录运行或重新安装");

  let selected = [];
  if (opts.all) {
    selected = catalog;
  } else if (opts.targets.length > 0) {
    selected = opts.targets.map((t) => {
      const found = resolveSkill(t);
      if (!found) fail(`未知的 Skill：${t}（用 --list 查看全部）`);
      return found;
    });
  }

  const root = installRoot(opts);

  if (selected.length === 0) {
    const rows = catalog.map((s) => {
      const dest = path.join(root, s.name);
      return {
        slug: s.slug,
        name: s.name,
        person: s.person,
        installed: exists(dest),
        path: dest,
      };
    });
    if (opts.json) {
      console.log(JSON.stringify({ root, skills: rows }, null, 2));
      return;
    }
    console.log(`Skill 目录：${root}\n`);
    const width = Math.max(...rows.map((r) => r.slug.length));
    for (const r of rows) {
      const mark = r.installed ? "✓ 已安装" : "  未安装";
      console.log(`  ${r.slug.padEnd(width)}  ${mark}  ${r.person}`);
    }
    console.log(`\n安装：npx perspective-skills <skill>   全部：npx perspective-skills --all`);
    return;
  }

  const results = [];
  for (const skill of selected) {
    const src = path.join(SKILLS_DIR, skill.slug);
    if (!exists(src)) {
      results.push({ slug: skill.slug, status: "missing-source", path: src });
      continue;
    }
    const dest = path.join(root, skill.name);
    const files = collect(src);
    if (exists(dest)) {
      if (!opts.force) {
        results.push({ slug: skill.slug, status: "exists", path: dest, files: files.length });
        continue;
      }
      if (!opts.dry) fs.rmSync(dest, { recursive: true, force: true });
    }
    if (!opts.dry) {
      for (const rel of files) {
        const target = path.join(dest, rel);
        fs.mkdirSync(path.dirname(target), { recursive: true });
        fs.copyFileSync(path.join(src, rel), target);
      }
    }
    results.push({ slug: skill.slug, status: opts.dry ? "planned" : "installed", path: dest, files: files.length });
  }

  if (opts.json) {
    console.log(JSON.stringify({ root, results }, null, 2));
    return;
  }

  const label = {
    installed: "✓ 已安装",
    planned: "· 预演",
    exists: "= 已存在（跳过）",
    "missing-source": "✗ 源缺失",
  };
  console.log(`Skill 目录：${root}\n`);
  for (const r of results) {
    console.log(`  ${(label[r.status] ?? r.status).padEnd(14)} ${r.slug}  (${r.files} 个文件)`);
  }
  const skipped = results.filter((r) => r.status === "exists").length;
  if (skipped > 0) console.log(`\n提示：${skipped} 个已存在，用 --force 覆盖。`);
  if (opts.dry) console.log("\n（--dry-run：未写入任何文件）");
}

main();

#!/usr/bin/env node
/**
 * zettaranc-perspective 的 npm 安装器。
 *
 * 只做一件事：把 Skill 文档复制到 agent 的 skills 目录。
 * 不下载行情数据，不依赖 zt，不修改宿主配置。
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..");
const NAME = "zettaranc-perspective";
const ITEMS = [
  "SKILL.md",
  "knowledge",
  "references",
  "skill.json",
  "test-prompts.json",
  "README.md",
  "INSTALL.md",
  "LICENSE",
];
const SKIP = new Set([".DS_Store", ".git", "node_modules", "__pycache__", ".venv"]);

const pkg = readJson(path.join(ROOT, "package.json")) || {};
const VERSION = pkg.version || "unknown";

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return null;
  }
}

function fail(message) {
  console.error(`错误：${message}`);
  process.exit(1);
}

function warn(message) {
  console.warn(`警告：${message}`);
}

function exists(p) {
  try {
    fs.lstatSync(p);
    return true;
  } catch {
    return false;
  }
}

function isInside(child, parent) {
  const rel = path.relative(parent, child);
  return rel === "" || (!rel.startsWith("..") && !path.isAbsolute(rel));
}

function walk(dir, base, out) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, base, out);
    else if (entry.isFile()) out.push(path.relative(base, full));
  }
}

function collect(root) {
  const out = [];
  for (const item of ITEMS) {
    const full = path.join(root, item);
    if (!exists(full)) continue;
    if (fs.statSync(full).isDirectory()) walk(full, root, out);
    else out.push(item);
  }
  return out.sort();
}

function formatSize(n) {
  return n < 1024 ? `${n} B` : `${(n / 1024).toFixed(1)} KB`;
}

function hasCommand(cmd) {
  const lookup = process.platform === "win32" ? "where" : "which";
  return spawnSync(lookup, [cmd], { stdio: "ignore" }).status === 0;
}

function usage() {
  console.log(`zettaranc-perspective ${VERSION}

把 Z 哥（zettaranc/万千）思维框架 Skill 安装到 agent 的 skills 目录。

用法：
  npx ${NAME} [选项]

选项：
  -g, --global        安装到 ~/.claude/skills（默认）
  -p, --project       安装到当前项目的 ./.claude/skills
      --dir <path>    安装到指定目录（精确路径，不会自动追加 skill 名）
  -f, --force         覆盖已有安装
      --dry-run       只打印将执行的操作，不写文件
      --list          列出将安装的文件
  -h, --help          显示帮助
  -v, --version       显示版本

示例：
  npx ${NAME}
  npx ${NAME} --project
  npx ${NAME} --dir ~/.cursor/skills/${NAME}
  npx ${NAME} --force`);
}

const opts = { mode: "global", dir: null, force: false, dry: false, list: false };
let modeSet = false;
const argv = process.argv.slice(2);

for (let i = 0; i < argv.length; i++) {
  const arg = argv[i];
  if (arg === "-h" || arg === "--help") {
    usage();
    process.exit(0);
  }
  if (arg === "-v" || arg === "--version") {
    console.log(VERSION);
    process.exit(0);
  }
  if (arg === "-g" || arg === "--global") {
    if (modeSet && opts.mode !== "global") fail("--global 与 --project 不能同时使用");
    opts.mode = "global";
    modeSet = true;
    continue;
  }
  if (arg === "-p" || arg === "--project") {
    if (modeSet && opts.mode !== "project") fail("--global 与 --project 不能同时使用");
    opts.mode = "project";
    modeSet = true;
    continue;
  }
  if (arg === "--dir") {
    const value = argv[++i];
    if (!value) fail("--dir 需要一个路径");
    opts.dir = value;
    continue;
  }
  if (arg === "-f" || arg === "--force") {
    opts.force = true;
    continue;
  }
  if (arg === "--dry-run") {
    opts.dry = true;
    continue;
  }
  if (arg === "--list") {
    opts.list = true;
    continue;
  }
  fail(`未知参数：${arg}\n\n运行 npx ${NAME} --help 查看用法。`);
}

if (opts.dir && modeSet) fail("--dir 不能与 --global/--project 同时使用");

const target = opts.dir
  ? path.resolve(opts.dir)
  : opts.mode === "project"
    ? path.resolve(process.cwd(), ".claude", "skills", NAME)
    : path.join(os.homedir(), ".claude", "skills", NAME);

if (!pkg.version) fail("包缺少 package.json 或 version");
const skill = readJson(path.join(ROOT, "skill.json"));
if (skill && skill.version && skill.version !== VERSION) {
  warn(`skill.json 版本 ${skill.version} 与包版本 ${VERSION} 不一致`);
}
const mdPath = path.join(ROOT, "SKILL.md");
if (!exists(mdPath)) fail("包内缺少 SKILL.md");
const head = fs.readFileSync(mdPath, "utf8").slice(0, 4096);
if (!head.includes(`name: ${NAME}`)) fail(`SKILL.md frontmatter 缺少 name: ${NAME}`);

if (isInside(target, ROOT) || isInside(ROOT, target)) {
  fail(`目标目录不能与 Skill 源目录重叠：${target}`);
}

const files = collect(ROOT);
if (!files.includes("SKILL.md")) fail("待安装文件里没有 SKILL.md");

if (opts.list) {
  console.log(`${NAME} ${VERSION} 将安装 ${files.length} 个文件到 ${target}\n`);
  for (const file of files) {
    console.log(`  ${file}  (${formatSize(fs.statSync(path.join(ROOT, file)).size)})`);
  }
  process.exit(0);
}

if (opts.dry) {
  console.log(`[dry-run] ${NAME} ${VERSION} → ${target}（${files.length} 个文件）`);
  process.exit(0);
}

const existed = exists(target);
if (existed) {
  if (!opts.force) {
    fail(`目标已存在：${target}\n  覆盖请加 --force；换个位置请用 --dir <path>。`);
  }
  if (fs.lstatSync(target).isSymbolicLink()) fs.unlinkSync(target);
  else fs.rmSync(target, { recursive: true, force: true });
}

fs.mkdirSync(target, { recursive: true });
for (const item of ITEMS) {
  const src = path.join(ROOT, item);
  if (!exists(src)) continue;
  fs.cpSync(src, path.join(target, item), {
    recursive: true,
    force: true,
    filter: (source) => !SKIP.has(path.basename(source)),
  });
}

const installed = collect(target);
console.log(`${NAME} ${VERSION} → ${target}`);
console.log(`${existed ? "已覆盖" : "已安装"} ${installed.length} 个文件。`);
console.log("");
console.log("下一步：重启 agent 会话，然后问「什么是少妇战法」。");
console.log(
  hasCommand("zt")
    ? "数据工具 zt：已检测到，可使用真实行情。"
    : "数据工具 zt：未检测到，Skill 将使用离线框架模式。"
);

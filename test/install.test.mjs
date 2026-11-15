import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const INSTALLER = path.join(ROOT, "bin", "install.mjs");
const CHECK_VERSION = path.join(ROOT, "scripts", "check-version.mjs");
const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8"));

function run(args, cwd = ROOT) {
  return spawnSync(process.execPath, [INSTALLER, ...args], { cwd, encoding: "utf8" });
}

function tempDir(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "zettaranc-perspective-"));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  return dir;
}

test("--version 输出 package 版本", () => {
  const result = run(["--version"]);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout.trim(), pkg.version);
});

test("--list 列出 Skill 文件但不写盘", (t) => {
  const dir = tempDir(t);
  const target = path.join(dir, "skill");
  const result = run(["--list", "--dir", target]);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /SKILL\.md/);
  assert.match(result.stdout, /knowledge\/trading-core\.md/);
  assert.match(result.stdout, /references\//);
  assert.ok(!fs.existsSync(target));
});

test("默认安装到指定目录并复制完整 Skill", (t) => {
  const target = path.join(tempDir(t), "skill");
  const result = run(["--dir", target]);
  assert.equal(result.status, 0, result.stderr);

  for (const file of ["SKILL.md", "skill.json", "LICENSE", "knowledge/trading-core.md"]) {
    assert.ok(fs.existsSync(path.join(target, file)), `缺少 ${file}`);
  }
  assert.ok(fs.existsSync(path.join(target, "references")));
  assert.ok(!fs.existsSync(path.join(target, "package.json")));
  assert.ok(!fs.existsSync(path.join(target, "bin")));
  assert.ok(!fs.existsSync(path.join(target, "node_modules")));
});

test("已有目标默认拒绝覆盖", (t) => {
  const target = path.join(tempDir(t), "skill");
  assert.equal(run(["--dir", target]).status, 0);

  const again = run(["--dir", target]);
  assert.equal(again.status, 1);
  assert.match(again.stderr, /--force/);
});

test("--force 覆盖已有安装", (t) => {
  const target = path.join(tempDir(t), "skill");
  assert.equal(run(["--dir", target]).status, 0);

  const skillMd = path.join(target, "SKILL.md");
  fs.writeFileSync(skillMd, "tampered");

  const result = run(["--dir", target, "--force"]);
  assert.equal(result.status, 0, result.stderr);
  const content = fs.readFileSync(skillMd, "utf8");
  assert.match(content, /name: zettaranc-perspective/);
  assert.doesNotMatch(content, /tampered/);
});

test("--dry-run 不创建目标目录", (t) => {
  const target = path.join(tempDir(t), "skill");
  const result = run(["--dir", target, "--dry-run"]);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /\[dry-run\]/);
  assert.ok(!fs.existsSync(target));
});

test("--project 安装到当前项目的 .claude/skills", (t) => {
  const project = tempDir(t);
  const result = run(["--project"], project);
  assert.equal(result.status, 0, result.stderr);
  assert.ok(
    fs.existsSync(path.join(project, ".claude", "skills", "zettaranc-perspective", "SKILL.md"))
  );
});

test("拒绝把 Skill 装进自身目录", (t) => {
  const nested = path.join(ROOT, `.tmp-install-${process.pid}`);
  t.after(() => fs.rmSync(nested, { recursive: true, force: true }));

  const result = run(["--dir", nested, "--force"]);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /重叠/);
  assert.ok(!fs.existsSync(nested));
});

test("check-version 校验三处版本一致", () => {
  const result = spawnSync(process.execPath, [CHECK_VERSION], {
    cwd: ROOT,
    encoding: "utf8",
  });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, new RegExp(pkg.version.replaceAll(".", "\\.")));
});

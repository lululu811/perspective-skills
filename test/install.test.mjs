import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CLI = path.join(ROOT, "bin", "install.mjs");

function run(args, cwd = ROOT) {
  return spawnSync(process.execPath, [CLI, ...args], { cwd, encoding: "utf8" });
}

function tmpdir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "perspective-skills-"));
}

test("--json 列出全部 skill", () => {
  const dir = tmpdir();
  const res = run(["--json", "--dir", dir]);
  assert.equal(res.status, 0, res.stderr);
  const out = JSON.parse(res.stdout);
  assert.equal(out.root, dir);
  assert.equal(out.skills.length, 10);
  assert.ok(out.skills.every((s) => s.installed === false));
  fs.rmSync(dir, { recursive: true, force: true });
});

test("安装单个 skill 时使用 SKILL.md 的 name 作为目录名", () => {
  const dir = tmpdir();
  const res = run(["mo-skill", "--dir", dir]);
  assert.equal(res.status, 0, res.stderr);
  assert.ok(fs.existsSync(path.join(dir, "boss-mo-perspective", "SKILL.md")));
  fs.rmSync(dir, { recursive: true, force: true });
});

test("重复安装默认跳过，--force 覆盖", () => {
  const dir = tmpdir();
  assert.equal(run(["albrooks-perspective", "--dir", dir]).status, 0);
  const second = run(["albrooks-perspective", "--json", "--dir", dir]);
  assert.equal(JSON.parse(second.stdout).results[0].status, "exists");
  const forced = run(["albrooks-perspective", "--json", "--dir", dir, "--force"]);
  assert.equal(JSON.parse(forced.stdout).results[0].status, "installed");
  fs.rmSync(dir, { recursive: true, force: true });
});

test("--dry-run 不写文件", () => {
  const dir = tmpdir();
  const res = run(["sanxian-skill", "--dir", dir, "--dry-run"]);
  assert.equal(res.status, 0, res.stderr);
  assert.deepEqual(fs.readdirSync(dir), []);
  fs.rmSync(dir, { recursive: true, force: true });
});

test("未知 skill 报错退出", () => {
  const res = run(["not-a-skill", "--dir", tmpdir()]);
  assert.notEqual(res.status, 0);
  assert.match(res.stderr, /未知的 Skill/);
});

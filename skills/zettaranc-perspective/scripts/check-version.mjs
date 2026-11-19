#!/usr/bin/env node
/** 校验 package.json / skill.json / SKILL.md 三处版本一致，并检查 npm 包必要文件。 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const NAME = "zettaranc-perspective";

function fail(message) {
  console.error(`错误：${message}`);
  process.exit(1);
}

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (error) {
    fail(`无法读取 ${path.relative(ROOT, file)}：${error.message}`);
  }
}

const pkg = readJson(path.join(ROOT, "package.json"));
const skill = readJson(path.join(ROOT, "skill.json"));
const skillMd = fs.readFileSync(path.join(ROOT, "SKILL.md"), "utf8");

const mdVersion = skillMd.match(/\*\*版本\*\*：\s*([0-9]+\.[0-9]+\.[0-9]+)/)?.[1];
if (!mdVersion) fail("SKILL.md 未找到 **版本**：x.y.z");

const versions = {
  "package.json": pkg.version,
  "skill.json": skill.version,
  "SKILL.md": mdVersion,
};
const unique = new Set(Object.values(versions));
if (unique.size !== 1) {
  fail(
    "版本不一致：\n" +
      Object.entries(versions)
        .map(([file, version]) => `  ${file}: ${version}`)
        .join("\n")
  );
}

if (pkg.name !== NAME) fail(`package.json name 应为 ${NAME}，实际为 ${pkg.name}`);
if (skill.name !== NAME) fail(`skill.json name 应为 ${NAME}，实际为 ${skill.name}`);

const required = ["SKILL.md", "knowledge/", "references/", "skill.json"];
const missing = required.filter((item) => !(pkg.files || []).includes(item));
if (missing.length > 0) fail(`package.json files 缺少：${missing.join(", ")}`);

const bin = pkg.bin?.[NAME];
if (!bin) fail(`package.json 缺少 bin.${NAME}`);
const binPath = path.join(ROOT, bin);
if (!fs.existsSync(binPath)) fail(`bin 文件不存在：${bin}`);
if (!fs.readFileSync(binPath, "utf8").startsWith("#!/usr/bin/env node")) {
  fail(`bin 文件缺少 shebang：${bin}`);
}

console.log(`版本一致：${pkg.version}`);

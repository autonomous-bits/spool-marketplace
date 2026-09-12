import { readFile, readdir, stat } from "node:fs/promises";
import { resolve } from "node:path";

const repositoryRoot = resolve(import.meta.dirname, "../..");
const marketplacePath = resolve(repositoryRoot, ".github/plugin/marketplace.json");
const marketplace = JSON.parse(await readFile(marketplacePath, "utf8"));

if (!marketplace.name || !Array.isArray(marketplace.plugins) || marketplace.plugins.length === 0) {
  throw new Error("marketplace.json must declare a marketplace name and at least one plugin.");
}

for (const entry of marketplace.plugins) {
  if (!entry.name || !entry.version || !entry.description || typeof entry.source !== "string") {
    throw new Error(`Plugin entries must include name, version, description, and string source: ${JSON.stringify(entry)}`);
  }

  const pluginRoot = resolve(repositoryRoot, entry.source);
  const manifestPath = resolve(pluginRoot, "plugin.json");
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));

  if (manifest.name !== entry.name || manifest.version !== entry.version) {
    throw new Error(`Catalog entry and manifest must have matching name and version for ${entry.name}.`);
  }

  const skillsPath = resolve(pluginRoot, "skills");
  const skills = await readdir(skillsPath, { withFileTypes: true });
  const skillDirectories = skills.filter((skill) => skill.isDirectory());

  if (skillDirectories.length === 0) {
    throw new Error(`${entry.name} must provide at least one skill.`);
  }

  for (const skill of skillDirectories) {
    const skillPath = resolve(skillsPath, skill.name, "SKILL.md");
    const skillFile = await stat(skillPath).catch(() => undefined);
    if (!skillFile?.isFile()) {
      throw new Error(`Skill ${skill.name} in ${entry.name} must contain SKILL.md.`);
    }
  }
}

console.log(`Validated ${marketplace.plugins.length} plugin(s) in ${marketplace.name}.`);

/**
 * Validate all authored data before build.
 * Run via `bun run validate` (also runs automatically as `prebuild`).
 */
import { readdirSync, readFileSync } from "node:fs";
import matter from "gray-matter";
import { postSchema } from "../src/schemas/post.js";
import { metadataSchema } from "../src/schemas/metadata.js";
import { navigationSchema } from "../src/schemas/navigation.js";

let failures = 0;

function check(label, schema, data) {
  const result = schema.safeParse(data);
  if (result.success) {
    console.log(`✅ ${label}`);
  } else {
    failures++;
    console.error(`❌ ${label}`);
    for (const issue of result.error.issues) {
      console.error(`   - ${issue.path.join(".") || "(root)"}: ${issue.message}`);
    }
  }
}

/* JSON data files */
const readJson = (p) => JSON.parse(readFileSync(new URL(p, import.meta.url), "utf8"));
check("metadata.json", metadataSchema, readJson("../src/_data/metadata.json"));
check("navigation.json", navigationSchema, readJson("../src/_data/navigation.json"));

/* Post front matter */
const postsDir = new URL("../src/posts/", import.meta.url);
const postFiles = readdirSync(postsDir).filter((f) => f.endsWith(".md"));
for (const file of postFiles) {
  const raw = readFileSync(new URL(file, postsDir), "utf8");
  const { data } = matter(raw);
  check(`posts/${file}`, postSchema, data);
}

if (failures > 0) {
  console.error(`\n❌ Validation failed: ${failures} file(s) invalid.`);
  process.exit(1);
}
console.log(`\n✅ All data valid (${postFiles.length} posts + 2 data files).`);

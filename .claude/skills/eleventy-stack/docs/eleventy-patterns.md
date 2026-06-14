# Eleventy Patterns — Config, Data Pipeline, Structure

Complete file templates and configuration examples for the 11ty MVP stack. Official reference: https://github.com/11ty/eleventy/

## Project Structure

```
project/
├── .eleventy.js              # Eleventy config (CommonJS or ESM)
├── package.json
├── tailwind.config.js        # optional in Tailwind 4 (theme via CSS)
├── tooling/
│   └── theme.css             # shared OKLCH @theme directive
├── scripts/
│   ├── validate.js           # Zod validation of authored data
│   └── generate.js           # transform authored → derived data
├── src/
│   ├── _data/                # global data (JSON authored + derived)
│   ├── _includes/
│   │   ├── layouts/          # base.njk, post.njk
│   │   ├── components/       # card.njk, nav.njk
│   │   └── macros/           # forms.njk, ui.njk
│   ├── schemas/              # Zod schemas mirroring _data files
│   ├── css/
│   │   └── main.css          # Tailwind entry, imports theme
│   ├── js/                   # client vanilla JS (passthrough)
│   ├── assets/               # images/fonts (passthrough)
│   └── index.njk
└── _site/                    # build output (gitignored)
```

## package.json

```json
{
  "type": "module",
  "scripts": {
    "validate": "bun run scripts/validate.js",
    "generate": "bun run scripts/generate.js",
    "prebuild": "bun run validate && bun run generate",
    "build:css": "bunx @tailwindcss/cli -i src/css/main.css -o _site/css/main.css --minify",
    "build:11ty": "bunx @11ty/eleventy",
    "build": "bun run build:css && bun run build:11ty",
    "watch:css": "bunx @tailwindcss/cli -i src/css/main.css -o _site/css/main.css --watch",
    "dev": "bun run prebuild && (bun run watch:css & bunx @11ty/eleventy --serve)"
  },
  "devDependencies": {
    "@11ty/eleventy": "^3.0.0",
    "@tailwindcss/cli": "^4.0.0",
    "@tailwindcss/typography": "^0.5.0",
    "zod": "^4.0.0"
  }
}
```

Run all scripts with **Bun**, never Node.

## .eleventy.js

```js
export default function (eleventyConfig) {
  // Passthrough — NOT src/css (Tailwind CLI handles it)
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/assets");

  // Global env data
  eleventyConfig.addGlobalData("env", process.env.ELEVENTY_ENV || "development");

  // Custom filters
  eleventyConfig.addFilter("formatMinutes", (mins) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h ? `${h}h ${m}m` : `${m}m`;
  });
  eleventyConfig.addFilter("json", (value) => JSON.stringify(value));

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    // Default everything to Nunjucks
    templateFormats: ["njk", "md", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
```

## Data Pipeline

### 1. Authored data — `src/_data/recipes.json`

```json
[
  { "slug": "tomato-soup", "title": "Tomato Soup", "minutes": 25, "tags": ["soup", "vegan"] }
]
```

### 2. Zod schema — `src/schemas/recipes.js`

Schemas mirror the data file structure exactly.

```js
import { z } from "zod";

export const recipeSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/, "must be kebab-case"),
  title: z.string().min(1),
  minutes: z.number().int().positive(),
  tags: z.array(z.string()),
});

export const recipesSchema = z.array(recipeSchema);
```

### 3. Validation — `scripts/validate.js`

```js
import { recipesSchema } from "../src/schemas/recipes.js";
import recipes from "../src/_data/recipes.json" with { type: "json" };

const result = recipesSchema.safeParse(recipes);
if (!result.success) {
  console.error("❌ recipes.json validation failed:");
  console.error(result.error.format());
  process.exit(1);
}
console.log(`✅ ${recipes.length} recipes valid`);
```

### 4. Generation — `scripts/generate.js`

Derived data is **generated**, never hand-written into `_data/`.

```js
import recipes from "../src/_data/recipes.json" with { type: "json" };

// Build a derived tag index
const byTag = {};
for (const r of recipes) {
  for (const tag of r.tags) {
    (byTag[tag] ??= []).push(r.slug);
  }
}

await Bun.write(
  "src/_data/recipesByTag.json",
  JSON.stringify(byTag, null, 2),
);
console.log(`✅ generated recipesByTag.json (${Object.keys(byTag).length} tags)`);
```

### 5. Client runtime — `src/js/app.js`

Vanilla JS. Hydrate from data injected into `window.*` by a template.

```js
const recipes = window.__RECIPES__ ?? [];
document.querySelector("#search")?.addEventListener("input", (e) => {
  const q = e.target.value.toLowerCase();
  // filter & re-render...
});
```

## Tailwind CSS 4 Setup

### `tooling/theme.css` — shared OKLCH theme

```css
@theme {
  --color-bg: oklch(98% 0.01 250);
  --color-fg: oklch(20% 0.02 250);
  --color-accent: oklch(65% 0.18 250);
}

[data-theme="dark"] {
  --color-bg: oklch(20% 0.02 250);
  --color-fg: oklch(95% 0.01 250);
}
```

### `src/css/main.css` — entry point

```css
@import "tailwindcss";
@import "../../tooling/theme.css";
@plugin "@tailwindcss/typography";

@variant dark (&:where([data-theme="dark"] *));
```

Tailwind 4 reads config from CSS — `tailwind.config.js` is optional and usually unnecessary.

## GitHub Pages Deployment — `.github/workflows/deploy.yml`

```yaml
name: Deploy
on:
  push:
    branches: [main]
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
      - run: bun install
      - run: bun run validate
      - run: bun run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: _site
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
    steps:
      - uses: actions/deploy-pages@v4
```

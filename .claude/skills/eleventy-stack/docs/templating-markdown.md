# Templating & Markdown — Nunjucks + markdown-it

Nunjucks templating patterns, macros, and Markdown configuration for the 11ty MVP stack. Official reference: https://github.com/11ty/eleventy/ and https://mozilla.github.io/nunjucks/

## Layouts

### `src/_includes/layouts/base.njk`

```njk
<!doctype html>
<html lang="en" data-theme="light">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{{ title or "Site" }}</title>
    <link rel="stylesheet" href="/css/main.css" />
  </head>
  <body class="bg-bg text-fg">
    {% include "components/nav.njk" %}
    <main class="mx-auto max-w-3xl px-4 py-8">
      {{ content | safe }}
    </main>
    <script type="module" src="/js/app.js"></script>
  </body>
</html>
```

### Layout chaining — `src/_includes/layouts/post.njk`

```njk
---
layout: layouts/base.njk
---
<article class="prose dark:prose-invert">
  <h1>{{ title }}</h1>
  {{ content | safe }}
</article>
```

A Markdown file then sets `layout: layouts/post.njk` in its front matter and its rendered HTML flows into `{{ content }}`.

## Front Matter

Every content page uses YAML front matter for page-level data:

```njk
---
layout: layouts/post.njk
title: Hello World
date: 2026-01-15
tags: [blog]
---
Page body here.
```

Page-level metadata belongs in front matter. **Shared content** (lists, collections of items) belongs in `src/_data/` JSON, never inline in templates.

## Components (partials)

`src/_includes/components/nav.njk`:

```njk
<nav class="flex gap-4 border-b border-fg/10 px-4 py-3">
  <a href="/" class="font-semibold">Home</a>
  <a href="/recipes/">Recipes</a>
</nav>
```

Include with `{% include "components/nav.njk" %}`.

## Macros — reusable parametric markup

`src/_includes/macros/ui.njk`:

```njk
{% macro card(title, href, meta) %}
<a href="{{ href }}" class="block rounded-lg border border-fg/10 p-4 hover:border-accent">
  <h3 class="font-medium">{{ title }}</h3>
  {% if meta %}<p class="text-sm text-fg/60">{{ meta }}</p>{% endif %}
</a>
{% endmacro %}
```

Use macros instead of `include` when the partial needs parameters:

```njk
{% from "macros/ui.njk" import card %}
{% for r in recipes %}
  {{ card(r.title, "/recipes/" + r.slug + "/", r.minutes | formatMinutes) }}
{% endfor %}
```

Rule of thumb: **`include`** for static partials, **`macro`** for parametric / repeated markup.

## Looping over data

Global data files in `src/_data/recipes.json` are available by filename (`recipes`):

```njk
<ul>
{% for r in recipes %}
  <li>{{ r.title }} — {{ r.minutes | formatMinutes }}</li>
{% endfor %}
</ul>
```

## Pagination (generating pages from data)

`src/recipes.njk` — one page per recipe:

```njk
---
pagination:
  data: recipes
  size: 1
  alias: recipe
permalink: "/recipes/{{ recipe.slug }}/"
layout: layouts/post.njk
eleventyComputed:
  title: "{{ recipe.title }}"
---
<p>Cooks in {{ recipe.minutes | formatMinutes }}.</p>
```

## Injecting data into client JS

To hand data to vanilla JS, serialize it into a script tag with the `json` filter:

```njk
<script>
  window.__RECIPES__ = {{ recipes | json | safe }};
</script>
```

## Collections (tags)

Pages with `tags: [blog]` in front matter join the `blog` collection:

```njk
{% for post in collections.blog | reverse %}
  <a href="{{ post.url }}">{{ post.data.title }}</a>
{% endfor %}
```

## Markdown Configuration

11ty 3.x bundles **markdown-it**. Customize it in `.eleventy.js` to add IDs, anchors, or syntax highlighting.

```js
import markdownIt from "markdown-it";
import markdownItAnchor from "markdown-it-anchor";
import { full as emoji } from "markdown-it-emoji";

export default function (eleventyConfig) {
  const md = markdownIt({ html: true, linkify: true, typographer: true })
    .use(markdownItAnchor, { permalink: markdownItAnchor.permalink.headerLink() })
    .use(emoji);

  eleventyConfig.setLibrary("md", md);

  // ... rest of config (see eleventy-patterns.md)
}
```

### Syntax highlighting

Use the official plugin rather than a custom markdown-it highlighter:

```js
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";

eleventyConfig.addPlugin(syntaxHighlight);
```

Install with `bun add -d @11ty/eleventy-plugin-syntaxhighlight markdown-it-anchor markdown-it-emoji`.

### Prose styling

Wrap rendered Markdown in Tailwind Typography's `prose` class (configured via `@plugin "@tailwindcss/typography"` in `main.css`):

```njk
<article class="prose dark:prose-invert max-w-none">
  {{ content | safe }}
</article>
```

## Nunjucks gotchas

- Use `| safe` when outputting trusted HTML (rendered Markdown, JSON for scripts) — Nunjucks auto-escapes by default.
- String concatenation uses `+`: `"/recipes/" + r.slug + "/"`.
- `{% set x = ... %}` for local variables; `eleventyComputed` in front matter for per-page computed data.
- Whitespace control: `{%-` and `-%}` trim surrounding whitespace.

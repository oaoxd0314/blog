# Design Token System — Tailwind CSS v4 (OKLCH)

Personal tech blog / Eleventy static site.

---

## 1. Rationale

### What was extracted from 1wei.dev

A single-column, restrained layout with generous outer padding and a narrow reading column (~600px / ~65ch). No decorative chrome. The nav is lightweight and fixed. Typography hierarchy is functional — headings differ clearly in weight and size but avoid theatrics. Code blocks use a dark surface with subtle contrast for tokens, never garish. The overall discipline is: let content breathe, do not compete with it.

### What was extracted from the Figma blog post

An editorial rhythm that treats spacing as punctuation. Display headings at ~48–56px with tight line-height (~1.15) contrasted against body at ~18–20px with generous line-height (~1.75). Section breaks are spacious (60–80px gaps). Pull quotes get isolated breathing room. Color is almost entirely neutral — text is dark charcoal, not pure black. Illustration or accent color appears sparingly, which means the accent color carries real weight when it does appear. This is the "taste" being cultivated: every element earns its place.

### Color anchors from the existing project

The existing palette orbits a strong amber-yellow primary (`#f9c412`), a near-black dark (`#181818`), and a white light background (`#fff`). Secondary UI surfaces use dark code backgrounds (`#2d2d2d`, `#3a3a3a`). Border grays range from `#ccc` through `#595959`. The Prism syntax theme uses `#e2777a` (rose/error), `#7ec699` (green/string), `#f8c555` (yellow/constant), `#cc99cd` (purple/keyword), `#67cdcc` (teal/operator). These are retained as syntax tokens.

### Taste decisions made

- The primary yellow is distinctive and should be kept but slightly warmed and muted in OKLCH to avoid rawness (`oklch(82% 0.16 85)` rather than the fully saturated original).
- Body type: Inter (already shipped as a variable font). No need to load anything extra.
- Mono font: `ui-monospace, 'Cascadia Code', 'Fira Code', Consolas, monospace` — system-first for zero extra load.
- Type scale: Minor Third (1.25x) ratio anchored at 1rem base. This gives a readable, restrained scale that doesn't sprawl.
- Reading measure: capped at `65ch` for prose content, matching best practices from both references.
- Line-height for body: 1.75 — matches the Figma editorial rhythm.
- Heading line-height: tightens as size grows (1.15 at display, 1.3 at h2).
- Radius: a gentle, consistent scale — not sharp, not bubbly. Code blocks use a slightly larger radius than inline elements.

---

## 2. `tooling/theme.css` — Complete Tailwind v4 `@theme` Block

```css
/* ============================================================
   tooling/theme.css
   Tailwind CSS v4 design tokens — @theme directive
   Color space: OKLCH (perceptually uniform, P3-wide-gamut)
   ============================================================ */

@import "tailwindcss";

/* ── Light theme (default) ────────────────────────────────── */
@theme {

  /* --- Font Families ---------------------------------------- */
  --font-sans:   "Inter UI", ui-sans-serif, system-ui, -apple-system, sans-serif;
  --font-mono:   ui-monospace, "Cascadia Code", "Fira Code", Consolas,
                 "Andale Mono", "Ubuntu Mono", monospace;

  /* --- Type Scale (Minor Third × 1.25, base = 1rem / 16px) --
     Step  Ratio   rem    px (approx)
     -1    ÷1.25   0.8    12.8
      0    ×1.00   1.0    16      ← base body
     +1    ×1.25   1.25   20
     +2    ×1.563  1.563  25
     +3    ×1.953  1.953  31.25
     +4    ×2.441  2.441  39
     +5    ×3.052  3.052  48.8    ← display / hero
  ----------------------------------------------------------- */
  --text-xs:   0.8rem;     /* 12.8px — meta, tags, captions  */
  --text-sm:   0.875rem;   /* 14px   — nav, secondary labels */
  --text-base: 1rem;       /* 16px   — body prose            */
  --text-md:   1.125rem;   /* 18px   — lead / intro para     */
  --text-lg:   1.25rem;    /* 20px   — h4 / small section    */
  --text-xl:   1.563rem;   /* 25px   — h3                    */
  --text-2xl:  1.953rem;   /* 31px   — h2                    */
  --text-3xl:  2.441rem;   /* 39px   — h1 post title         */
  --text-4xl:  3.052rem;   /* 49px   — display / hero        */

  /* --- Line Heights ----------------------------------------- */
  --leading-tight:   1.15;   /* display headings               */
  --leading-snug:    1.3;    /* h2 / h3                        */
  --leading-normal:  1.5;    /* h4 / nav / compact text        */
  --leading-relaxed: 1.65;   /* subheadings / list items       */
  --leading-loose:   1.75;   /* body prose — editorial rhythm  */

  /* --- Letter Spacing --------------------------------------- */
  --tracking-tight:  -0.02em;  /* display headings             */
  --tracking-snug:   -0.01em;  /* h2 / h3                      */
  --tracking-normal:  0em;     /* body                         */
  --tracking-wide:    0.04em;  /* ALL-CAPS labels, tags        */

  /* --- Spacing (8px grid base) ------------------------------ */
  --spacing-0:   0;
  --spacing-1:   0.25rem;   /*  4px */
  --spacing-2:   0.5rem;    /*  8px */
  --spacing-3:   0.75rem;   /* 12px */
  --spacing-4:   1rem;      /* 16px */
  --spacing-5:   1.25rem;   /* 20px */
  --spacing-6:   1.5rem;    /* 24px */
  --spacing-8:   2rem;      /* 32px */
  --spacing-10:  2.5rem;    /* 40px */
  --spacing-12:  3rem;      /* 48px */
  --spacing-16:  4rem;      /* 64px */
  --spacing-20:  5rem;      /* 80px */
  --spacing-24:  6rem;      /* 96px */

  /* --- Border Radius ---------------------------------------- */
  --radius-none:  0;
  --radius-sm:    0.25rem;   /*  4px — tags, badges            */
  --radius-md:    0.375rem;  /*  6px — inline code             */
  --radius-lg:    0.5rem;    /*  8px — code blocks, cards      */
  --radius-xl:    0.75rem;   /* 12px — modal, large surfaces   */
  --radius-full:  9999px;    /* pill shapes                    */

  /* --- Reading Measure -------------------------------------- */
  --prose-width:  65ch;      /* optimal reading line length    */
  --content-max:  70rem;     /* max-width for wide layouts     */

  /* ── Color Palette (OKLCH) ──────────────────────────────────
     Primary source:  #f9c412 → oklch(82% 0.163 85)
     Near-black:      #181818 → oklch(14% 0.000 0)
     Code dark:       #2d2d2d → oklch(24% 0.000 0)
     Border gray:     #ccc    → oklch(83% 0.000 0)
  ─────────────────────────────────────────────────────────── */

  /* Background layers */
  --color-bg:        oklch(99% 0.000  0);    /* #fff equiv — page bg     */
  --color-surface:   oklch(97% 0.003 85);    /* warm near-white — cards  */
  --color-surface-2: oklch(95% 0.006 85);    /* slightly deeper surface  */
  --color-overlay:   oklch(14% 0.000  0 / 0.75); /* dark overlay / footer */

  /* Foreground / text */
  --color-fg:        oklch(16% 0.000  0);    /* #181818 — primary text   */
  --color-fg-muted:  oklch(42% 0.000  0);    /* #595959 — secondary text */
  --color-fg-subtle: oklch(54% 0.000  0);    /* #767676 — tertiary / meta */
  --color-fg-inverse:oklch(96% 0.000  0);    /* #eee — text on dark bg   */

  /* Borders */
  --color-border:      oklch(87% 0.000  0);  /* #ccc  — default border   */
  --color-border-muted:oklch(93% 0.000  0);  /* #eee  — subtle divider   */
  --color-border-strong:oklch(67% 0.000  0); /* #aaa  — stronger border  */

  /* Accent — amber yellow, the brand anchor */
  --color-accent:       oklch(82% 0.163 85); /* #f9c412 — primary accent */
  --color-accent-hover: oklch(75% 0.155 80); /* #e7bf60 equiv — hover    */
  --color-accent-active:oklch(68% 0.148 75); /* #ba9005 equiv — pressed  */
  --color-accent-muted: oklch(95% 0.058 85); /* very light amber — bg    */

  /* Code surfaces */
  --color-code-bg:  oklch(24% 0.000  0);    /* #2d2d2d — block bg       */
  --color-code-surface: oklch(28% 0.000  0);/* #3a3a3a — elevated layer */
  --color-code-fg:  oklch(81% 0.000  0);    /* #ccc    — base code text */
  --color-code-border: oklch(32% 0.000  0); /* subtle code block border */

  /* Inline code */
  --color-inline-bg:   oklch(24% 0.000  0); /* same dark bg             */
  --color-inline-fg:   oklch(70% 0.120 15); /* #e2777a rose — orig hue  */

  /* Semantic / status (for future use, anchored to brand hues) */
  --color-success: oklch(69% 0.130 150);    /* #7ec699 green            */
  --color-warning: oklch(82% 0.163 85);     /* reuse accent             */
  --color-info:    oklch(64% 0.100 225);    /* #67cdcc teal             */
  --color-error:   oklch(70% 0.120 15);     /* #e2777a rose             */

  /* Syntax token palette (Prism theme — for reference / override) */
  --syntax-comment:   oklch(65% 0.000  0);  /* #999  */
  --syntax-tag:       oklch(70% 0.120 15);  /* #e2777a rose  */
  --syntax-fn:        oklch(58% 0.090 245); /* #6196cc blue  */
  --syntax-number:    oklch(71% 0.130 55);  /* #f08d49 orange */
  --syntax-constant:  oklch(83% 0.130 80);  /* #f8c555 yellow */
  --syntax-keyword:   oklch(72% 0.090 310); /* #cc99cd purple */
  --syntax-string:    oklch(73% 0.110 155); /* #7ec699 green  */
  --syntax-operator:  oklch(75% 0.090 195); /* #67cdcc teal   */
}

/* ── Dark theme override ─────────────────────────────────────
   Applied via [data-theme="dark"] on <html> or <body>.
   Flip surfaces and foregrounds; keep accent and syntax tokens.
─────────────────────────────────────────────────────────── */
[data-theme="dark"] {
  --color-bg:          oklch(14% 0.000  0);  /* #181818 — dark page bg   */
  --color-surface:     oklch(20% 0.000  0);  /* #2d2d2d equiv            */
  --color-surface-2:   oklch(24% 0.000  0);  /* elevated surface         */
  --color-overlay:     oklch(96% 0.000  0 / 0.08); /* light overlay      */

  --color-fg:          oklch(93% 0.000  0);  /* #eee — primary text      */
  --color-fg-muted:    oklch(75% 0.000  0);  /* medium-light muted       */
  --color-fg-subtle:   oklch(58% 0.000  0);  /* subtle / tertiary        */
  --color-fg-inverse:  oklch(16% 0.000  0);  /* dark text on light elem  */

  --color-border:        oklch(32% 0.000  0); /* #595959 — dark borders  */
  --color-border-muted:  oklch(24% 0.000  0); /* very subtle             */
  --color-border-strong: oklch(45% 0.000  0); /* stronger dark border    */

  /* Accent stays the same — yellow reads well on dark */
  --color-accent:       oklch(82% 0.163 85);
  --color-accent-hover: oklch(87% 0.155 85);  /* slightly brighter hover */
  --color-accent-muted: oklch(25% 0.040 85);  /* dark amber muted bg     */

  /* Code surfaces become slightly elevated from base */
  --color-code-bg:      oklch(18% 0.000  0);
  --color-code-surface: oklch(24% 0.000  0);
  --color-code-border:  oklch(30% 0.000  0);

  --color-inline-bg:    oklch(24% 0.000  0);
}
```

---

## 3. Prose / Markdown Treatment

### Recommended approach: Custom `@layer components` (no @tailwindcss/typography dependency)

This is the right call for an Eleventy static blog: you own the markup, the Prism syntax highlighting is already wired, and the existing SCSS already proves a hand-rolled approach works. Using the `@tailwindcss/typography` plugin would add a dependency and require working around many of its opinionated defaults. Instead, scope all prose styles to `.prose` (or `article.post`) using Tailwind v4's `@layer components`.

```css
/* ============================================================
   Prose / Markdown layer
   Place this below the @theme block in tooling/theme.css,
   or import it as a separate file.
   Scope: .prose (apply this class to <article> in templates)
   ============================================================ */

@layer components {

  /* ── Container ─────────────────────────────────────────── */
  .prose {
    max-width: var(--prose-width);       /* 65ch reading measure        */
    margin-inline: auto;
    font-family: var(--font-sans);
    font-size: var(--text-base);         /* 16px                        */
    line-height: var(--leading-loose);   /* 1.75 — editorial rhythm     */
    color: var(--color-fg);
  }

  /* ── Headings ──────────────────────────────────────────── */
  .prose h1 {
    font-size: var(--text-3xl);          /* 39px                        */
    line-height: var(--leading-tight);   /* 1.15 — tight display        */
    letter-spacing: var(--tracking-tight);
    font-weight: 700;
    margin-top: var(--spacing-12);
    margin-bottom: var(--spacing-6);
    color: var(--color-fg);
  }

  .prose h2 {
    font-size: var(--text-2xl);          /* 31px                        */
    line-height: var(--leading-snug);    /* 1.3                         */
    letter-spacing: var(--tracking-snug);
    font-weight: 700;
    margin-top: var(--spacing-12);
    margin-bottom: var(--spacing-4);
    padding-bottom: var(--spacing-2);
    border-bottom: 1px solid var(--color-border-muted);
    color: var(--color-fg);
  }

  .prose h3 {
    font-size: var(--text-xl);           /* 25px                        */
    line-height: var(--leading-snug);
    letter-spacing: var(--tracking-snug);
    font-weight: 600;
    margin-top: var(--spacing-10);
    margin-bottom: var(--spacing-3);
    color: var(--color-fg);
  }

  .prose h4 {
    font-size: var(--text-lg);           /* 20px                        */
    line-height: var(--leading-normal);
    font-weight: 600;
    margin-top: var(--spacing-8);
    margin-bottom: var(--spacing-2);
    color: var(--color-fg-muted);        /* slightly recessed vs h3     */
  }

  /* First heading in prose gets no top margin */
  .prose > :first-child {
    margin-top: 0;
  }

  /* ── Paragraphs ────────────────────────────────────────── */
  .prose p {
    margin-top: 0;
    margin-bottom: var(--spacing-5);     /* 20px between paragraphs     */
    hanging-punctuation: first last;
  }

  .prose p.lead {
    font-size: var(--text-md);           /* 18px — intro paragraph      */
    line-height: var(--leading-relaxed);
    color: var(--color-fg-muted);
    margin-bottom: var(--spacing-8);
  }

  /* ── Links ─────────────────────────────────────────────── */
  .prose a {
    color: var(--color-fg);
    text-decoration: underline;
    text-decoration-color: var(--color-accent);
    text-underline-offset: 3px;
    text-decoration-thickness: 2px;
    transition: color 150ms ease, text-decoration-color 150ms ease;
  }

  .prose a:hover {
    color: var(--color-accent-hover);
    text-decoration-color: var(--color-accent-hover);
  }

  /* ── Lists ─────────────────────────────────────────────── */
  .prose ul,
  .prose ol {
    margin-top: 0;
    margin-bottom: var(--spacing-5);
    padding-left: var(--spacing-6);
  }

  .prose ul {
    list-style-type: disc;
  }

  .prose ol {
    list-style-type: decimal;
  }

  .prose li {
    margin-bottom: var(--spacing-2);
    line-height: var(--leading-relaxed);
  }

  .prose li > ul,
  .prose li > ol {
    margin-top: var(--spacing-2);
    margin-bottom: 0;
  }

  /* ── Blockquote ────────────────────────────────────────── */
  .prose blockquote {
    margin-inline: 0;
    margin-block: var(--spacing-8);
    padding-inline: var(--spacing-6);
    padding-block: var(--spacing-3);
    border-left: 3px solid var(--color-accent);
    background-color: var(--color-accent-muted);
    border-radius: 0 var(--radius-md) var(--radius-md) 0;
    color: var(--color-fg-muted);
    font-style: italic;
  }

  .prose blockquote p {
    margin-bottom: 0;
  }

  .prose blockquote p + p {
    margin-top: var(--spacing-3);
  }

  /* ── Inline Code ───────────────────────────────────────── */
  .prose :not(pre) > code {
    font-family: var(--font-mono);
    font-size: 0.875em;               /* 87.5% of surrounding text     */
    font-style: normal;
    color: var(--color-inline-fg);
    background-color: var(--color-inline-bg);
    padding: 0.15em 0.4em;
    border-radius: var(--radius-md);  /* 6px                           */
    border: 1px solid var(--color-code-border);
    word-break: break-word;
  }

  /* ── Code Blocks (pre) ─────────────────────────────────── */
  .prose pre {
    font-family: var(--font-mono);
    font-size: var(--text-sm);        /* 14px — one step below body    */
    line-height: 1.6;
    color: var(--color-code-fg);
    background-color: var(--color-code-bg);
    border: 1px solid var(--color-code-border);
    border-radius: var(--radius-lg);  /* 8px                           */
    padding: var(--spacing-5) var(--spacing-6);
    margin-block: var(--spacing-6);
    overflow-x: auto;
    tab-size: 2;
    /* Negative margin to break out of prose max-width slightly */
    margin-inline: calc(var(--spacing-4) * -1);
  }

  /* On narrow screens, full bleed */
  @media (max-width: 640px) {
    .prose pre {
      border-radius: 0;
      margin-inline: calc(var(--spacing-6) * -1);
    }
  }

  .prose pre code {
    /* Reset inline code styles inside pre blocks */
    background: none;
    border: none;
    padding: 0;
    font-size: inherit;
    color: inherit;
    border-radius: 0;
  }

  /* ── Horizontal Rule ───────────────────────────────────── */
  .prose hr {
    border: none;
    border-top: 1px solid var(--color-border);
    margin-block: var(--spacing-10);
  }

  /* ── Images ────────────────────────────────────────────── */
  .prose img {
    max-width: 100%;
    height: auto;
    border-radius: var(--radius-lg);
    margin-block: var(--spacing-8);
    display: block;
  }

  .prose figure {
    margin-inline: 0;
    margin-block: var(--spacing-8);
  }

  .prose figcaption {
    font-size: var(--text-xs);
    color: var(--color-fg-subtle);
    text-align: center;
    margin-top: var(--spacing-2);
  }

  /* ── Tables ────────────────────────────────────────────── */
  .prose table {
    width: 100%;
    border-collapse: collapse;
    font-size: var(--text-sm);
    margin-block: var(--spacing-6);
  }

  .prose th {
    text-align: left;
    font-weight: 600;
    padding: var(--spacing-2) var(--spacing-4);
    border-bottom: 2px solid var(--color-border-strong);
    color: var(--color-fg-muted);
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
    font-size: var(--text-xs);
  }

  .prose td {
    padding: var(--spacing-2) var(--spacing-4);
    border-bottom: 1px solid var(--color-border-muted);
  }

  /* ── Mark / Highlight ──────────────────────────────────── */
  .prose mark {
    background-color: var(--color-accent);
    color: var(--color-fg);
    padding: 0 0.25em;
    border-radius: var(--radius-sm);
  }

  /* ── KBD ───────────────────────────────────────────────── */
  .prose kbd {
    font-family: var(--font-mono);
    font-size: 0.8em;
    color: var(--color-success);
    background-color: var(--color-inline-bg);
    padding: 0.1em 0.4em;
    border-radius: var(--radius-md);
    border: 1px solid var(--color-code-border);
  }

  /* ── Definition lists ──────────────────────────────────── */
  .prose dd + dt {
    border-top: 1px solid var(--color-accent);
    margin-top: var(--spacing-3);
    padding-top: var(--spacing-3);
  }

}
```

---

## 4. Token Reference Table

### Color Tokens

| Token | OKLCH Value | Original Hex | Usage |
|-------|-------------|--------------|-------|
| `--color-bg` | `oklch(99% 0.000 0)` | `#fff` | Page background |
| `--color-surface` | `oklch(97% 0.003 85)` | warm white | Card / post list row bg |
| `--color-surface-2` | `oklch(95% 0.006 85)` | warm light | Nested surface, tags |
| `--color-overlay` | `oklch(14% 0.000 0 / 0.75)` | `rgba(0,0,0,0.8)` | Footer bg, modal scrim |
| `--color-fg` | `oklch(16% 0.000 0)` | `#181818` | Primary body text |
| `--color-fg-muted` | `oklch(42% 0.000 0)` | `#595959` | Secondary text, h4 |
| `--color-fg-subtle` | `oklch(54% 0.000 0)` | `#767676` | TOC links, meta |
| `--color-fg-inverse` | `oklch(96% 0.000 0)` | `#eee` | Text on dark surfaces |
| `--color-border` | `oklch(87% 0.000 0)` | `#ccc` | Default dividers, main border-top |
| `--color-border-muted` | `oklch(93% 0.000 0)` | `#eee` | Subtle row dividers |
| `--color-border-strong` | `oklch(67% 0.000 0)` | `#aaa` | Table headers, strong dividers |
| `--color-accent` | `oklch(82% 0.163 85)` | `#f9c412` | Primary brand yellow |
| `--color-accent-hover` | `oklch(75% 0.155 80)` | `#e7bf60` | Accent hover state |
| `--color-accent-active` | `oklch(68% 0.148 75)` | `#ba9005` | Accent pressed state |
| `--color-accent-muted` | `oklch(95% 0.058 85)` | light amber | Blockquote background |
| `--color-code-bg` | `oklch(24% 0.000 0)` | `#2d2d2d` | Code block background |
| `--color-code-surface` | `oklch(28% 0.000 0)` | `#3a3a3a` | Tags on dark, elevated code |
| `--color-code-fg` | `oklch(81% 0.000 0)` | `#ccc` | Default code text |
| `--color-code-border` | `oklch(32% 0.000 0)` | — | Code block border |
| `--color-inline-bg` | `oklch(24% 0.000 0)` | `#2d2d2d` | Inline code bg |
| `--color-inline-fg` | `oklch(70% 0.120 15)` | `#e2777a` | Inline code text (rose) |
| `--color-success` | `oklch(69% 0.130 150)` | `#7ec699` | kbd, success states |
| `--color-info` | `oklch(64% 0.100 225)` | `#67cdcc` | Info / teal |
| `--color-error` | `oklch(70% 0.120 15)` | `#e2777a` | Error states |

### Syntax Token Colors

| Token | Value | Prism class |
|-------|-------|-------------|
| `--syntax-comment` | `oklch(65% 0.000 0)` | `.token.comment` |
| `--syntax-tag` | `oklch(70% 0.120 15)` | `.token.tag`, `.token.deleted` |
| `--syntax-fn` | `oklch(58% 0.090 245)` | `.token.function-name` |
| `--syntax-number` | `oklch(71% 0.130 55)` | `.token.number`, `.token.boolean` |
| `--syntax-constant` | `oklch(83% 0.130 80)` | `.token.constant`, `.token.property` |
| `--syntax-keyword` | `oklch(72% 0.090 310)` | `.token.keyword`, `.token.selector` |
| `--syntax-string` | `oklch(73% 0.110 155)` | `.token.string`, `.token.attr-value` |
| `--syntax-operator` | `oklch(75% 0.090 195)` | `.token.operator`, `.token.url` |

### Type Scale

| Token | Value | px | Usage |
|-------|-------|----|-------|
| `--text-xs` | `0.8rem` | 12.8px | Tags, meta, captions, `book-guide` links |
| `--text-sm` | `0.875rem` | 14px | Nav links, footer, code blocks |
| `--text-base` | `1rem` | 16px | Body prose, `.content` preview |
| `--text-md` | `1.125rem` | 18px | Lead paragraphs |
| `--text-lg` | `1.25rem` | 20px | h4 |
| `--text-xl` | `1.563rem` | 25px | h3 |
| `--text-2xl` | `1.953rem` | 31px | h2 |
| `--text-3xl` | `2.441rem` | 39px | h1 in posts |
| `--text-4xl` | `3.052rem` | 49px | Display / hero h1 |

### Radius Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-none` | `0` | No rounding |
| `--radius-sm` | `0.25rem / 4px` | Tags (`.tag`), badges, `mark` |
| `--radius-md` | `0.375rem / 6px` | Inline code, `kbd` |
| `--radius-lg` | `0.5rem / 8px` | Code blocks (`pre`), images, cards |
| `--radius-xl` | `0.75rem / 12px` | Modals, large surface panels |
| `--radius-full` | `9999px` | Pill-shaped elements |

### Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `--spacing-2` | `0.5rem / 8px` | Tight gaps: tag padding, list item gap |
| `--spacing-4` | `1rem / 16px` | Base padding unit |
| `--spacing-5` | `1.25rem / 20px` | Paragraph margin-bottom |
| `--spacing-6` | `1.5rem / 24px` | Code block padding, article padding |
| `--spacing-8` | `2rem / 32px` | Section spacing, blockquote margin |
| `--spacing-10` | `2.5rem / 40px` | h3 top margin, hr margin |
| `--spacing-12` | `3rem / 48px` | h1/h2 top margin |
| `--spacing-16` | `4rem / 64px` | Header top padding |

### Line Heights

| Token | Value | Usage |
|-------|-------|-------|
| `--leading-tight` | `1.15` | h1, display headings |
| `--leading-snug` | `1.3` | h2, h3 |
| `--leading-normal` | `1.5` | h4, nav, compact text |
| `--leading-relaxed` | `1.65` | subheadings, list items |
| `--leading-loose` | `1.75` | Body prose — editorial rhythm |

---

## 5. Apply Note — Wiring Tokens to Existing Templates

### CSS class / element mapping

| Existing selector | Token action | Migration note |
|-------------------|-------------|----------------|
| `main` max-width | Replace `70rem` with `var(--content-max)` | Already correct value, just tokenize |
| `article` in `_post.scss` | Replace `width: 37.5em` and `padding: 1.5em` | Use `max-width: var(--prose-width)` + `padding-inline: var(--spacing-6)` |
| `header nav` bg | Replace `hsla(0,0%,100%,0.9)` | Use `color-mix(in oklch, var(--color-bg) 90%, transparent)` or CSS custom property |
| `footer` bg | Replace `rgba(0,0,0,0.8)` | Use `var(--color-overlay)` |
| `--primary` | Delete from `:root`, use `var(--color-accent)` | Global find/replace |
| `--bg-light` / `--bg-dark` | Delete, use `var(--color-bg)` | Scoped by `[data-theme]` |
| `--font-color` | Delete, use `var(--color-fg)` | Global find/replace |
| `--font-color-dark-version` | Delete, use `var(--color-fg-inverse)` | Only needed in dark theme scope |
| `.tag` bg | Replace `#3a3a3a` | Use `var(--color-code-surface)` |
| `.under-line` box-shadow | Replace `rgb(230 230 230)` | Use `var(--color-border-muted)` |
| `book-guide a` color `#767676` | Use `var(--color-fg-subtle)` | Direct swap |
| `border-left` on blockquote | Currently `1px solid var(--primary)` — upgrade to `3px` | Matches new blockquote spec |
| `article` class | Add `.prose` class to `<article>` in post template | All prose styles then apply automatically |

### Template files to target

- `src/_includes/layouts/post.njk` (or equivalent) — add `class="prose"` to the `<article>` element that wraps rendered markdown content.
- `src/_includes/layouts/base.njk` — add `[data-theme]` attribute toggle if dark mode switching is desired.
- `tooling/` directory — create `theme.css` with the full `@theme` block above.
- Entry CSS file (likely `src/style/main.scss` or similar) — import `tooling/theme.css` as the first import, then remove `:root` variable declarations from `_base.scss` once migrated.

### Migration order recommendation

1. Write `tooling/theme.css` (the file above).
2. Add `@import "../tooling/theme.css"` at the top of the main CSS entry point.
3. Add `.prose` to the post article element in the template.
4. Delete the old `:root` variable block from `_base.scss` (the `--primary`, `--bg-light`, etc. declarations).
5. Find/replace old variable names across all SCSS files.
6. Remove `_base.scss` heading rules (`h1`–`h6`) since prose scopes them — or keep global heading defaults and let `.prose` override.
7. Migrate `_markdown.scss` syntax token colors to use `var(--syntax-*)` tokens for easier theming.

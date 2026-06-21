UI colors and utility classes

This file documents the custom color variables and small utilities added to `src/index.css` to keep the app's visual language consistent.

Palette (CSS variables declared in `src/index.css`):

- `--accent`: primary action color (used on main CTAs)
- `--accent-600`: darker accent for hover states
- `--card` / `--surface`: semi-opaque card backgrounds
- `--muted`: muted text color for secondary labels

Utility classes added:

- `.bg-accent` — primary background color for CTA elements
- `.bg-accent-600` — darker accent (hover)
- `.text-accent` — accent text color
- `.bg-surface` — soft surface/card background
- `.text-muted` — muted text color
- `.border-muted` — subtle border color
- `.btn-accent` — convenience (accent background + white text)

Usage recommendations:

- Primary actions: use `.bg-accent` + `text-white` + `shadow-sm`.
- Secondary actions: use `.bg-surface` or subtle `bg-slate-800` with `.text-accent` or `.text-muted`.
- Danger actions (reject/alerts): prefer softer reds like `bg-rose-500` with `text-white` and `shadow-sm`.
- Badges and small indicators: use `.inline-flex rounded-full px-2 py-1 text-xs` with `bg-accent/10` or `bg-emerald-500/10`.

Examples

Primary button:

```html
<button class="rounded-3xl bg-accent px-6 py-3 text-white shadow-sm">Enviar</button>
```

Secondary button:

```html
<button class="rounded-3xl bg-surface px-4 py-2 text-accent">Volver</button>
```

Alert button (soft):

```html
<button class="rounded px-3 py-2 bg-rose-500 text-white shadow-sm">Generar Alerta</button>
```

Notes

- These utilities exist alongside Tailwind's utilities; use them for semantic consistency rather than replacing Tailwind entirely.
- If you want to expand the palette, add variables at the top of `src/index.css` and document them here.

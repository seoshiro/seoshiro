# Profile design and verification

The profile uses native GitHub Markdown, a theme-aware original banner, and three single-column project previews. Descriptions, links, and technologies remain selectable text. The introduction uses the established English name; no account identity settings were changed.

Public profiles inspected on 1 October 2026:

- [Anthony Fu](https://github.com/antfu): compact navigation with a distinct personal voice.
- [Cassidy Williams](https://github.com/cassidoo): specific prose and curated project links.
- [Midudev](https://github.com/midudev): identity and linked project thumbnails.
- [Sindre Sorhus](https://github.com/sindresorhus): concise copy and deliberately playful original imagery.
- [Jason Lengstorf](https://github.com/jlengstorf): a short, grounded introduction.

These examples informed hierarchy and selection. Their art, branding, copy, and source were not copied. GitHub strips arbitrary inline styles and classes, so the layout uses the [supported markup](https://github.com/github/markup) and [theme-aware picture syntax](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/quickstart-for-writing-on-github).

## Checks

`node --test scripts/check-profile.mjs` validates image completeness, intrinsic dimensions, descriptive alternatives, local asset references, project destinations, and portable Markdown. The same checks run in a read-only GitHub Actions job. There are no dependencies, external stats widgets, tracking counters, runtime calls, credentials, or paid services.

Visual QA uses the actual public GitHub profile in light and dark mode at desktop and narrow widths. Screenshots and image-load/link results are retained in the release workspace. A GitHub profile README appears directly after a main-branch update; it has no separate website deployment.

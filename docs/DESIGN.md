# Profile design and verification

## Editorial direction · 3 November 2026

A compact portfolio index: an original ink/paper masthead with a cobalt accent, a short introduction, and three consistent single-column project stories. The real PERCH, SELVEDGE, and FORME previews are preserved byte for byte. Each story pairs the use case with concrete outputs, a live app, source, and case study. The introduction preserves the author's AI-assisted creation role and learning context.

The [awesome-github-profile-readme collection](https://github.com/abhisheknaiidu/awesome-github-profile-readme), specifically its Minimalistic and Simple but Innovative categories, supplied the exploration starting point. Public examples inspected: [Caneco](https://github.com/caneco), [Gift Egwuenu](https://github.com/lauragift21/lauragift21), and [Nate Moore](https://github.com/natemoo-re/natemoo-re). The useful patterns were concise identity, direct navigation, and selected work. No example's branding, copy, artwork, or code was copied.

## Content and boundaries

- Project descriptions and outputs were checked against the current README files for perch-studio, selvedge-studio, forme-studio, guidecheck, archiveguard, aitudesk, and AssetControl.
- The portfolio's English, Russian, and Kazakh versions and the three case-study links are retained.
- No claimed proficiency level, user count, customer endorsement, contribution statistic, tracking counter, or external stats service is added.
- Native headings, text links, and one-column images remain usable when the banner is unavailable. Theme-specific SVGs have a viewBox, explicit dimensions, titles, and descriptions. The mobile reading order follows the source order.
- Changes are confined to this profile repository. The existing screenshots, prior banners, workflows, project repositories, and account settings are preserved.

## Recovery and checks

The original main commit is `bf47f3d042203d4d0453873149f05ece76004e97`, retained in [backup/profile-before-editorial-2026-11-03](https://github.com/seoshiro/seoshiro/tree/backup/profile-before-editorial-2026-11-03).

Run `node --test scripts/check-profile.mjs` to check repository-local image integrity, theme sources, descriptive alternatives, project destinations, supported markup, and original screenshot hashes. The existing read-only GitHub Actions job runs the same checks. Public visual checks cover desktop and narrow layouts; exact outcomes are recorded in the delivery evidence.

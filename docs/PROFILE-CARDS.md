# Public profile cards

Generator: [GitHub Readme Stats Action v2.1.0](https://github.com/stats-organization/github-readme-stats-action/tree/2c498845f71017821efaad14293ebc736156ef21), pinned to the inspected commit `2c498845f71017821efaad14293ebc736156ef21`. Core renderer `@stats-organization/github-readme-stats-core` is fixed at `2.2.0`. The inspected action uses frozen production dependencies and ignores install lifecycle scripts; its explicit core-version install also ignores scripts. No floating action tag is used.

A daily/manual workflow generates activity and language cards in both palettes. Activity hides rank, uses public counts, and disables card animation. Languages describe repository code, not competence. The README embeds local files; no live stats service receives reader requests.

Permissions are separated: generation receives only `contents: read` and an ephemeral repository GITHUB_TOKEN. No PAT, new secret, account permission, private repository grant, or paid runner is created. A separate publishing job receives `contents: write`; only pinned official checkout/download actions and repository-controlled validation/commit commands run in that job. The stats action never receives its write token.

Four candidates are rendered in a staging directory. Data-fetch errors fail generation before an error card is written (`fail_on_error: true`). All four SVGs must pass validation before a one-day artifact can reach the publisher. The publisher validates again, copies only the four named SVGs and pushes a normal commit. A failed render, validation, artifact transfer, or push preserves the previous committed cards; no force push is used. Untrusted pull requests never trigger this workflow.

The first run generated valid cards but the upload action excluded the hidden staging folder. Adding its explicit `include-hidden-files: true` option fixed the transfer; the next run completed both jobs. This failure demonstrated that no partial/error cards were published.

The accent GIFs are Cycles renders of the same existing approved model. The lotus starts open, closes gently to a bud, pauses and opens; the petal makes a restrained float. They are separated by the three project stories, with static first-frame alternatives for reduced motion. Technology marks are local Simple Icons tiles (CC0); contact symbols are original line art. No generation credits were spent.

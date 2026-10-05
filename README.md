# MedusaPOS Website & Docs

Documentation and marketing site for [MedusaPOS](https://github.com/medusapos).

Built with [Next.js](https://nextjs.org) and [fumadocs](https://fumadocs.dev).

## Development

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Changelog page

`content/docs/changelog.mdx` lists released versions only, newest first. At each
[medusapos/app](https://github.com/medusapos/app) release, copy
`docs/release-notes/vX.Y.Z.md` from that release's tag into a new top section
`## X.Y.Z (YYYY-MM-DD)` with a link to the GitHub release, demoting its `##`
headings to `###` and leaving out its `#` title. Never copy `next.md`.

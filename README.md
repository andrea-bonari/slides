# slides-builder

Point it at a list of slide repos. Get a single deployable site with a slick index page.

Built for keeping talks and presentations from separate repositories all in one place — each deck lives at its own path, auto-built and ready to share.

## Usage

```bash
bun run src/main.ts
```

Drop a `sources.json` in the root, run the script, deploy the `dist/` folder anywhere that serves static files.

## sources.json

Each entry is a slide deck from an external repo:

```json
[
  {
    "slug": "my-talk",
    "sourceRepo": "https://github.com/you/my-talk",
    "buildCommand": "npm install && npm run build",
    "buildOutput": "dist"
  }
]
```

| Field | Description |
|---|---|
| `slug` | The URL path your deck will live at — `yoursite.com/my-talk` |
| `sourceRepo` | Any git-clonable URL |
| `buildCommand` | Whatever builds the deck inside the repo |
| `buildOutput` | Where the built files end up, relative to the repo root |

Add as many entries as you like. Each gets its own path in the output, and the index page links them all together.
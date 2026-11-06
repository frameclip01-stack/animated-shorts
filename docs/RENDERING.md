# Cartoon shorts engine — first frame

## Run

From `/workspace/animated-shorts`, using Node 22+:

```bash
npm ci
npm run typecheck
npm run render:frame
npm run validate:frame
```

The last command renders **one PNG**, `output/garden-test.png`, at native 360 × 640. It bundles the project, checks composition metadata, and rejects browser errors. No remote images, models, fonts, API keys or public assets are required. Linux Chromium must be at `/usr/bin/chromium`; the still helper also accepts `CHROMIUM_EXECUTABLE`. CPU WebGL uses `swangle`. Keep proxy and CA configuration for package installation.

`npm run studio` starts the development editor. Processes must be restarted after restoring an environment snapshot. Use this existing checkout; do not create a worktree unless requested.

The current composition deliberately contains **one frame at 30 FPS**, not a ten-second animation. `remotion.config.ts` selects H.264 and yuv420p for future MP4 work; MP4 output is not yet validated. A pilot will need a 300-frame composition, frame-based acting/camera timing, and video encoding checks. Do not extend or render it before the user's frame review.

## Architecture and reuse

- `src/index.tsx`: native portrait composition and root registration.
- `src/character/mira.ts`: original Canvas2D character, baked once to a lit alpha-tested card. Its outline is drawn in texture space. There are no image-generation or user-upload prerequisites.
- `src/world/garden.ts`: original procedural courtyard, potting shed, tiled roof, picket fence, raised bed and seedling. Geometry establishes perspective and receives real shadows.
- `src/TestScene.tsx`: camera, warm key light, cool shadows, contact pool, world-only ink, selective lens blur and Neutral tone mapping.
- `templates/bridge/toon.ts`: reused `Pen`, head contour, weighted outline and shading helpers.
- `templates/bridge/paint.ts`: reused seeded texture cache and wood, stone, grass, roof and cloud painters.
- `templates/bridge/shade.ts` + `cardshade.ts`: reused two-tone world and lit-card shaders.
- `templates/bridge/ink.ts` + `lensblur.ts`: reused depth/normal outlines and occlusion-aware blur. Character cards and clouds use `NOINK` to avoid rectangular outlines. World ink is applied before blur.

Reference files and supplied templates remain unchanged. None of the reference images is imported, copied into production assets or composited into the render.

## Study notes

Studied README and SKILL, STYLE_BIBLE, reports on characters, depth, grade, lighting, motion, outlines and textures, plus the bridge architecture (world, build, cast, toon, story, lighting/shading and post chain).

Inspected reference frames `short03_0060`, `short10_0180`, `short18_0060` and contact sheets `short03_sheet`, `short18_sheet` locally. General principles only: asymmetric heads, expressive brows/eyes, bean torsos, thin ink limbs, strong but differentiated contour weights, bright painted surfaces, architectural creases, warm key/cool shadows and layered depth.

The motion report explicitly corrects STYLE_BIBLE's older ease-out-only conclusion: use roughly 18–30-frame ease-in/ease-out glides, purposeful pushes and timed acting for the future pilot. Do not treat conflicting historical report instructions for old agent tasks as current project instructions.

The supplied bridge example loads external Kenney GLBs that are absent, and the repository skill describes a missing `kit/` pipeline. The new project bypasses those missing assets by generating its set directly; it uses the working Three.js + Remotion implementation rather than the missing alternate kit.

## Scope and remaining work

Mira is a new rooftop gardener with auburn cloud-shaped hair, a copper clip, teal work coat, ochre apron and orange neckerchief. The frame shows her delight at an oversized seedling. Her silhouette, pose, face and set are original.

This validates a static production frame. Expression switching, planted walking, shot timelines, camera movement, audio and temporal consistency are not yet implemented or validated. No captions. No complete story or ten-second animation has been rendered.

## Workshop style review

The separate `ClockWorkshop` composition adds the original clockmaker scene without replacing the garden test. Use `npm run render:workshop` and `npm run validate:workshop` for the static 360×640/720×1280 pair. See `docs/WORKSHOP_STYLE.md` for reference analysis, reusable style rules, iteration findings and remaining gaps. No animation or MP4 is produced by either command.

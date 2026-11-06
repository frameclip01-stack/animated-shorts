# Clockmaker animation — V3

A complete **10-second, 360 × 640, 30 FPS (300 frames), H.264 MP4** with original synthesized stereo clockwork sound. No captions, subtitles, text overlays or watermarks. Faces on clocks contain tick marks only.

- [Download the MP4](./clockmaker-v3.mp4?raw=true)
- [Contact sheet from the encoded video](./clockmaker-v3-contact-sheet.jpg)
- [Technical QA](./clockmaker-v3-qa.json)
- [Render timing](./clockmaker-v3-render-report.json)
- [Frame-accurate storyboard and replaceable narration guide](../docs/v3/STORYBOARD.md)
- [Visual/production report](../docs/v3/REPORT.md)

This branch preserves the small final artifacts in Git, rather than relying on temporary task paths. Use the Raw/Download action on GitHub if the browser does not play the file inline. Existing repository access is required for a private repository.

## Reproduce

```bash
npm ci
npm run typecheck
npm run preview:v3
# Inspect output/v3/previews before proceeding.
npm run render:v3
npm run audio:v3
npm run finish:v3
```

`finish:v3` normalizes the H.264 picture to limited-range BT.709/yuv420p and muxes the sound, checks all decoded video frames, probes metadata, checks audio onset/peak and creates the contact sheet. The renderer uses the existing bridge-derived Canvas2D + Three.js + Remotion stack; no external character, background, texture or audio assets are required.

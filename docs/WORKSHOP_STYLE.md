# Workshop visual standard — static review candidate

## Reference analysis (attached frame; visual observations, not pixel measurements)

1. **Heads:** pale near-circular beans with a fuller jaw, slight asymmetry, and subtle lavender side shade. Head size dominates the torso without making the limbs thick.
2. **Faces:** very small solid or half-lidded eyes, decisive short brows, and an economical mouth. The acting comes from eyelid/brow angles and mouth shape. No eye catchlights, round noses, cheek marks, or high-detail anatomy.
3. **Ink:** dark plum rather than absolute black on people. Character contours are stronger than interior details; dimensional objects have thinner edges and painted joints. The reference image's compression makes exact line widths uncertain.
4. **Materials:** clean face fills contrast with visibly mottled walls, worn counters, and irregular floor fragments. Large tonal patches matter more than fine noise.
5. **Density:** objects cluster around a working surface, not across every pixel. Repeated boxes/props establish scale and occupational context; face silhouettes remain readable.
6. **Light:** brightest spill enters from the upper/left side and spreads over the lower-left floor. Dark burgundy and blue-green zones preserve a pronounced value split. Visible practical lamps support the room's story; they are not evidence that all illumination comes from those bulbs.
7. **Layers:** floor, front person, counter objects, rear person, wall and back corner overlap at distinct depths. Contact and occlusion prevent pasted-on staging.
8. **Camera:** a moderately elevated portrait view reveals the counter top and floor. Strong perspective recedes into the room. Figures occupy different distances; the nearer figure has a larger head on screen.
9. **Color:** pale/lavender faces against wine-red surroundings; mint and purple clothes; green counter; warm gold illumination. Our palette deliberately changes the arrangement to teal walls, walnut/brass, rust-red visitor and indigo maker.
10. **Integration:** facial drawing stays simple while cards acquire scene tint, edge shade, and geometric occlusion. The world carries the texture/detail budget. Faces receive no photographic texture.

Re-read STYLE_BIBLE and relevant characters, textures, lighting, depth, outlines and grade report sections. Some historical recipes describe earlier renderer failures; the current bridge templates already contain later corrections. The single image suggests a local lighting/composition target, not a mandate to copy its cast, room, props, camera placement or captions.

## Original scene and reusable pieces

`src/workshop/` contains two new original cast members and a clockmaker's shop. The visitor reacts with small solid eyes, lifted asymmetric brows and an O-mouth. The older maker has half-disc lids, unequal brows and a short tilted mouth. Neither uses the reference's outfits, hats, accessories or exact silhouettes.

- `palette.ts`: shared ink, pale face, outline, lens and seed constants.
- `characters.ts`: 1200×2000 Canvas2D cards in a 600×1000 design space, subtly shaped heads, 9-unit weighted outlines, 12–13-unit limbs and restrained facial detail. Shared bridge Pen/contour/card shaders remain unchanged.
- `textures.ts`: deterministic worn timber, mottled patterned wallpaper, brushed brass and aged clock dials. Dial numerals are diegetic markings, not captions.
- `environment.ts`: actual timber slabs, drawers, legs and stretchers; bevelled toothed gears with open hubs; regulator/round/mantel/longcase clocks; pendulums, screws, oil, loupe, hammer, screwdriver, tweezers, shelves and jars. All generated through code.
- `WorkshopScene.tsx`: warm practical/side light, cool fill, true shadow maps, local ambient-occlusion/contact decals, world-only ink, controlled lens blur and emissive-only bloom.

Contact decals provide local ambient-occlusion darkening under grounded objects; this is not a screen-space SSAO pass. The existing bridge material contracts and NOINK layer keep drawn cards out of geometric outlines. No attachment or repository reference image is loaded at runtime.

## Reproduce

```bash
cd /workspace/animated-shorts
npm ci
npm run typecheck
npm run render:workshop
```

Two PNGs use **frame 0 of the same one-frame composition**, with Remotion scale 1 and 2. The 720×1280 result is re-rendered by Chromium, not a resized 360px image. ThreeCanvas dimensions come from useVideoConfig; lens radius and world ink follow the bridge's output-height scaling. The original garden composition, render command, and delivered PNG remain available.

Outputs: `output/workshop/clockmaker-360x640.png`, `clockmaker-720x1280.png`, and `render-info.json`. No animation or MP4 is generated. Live rendering uses CPU WebGL (`swangle`).

This is a style review candidate, not an assertion that the user's visual standard has been approved. Remaining differences are recorded after visual inspection in the final delivery.

## Inspection and refinements

The first render exposed overlapping faces, a foreground mechanism blocking the rear character, excessively crushed shadow areas and too many floor seams. Subsequent static reviews separated the actors, moved the maker clear of the mechanism, lifted the cool fill, painted single-board floor grain, introduced a cropped foreground parts case and shavings, softened torso silhouettes into cubic curves, and added a subtle wall bounce to reveal the wallpaper.

Review targets retained for future shots: pale clean faces; near-circular asymmetric heads; small solid/half-lidded eyes; weighted plum contours; thin limbs; distinct front/behind-work-surface placement; brighter faces than background; warm working light plus cooler shade; contact darkening under grounded props; sparse blur that leaves acting readable. Keep surfaces varied and props clustered around occupational tasks, not uniformly scattered. Use the seeded painters and shared palette across shots.

Remaining differences from the supplied reference: the reference has more irregular painterly wear, a brighter and more uneven floor light spill, and more nuanced local color variation. This scene retains cleaner geometry and more regular planks/shelves. The teal/brass palette and staging are intentional original choices, not a palette or composition match. Temporal consistency has not been tested, since only a single instant is rendered.

`npm run validate:workshop` checks PNG integrity, exact sizes, full opacity, useful tonal variation, a clean browser-error receipt and alignment of the 720px rerender against the 360px output. It writes `output/workshop/validation.json`. Pixel tests do not constitute artistic approval.

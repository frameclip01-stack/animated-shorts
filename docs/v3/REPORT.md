# V3 production and visual report

## Scope

Original clockmaker story: an inventor presents an absurd twin-bell alarm, winds up for one test, triggers every clock, and regrets the result. The visitor begins half asleep, wakes in shock, covers his ears, and ends with a deadpan sideways look. Existing workshop, cast construction, card lighting, world ink, lens blur and Remotion configuration were extended, not rebuilt. The garden and static workshop compositions remain registered. Reference files and bridge templates are unchanged.

The attached reference and local sheets/reports were used only to study visual language. No reference pixels, traced shapes or copied characters are used in the production frame. No generated external assets or robotic voice.

## Artwork changes

- Broad, deterministic scumbled patches, rubbed highlights and irregular pigment on timber; knot/grain variation without animated noise.
- Worn plum wallpaper with broad discoloration and a faded motif replaces the flat dark teal wall.
- Patinated brass with reduced metallic gloss; warm material highlights and cool violet shade.
- Smooth bean bodies, near-circular asymmetric pale heads, small readable features, eyebrow/mouth swaps, shaped four-frame blinks and gaze changes.
- Pose interpolation, torso lean and head tilt preserve the original cast proportions while making the acting clear.
- Local contact occlusion, true shadow maps, a foreground parts case and per-shot focus preserve depth.

## Camera and animation

Seven planned action sections across six distinct camera setups. Hard cuts at frames 60, 150, 195, 225 and 255. Every shot has dolly/push/track motion, with small seven-frame impact kicks rather than random camera noise. All 300 camera states were checked for finite values and motion between cuts.

All animation is a pure function of the absolute frame. Clock hands accelerate, clock cases rock in a cascade, bells and striker vibrate, the exposed spring bends, loose parts hop, the lamp swings, and the room develops restrained coherent movement. The button strike is at f120. The mechanism is stylized, not a physically simulated clock movement.

Static opaque geometry is batched by material for CPU WebGL performance; moving pivots and character cards stay separate. The 300-frame render uses two workers, 1024 shadow maps, 4x MSAA and the existing depth-aware ink/blur passes at the native output resolution. Textured faces remain crisp while the room falls out of focus in reaction close-ups.

## Preview inspection

Inspected the requested frames 0,45,90,135,180,225,270,299, plus 195 for the visitor close-up. Initial previews exposed an alarm/maker overlap and an obscured maker reaction. Re-staging the maker, moving the gear cradle and reversing the maker close-up cleared his face. Further previews caught a clipped bell in the alarm shot; the camera was pulled back and re-aimed before the complete render. The wall-clock shot was reframed to follow the ringing cascade. Final decoded frames are inspected separately after encoding.

## Sound and narration

All sound is original, seeded numpy/scipy synthesis at 48 kHz stereo. Ticks, winding ratchet, click, inharmonic bell strikes, shelf/gear rattles, wood jolts, spring boing, room rumble and the final clunk use integer-frame cue times. The activation click and first bell start at sample 192000 (frame 120). The clock ensemble joins at frames 150,156,162. The mix has a short ending fade and is loudness normalized during muxing. There is no narration in the final mix; a replaceable timing guide is in STORYBOARD.md.

## Remaining visual differences

This moves the system beyond static-image validation, but does not establish a complete style match. The reference still has more organic surface painting, less regular furniture edges, richer localized light spill and more delicate integration of flat figures into the room. Our gear teeth, drawers and floor courses remain conspicuously regular; the alarm's rounded metal shading is still more CG-like. Character acting is deliberately economical and planar; no anatomical turnaround or planted walking is validated here. The final joke is visual, without a narrator.

No 60-second short has been generated. The V3 MP4 and decoded contact sheet are the review artifacts for judging viability.


## Final encoded-output verification

- ffprobe: H.264 High, **360×640**, **30/1 FPS**, **300 decoded frames**, **10.000000 seconds**, limited-range BT.709/yuv420p; stereo AAC 48 kHz, 10.000000 seconds. Both streams start at zero.
- Decoded every frame: no black frames and no frozen spans of six frames or more. Minimum successive-frame mean difference: 1.315/255; full-sequence mean: 5.975/255.
- Visually inspected the contact sheet generated from the delivered MP4, plus frame 195 for the visitor reaction. No broken geometry or unintended face occlusion was observed in those samples. The maker is intentionally cropped at the edge of the alarm insert, and foreground gears mask his lower torso in his close-up; his expression remains visible.
- Audio onset at f120 rises from RMS 0.0128 to 0.2001 over adjacent two-frame windows. Decoded sample peak 0.875; ffmpeg EBU R128: −15.3 LUFS integrated, true peak −1.0 dBFS. No digital clipping detected. This verifies technical alignment, not a human listening review.
- Initial output was full-range YUV despite the renderer's pixel-format request. Final finishing explicitly converts to limited-range BT.709/yuv420p for player compatibility; all checks refer to that final file.
- Full 300-frame picture render: **289.27 s**. Final encode/mux: **2.05 s**. Picture plus finishing: **291.32 s (4 min 51 s)**. Three preview passes: **100.77 s**; combined timed rendering approximately **6 min 32 s**, excluding development and QA.

The MP4 is about 2.1 MB and is stored with this report and the contact sheet on the `codex/clockmaker-v3` branch. The original reference files are not changed or included as generated assets.

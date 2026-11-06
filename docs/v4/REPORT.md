# V4: five-second narrated character/material test

## Narration first

Uses the user's **AT1.mp3**, converted locally for analysis and mixing. No synthesized or robotic placeholder voice. Unconstrained PocketSphinx recognition matched “he made an alarm so loud it shook the entire workshop” before any animation was timed. Two-pass forced word/phone alignment estimates acoustic boundaries at 10 ms resolution. The 3.5004-second source is placed at 0.22 s, without time stretching, pitch change or editing of spoken words. “loud” begins at f42, “shook” at f62, “workshop” at f90. Complete word timings and source SHA-256 are delivered.

The sentence is external narration, not dialogue spoken by either character. Their mouths act emotional reactions rather than pretending to lip-sync the narrator.

## Animation changes implemented

- Reuses the existing character artwork/drawing helpers and card lighting. A head-only card has its own pivot, translation and rotation; a separate body/arm card deforms from a planted-foot origin.
- Body squash/stretch preserves approximate volume with inverse horizontal scale. The head stays essentially constant size and tracks the shoulder attachment with independent offsets, avoiding a floating-head seam.
- Continuous face parameters control eye opening, pupil gaze, eyebrow height/asymmetry, mouth opening/width/curvature, teeth and blink. No discrete expression image swaps or dissolves between duplicate faces.
- Curved quadratic arms use interpolated endpoints; hands lift and arc toward the ears. Secondary hand/head motion is damped after the reaction.
- Explicit anticipation precedes the f62 activation and f90 close-up. Analytic damped step responses start at zero velocity, overshoot, and settle. Their controls are pure functions of absolute frame, safe for out-of-order Remotion rendering.
- Motivated opening eye/head tracking continues through the initial dolly. Each actor's combined bone, face and hand controls changes on every one of the 150 frames. All camera samples change between the four planned cuts. Largest consecutive bone scalar change is under 0.05 (radians for angles, meters for translations, unitless for stretch); this is a continuity bound, not an artistic quality score.

## Material and lighting changes implemented

- Reuses painted wood grain, knots, scumbled color fields, cracks and wallpaper wear.
- Generates registered grayscale **bump and roughness maps from those same painted pixels**, avoiding sliding or unrelated surface detail. Textures use data color space for scalar maps and matching UV repeat.
- Wood/plaster use stronger but shallow relief; metal uses subtler patina relief and spatially varying matte roughness. Printed clock markings remain tick-only.
- Adjusted directional key, cool hemisphere fill and practical spot penumbra/power; added a grounded contact pool at the visitor's actual feet. Existing real shadows, local occlusion, depth-aware ink and selective lens blur remain.
- No extra geometric clutter is used as a substitute for surface work. Only the existing foreground mechanism is relocated to clear the inventor's face.

## Camera and story

Five one-second shots: fast alarm dolly, inventor lean/eye widening, activation insert, visitor recoil close-up, workshop reveal. Cuts at f30/60/90/120; push/track motion and real foreground parallax inside each shot. No random orbit and no global camera shake. The lamp, clocks, gears, loose parts and room react independently; ringing begins with the aligned “shook” cue.

## Preview corrections

Inspected key frames including the extremes at f45/f59 and f90/f98/f110. The previews exposed foreground clocks covering the inventor's mouth and excessive head lift separating the head from the body. The close-up was re-angled and the neck attachment travel reduced. Later samples show a clear inventor face and overlapping head/body silhouettes during recoil. Continuous eyelid outlines were strengthened to avoid faint, ghosted eye rings during transitions.

## Verification and remaining limits

Final video metadata, all-frame decode checks, audio waveform correlation and unconstrained recognition of the **actual final AAC stream** are reported in deliverables/v4/qa.json. Source audio and a mixed WAV were both recognized verbatim before the full render. Contact-sheet captions are only on the review sheet, never in the video.

This remains a stylized planar cast in a dimensional set. No anatomical head turnaround, hand/finger articulation or walking is validated. Camera-facing cards and some regular furniture/gear shapes remain apparent. Bump/roughness variation improves lighting response but does not equal fully hand-painted reference artistry. Word timing is an acoustic estimate. Automated continuity/black/freeze checks supplement visual inspection; they cannot certify that the characters feel alive or that the style matches the reference.

## Reproduction

```bash
npm ci
npm run typecheck
npm run preview:v4
# Review previews before the full render.
npm run render:v4
npm run audio:v4
npm run finish:v4
```

The supplied source remains locally at assets/audio/AT1.mp3 and is deliberately excluded from Git. Copy your original AT1.mp3 there when reproducing the audio; the published video already contains the verified narration. Alignment and final speech verification use a local Python venv at /workspace/.venvs/alignment with pocketsphinx==5.0.4 (its English model ships in the wheel), plus the environment's numpy/scipy/Pillow. To recreate it: python3 -m venv --system-site-packages /workspace/.venvs/alignment, then /workspace/.venvs/alignment/bin/pip install pocketsphinx==5.0.4. `scripts/align-v4.py` recreates timing after the 16 kHz WAV is decoded with ffmpeg. No audio is sent to an external service.

Previous garden, static workshop and V3 compositions remain registered. Existing reference files and bridge templates are unchanged. No 60-second video has been produced.


## Delivered result

- Full picture render: **231.34 s**. Final BT.709 encode/audio mux: **1.12 s**. Total final render/encode: **232.46 s (3 min 52 s)**. Completed preview passes total **175.86 s**; development, QA and one interrupted render are excluded from the final-render time.
- ffprobe confirms **5.000000 seconds**, **360×640**, **30/1 FPS**, **150 decoded frames**, H.264/yuv420p, stereo AAC 48 kHz; both streams start at zero and have 5-second declared duration.
- Final AAC recognition is verbatim: **he made an alarm so loud it shook the entire workshop**. Correlation with the unretimed, gain-adjusted supplied recording is **0.98265**. This confirms actual source narration is present, not just an audio stream or placeholder.
- Decoded sample peak **0.6712**; EBU R128 **−16.9 LUFS** integrated and **−3.4 dBFS** true peak. No audio clipping detected. Effects remain behind the voice during the sentence.
- Every video frame decoded successfully. No black frames or five-frame frozen windows; minimum adjacent-frame mean pixel difference **2.357/255**. All 150 combined pose states and camera states were checked separately to avoid mistaking camera movement alone for character animation.
- Inspected the decoded 15-frame contact sheet and individual f45/f98/f149 samples. The inventor's face is clear, and the recoil sample keeps the head attached to the body. The cropped foreground visitor during the opening/alarm inserts is intentional framing; both characters are visible in the final reveal.

These are technical and sampled visual checks, not a guarantee of reference-level artistry or a human listening review. The planar cast and regular workshop geometry remain the principal visual limitations.


Publication excludes the raw user-supplied MP3. The first publication attempt was rejected automatically because it included that source recording; the unpublished commit was amended to keep the file local and publish only the requested video and supporting artifacts.

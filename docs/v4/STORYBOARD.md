# V4 — five-second narrated expressive animation test

150 frames, 30 FPS, 360×640. Existing workshop and cast, independently articulated head/body layers. No text, subtitles or captions. No generated voice: uses the user's AT1.mp3 unchanged in speed/pitch.

Narration recognized verbatim by local unconstrained ASR: “He made an alarm so loud, it shook the entire workshop.” Source duration 3.50044 seconds. A 0.22-second lead-in places “loud” at 1.41 s (f42), “shook” at 2.06 s (f62), and “workshop” at 2.99 s (f90). Speech ends at 3.57 s, source tail ends at 3.72 s; the final reveal has room for ringing/settling. Word boundaries are forced acoustic alignment estimates at 10 ms resolution, not manually labelled ground truth. See narration-v4.json and delivered timing JSON.

| Frames | Camera / staging | Character animation | Audio / narration |
|---|---|---|---|
| 0–29 | Rapid, eased dolly toward the already trembling alarm; real workbench foreground parallax. | Both characters track the device; controlled early anticipation. | “He made an alarm”; low mechanical chatter and ticks, voice starts f6.6. |
| 30–59 | Motivated cut to inventor; push/track as he leans toward the device. | Torso leans; head translates and rotates independently; pupils track; brow/eye openness increases continuously. Arms arc toward the alarm. | “so loud”; anticipation squash builds toward f59. |
| 60–89 | Cut to alarm insert, moving closer. Violent activation on f62. | Body squash/stretch, lagged head flinch, arm overshoot; other clocks and loose parts begin rattling. | “it shook the entire”; click and alarm exactly f62, layered clocks follow. |
| 90–119 | Dramatic visitor close-up on “workshop”; inward dolly. | Small forward anticipation, head-back spring overshoot, body compression/rebound, mouth/eyes/brows interpolate. Hands arc toward ears with delayed follow-through. | “workshop” from f90–107; ringing stays below voice. |
| 120–149 | Cut wide and dolly past foreground case to reveal the shaking room and both characters. | Spring settling continues; arms and head retain secondary motion; planted feet and preserved head identity. | Narration has finished; room rattle and ringing rise for the final beat, then fade. |

Cuts at 30,60,90,120. Continuous purposeful camera movement within every shot. No random orbiting, simulation history or general-purpose idle bob. Frame-driven, seeded art is consistent under out-of-order rendering.

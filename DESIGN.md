# Design System: Cube Timer

## 1. Creative North Star

Cube Timer is a warm, tactile puzzle timer. The interface should feel like a well-made cube sitting on a quiet desk: physical, focused, and easy to return to for one more solve.

The design language combines a desk-toy mood with a lightweight speedcubing timer. The cube is the visual hero. The interface supports it with calm typography, touch-friendly controls, and soft material depth.

## 2. Palette And Surface Logic

Use a warm neutral base with cube colors as restrained accents.

- Base: warm ivory and paper tones.
- Text: graphite and soft brown-gray.
- Primary action: muted sage.
- Supporting surfaces: matte cream, pale sand, and soft clay.
- Accent colors: cube red, yellow, blue, green, orange, and white, used sparingly.

Surfaces should feel tactile rather than glossy. Prefer paper grain, soft shadows, subtle bevels, and a tiny amount of inset contrast. Avoid heavy outlines. If a boundary is needed, use a low-contrast warm stroke or a shadow shift.

## 3. Typography

Typography should be readable and friendly, with enough precision for timer use.

- Product names and large numbers use a rounded, confident sans.
- Body copy uses a calm humanist sans.
- Timer values should be large, tabular-feeling, and immediately scannable.
- Labels stay short and useful. Do not add decorative system copy.

Keep line lengths short on mobile. The app should read clearly at normal phone size.

## 4. Components

### Buttons

Primary actions use muted sage fill, light text, and a soft lower shadow. Secondary actions use matte cream surfaces with graphite text. Buttons use small to medium radius, never oversized pill shapes unless the control is intentionally compact.

### Cards

Cards should look like paper or ceramic trays on a desk. Use modest radius, warm shadows, and generous internal padding. Avoid stacking cards inside larger cards unless the nested surface has a real functional purpose.

### Mode Tiles

Mode tiles are compact, touch-friendly blocks with a small cube glyph, a clear label, and a slight raised surface. Selection should be visible through fill and shadow rather than a loud border.

### Timer And Metrics

The timer is the strongest UI element during play. Move count, best time, and session average are secondary and should not compete with the cube.

### Result Review

Result review should feel celebratory but quiet. Use cube-color tile motifs and a clear result summary rather than confetti-heavy decoration.

## 5. Layout Principles

- Mobile first. The phone-sized composition is the primary experience.
- On wider screens, expand into a real responsive web layout with generous side-by-side composition.
- Keep the cube large and touchable.
- Use bottom controls for frequent play actions on mobile, and let the same controls breathe wider on desktop.
- Keep settings and secondary controls visually quiet.
- Preserve safe-area spacing at top and bottom.
- Do not present desktop as a phone mockup. It should feel like the same product adapted to a larger desk surface.

## 6. Copy Direction

Use simple, product-like language.

- Product name: Cube Timer
- Tagline: Time your cube.
- Landing copy: Start a scramble, solve the cube, and track the run without extra noise.
- Primary CTA: Start solving
- Play controls: Scramble, Undo, Reset, Done
- Result: Solved, Try again, Back to home

Do not use the Rubik's Cube trademark in UI copy. Use cube, puzzle, solve, scramble, moves, and session language.

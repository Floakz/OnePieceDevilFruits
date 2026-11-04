# One Piece Devil Fruits — Brand Kit

This guide captures the visual language currently used by the website and gives new pages, components, and graphics a consistent starting point. When existing styles disagree, prefer the core tokens and rules below for new work; avoid expanding one-off variations.

## Brand character

- **Personality:** energetic, playful, and fan-made, with a catalog-like focus on discovery and comparison.
- **Visual signature:** deep ocean blues, bright gold highlights, bold uppercase labels, and prominent fruit/character artwork.
- **Priority:** keep information and imagery easy to scan. Use decoration to support the content, not compete with it.

## Color primitives

| Token | Value | Use |
|---|---|---|
| Gold | `#F8DE3C` | Primary accent, active navigation, highlighted text, primary action backgrounds |
| Action blue | `#044BD0` | Primary blue buttons and interactive emphasis |
| Deep blue | `#022668` | Page gradient endpoint, deep panels, and mobile navigation |
| Card navy | `#011A48` | Cards, guides, and other content surfaces |
| Panel blue | `#0A2963` | Secondary surfaces, footer links, and pagination |
| Raised blue | `#0E3473` | Nested or interactive content surfaces |
| White | `#FFFFFF` | Main text and high-contrast icons on dark backgrounds |
| Muted blue text | `#9BB7EA` | Descriptions and secondary text on dark backgrounds |
| Border blue | `#1869FF` | Card outlines and restrained blue borders |
| Cyan | `#3CC3F8` | Secondary outlines and occasional supporting accents |

The page background currently uses a diagonal-like vertical gradient: `#1B62E6` at the top to `#022668` lower down (`185deg`). Keep large surfaces blue/navy and reserve gold for focus and hierarchy. Gold text should sit on a dark background; use dark navy text on gold-filled controls.

### Color consistency

Several existing components use nearby yellows (`#FFEE06`, `#FFEC18`, `#DCF83C`) or brighter cyan/teal values. Treat these as legacy or feature-specific exceptions, not additional brand colors. Use **Gold** (`#F8DE3C`) for new shared UI. Cyan can remain a supporting accent, not a competing primary.

## Typography

- **Typeface:** Poppins, with a sans-serif fallback. It is loaded from Google Fonts in `index.html` and set globally in `App.css`.
- **Headings:** bold, compact, and often uppercase; use uppercase especially for short labels, category names, and navigation.
- **Body copy:** sentence case, comfortable line-height, and muted blue for secondary descriptions on dark surfaces.
- **Hierarchy:** use size and weight before adding more colors. Allow long fruit names to wrap rather than clip.
- **Responsive sizing:** use fluid sizing (for example `clamp()`) for titles that need to adapt to card or viewport width.

## Layout and spacing

- Center the primary content and constrain its width. The main catalog uses a wide layout (up to `1600px`); individual content sections commonly use about `90vw`.
- Use grid for browsable collections, flex for compact rows and card internals, and preserve generous gaps between separate content groups.
- Existing layouts commonly use `20px` gaps and `50–80px` section spacing. For new UI, favor a repeatable `4px`-based spacing scale (for example `4, 8, 12, 16, 24, 32, 48`) rather than introducing arbitrary values.
- On small screens, collapse multi-column collections to one column and turn horizontal collections into scrollable, snap-aligned rows when that better suits the content.

## Surfaces, borders, and shape

- Use dark navy for cards and panels against the blue page background.
- Cards are substantial, rounded surfaces: fruit cards use a `17px` radius; smaller controls and panels commonly use `6–10px`.
- Use a thin blue border to define a surface. Gold borders are for emphasis, selected states, or featured content.
- Keep shadows purposeful and soft; avoid stacking heavy glow effects across every surface.
- Preserve artwork aspect ratios and use `object-fit: contain` for fruit illustrations. Use `cover` for portrait/user imagery when cropping is appropriate.

## Component patterns

- **Primary action:** gold fill with dark navy text; uppercase, bold labels where space permits. A blue action with a gold outline is also established for prominent catalog actions.
- **Navigation:** bold uppercase labels; gold fill and dark text indicate the active item. Keep hover and active states easy to distinguish.
- **Cards:** image first, clear uppercase title, short description, then compact metadata. Keep metadata secondary and align repeated details consistently.
- **Search and filters:** controls should be visually distinct from the dark page; clearly expose focus and selected-result states.
- **Badges:** keep short and high-contrast. Bright teal is currently used for “new” indicators only; don't use it as a general-purpose accent.

## Interaction and accessibility

- Interactive elements need visible hover **and keyboard focus** states. Use `:focus-visible` with a clear outline and offset; don't rely on color changes alone.
- Maintain readable contrast: white or muted blue on dark surfaces, dark navy on gold surfaces. Do not put small yellow text on white.
- Keep touch targets comfortable on mobile; use the existing `40px` minimum pagination target as a baseline.
- Respect reduced-motion preferences. Motion should be brief and optional, and should not be required to understand a state change.
- Give meaningful images alternative text; use empty alternative text for purely decorative imagery.

## Imagery and logo

- Fruit and character art are the main visual content. Prefer supplied site imagery and placeholders over generic stock imagery.
- Avoid stretching, unnecessary filters, or crops that hide identifying details.
- Use the existing One Piece Devil Fruits logo artwork; do not redraw or typeset a substitute. The header currently references a hosted logo, and a copy is present at `public/images/branding/opdvlogo.webp`.
- Keep image treatment consistent with its role: contained fruit art, portrait-cropped user art, and restrained rounded corners.

## Content voice

- Be direct, enthusiastic, and easy to scan.
- Use plain language for labels and instructions. Keep fan opinions and site estimates clearly identifiable as such.
- Prefer short headings and concise descriptions; preserve canonical fruit and character names.

## Quick checklist for new work

1. Start with Poppins, the blue gradient, and the core gold/navy palette.
2. Use navy surfaces and clear text hierarchy; save gold for meaningful emphasis.
3. Reuse established card, button, and navigation patterns before inventing new ones.
4. Make layouts responsive and check keyboard focus, contrast, and image behavior.
5. Avoid adding near-duplicate colors, radii, or one-off effects without a specific need.

## Current implementation references

- Global background and typography: [src/index.css](./src/index.css), [src/App.css](./src/App.css), [index.html](./index.html)
- Fruit cards: [src/Components/fruitcardstyle.css](./src/Components/fruitcardstyle.css)
- Header and navigation: [src/Components/header/Header.jsx](./src/Components/header/Header.jsx), [src/Components/header/header.module.css](./src/Components/header/header.module.css)
- Search: [src/Components/searchBar/searchBar.module.css](./src/Components/searchBar/searchBar.module.css)
- Fruit imagery: [public/images/branding/opdvlogo.webp](./public/images/branding/opdvlogo.webp)

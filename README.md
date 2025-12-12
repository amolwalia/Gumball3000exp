# Gumball 3000 Experience

Interactive memoir for the Istanbul → Ibiza route: animated hero, live map with city pins, timeline, particle/glow background, and a 3D “garage” to explore a Lamborghini Aventador (.glb).

## Quick start
```bash
npm install
npm run dev   # http://localhost:5173
# npm run build for production
```

## Structure
- `src/App.jsx` – main UI (hero, map, timeline, garage) and interactions.
- `src/App.css` – styling, animations (particles, glow, map pins).
- `public/assets/` – images, map.svg/png, and expected `aventador.glb`.

## Garage (3D Aventador)
- Drop your model at `public/assets/aventador.glb`.
- Viewer uses three.js + OrbitControls; drag to orbit, scroll to zoom.
- Default paint set to Verde Scandal; change in `src/App.jsx` if desired.

## Map interaction
- Hover a pin to highlight; click to load its details and timeline card.
- Pins are positioned via percentage coords against `public/assets/map.svg`.

## Theming & visuals
- Dark/light toggle in the top bar.
- Particle field, cursor glow, and warm route accents for motion/energy.

## Notes
- If the dev server port is blocked, run `npm run dev -- --host --port 5173` (or change the port).
- Large bundle warning is expected due to images/three.js; acceptable for this experience.

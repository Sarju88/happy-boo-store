# Happy Boo Downloads

A static free-download storefront for **Happy Boo Game**, built from the local Godot project's game-facing visual language.

## Development

```bash
npm install
npm run dev
```

Build the static site with:

```bash
npm run build
```

Preview the production build locally with:

```bash
npm run preview
```

GitHub Pages should deploy the generated `dist` folder through `.github/workflows/pages.yml`.
Do not point Pages directly at the repo root, because the root `index.html` is the Vite source
entry and must be built first.

## Download Flow

All items are free digital downloads: profile pictures, desktop backgrounds, icons, and stickers.
Clicking a download opens an optional donation prompt first. Users can donate or continue without
donating.

## Asset Sources

The storefront intentionally copies a small set of user-owned game assets from:

`/Users/arjunrao/Happy_Boo_Game_Web_version`

Copied assets:

- `icon.png`
- `characters/happy_boo/square_ref.png`
- `characters/happy_boo/skins/berry/preview.png`
- `characters/happy_boo/skins/mint/preview.png`
- `characters/happy_boo/skins/gold/preview.png`
- `characters/happy_boo/skins/sappy/preview.png`
- `bombs/tanks_mineOn.png`
- `food/tile_0000.png`
- `food/tile_0035.png`
- `monsters/assets/bee_rest.png`
- `monsters/assets/slime_spike_rest.png`

No payment is required to download.

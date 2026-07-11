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

To show live site-wide and per-item download totals, build with:

```bash
VITE_STORE_STATS_URL=https://your-download-counter-worker-url/total npm run build
```

See `worker/README.md` for the optional backend download counter.

GitHub Pages should deploy the generated `dist` folder through `.github/workflows/pages.yml`.
Do not point Pages directly at the repo root, because the root `index.html` is the Vite source
entry and must be built first.

## Download Flow

All items are free digital downloads: profile pictures, wallpapers, icons, stickers, creator packs,
printables, guides, and audio. Clicking a download opens an optional donation prompt first. Users
can donate or continue without donating.

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

Generated wallpaper assets:

- `public/assets/wallpapers/classic-boo-desktop-background.png`
- `public/assets/wallpapers/berry-boo-desktop-background.png`
- `public/assets/wallpapers/mint-boo-desktop-background.png`
- `public/assets/wallpapers/gold-boo-desktop-background.png`
- `public/assets/wallpapers/sappy-boo-desktop-background.png`

Generated merch packs:

- `public/assets/merch/phone-wallpapers/`
- `public/assets/merch/lock-screens/`
- `public/assets/merch/profile-banners/`
- `public/assets/merch/emoji/`
- `public/assets/merch/stickers/`
- `public/assets/merch/icons/`
- `public/assets/merch/cursors/`
- `public/assets/merch/stream-overlays/`
- `public/assets/merch/score-cards/`
- `public/assets/merch/badges/`
- `public/assets/merch/trading-cards/`
- `public/assets/merch/sticker-sheet/`
- `public/downloads/`

The new large visuals were generated from the real Happy Boo skin/item/enemy assets as references,
then packaged locally into ZIP/PDF/MP3 downloads. The in-game music download comes from
`music/in_game_music.mp3`.

No payment is required to download.

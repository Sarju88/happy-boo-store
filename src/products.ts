export type Product = {
  id: string;
  name: string;
  shortName: string;
  category: string;
  description: string;
  image: string;
  downloadUrl: string;
  fileName: string;
  fileType: string;
  accentColor: string;
  details: string[];
};

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

export const products: Product[] = [
  {
    id: "classic-boo-avatar",
    name: "Classic Boo Profile Picture",
    shortName: "Classic Avatar",
    category: "Profile Pictures",
    description: "A clean square avatar using the original Happy Boo look.",
    image: asset("assets/boo/classic-boo.png"),
    downloadUrl: asset("assets/boo/classic-boo.png"),
    fileName: "classic-boo-profile-picture.png",
    fileType: "PNG avatar",
    accentColor: "#ffd24b",
    details: ["128 x 128", "PNG", "Profile-ready"]
  },
  {
    id: "berry-boo-avatar",
    name: "Berry Boo Profile Picture",
    shortName: "Berry Avatar",
    category: "Profile Pictures",
    description: "A bright berry skin avatar for social profiles, forums, and chat icons.",
    image: asset("assets/boo/berry-boo.png"),
    downloadUrl: asset("assets/boo/berry-boo.png"),
    fileName: "berry-boo-profile-picture.png",
    fileType: "PNG avatar",
    accentColor: "#d83990",
    details: ["128 x 128", "PNG", "Berry skin"]
  },
  {
    id: "mint-boo-avatar",
    name: "Mint Boo Profile Picture",
    shortName: "Mint Avatar",
    category: "Profile Pictures",
    description: "A cool mint Happy Boo avatar with candy stripes and a soft teal palette.",
    image: asset("assets/boo/mint-boo.png"),
    downloadUrl: asset("assets/boo/mint-boo.png"),
    fileName: "mint-boo-profile-picture.png",
    fileType: "PNG avatar",
    accentColor: "#67dfc8",
    details: ["128 x 128", "PNG", "Mint skin"]
  },
  {
    id: "gold-boo-avatar",
    name: "Gold Boo Profile Picture",
    shortName: "Gold Avatar",
    category: "Profile Pictures",
    description: "A bright golden Happy Boo avatar for profiles that need a coin-store shine.",
    image: asset("assets/boo/gold-boo.png"),
    downloadUrl: asset("assets/boo/gold-boo.png"),
    fileName: "gold-boo-profile-picture.png",
    fileType: "PNG avatar",
    accentColor: "#ffc832",
    details: ["128 x 128", "PNG", "Gold skin"]
  },
  {
    id: "sappy-boo-avatar",
    name: "Sappy Boo Profile Picture",
    shortName: "Sappy Avatar",
    category: "Profile Pictures",
    description: "A leafy green Happy Boo avatar with a soft nature-inspired look.",
    image: asset("assets/boo/sappy-boo.png"),
    downloadUrl: asset("assets/boo/sappy-boo.png"),
    fileName: "sappy-boo-profile-picture.png",
    fileType: "PNG avatar",
    accentColor: "#86d95b",
    details: ["128 x 128", "PNG", "Sappy skin"]
  },
  {
    id: "classic-boo-wallpaper",
    name: "Classic Boo Desktop Background",
    shortName: "Classic Wallpaper",
    category: "Desktop Backgrounds",
    description: "A sunny meadow wallpaper with Classic Boo, soft hills, coins, and open icon space.",
    image: asset("assets/wallpapers/classic-boo-desktop-background.png"),
    downloadUrl: asset("assets/wallpapers/classic-boo-desktop-background.png"),
    fileName: "classic-boo-desktop-background.png",
    fileType: "PNG background",
    accentColor: "#ffd24b",
    details: ["1920 x 1080", "PNG", "Desktop"]
  },
  {
    id: "berry-boo-wallpaper",
    name: "Berry Boo Desktop Background",
    shortName: "Berry Wallpaper",
    category: "Desktop Backgrounds",
    description: "A berry-purple sunset wallpaper with arcade hills, floating fruit, and sparkle trails.",
    image: asset("assets/wallpapers/berry-boo-desktop-background.png"),
    downloadUrl: asset("assets/wallpapers/berry-boo-desktop-background.png"),
    fileName: "berry-boo-desktop-background.png",
    fileType: "PNG background",
    accentColor: "#d83990",
    details: ["1920 x 1080", "PNG", "Desktop"]
  },
  {
    id: "mint-boo-wallpaper",
    name: "Mint Boo Desktop Background",
    shortName: "Mint Wallpaper",
    category: "Desktop Backgrounds",
    description: "A cool crystal-cave wallpaper with Mint Boo, floating ice islands, and teal glow.",
    image: asset("assets/wallpapers/mint-boo-desktop-background.png"),
    downloadUrl: asset("assets/wallpapers/mint-boo-desktop-background.png"),
    fileName: "mint-boo-desktop-background.png",
    fileType: "PNG background",
    accentColor: "#67dfc8",
    details: ["1920 x 1080", "PNG", "Desktop"]
  },
  {
    id: "gold-boo-wallpaper",
    name: "Gold Boo Desktop Background",
    shortName: "Gold Wallpaper",
    category: "Desktop Backgrounds",
    description: "A sunny Gold Boo download for players who want a coin-streak desktop vibe.",
    image: asset("assets/wallpapers/gold-boo-desktop-background.png"),
    downloadUrl: asset("assets/wallpapers/gold-boo-desktop-background.png"),
    fileName: "gold-boo-desktop-background.png",
    fileType: "PNG background",
    accentColor: "#ffc832",
    details: ["1920 x 1080", "PNG", "Desktop"]
  },
  {
    id: "sappy-boo-wallpaper",
    name: "Sappy Boo Desktop Background",
    shortName: "Sappy Wallpaper",
    category: "Desktop Backgrounds",
    description: "A leafy Sappy Boo background for calm desktops and cozy setups.",
    image: asset("assets/wallpapers/sappy-boo-desktop-background.png"),
    downloadUrl: asset("assets/wallpapers/sappy-boo-desktop-background.png"),
    fileName: "sappy-boo-desktop-background.png",
    fileType: "PNG background",
    accentColor: "#86d95b",
    details: ["1920 x 1080", "PNG", "Desktop"]
  },
  {
    id: "food-pickup-icon",
    name: "Food Pickup Icon",
    shortName: "Food Icon",
    category: "Icons",
    description: "A tiny pickup icon for folders, streams, overlays, and fan projects.",
    image: asset("assets/items/food-pickup.png"),
    downloadUrl: asset("assets/items/food-pickup.png"),
    fileName: "happy-boo-food-pickup-icon.png",
    fileType: "PNG icon",
    accentColor: "#f58c3d",
    details: ["PNG", "Pixel art", "Pickup"]
  },
  {
    id: "bomb-cooldown-icon",
    name: "Bomb Cooldown Icon",
    shortName: "Bomb Icon",
    category: "Icons",
    description: "A compact bomb icon for custom launchers, folders, or stream labels.",
    image: asset("assets/items/bomb.png"),
    downloadUrl: asset("assets/items/bomb.png"),
    fileName: "happy-boo-bomb-cooldown-icon.png",
    fileType: "PNG icon",
    accentColor: "#384b5e",
    details: ["PNG", "Pixel art", "Bomb"]
  },
  {
    id: "bee-wave-sticker",
    name: "Bee Wave Digital Sticker",
    shortName: "Bee Sticker",
    category: "Digital Stickers",
    description: "A downloadable bee enemy sticker for messages, notes, and fan graphics.",
    image: asset("assets/monsters/bee.png"),
    downloadUrl: asset("assets/monsters/bee.png"),
    fileName: "happy-boo-bee-wave-sticker.png",
    fileType: "PNG sticker",
    accentColor: "#ffb938",
    details: ["PNG", "Enemy art", "Sticker"]
  },
  {
    id: "spike-wave-sticker",
    name: "Spike Wave Digital Sticker",
    shortName: "Spike Sticker",
    category: "Digital Stickers",
    description: "A spike monster sticker for fans of the heavier survival waves.",
    image: asset("assets/monsters/spike.png"),
    downloadUrl: asset("assets/monsters/spike.png"),
    fileName: "happy-boo-spike-wave-sticker.png",
    fileType: "PNG sticker",
    accentColor: "#7dc557",
    details: ["PNG", "Enemy art", "Sticker"]
  },

  {
    id: "phone-wallpaper-pack",
    name: "Phone Wallpaper Pack",
    shortName: "Phone Wallpapers",
    category: "Wallpaper Packs",
    description: "Five unique vertical phone wallpapers, one for each Happy Boo skin.",
    image: asset("assets/merch/previews/phone-wallpaper-pack.png"),
    downloadUrl: asset("downloads/happy-boo-phone-wallpaper-pack.zip"),
    fileName: "happy-boo-phone-wallpaper-pack.zip",
    fileType: "ZIP wallpaper pack",
    accentColor: "#3ca0ea",
    details: ["5 PNGs", "1440 x 2560", "Phone"]
  },
  {
    id: "lock-screen-pack",
    name: "Lock Screen Pack",
    shortName: "Lock Screens",
    category: "Wallpaper Packs",
    description: "Five clock-safe lock screen wallpapers with distinct Boo scenes.",
    image: asset("assets/merch/previews/lock-screen-pack.png"),
    downloadUrl: asset("downloads/happy-boo-lock-screen-pack.zip"),
    fileName: "happy-boo-lock-screen-pack.zip",
    fileType: "ZIP lock screens",
    accentColor: "#67dfc8",
    details: ["5 PNGs", "1440 x 2560", "Lock screen"]
  },
  {
    id: "profile-banner-pack",
    name: "Profile Banner Pack",
    shortName: "Profile Banners",
    category: "Profile Pictures",
    description: "Wide Happy Boo banners for social profiles, channels, and fan pages.",
    image: asset("assets/merch/previews/profile-banner-pack.png"),
    downloadUrl: asset("downloads/happy-boo-profile-banner-pack.zip"),
    fileName: "happy-boo-profile-banner-pack.zip",
    fileType: "ZIP banner pack",
    accentColor: "#d83990",
    details: ["5 PNGs", "1500 x 500", "Banner"]
  },
  {
    id: "emoji-pack",
    name: "Discord Emoji Pack",
    shortName: "Emoji Pack",
    category: "Digital Stickers",
    description: "Small transparent emoji for Boo skins, pickups, coins, and enemies.",
    image: asset("assets/merch/previews/emoji-pack.png"),
    downloadUrl: asset("downloads/happy-boo-emoji-pack.zip"),
    fileName: "happy-boo-emoji-pack.zip",
    fileType: "ZIP emoji pack",
    accentColor: "#ffd24b",
    details: ["10 PNGs", "128 x 128", "Transparent"]
  },
  {
    id: "animated-sticker-pack",
    name: "Animated Sticker Pack",
    shortName: "Animated Stickers",
    category: "Digital Stickers",
    description: "Looping Happy Boo GIF stickers for chats, posts, and overlays.",
    image: asset("assets/merch/previews/animated-sticker-pack.png"),
    downloadUrl: asset("downloads/happy-boo-animated-sticker-pack.zip"),
    fileName: "happy-boo-animated-sticker-pack.zip",
    fileType: "ZIP GIF pack",
    accentColor: "#86d95b",
    details: ["5 GIFs", "Looping", "Sticker"]
  },
  {
    id: "folder-app-icon-pack",
    name: "Folder and App Icon Pack",
    shortName: "Icon Pack",
    category: "Icons",
    description: "Happy Boo PNG and ICO icons for folders, shortcuts, and launchers.",
    image: asset("assets/merch/previews/icon-pack.png"),
    downloadUrl: asset("downloads/happy-boo-folder-app-icon-pack.zip"),
    fileName: "happy-boo-folder-app-icon-pack.zip",
    fileType: "ZIP icon pack",
    accentColor: "#ffc832",
    details: ["PNG + ICO", "9 icons", "Shortcuts"]
  },
  {
    id: "cursor-pack",
    name: "Cursor Pack",
    shortName: "Cursors",
    category: "Icons",
    description: "Happy Boo cursor images for custom cursor tools, websites, and streams.",
    image: asset("assets/merch/previews/cursor-pack.png"),
    downloadUrl: asset("downloads/happy-boo-cursor-pack.zip"),
    fileName: "happy-boo-cursor-pack.zip",
    fileType: "ZIP cursor pack",
    accentColor: "#3ca0ea",
    details: ["PNG cursors", "Hotspot notes", "Custom tools"]
  },
  {
    id: "stream-overlay-pack",
    name: "Stream Overlay Pack",
    shortName: "Stream Overlays",
    category: "Creator Packs",
    description: "Four 1080p Happy Boo screens for streams and gameplay videos.",
    image: asset("assets/merch/previews/stream-overlay-pack.png"),
    downloadUrl: asset("downloads/happy-boo-stream-overlay-pack.zip"),
    fileName: "happy-boo-stream-overlay-pack.zip",
    fileType: "ZIP overlay pack",
    accentColor: "#3ca0ea",
    details: ["4 PNGs", "1920 x 1080", "Stream"]
  },
  {
    id: "printable-score-card-pack",
    name: "Printable Score Card Pack",
    shortName: "Score Cards",
    category: "Printables",
    description: "Printable score and challenge sheets for tracking Happy Boo runs.",
    image: asset("assets/merch/previews/score-card-pack.png"),
    downloadUrl: asset("downloads/happy-boo-printable-score-card-pack.zip"),
    fileName: "happy-boo-printable-score-card-pack.zip",
    fileType: "ZIP printable pack",
    accentColor: "#ffd24b",
    details: ["PNG + PDF", "Printable", "Run tracker"]
  },
  {
    id: "achievement-badge-pack",
    name: "Achievement Badge Pack",
    shortName: "Badges",
    category: "Creator Packs",
    description: "Twelve Happy Boo achievement badges for fan posts and progress boards.",
    image: asset("assets/merch/previews/achievement-badge-pack.png"),
    downloadUrl: asset("downloads/happy-boo-achievement-badge-pack.zip"),
    fileName: "happy-boo-achievement-badge-pack.zip",
    fileType: "ZIP badge pack",
    accentColor: "#ffc832",
    details: ["12 PNGs", "512 x 512", "Badges"]
  },
  {
    id: "trading-card-pack",
    name: "Trading Card Pack",
    shortName: "Trading Cards",
    category: "Creator Packs",
    description: "Character and mechanic cards for Boo skins, enemies, bombs, and food.",
    image: asset("assets/merch/previews/trading-card-pack.png"),
    downloadUrl: asset("downloads/happy-boo-trading-card-pack.zip"),
    fileName: "happy-boo-trading-card-pack.zip",
    fileType: "ZIP card pack",
    accentColor: "#d83990",
    details: ["10 PNGs", "Digital cards", "Game facts"]
  },
  {
    id: "mini-strategy-guide",
    name: "Mini Strategy Guide",
    shortName: "Strategy Guide",
    category: "Guides",
    description: "A short PDF guide based on verified Happy Boo mechanics and strategy.",
    image: asset("assets/merch/previews/strategy-guide.png"),
    downloadUrl: asset("downloads/happy-boo-mini-strategy-guide.pdf"),
    fileName: "happy-boo-mini-strategy-guide.pdf",
    fileType: "PDF guide",
    accentColor: "#3ca0ea",
    details: ["PDF", "2 pages", "Verified mechanics"]
  },
  {
    id: "sticker-sheet-pack",
    name: "Sticker Sheet PNG",
    shortName: "Sticker Sheet",
    category: "Printables",
    description: "A high-resolution sticker sheet with Boo skins, pickups, enemies, and badges.",
    image: asset("assets/merch/previews/sticker-sheet.png"),
    downloadUrl: asset("downloads/happy-boo-sticker-sheet-pack.zip"),
    fileName: "happy-boo-sticker-sheet-pack.zip",
    fileType: "ZIP sticker sheet",
    accentColor: "#86d95b",
    details: ["PNG", "2400 x 1800", "Printable"]
  },
  {
    id: "in-game-music-download",
    name: "In-Game Music Download",
    shortName: "Game Music",
    category: "Audio",
    description: "The Happy Boo in-game music as a free MP3 download.",
    image: asset("assets/merch/previews/in-game-music.png"),
    downloadUrl: asset("downloads/happy-boo-in-game-music.mp3"),
    fileName: "happy-boo-in-game-music.mp3",
    fileType: "MP3 audio",
    accentColor: "#67dfc8",
    details: ["MP3", "Game music", "Audio"]
  }

];

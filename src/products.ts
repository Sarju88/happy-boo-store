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
    description: "An animated walking avatar using the original Happy Boo look.",
    image: asset("assets/pfps/classic-boo-walk.gif"),
    downloadUrl: asset("assets/pfps/classic-boo-walk.gif"),
    fileName: "classic-boo-profile-picture.gif",
    fileType: "GIF avatar",
    accentColor: "#ffd24b",
    details: ["256 x 256", "GIF", "Walking loop"]
  },
  {
    id: "berry-boo-avatar",
    name: "Berry Boo Profile Picture",
    shortName: "Berry Avatar",
    category: "Profile Pictures",
    description: "A bright berry skin walking avatar for social profiles, forums, and chat icons.",
    image: asset("assets/pfps/berry-boo-walk.gif"),
    downloadUrl: asset("assets/pfps/berry-boo-walk.gif"),
    fileName: "berry-boo-profile-picture.gif",
    fileType: "GIF avatar",
    accentColor: "#d83990",
    details: ["256 x 256", "GIF", "Walking loop"]
  },
  {
    id: "mint-boo-avatar",
    name: "Mint Boo Profile Picture",
    shortName: "Mint Avatar",
    category: "Profile Pictures",
    description: "A cool mint Happy Boo walking avatar with candy stripes and a soft teal palette.",
    image: asset("assets/pfps/mint-boo-walk.gif"),
    downloadUrl: asset("assets/pfps/mint-boo-walk.gif"),
    fileName: "mint-boo-profile-picture.gif",
    fileType: "GIF avatar",
    accentColor: "#67dfc8",
    details: ["256 x 256", "GIF", "Walking loop"]
  },
  {
    id: "gold-boo-avatar",
    name: "Gold Boo Profile Picture",
    shortName: "Gold Avatar",
    category: "Profile Pictures",
    description: "A bright golden Happy Boo walking avatar for profiles that need a coin-store shine.",
    image: asset("assets/pfps/gold-boo-walk.gif"),
    downloadUrl: asset("assets/pfps/gold-boo-walk.gif"),
    fileName: "gold-boo-profile-picture.gif",
    fileType: "GIF avatar",
    accentColor: "#ffc832",
    details: ["256 x 256", "GIF", "Walking loop"]
  },
  {
    id: "sappy-boo-avatar",
    name: "Sappy Boo Profile Picture",
    shortName: "Sappy Avatar",
    category: "Profile Pictures",
    description: "A leafy green Happy Boo walking avatar with a soft nature-inspired look.",
    image: asset("assets/pfps/sappy-boo-walk.gif"),
    downloadUrl: asset("assets/pfps/sappy-boo-walk.gif"),
    fileName: "sappy-boo-profile-picture.gif",
    fileType: "GIF avatar",
    accentColor: "#86d95b",
    details: ["256 x 256", "GIF", "Walking loop"]
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
  }
];

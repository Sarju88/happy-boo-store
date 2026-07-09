export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  accentColor: string;
  options: string[];
};

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

export const products: Product[] = [
  {
    id: "classic-boo-plush",
    name: "Classic Boo Plush",
    category: "Boo Skins",
    price: 24,
    description: "The original Happy Boo in soft desk-size plush form, ready for a fresh run.",
    image: asset("assets/boo/classic-boo.png"),
    accentColor: "#ffd24b",
    options: ["Small", "Collector"]
  },
  {
    id: "berry-boo-tee",
    name: "Berry Boo Tee",
    category: "Boo Skins",
    price: 29,
    description: "A punchy berry-pink tee with the cheerful skin from the in-game catalog.",
    image: asset("assets/boo/berry-boo.png"),
    accentColor: "#d83990",
    options: ["S", "M", "L", "XL"]
  },
  {
    id: "mint-boo-hoodie",
    name: "Mint Boo Hoodie",
    category: "Boo Skins",
    price: 52,
    description: "A cool mint hoodie with candy-bright stripes and a clean Happy Boo mark.",
    image: asset("assets/boo/mint-boo.png"),
    accentColor: "#67dfc8",
    options: ["S", "M", "L", "XL"]
  },
  {
    id: "gold-boo-pin",
    name: "Gold Boo Pin",
    category: "Boo Skins",
    price: 12,
    description: "A shiny coin-run enamel pin for players chasing the 100-coin skin energy.",
    image: asset("assets/boo/gold-boo.png"),
    accentColor: "#ffc832",
    options: ["Single", "Two-pack"]
  },
  {
    id: "sappy-boo-sticker",
    name: "Sappy Boo Sticker Pack",
    category: "Boo Skins",
    price: 9,
    description: "Leafy green Sappy Boo stickers with weatherproof finish for laptops and cases.",
    image: asset("assets/boo/sappy-boo.png"),
    accentColor: "#86d95b",
    options: ["Matte", "Gloss"]
  },
  {
    id: "food-pickup-pouch",
    name: "Food Pickup Pouch",
    category: "Survival Gear",
    price: 18,
    description: "A tiny zip pouch patterned after the pickups that help Boo stay healthy.",
    image: asset("assets/items/food-pickup.png"),
    accentColor: "#f58c3d",
    options: ["Snack", "Travel"]
  },
  {
    id: "bomb-cooldown-mug",
    name: "Bomb Cooldown Mug",
    category: "Survival Gear",
    price: 21,
    description: "A sturdy mug for the players who know when to hold a bomb and when to throw.",
    image: asset("assets/items/bomb.png"),
    accentColor: "#384b5e",
    options: ["11 oz", "15 oz"]
  },
  {
    id: "monster-wave-poster",
    name: "Monster Wave Poster",
    category: "Monster Waves",
    price: 16,
    description: "Bee and spike enemies arranged in a bright arcade-style wall print.",
    image: asset("assets/monsters/bee.png"),
    accentColor: "#ffb938",
    options: ["8x10", "12x18"]
  },
  {
    id: "spike-squad-keychain",
    name: "Spike Squad Keychain",
    category: "Monster Waves",
    price: 11,
    description: "A small charm inspired by the heavy spike monster from the survival field.",
    image: asset("assets/monsters/spike.png"),
    accentColor: "#7dc557",
    options: ["Single", "Pair"]
  }
];

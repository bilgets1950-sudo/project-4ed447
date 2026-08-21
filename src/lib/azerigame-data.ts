export type GameCard = {
  id: string;
  name: string;
  description: string;
  cover_url: string | null;
  logo: string;
  tone: "game-red" | "game-gold" | "game-blue" | "game-green";
};

export type Listing = {
  id: string;
  title: string;
  description: string | null;
  price_azn: number;
  status: "active";
  created_at: string;
  game_id: string;
  category: string;
  image_url?: string | null;
  images?: string[] | null;
  level?: number | null;
  rank?: string | null;
  seller_name: string;
  seller_id: string;
  rating: number;
};

export type ChatMessage = { id: string; text: string; sender_id: string; createdAt: string };
export type SellerChat = {
  id: string;
  buyer_id: string;
  seller_id: string;
  buyerName: string;
  sellerName: string;
  listingTitle: string;
  messages: ChatMessage[];
};

export type AppUser = {
  id: string;
  username: string;
  displayName: string;
  walletActive: number;
  walletFrozen: number;
};

export const CATEGORIES = ["Аккаунты", "Донат", "Бустинг", "Услуги"] as const;

export const BUYER_FEE_MULTIPLIER = 1.1;
export const buyerPrice = (price: number) => Number(price) * BUYER_FEE_MULTIPLIER;

export const GAMES: GameCard[] = [
  { id: "free-fire", name: "Free Fire", description: "Аккаунты и донат", cover_url: null, logo: "FF", tone: "game-red" },
  { id: "pubg-mobile", name: "PUBG Mobile", description: "Аккаунты и донат", cover_url: null, logo: "P", tone: "game-gold" },
  { id: "brawl-stars", name: "Brawl Stars", description: "Аккаунты и донат", cover_url: null, logo: "BS", tone: "game-blue" },
  { id: "clash-of-clans", name: "Clash of Clans", description: "Аккаунты и донат", cover_url: null, logo: "COC", tone: "game-green" },
];

const shot = (seed: string) => `https://picsum.photos/seed/${seed}/900/560`;

export const SEED_LISTINGS: Listing[] = [
  {
    id: "l-1",
    title: "Free Fire — аккаунт с эксклюзивными скинами",
    description:
      "Аккаунт привязан к почте, полный доступ. Много эксклюзивных скинов, пропуск элиты, редкие эмоции.",
    price_azn: 120,
    status: "active",
    created_at: "2026-08-01T10:00:00Z",
    game_id: "free-fire",
    category: "Аккаунты",
    images: [shot("ff-1"), shot("ff-2"), shot("ff-3"), shot("ff-4")],
    level: 62,
    rank: "Heroic",
    seller_id: "s-1",
    seller_name: "Rashad",
    rating: 4.9,
  },
  {
    id: "l-2",
    title: "PUBG Mobile — Conqueror аккаунт",
    description: "Сезонный Conqueror, много мифических нарядов, редкие скины на M416.",
    price_azn: 340,
    status: "active",
    created_at: "2026-08-03T10:00:00Z",
    game_id: "pubg-mobile",
    category: "Аккаунты",
    images: [shot("pubg-1"), shot("pubg-2"), shot("pubg-3")],
    level: 78,
    rank: "Conqueror",
    seller_id: "s-2",
    seller_name: "Elvin",
    rating: 4.7,
  },
  {
    id: "l-3",
    title: "UC 660 — быстрый донат PUBG Mobile",
    description: "Пополнение по ID за 10 минут. Официальный способ, без риска бана.",
    price_azn: 18,
    status: "active",
    created_at: "2026-08-05T10:00:00Z",
    game_id: "pubg-mobile",
    category: "Донат",
    images: [shot("uc-1"), shot("uc-2")],
    seller_id: "s-3",
    seller_name: "TopUpAZ",
    rating: 5,
  },
  {
    id: "l-4",
    title: "Brawl Stars — 40 бравлеров, много гаджетов",
    description: "Все легендарные бравлеры открыты, 25к кубков, куча скинов.",
    price_azn: 210,
    status: "active",
    created_at: "2026-08-06T10:00:00Z",
    game_id: "brawl-stars",
    category: "Аккаунты",
    images: [shot("bs-1"), shot("bs-2"), shot("bs-3"), shot("bs-4"), shot("bs-5")],
    level: 45,
    rank: "Мифический",
    seller_id: "s-4",
    seller_name: "Nigar",
    rating: 4.8,
  },
  {
    id: "l-5",
    title: "Бустинг ранга в Free Fire до Heroic",
    description: "Поднимем ранг за 2-3 дня. Работаем без читов, гарантия возврата.",
    price_azn: 55,
    status: "active",
    created_at: "2026-08-07T10:00:00Z",
    game_id: "free-fire",
    category: "Бустинг",
    images: [shot("boost-1"), shot("boost-2")],
    seller_id: "s-5",
    seller_name: "BoostTeam",
    rating: 4.6,
  },
  {
    id: "l-6",
    title: "Clash of Clans — TH14 макс. защита",
    description: "Максимальная ратуша 14, герои прокачаны, много книг и гемов.",
    price_azn: 430,
    status: "active",
    created_at: "2026-08-08T10:00:00Z",
    game_id: "clash-of-clans",
    category: "Аккаунты",
    images: [shot("coc-1"), shot("coc-2"), shot("coc-3")],
    level: 190,
    rank: "Titan",
    seller_id: "s-6",
    seller_name: "Kamran",
    rating: 4.9,
  },
  {
    id: "l-7",
    title: "Услуга: перенос аккаунта на вашу почту",
    description: "Безопасно отвяжем и привяжем аккаунт к вашим данным.",
    price_azn: 12,
    status: "active",
    created_at: "2026-08-09T10:00:00Z",
    game_id: "clash-of-clans",
    category: "Услуги",
    images: [shot("srv-1")],
    seller_id: "s-7",
    seller_name: "SafeDeal",
    rating: 4.5,
  },
  {
    id: "l-8",
    title: "Brawl Stars — Gems 950",
    description: "Донат гемов по тегу игрока, моментально.",
    price_azn: 26,
    status: "active",
    created_at: "2026-08-10T10:00:00Z",
    game_id: "brawl-stars",
    category: "Донат",
    images: [shot("gem-1"), shot("gem-2")],
    seller_id: "s-8",
    seller_name: "GemShop",
    rating: 4.4,
  },
];

export const listingPhotos = (listing: Listing) => {
  const fromImages = (listing.images ?? []).filter(Boolean) as string[];
  if (fromImages.length) return fromImages;
  return listing.image_url ? [listing.image_url] : [];
};

export const STORAGE = {
  user: "azerigame_user",
  listings: "azerigame_listings",
  chats: "azerigame_chats",
  favorites: "azerigame_favorites",
};

export function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeStorage(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

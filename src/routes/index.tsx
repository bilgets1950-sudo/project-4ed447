import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Bell,
  ChevronRight,
  Gamepad2,
  Heart,
  MessageCircle,
  Search,
  ShieldCheck,
  Star,
  UserRound,
} from "lucide-react";
import {
  BUYER_FEE_MULTIPLIER,
  CATEGORIES,
  GAMES,
  SEED_LISTINGS,
  STORAGE,
  buyerPrice,
  listingPhotos,
  readStorage,
  writeStorage,
  type AppUser,
  type GameCard,
  type Listing,
  type SellerChat,
} from "@/lib/azerigame-data";
import { ListingGallery } from "@/components/listing-gallery";
import { AuthModal } from "@/components/auth-modal";
import { PaymentModal } from "@/components/payment-modal";
import { CreateOfferForm } from "@/components/create-offer-form";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Azerigame — маркетплейс игровых аккаунтов" },
      {
        name: "description",
        content:
          "Azerigame — безопасная площадка для покупки и продажи игровых аккаунтов, доната и бустинга в Азербайджане.",
      },
      { property: "og:title", content: "Azerigame — маркетплейс игровых аккаунтов" },
      {
        property: "og:description",
        content:
          "Покупайте и продавайте аккаунты Free Fire, PUBG Mobile, Brawl Stars и Clash of Clans безопасно.",
      },
    ],
  }),
  component: Index,
});

type Screen = "home" | "offers" | "detail" | "form" | "favorites" | "chats" | "profile";

function Header({ onSearch }: { onSearch: () => void }) {
  return (
    <header className="topbar">
      <div className="brand">
        <span className="brand-mark">
          <ShieldCheck size={22} />
        </span>
        <span>Azerigame</span>
      </div>
      <div className="top-actions">
        <button aria-label="Поиск" onClick={onSearch}>
          <Search size={20} />
        </button>
        <button aria-label="Уведомления">
          <Bell size={20} />
        </button>
      </div>
    </header>
  );
}

function BottomNav({
  screen,
  setScreen,
  onProtectedNav,
}: {
  screen: Screen;
  setScreen: (s: Screen) => void;
  onProtectedNav: (s: "chats") => void;
}) {
  const items = [
    ["home", "Домой", Gamepad2],
    ["favorites", "Избранные", Heart],
    ["chats", "Чаты", MessageCircle],
    ["profile", "Профиль", UserRound],
  ] as const;
  return (
    <nav className="bottom-nav">
      {items.map(([id, label, Icon]) => (
        <button
          key={id}
          className={screen === id ? "active" : ""}
          onClick={() => (id === "chats" ? onProtectedNav("chats") : setScreen(id))}
        >
          <Icon size={20} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}

function OfferCard({ listing, onClick }: { listing: Listing; onClick: () => void }) {
  const cover = listingPhotos(listing)[0];
  return (
    <button className="offer-card" onClick={onClick}>
      <div
        className="offer-image"
        style={{
          backgroundImage: cover
            ? `linear-gradient(0deg, rgba(12,13,18,.78), transparent), url(${cover})`
            : undefined,
        }}
      >
        <strong>{buyerPrice(listing.price_azn).toFixed(2)} AZN</strong>
      </div>
      <div className="offer-copy">
        <small>{listing.category}</small>
        <h3>{listing.title}</h3>
        {(listing.level != null || listing.rank) && (
          <div className="listing-tags">
            {listing.level != null && <span>Уровень: {listing.level}</span>}
            {listing.rank && <span>Ранг: {listing.rank}</span>}
          </div>
        )}
        <div className="seller">
          <span className="avatar">{listing.seller_name[0]?.toUpperCase() ?? "S"}</span>
          <span>{listing.seller_name}</span>
          <span className="rating">
            <Star size={12} fill="currentColor" /> {listing.rating.toFixed(1)}
          </span>
        </div>
      </div>
    </button>
  );
}

function Catalog({
  listings,
  onOpenGame,
  onOpenListing,
}: {
  listings: Listing[];
  onOpenGame: (game: GameCard) => void;
  onOpenListing: (listing: Listing) => void;
}) {
  const [query, setQuery] = useState("");
  const [activeGame, setActiveGame] = useState<string>("all");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const normalizedQuery = query.trim().toLowerCase();

  const filtered = useMemo(
    () =>
      listings.filter((l) => {
        const matchesQuery = `${l.title} ${l.description ?? ""}`
          .toLowerCase()
          .includes(normalizedQuery);
        const matchesGame = activeGame === "all" || l.game_id === activeGame;
        const matchesCategory = activeCategory === "all" || l.category === activeCategory;
        return matchesQuery && matchesGame && matchesCategory;
      }),
    [listings, normalizedQuery, activeGame, activeCategory],
  );

  const countForGame = (id: string) => listings.filter((l) => l.game_id === id).length;
  const countForCategory = (name: string) =>
    listings.filter(
      (l) => l.category === name && (activeGame === "all" || l.game_id === activeGame),
    ).length;

  const isFiltered = activeGame !== "all" || activeCategory !== "all" || Boolean(normalizedQuery);

  return (
    <section className="screen">
      <div className="eyebrow">Добро пожаловать в Azerigame</div>
      <h1>
        Играй. Покупай.
        <br />
        <em>Побеждай.</em>
      </h1>
      <p className="lead">Безопасный маркетплейс игровых аккаунтов и ценностей в Азербайджане.</p>

      <div className="searchbox">
        <Search size={18} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Найти игру или предложение"
        />
      </div>

      <div className="section-heading">
        <h2>Популярные игры</h2>
        <span>{GAMES.length} игр</span>
      </div>
      <div className="game-grid">
        {GAMES.map((game, index) => (
          <button
            className={`game-card ${index === 0 ? "featured" : ""} ${game.tone}`}
            key={game.id}
            onClick={() => onOpenGame(game)}
          >
            <span className="game-icon">{game.logo}</span>
            <span>
              <strong>{game.name}</strong>
              <small>{game.description}</small>
            </span>
            <ChevronRight size={18} />
          </button>
        ))}
      </div>

      <div className="section-heading" style={{ marginTop: 26 }}>
        <h2>Новые предложения</h2>
      </div>

      <div className="filter-row" role="group" aria-label="Фильтр по играм">
        <button
          type="button"
          className={`filter-chip ${activeGame === "all" ? "active" : ""}`}
          onClick={() => setActiveGame("all")}
        >
          Все игры <i>{listings.length}</i>
        </button>
        {GAMES.map((game) => (
          <button
            key={game.id}
            type="button"
            className={`filter-chip ${activeGame === game.id ? "active" : ""}`}
            onClick={() => setActiveGame(activeGame === game.id ? "all" : game.id)}
          >
            {game.name} <i>{countForGame(game.id)}</i>
          </button>
        ))}
      </div>

      <div className="filter-row" role="group" aria-label="Фильтр по категориям">
        <button
          type="button"
          className={`filter-chip ${activeCategory === "all" ? "active" : ""}`}
          onClick={() => setActiveCategory("all")}
        >
          Все категории
        </button>
        {CATEGORIES.map((name) => (
          <button
            key={name}
            type="button"
            className={`filter-chip ${activeCategory === name ? "active" : ""}`}
            onClick={() => setActiveCategory(activeCategory === name ? "all" : name)}
          >
            {name} <i>{countForCategory(name)}</i>
          </button>
        ))}
      </div>

      <div className="filter-meta">
        <span>{filtered.length ? `Найдено: ${filtered.length}` : "Ничего не найдено"}</span>
        {isFiltered && (
          <button
            type="button"
            className="filter-reset"
            onClick={() => {
              setActiveGame("all");
              setActiveCategory("all");
              setQuery("");
            }}
          >
            Сбросить фильтры
          </button>
        )}
      </div>

      <div className="offer-grid">
        {filtered.map((l) => (
          <OfferCard key={l.id} listing={l} onClick={() => onOpenListing(l)} />
        ))}
      </div>

      {!filtered.length && (
        <div className="empty-state">
          <Search size={28} />
          <b>По вашему запросу ничего не найдено</b>
          <span>Попробуйте другой фильтр или измените формулировку.</span>
        </div>
      )}
    </section>
  );
}

function Offers({
  listings,
  game,
  onBack,
  onOpenListing,
  onSell,
}: {
  listings: Listing[];
  game: GameCard;
  onBack: () => void;
  onOpenListing: (l: Listing) => void;
  onSell: () => void;
}) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const gameListings = listings.filter((l) => l.game_id === game.id);
  const filtered = gameListings.filter(
    (l) => activeCategory === "all" || l.category === activeCategory,
  );

  return (
    <section className="screen">
      <button className="back-button" onClick={onBack}>
        <ArrowLeft size={15} /> Игры
      </button>
      <div className={`game-hero ${game.tone}`}>
        <span className="hero-badge">{game.logo}</span>
        <div>
          <h1>{game.name}</h1>
          <p>{game.description}</p>
        </div>
      </div>
      <div className="filter-row" role="group" aria-label="Фильтр по категориям">
        <button
          type="button"
          className={`filter-chip ${activeCategory === "all" ? "active" : ""}`}
          onClick={() => setActiveCategory("all")}
        >
          Все <i>{gameListings.length}</i>
        </button>
        {CATEGORIES.map((name) => (
          <button
            key={name}
            type="button"
            className={`filter-chip ${activeCategory === name ? "active" : ""}`}
            onClick={() => setActiveCategory(activeCategory === name ? "all" : name)}
          >
            {name} <i>{gameListings.filter((l) => l.category === name).length}</i>
          </button>
        ))}
      </div>
      <button className="sell-button" onClick={onSell}>
        + Начать продажу
      </button>
      <div className="section-heading offers-title">
        <h2>Новые предложения</h2>
        <span>{filtered.length ? `${filtered.length} лотов` : "Пока пусто"}</span>
      </div>
      <div className="offer-grid">
        {filtered.map((l) => (
          <OfferCard key={l.id} listing={l} onClick={() => onOpenListing(l)} />
        ))}
      </div>
      {!filtered.length && (
        <div className="empty-state">
          <Gamepad2 size={28} />
          <b>Пока нет объявлений, добавьте первое!</b>
          <span>Разместите своё предложение и найдите покупателя.</span>
        </div>
      )}
    </section>
  );
}

function Detail({
  listing,
  onBack,
  onBuy,
  onOpenChat,
  isFavorite,
  onToggleFavorite,
}: {
  listing: Listing | null;
  onBack: () => void;
  onBuy: (l: Listing) => void;
  onOpenChat: (l: Listing) => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}) {
  const [showSecurityNotice, setShowSecurityNotice] = useState(false);
  if (!listing)
    return (
      <section className="screen empty-state">
        <b>Объявление не найдено</b>
        <button className="back-button" onClick={onBack}>
          Вернуться в каталог
        </button>
      </section>
    );

  return (
    <section className="screen">
      <button className="back-button" onClick={onBack}>
        <ArrowLeft size={15} /> К объявлениям
      </button>
      <div className="detail-title">
        <div>
          <small>
            {GAMES.find((g) => g.id === listing.game_id)?.name} · {listing.category}
          </small>
          <h1>{listing.title}</h1>
          {(listing.level != null || listing.rank) && (
            <div className="listing-tags detail-tags">
              {listing.level != null && <span>Уровень: {listing.level}</span>}
              {listing.rank && <span>Ранг: {listing.rank}</span>}
            </div>
          )}
        </div>
        <div className="icon-row">
          <button
            type="button"
            className="favorite-heart"
            aria-label={isFavorite ? "Удалить из избранного" : "Добавить в избранное"}
            aria-pressed={isFavorite}
            onClick={onToggleFavorite}
            style={{ color: isFavorite ? "var(--primary)" : undefined }}
          >
            <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
          </button>
          <button
            type="button"
            className="security-shield"
            aria-label="Гарантия безопасности"
            onClick={() => {
              setShowSecurityNotice(true);
              window.setTimeout(() => setShowSecurityNotice(false), 5000);
            }}
          >
            <ShieldCheck size={20} />
          </button>
        </div>
      </div>

      {showSecurityNotice && (
        <div className="security-toast" role="status">
          Гарантия безопасности Azerigame: деньги переводятся продавцу только после того, как вы
          лично проверите аккаунт!
        </div>
      )}

      <ListingGallery photos={listingPhotos(listing)} title={listing.title} />

      <div className="buy-card">
        <div className="price-line">
          <span>Цена</span>
          <strong>
            {buyerPrice(listing.price_azn).toFixed(2)} <small>AZN</small>
          </strong>
        </div>
        <p className="payment-label">Оплата через m10 или банковскую карту</p>
        <button className="buy-button" onClick={() => onBuy(listing)}>
          Купить <ChevronRight size={18} />
        </button>
        <button className="chat-button" onClick={() => onOpenChat(listing)}>
          <MessageCircle size={17} /> ОТКРЫТЬ ЧАТ
        </button>
        <div className="secure-note">
          <ShieldCheck size={15} /> Защита средств до завершения сделки
        </div>
      </div>

      <div className="description">
        <h2>Описание</h2>
        <p>{listing.description || "Продавец пока не добавил подробное описание."}</p>
        <div className="seller-card">
          <span className="avatar large">{listing.seller_name[0]?.toUpperCase() ?? "S"}</span>
          <div>
            <b>{listing.seller_name}</b>
            <small>
              <Star size={12} fill="currentColor" /> {listing.rating.toFixed(1)}
            </small>
          </div>
        </div>
      </div>
    </section>
  );
}

function Profile({
  user,
  onLoginClick,
  onSignOut,
  onNicknameSaved,
}: {
  user: AppUser | null;
  onLoginClick: () => void;
  onSignOut: () => void;
  onNicknameSaved: (nickname: string) => void;
}) {
  const [nickname, setNickname] = useState("");
  useEffect(() => {
    if (user) setNickname(user.displayName);
  }, [user]);

  if (!user) {
    return (
      <section className="screen profile-screen">
        <div className="profile-head">
          <div className="profile-avatar">
            <UserRound size={28} />
          </div>
          <h1>Вы не авторизованы</h1>
          <p>Войдите, чтобы видеть баланс, сделки и настройки профиля.</p>
        </div>
        <button className="publish-button" onClick={onLoginClick}>
          Войти в аккаунт
        </button>
      </section>
    );
  }

  return (
    <section className="screen profile-screen">
      <div className="profile-head">
        <div className="profile-avatar">{user.displayName[0]?.toUpperCase() ?? "S"}</div>
        <h1>{user.displayName}</h1>
        <p className="profile-status">
          <span className="status-dot" aria-hidden="true" />
          онлайн
        </p>
      </div>
      <div className="nickname-editor">
        <label htmlFor="profile-nickname">Ваш никнейм</label>
        <div>
          <input
            id="profile-nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            minLength={2}
          />
          <button
            type="button"
            onClick={() => nickname.trim().length > 1 && onNicknameSaved(nickname.trim())}
          >
            Сохранить
          </button>
        </div>
      </div>
      <div className="wallet">
        <span>Кошелёк</span>
        <div className="balance-grid">
          <div>
            <small>Активный баланс</small>
            <b>
              {user.walletActive.toFixed(2)} <i>AZN</i>
            </b>
          </div>
          <div>
            <small>Замороженный баланс</small>
            <b>
              {user.walletFrozen.toFixed(2)} <i>AZN</i>
            </b>
          </div>
        </div>
      </div>
      <div className="settings-list">
        <button>
          <UserRound size={20} /> Мой профиль
        </button>
        <button>
          <ShieldCheck size={20} /> Настройки
        </button>
        <button>
          <Bell size={20} /> Уведомления
        </button>
      </div>
      <button className="logout-button" type="button" onClick={onSignOut}>
        Выйти из аккаунта
      </button>
    </section>
  );
}

function Chats({
  chats,
  activeChatId,
  setActiveChatId,
  onSendMessage,
  currentUserId,
}: {
  chats: SellerChat[];
  activeChatId: string | null;
  setActiveChatId: (id: string | null) => void;
  onSendMessage: (text: string) => void;
  currentUserId: string;
}) {
  const [message, setMessage] = useState("");
  const activeChat = chats.find((chat) => chat.id === activeChatId) ?? null;

  if (activeChat) {
    const participantName =
      activeChat.seller_id === currentUserId ? activeChat.buyerName : activeChat.sellerName;
    return (
      <section className="screen chat-screen">
        <button className="back-button" type="button" onClick={() => setActiveChatId(null)}>
          <ArrowLeft size={15} /> Все чаты
        </button>
        <div className="page-title">
          <div>
            <h1>{participantName}</h1>
            <p>{activeChat.listingTitle}</p>
          </div>
          <MessageCircle size={20} />
        </div>
        <div className="chat-messages">
          {activeChat.messages.map((item) => (
            <div
              className={`chat-bubble ${item.sender_id === currentUserId ? "mine" : "theirs"}`}
              key={item.id}
            >
              {item.text}
            </div>
          ))}
        </div>
        <form
          className="chat-compose"
          onSubmit={(event) => {
            event.preventDefault();
            if (!message.trim()) return;
            onSendMessage(message.trim());
            setMessage("");
          }}
        >
          <input
            aria-label="Сообщение"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Написать сообщение"
          />
          <button type="submit" aria-label="Отправить сообщение">
            <ChevronRight size={18} />
          </button>
        </form>
      </section>
    );
  }

  return (
    <section className="screen">
      <div className="page-title">
        <h1>Чаты</h1>
        <MessageCircle size={20} />
      </div>
      <div className="chat-item support">
        <span className="chat-avatar">
          <ShieldCheck size={18} />
        </span>
        <div>
          <b>Поддержка Azerigame</b>
          <p>Мы всегда рядом и готовы помочь</p>
        </div>
        <span className="online-dot" />
      </div>
      {chats.length ? (
        <div className="chat-list">
          {chats.map((chat) => (
            <button
              className="chat-item"
              type="button"
              key={chat.id}
              onClick={() => setActiveChatId(chat.id)}
            >
              <span className="chat-avatar">
                {(chat.seller_id === currentUserId
                  ? chat.buyerName
                  : chat.sellerName)[0]?.toUpperCase()}
              </span>
              <div>
                <b>{chat.seller_id === currentUserId ? chat.buyerName : chat.sellerName}</b>
                <p>{chat.listingTitle}</p>
                <small>{chat.messages.at(-1)?.text}</small>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <MessageCircle size={28} />
          <b>Ваши сделки и сообщения появятся здесь</b>
          <span>Откройте чат с продавцом из объявления.</span>
        </div>
      )}
    </section>
  );
}

function Index() {
  const [screen, setScreen] = useState<Screen>("home");
  const [selectedGame, setSelectedGame] = useState<GameCard>(GAMES[0]!);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [authIntent, setAuthIntent] = useState<"sell" | "chats" | null>(null);
  const [paymentListing, setPaymentListing] = useState<Listing | null>(null);
  const [user, setUser] = useState<AppUser | null>(null);
  const [localListings, setLocalListings] = useState<Listing[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [chats, setChats] = useState<SellerChat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [chatError, setChatError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setUser(readStorage<AppUser | null>(STORAGE.user, null));
    setLocalListings(readStorage<Listing[]>(STORAGE.listings, []));
    setFavorites(readStorage<string[]>(STORAGE.favorites, []));
    setChats(readStorage<SellerChat[]>(STORAGE.chats, []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    writeStorage(STORAGE.user, user);
    writeStorage(STORAGE.listings, localListings);
    writeStorage(STORAGE.favorites, favorites);
    writeStorage(STORAGE.chats, chats);
  }, [hydrated, user, localListings, favorites, chats]);

  const listings = useMemo(() => [...localListings, ...SEED_LISTINGS], [localListings]);
  const favoriteListings = listings.filter((l) => favorites.includes(l.id));
  const currentUserId = user?.id ?? "guest";

  function openAuth(intent: "sell" | "chats" | null = null) {
    setAuthIntent(intent);
    setAuthOpen(true);
  }

  function handleAuthSuccess(nextUser: AppUser) {
    setUser(nextUser);
    setAuthOpen(false);
    if (authIntent === "sell") setScreen("form");
    if (authIntent === "chats") setScreen("chats");
    setAuthIntent(null);
  }

  function handleOpenChat(listing: Listing) {
    if (!user) {
      openAuth("chats");
      return;
    }
    if (listing.seller_id === user.id) {
      setChatError("Вы не можете написать самому себе");
      window.setTimeout(() => setChatError(null), 4000);
      return;
    }
    const chatId = `listing-${listing.id}`;
    setChats((current) =>
      current.some((chat) => chat.id === chatId)
        ? current
        : [
            ...current,
            {
              id: chatId,
              buyer_id: user.id,
              seller_id: listing.seller_id,
              buyerName: user.displayName,
              sellerName: listing.seller_name,
              listingTitle: listing.title,
              messages: [
                {
                  id: `${chatId}-welcome`,
                  text: `Здравствуйте! Меня интересует ваш товар "${listing.title}"`,
                  sender_id: user.id,
                  createdAt: new Date().toISOString(),
                },
              ],
            },
          ],
    );
    setActiveChatId(chatId);
    setScreen("chats");
  }

  function handleSendMessage(text: string) {
    if (!activeChatId) return;
    setChats((current) =>
      current.map((chat) =>
        chat.id === activeChatId
          ? {
              ...chat,
              messages: [
                ...chat.messages,
                {
                  id: `${chat.id}-${Date.now()}`,
                  text,
                  sender_id: currentUserId,
                  createdAt: new Date().toISOString(),
                },
              ],
            }
          : chat,
      ),
    );
  }

  function openListing(listing: Listing) {
    setSelectedListing(listing);
    setSelectedGame(GAMES.find((g) => g.id === listing.game_id) ?? GAMES[0]!);
    setScreen("detail");
  }

  return (
    <main className="app-shell">
      <Header onSearch={() => setScreen("home")} />
      <div className="app-content">
        {screen === "home" && (
          <Catalog
            listings={listings}
            onOpenGame={(game) => {
              setSelectedGame(game);
              setScreen("offers");
            }}
            onOpenListing={openListing}
          />
        )}
        {screen === "offers" && (
          <Offers
            listings={listings}
            game={selectedGame}
            onBack={() => setScreen("home")}
            onOpenListing={openListing}
            onSell={() => (user ? setScreen("form") : openAuth("sell"))}
          />
        )}
        {screen === "detail" && (
          <Detail
            listing={selectedListing}
            onBack={() => setScreen("offers")}
            onBuy={(l) => setPaymentListing(l)}
            onOpenChat={handleOpenChat}
            isFavorite={selectedListing ? favorites.includes(selectedListing.id) : false}
            onToggleFavorite={() =>
              selectedListing &&
              setFavorites((current) =>
                current.includes(selectedListing.id)
                  ? current.filter((id) => id !== selectedListing.id)
                  : [selectedListing.id, ...current],
              )
            }
          />
        )}
        {screen === "form" && (
          <CreateOfferForm
            game={selectedGame}
            user={user}
            onBack={() => setScreen("home")}
            onPublished={(listing) => {
              setLocalListings((current) => [listing, ...current]);
              setSelectedListing(listing);
              setScreen("detail");
            }}
          />
        )}
        {screen === "favorites" && (
          <section className="screen">
            <h1>Избранные</h1>
            {favoriteListings.length ? (
              <div className="offer-grid">
                {favoriteListings.map((listing) => (
                  <OfferCard
                    key={listing.id}
                    listing={listing}
                    onClick={() => openListing(listing)}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <Heart size={28} />
                <b>У вас пока нет сохранённых объявлений</b>
              </div>
            )}
          </section>
        )}
        {screen === "chats" && (
          <Chats
            chats={chats}
            activeChatId={activeChatId}
            setActiveChatId={setActiveChatId}
            onSendMessage={handleSendMessage}
            currentUserId={currentUserId}
          />
        )}
        {screen === "profile" && (
          <Profile
            user={user}
            onLoginClick={() => openAuth(null)}
            onSignOut={() => {
              setUser(null);
              setScreen("home");
            }}
            onNicknameSaved={(nickname) =>
              setUser((current) => (current ? { ...current, displayName: nickname } : current))
            }
          />
        )}
      </div>

      <BottomNav
        screen={screen}
        setScreen={setScreen}
        onProtectedNav={(target) => (user ? setScreen(target) : openAuth(target))}
      />

      {chatError && (
        <div className="chat-error-toast" role="alert">
          {chatError}
        </div>
      )}

      {authOpen && (
        <AuthModal
          onClose={() => {
            setAuthOpen(false);
            setAuthIntent(null);
          }}
          onSuccess={handleAuthSuccess}
        />
      )}

      {paymentListing && (
        <PaymentModal
          listing={{
            id: paymentListing.id,
            title: paymentListing.title,
            price_azn: paymentListing.price_azn * BUYER_FEE_MULTIPLIER,
          }}
          onClose={() => setPaymentListing(null)}
          onPurchased={() => {
            handleOpenChat(paymentListing);
            setPaymentListing(null);
          }}
        />
      )}
    </main>
  );
}

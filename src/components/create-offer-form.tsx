import { useState } from "react";
import { ArrowLeft, ImagePlus, X } from "lucide-react";
import { CATEGORIES, type GameCard, type Listing, type AppUser } from "@/lib/azerigame-data";

export function CreateOfferForm({
  game,
  user,
  onBack,
  onPublished,
}: {
  game: GameCard;
  user: AppUser | null;
  onBack: () => void;
  onPublished: (listing: Listing) => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [level, setLevel] = useState("");
  const [rank, setRank] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [error, setError] = useState("");

  function addPhotos(files: FileList | null) {
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => setPhotos((current) => [...current, String(reader.result)]);
      reader.readAsDataURL(file);
    });
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const numericPrice = Number(price);
    if (title.trim().length < 4 || !numericPrice) {
      setError("Укажите название (от 4 символов) и цену.");
      return;
    }
    onPublished({
      id: `local-${Date.now()}`,
      title: title.trim(),
      description: description.trim() || null,
      price_azn: numericPrice,
      status: "active",
      created_at: new Date().toISOString(),
      game_id: game.id,
      category,
      images: photos,
      level: level ? Number(level) : null,
      rank: rank.trim() || null,
      seller_id: user?.id ?? "guest",
      seller_name: user?.displayName ?? "Продавец",
      rating: 5,
    });
  }

  return (
    <section className="screen">
      <button className="back-button" type="button" onClick={onBack}>
        <ArrowLeft size={15} /> Назад
      </button>
      <div className="page-title">
        <h1>Новое предложение</h1>
      </div>
      <p className="lead">Игра: {game.name}</p>

      <form className="modal-form" onSubmit={submit}>
        <label>
          Название
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Например: Аккаунт с редкими скинами"
          />
        </label>
        <label>
          Категория
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              display: "block",
              width: "100%",
              marginTop: 8,
              padding: 13,
              borderRadius: 11,
              background: "#1d1e28",
              color: "#eee",
              border: "1px solid var(--line)",
            }}
          >
            {CATEGORIES.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Цена, AZN
          <input
            value={price}
            inputMode="decimal"
            onChange={(e) => setPrice(e.target.value)}
            placeholder="120"
          />
        </label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <label>
            Уровень
            <input
              value={level}
              inputMode="numeric"
              onChange={(e) => setLevel(e.target.value)}
              placeholder="60"
            />
          </label>
          <label>
            Ранг
            <input value={rank} onChange={(e) => setRank(e.target.value)} placeholder="Heroic" />
          </label>
        </div>
        <label>
          Описание
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Что входит в аккаунт, как проходит передача"
            style={{
              display: "block",
              width: "100%",
              marginTop: 8,
              padding: 13,
              borderRadius: 11,
              background: "#1d1e28",
              color: "#eee",
              border: "1px solid var(--line)",
            }}
          />
        </label>

        <span style={{ display: "block", color: "#9d9eae", fontSize: 12, margin: "12px 0 8px" }}>
          Скриншоты
        </span>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
          {photos.map((photo, index) => (
            <div className="photo-thumb" key={`${index}-${photo.slice(0, 20)}`}>
              <img src={photo} alt={`Скриншот ${index + 1}`} />
              <button
                className="photo-remove"
                type="button"
                aria-label="Удалить фото"
                onClick={() => setPhotos((current) => current.filter((_, i) => i !== index))}
              >
                <X size={12} />
              </button>
            </div>
          ))}
          <label className="photo-add">
            <ImagePlus size={18} />
            Добавить
            <input
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={(e) => addPhotos(e.target.files)}
            />
          </label>
        </div>

        {error && <p style={{ color: "#ff8066", fontSize: 12 }}>{error}</p>}
        <button className="publish-button" type="submit" style={{ width: "100%", marginTop: 16 }}>
          Опубликовать
        </button>
      </form>
    </section>
  );
}

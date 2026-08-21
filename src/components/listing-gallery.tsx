import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";

export function ListingGallery({ photos, title }: { photos: string[]; title: string }) {
  const [index, setIndex] = useState(0);
  const startX = useRef<number | null>(null);
  const count = photos.length;

  useEffect(() => {
    setIndex(0);
  }, [title]);

  if (!count) {
    return (
      <div
        className="gallery gallery-empty"
        style={{ minHeight: 180, borderRadius: 17, margin: "16px 0" }}
      >
        <ImageOff size={28} />
        <span>Продавец не прикрепил скриншоты</span>
      </div>
    );
  }

  const go = (next: number) => setIndex(((next % count) + count) % count);

  return (
    <div className="gallery">
      <div
        className="gallery-viewport"
        onTouchStart={(e) => {
          startX.current = e.touches[0]?.clientX ?? null;
        }}
        onTouchEnd={(e) => {
          if (startX.current === null) return;
          const delta = (e.changedTouches[0]?.clientX ?? startX.current) - startX.current;
          if (Math.abs(delta) > 40) go(index + (delta < 0 ? 1 : -1));
          startX.current = null;
        }}
      >
        <div className="gallery-track" style={{ transform: `translateX(-${index * 100}%)` }}>
          {photos.map((photo, i) => (
            <div className="gallery-slide" key={`${photo}-${i}`}>
              <img
                src={photo}
                alt={`${title} — скриншот ${i + 1}`}
                loading={i === 0 ? "eager" : "lazy"}
              />
            </div>
          ))}
        </div>

        <span className="gallery-counter">
          {index + 1}/{count}
        </span>

        {count > 1 && (
          <>
            <button
              type="button"
              className="gallery-arrow prev"
              aria-label="Предыдущее фото"
              onClick={() => go(index - 1)}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              className="gallery-arrow next"
              aria-label="Следующее фото"
              onClick={() => go(index + 1)}
            >
              <ChevronRight size={18} />
            </button>
            <div className="gallery-dots">
              {photos.map((photo, i) => (
                <button
                  key={`dot-${photo}-${i}`}
                  type="button"
                  aria-label={`Показать фото ${i + 1}`}
                  className={i === index ? "active" : ""}
                  onClick={() => setIndex(i)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="gallery-thumbs">
          {photos.map((photo, i) => (
            <button
              key={`thumb-${photo}-${i}`}
              type="button"
              className={i === index ? "active" : ""}
              aria-label={`Миниатюра ${i + 1}`}
              onClick={() => setIndex(i)}
            >
              <img src={photo} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import { ShieldCheck, X, Sparkles } from "lucide-react";
import type { AppUser } from "@/lib/azerigame-data";

export function AuthModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: (user: AppUser) => void;
}) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function makeUser(name: string): AppUser {
    return {
      id: `u-${name.toLowerCase().replace(/[^a-z0-9]/g, "") || "guest"}`,
      username: name,
      displayName: name,
      walletActive: 240.5,
      walletFrozen: 60,
    };
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = (mode === "register" ? username : email.split("@")[0]) ?? "";
    if (!name.trim() || password.length < 4) {
      setError("Проверьте данные: пароль от 4 символов.");
      return;
    }
    onSuccess(makeUser(name.trim()));
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" type="button" aria-label="Закрыть" onClick={onClose}>
          <X size={16} />
        </button>
        <div className="modal-head">
          <span className="modal-badge">
            <ShieldCheck size={20} />
          </span>
          <h2>{mode === "login" ? "Вход в Azerigame" : "Создать аккаунт"}</h2>
          <p>Безопасные сделки, кошелёк и чаты с продавцами.</p>
        </div>

        <button
          className="demo-login-button"
          type="button"
          onClick={() => onSuccess(makeUser("Demo User"))}
        >
          <Sparkles size={16} /> Войти как демо-пользователь
        </button>
        <div className="modal-divider">или</div>

        <form className="modal-form" onSubmit={submit}>
          {mode === "register" && (
            <label>
              Никнейм
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ваш никнейм"
              />
            </label>
          )}
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@mail.az"
              required
            />
          </label>
          <label>
            Пароль
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              required
            />
          </label>
          {error && (
            <p className="muted" style={{ color: "#ff8066", fontSize: 12 }}>
              {error}
            </p>
          )}
          <button className="publish-button" type="submit">
            {mode === "login" ? "Войти" : "Зарегистрироваться"}
          </button>
        </form>

        <button
          className="modal-switch"
          type="button"
          onClick={() => setMode(mode === "login" ? "register" : "login")}
        >
          {mode === "login" ? "Нет аккаунта? Зарегистрируйтесь" : "Уже есть аккаунт? Войти"}
        </button>
      </div>
    </div>
  );
}

import { useState } from "react";
import { X, CreditCard, Wallet, ShieldCheck, CheckCircle2, Smartphone, Landmark } from "lucide-react";

export type PayableListing = { id: string; title: string; price_azn: number };

const METHODS = [
  { id: "m10", label: "m10", sub: "Мобильный кошелёк", icon: Smartphone },
  { id: "card", label: "Банковская карта", sub: "Visa / Mastercard", icon: CreditCard },
  { id: "emanat", label: "eManat", sub: "Оплата в терминале", icon: Landmark },
  { id: "balance", label: "Внутренний баланс", sub: "Azerigame Wallet", icon: Wallet },
] as const;

type Step = "select" | "processing" | "success";

export function PaymentModal({
  listing,
  onClose,
  onPurchased,
}: {
  listing: PayableListing;
  onClose: () => void;
  onPurchased: () => void;
}) {
  const [method, setMethod] = useState<(typeof METHODS)[number]["id"]>("m10");
  const [step, setStep] = useState<Step>("select");

  function confirm() {
    setStep("processing");
    window.setTimeout(() => {
      setStep("success");
      window.setTimeout(onPurchased, 1200);
    }, 1400);
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" onClick={step === "select" ? onClose : undefined}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        {step === "select" && (
          <>
            <button className="modal-close" type="button" aria-label="Закрыть" onClick={onClose}>
              <X size={16} />
            </button>
            <div className="modal-head">
              <span className="modal-badge">
                <ShieldCheck size={20} />
              </span>
              <h2>Оплата заказа</h2>
              <p>{listing.title}</p>
            </div>
            <div className="pay-amount">
              <span>К оплате</span>
              <strong>{listing.price_azn.toFixed(2)} AZN</strong>
            </div>
            <div className="pay-method-list">
              {METHODS.map(({ id, label, sub, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  className={`pay-method ${method === id ? "selected" : ""}`}
                  onClick={() => setMethod(id)}
                >
                  <Icon size={18} />
                  <span>
                    <b>{label}</b>
                    <small>{sub}</small>
                  </span>
                </button>
              ))}
            </div>
            <button className="publish-button" type="button" onClick={confirm} style={{ width: "100%" }}>
              Подтвердить оплату
            </button>
          </>
        )}
        {step === "processing" && (
          <div className="pay-status">
            <div className="pay-spinner" />
            <b>Обрабатываем платёж…</b>
            <span>Не закрывайте окно</span>
          </div>
        )}
        {step === "success" && (
          <div className="pay-status success">
            <CheckCircle2 size={40} />
            <b>Оплата прошла успешно</b>
            <span>Средства заморожены до подтверждения сделки</span>
          </div>
        )}
      </div>
    </div>
  );
}

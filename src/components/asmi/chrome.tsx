import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import logo from "@/assets/asmi-mark-ink.png.asset.json";
import { useApp } from "@/lib/app-context";
import { SUPPORT_EMAIL, SUPPORT_TEXT_NUMBER } from "@/config";

export function Plate({ base, lime, alt, w, h, eager, settle, className = "" }: {
  base: string; lime?: string; alt: string; w: number; h: number; eager?: boolean; settle?: boolean; className?: string;
}) {
  return (
    <div className={`plate ${settle ? "settle" : ""} ${className}`}>
      <img src={base} alt={alt} width={w} height={h} loading={eager ? "eager" : "lazy"} fetchPriority={eager ? "high" : undefined} decoding="async" />
      {lime && <img className="lime-plate" src={lime} alt="" aria-hidden width={w} height={h} loading={eager ? "eager" : "lazy"} decoding="async" />}
    </div>
  );
}

export function Checks({ items }: { items: string[] }) {
  return (
    <ul className="checks">
      {items.map((c) => (
        <li key={c} className="ck">{c}</li>
      ))}
    </ul>
  );
}

export function TopBar() {
  const { lang, setLang, t } = useApp();
  return (
    <header className="wrap top">
      <Link to="/" aria-label="Asmi home">
        <img src={logo.url} alt="Asmi" width={79} height={30} style={{ height: 30, width: "auto" }} />
      </Link>
      <div className="flex items-center gap-5">
        {SUPPORT_TEXT_NUMBER && (
          <a className="hidden lg:inline font-semibold" href={`sms:${SUPPORT_TEXT_NUMBER}`}>{t.top.textUs}</a>
        )}
        <div className="lang" role="group" aria-label={t.top.langLabel}>
          <button type="button" aria-pressed={lang === "en"} onClick={() => setLang("en")} lang="en">EN</button>
          <button type="button" aria-pressed={lang === "es"} onClick={() => setLang("es")} lang="es">ES</button>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  const { t } = useApp();
  return (
    <footer className="wrap" style={{ padding: "30px 20px 48px", fontSize: 15, color: "var(--muted)" }}>
      <img src={logo.url} alt="Asmi" width={69} height={26} style={{ height: 26, width: "auto", marginBottom: 12 }} loading="lazy" />
      <p>Humint Labs, Inc. 710 Lakeway Drive, Suite 200, Sunnyvale, CA 94085</p>
      <p className="mt-2">
        {t.footer.questions} <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
        {SUPPORT_TEXT_NUMBER && (
          <> · {t.footer.text} <a href={`sms:${SUPPORT_TEXT_NUMBER}`}>{SUPPORT_TEXT_NUMBER}</a></>
        )}
      </p>
      <p className="mt-2">© 2026 Humint Labs, Inc.</p>
    </footer>
  );
}

export function SimplePage({ children }: { children: ReactNode }) {
  return (
    <>
      <TopBar />
      <main className="wrap py-8">{children}</main>
      <Footer />
    </>
  );
}

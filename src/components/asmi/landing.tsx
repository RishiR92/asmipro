import { useEffect, useRef, useState } from "react";
import heroBase from "@/assets/scene-hero3-base.webp.asset.json";
import heroLime from "@/assets/scene-hero3-lime.webp.asset.json";
import paidArt from "@/assets/scene-paid.webp.asset.json";
import invBase from "@/assets/scene-invoice-base.webp.asset.json";
import invLime from "@/assets/scene-invoice-lime.webp.asset.json";
import metaLogo from "@/assets/meta-ink.svg.asset.json";
import dmLogo from "@/assets/deepmind-ink.svg.asset.json";
import snapLogo from "@/assets/snapchat-ink.svg.asset.json";
import rishPhoto from "@/assets/rish-founder.jpg.asset.json";
import satwikPhoto from "@/assets/satwik-founder.png.asset.json";
import { track, useApp } from "@/lib/app-context";
import { showCounts, showRecent, spotsLeft, useStats, type Stats } from "@/lib/stats";
import { TRADE_KEYS } from "@/lib/dict";
import {
  CITY_SPOTS, COMMISSION_START_PERCENT, CREW_FREE, HAS_PRO_QUOTE, NO_APP_NEEDED, PAYOUT_TIMING, PRO_QUOTE, SHOW_FOUNDER_PHOTOS,
  SPANISH_CALLS, SUPPORT_EMAIL, SUPPORT_TEXT_NUMBER,
} from "@/config";
import { Checks, Footer, Plate, TopBar } from "./chrome";
import { DayThread } from "./day-thread";
import { SignupSheet } from "./signup";

function LiveLine({ stats, loading }: { stats: Stats | undefined; loading: boolean }) {
  const { t, city } = useApp();
  if (loading) return <p className="live" aria-hidden><span className="skel" /></p>;
  if (!showCounts(stats)) return null;
  const left = spotsLeft(stats, city);
  return (
    <p className="live">
      <i aria-hidden />
      <span>
        {t.live.pros(stats!.total)}
        {left != null && city && ` ${t.live.left(left, t.cities[city])}`}
      </span>
    </p>
  );
}

function Hero({ stats, loading, btnRef }: { stats: Stats | undefined; loading: boolean; btnRef: React.RefObject<HTMLButtonElement | null> }) {
  const { t, variant, openSheet } = useApp();
  return (
    <section style={{ paddingTop: 4, paddingBottom: 36 }}>
      <div className="wrap lg:grid lg:grid-cols-2 lg:items-center lg:gap-12">
        <div>
          <p className="eyebrow">{t.hero.eyebrow}</p>
          <h1>{t.hero.h1[variant]}</h1>
          <p className="sub hero-sub">{t.hero.sub}</p>
          <p className="hero-modes">{t.hero.modes}</p>
          <div style={{ marginTop: 22 }} className="lg:max-w-[360px]">
            <button ref={btnRef} type="button" className="btn" onClick={() => openSheet("hero")}>{t.cta}</button>
            <Checks items={t.checks} />
            <LiveLine stats={stats} loading={loading} />
          </div>
        </div>
        <div className="relative" style={{ marginTop: 22, marginBottom: 14 }}>
          <Plate base={heroBase.url} lime={heroLime.url} alt={t.hero.artAlt} w={1000} h={747} eager settle />
          <div className="chip">
            <span className="tag">{t.example}</span>
            <p>{t.hero.chipTitle}</p>
            <small>{t.hero.chipSub}</small>
          </div>
        </div>
      </div>
    </section>
  );
}

function Trust() {
  const { t } = useApp();
  const tr = t.trust;
  return (
    <button
      type="button"
      className="band block w-full text-left cursor-pointer"
      style={{ padding: "14px 0" }}
      aria-label={tr.aria}
      onClick={() => document.getElementById("team")?.scrollIntoView({ behavior: "smooth" })}
    >
      <div className="wrap flex flex-col gap-2 lg:flex-row lg:justify-between">
        <span className="trust-item">
          <img src={metaLogo.url} alt="" width={28} height={22} style={{ width: 28, height: 22 }} />
          <img src={dmLogo.url} alt="" width={22} height={22} style={{ width: 22, height: 22 }} />
          <span>{tr.team[0]}<b>{tr.team[1]}</b>{tr.team[2]}<b>{tr.team[3]}</b></span>
        </span>
        <span className="trust-item">
          <img src={snapLogo.url} alt="" width={22} height={22} style={{ width: 22, height: 22 }} />
          <span>{tr.backed[0]}<b>{tr.backed[1]}</b></span>
        </span>
        <span className="trust-item">
          <b className="tnum" style={{ fontSize: 16 }}>2,500+</b>
          <span>{tr.biz}</span>
        </span>
      </div>
    </button>
  );
}

function Pain() {
  const { t } = useApp();
  return (
    <section className="sec">
      <div className="wrap">
        <h2>{t.pain.h2}</h2>
        <div className="obj pains lg:max-w-[640px]" style={{ marginTop: 18 }}>
          {t.pain.items.map((p) => (
            <p key={p} className="pain"><span className="xmark" aria-hidden />{p}</p>
          ))}
        </div>
        <p style={{ marginTop: 16, fontSize: 22, fontWeight: 700, color: "var(--ink)" }}>{t.pain.fix}</p>
      </div>
    </section>
  );
}

function TwoThings() {
  const { t } = useApp();
  const tw = t.two;
  return (
    <section className="sec" style={{ paddingTop: 8 }}>
      <div className="wrap">
        <h2>{tw.h2}</h2>
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start" style={{ marginTop: 20 }}>
          <article className="obj">
            <div style={{ borderBottom: "2px solid var(--ink)", background: "var(--paper)" }}>
              <img src={paidArt.url} alt="" width={1000} height={811} loading="lazy" decoding="async" />
            </div>
            <div className="grid" style={{ gridTemplateColumns: "1fr 46px" }}>
              <div style={{ padding: 18 }}>
                <span className="label">{tw.paidLabel}</span>
                <h3>{tw.paidH3}</h3>
                <ul className="list">{tw.paidList.map((x) => <li key={x}>{x}</li>)}</ul>
              </div>
              <div className="tear" aria-hidden>{tw.admit}</div>
            </div>
          </article>
          <article className="obj" style={{ marginTop: 12 }}>
            <span className="clipbar" aria-hidden />
            <div style={{ borderBottom: "2px solid var(--ink)", background: "var(--paper)", paddingTop: 14 }}>
              <Plate base={invBase.url} lime={invLime.url} alt="" w={720} h={582} />
            </div>
            <div style={{ padding: 18 }}>
              <span className="label">{tw.crewLabel}</span>
              <h3>{tw.crewH3}</h3>
              <ul className="list">{tw.crewList.map((x) => <li key={x}>{x}</li>)}</ul>
              <p className="small" style={{ marginTop: 10 }}>{tw.note}{CREW_FREE && tw.noteFree}</p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

function Day() {
  const { t } = useApp();
  const r = t.day.receipt;
  return (
    <section className="sec">
      <div className="wrap">
        <h2 className="lg:text-center">{t.day.h2}</h2>
        <p className="sub lg:mx-auto lg:text-center">{t.day.sub}</p>
        <DayThread />
        <div className="receipt">
          <div className="flex items-center justify-between" style={{ marginBottom: 6 }}>
            <b style={{ fontSize: 17, color: "var(--ink)" }}>{r.head}</b>
            <span className="tag" style={{ marginBottom: 0 }}>{t.example}</span>
          </div>
          <p className="row"><span>{r.earned}</span><b className="tnum">$610</b></p>
          <p className="row"><span>{r.owed}</span><b className="tnum">$180</b></p>
          <p className="row" style={{ borderBottom: 0 }}><span>{r.paper}</span><b>{r.none}</b></p>
        </div>
        <p className="small text-center mx-auto" style={{ marginTop: 28, maxWidth: "46ch" }}>{t.day.fine}</p>
      </div>
    </section>
  );
}

function ProQuote() {
  if (!HAS_PRO_QUOTE || !PRO_QUOTE.text) return null;
  return (
    <section className="sec" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <figure className="obj lg:max-w-[640px] mx-auto" style={{ padding: 20 }}>
          <blockquote style={{ fontSize: 20, fontWeight: 600, color: "var(--ink)" }}>{PRO_QUOTE.text}</blockquote>
          <figcaption className="small" style={{ marginTop: 10 }}>
            {[PRO_QUOTE.name, PRO_QUOTE.trade, PRO_QUOTE.city].filter(Boolean).join(", ")}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

function PaidDetail() {
  const { t } = useApp();
  const p = t.paid;
  return (
    <section className="sec">
      <div className="wrap">
        <h2>{p.h2}</h2>
        <p className="sub">{p.rate}</p>
        <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
          <div className="obj grid" style={{ gridTemplateColumns: "1fr 108px", marginTop: 20 }}>
            <div style={{ padding: 18 }}>
              <span className="tag">{t.example}</span>
              <h3 style={{ marginTop: 4 }}>{p.job}</h3>
              <p className="small" style={{ marginBottom: 8 }}>{p.when}</p>
              <p className="row"><span>{p.r1}</span><b className="tnum">$300</b></p>
               <p className="row"><span>{p.r2}</span><b className="tnum">${Math.round(300 * COMMISSION_START_PERCENT / 100)}</b></p>
               <p className="row tot"><span>{p.tot}</span><span className="tnum">${300 - Math.round(300 * COMMISSION_START_PERCENT / 100)}</span></p>
            </div>
            <div className="flex flex-col justify-center gap-3" style={{ borderLeft: "2px dashed var(--ink)", padding: 10 }} aria-hidden>
              <span className="pstamp l">{p.take}</span>
              <span className="pstamp">{p.pass}</span>
            </div>
          </div>
          <div>
            <div className="obj cmp" style={{ marginTop: 20 }} role="table">
              <div className="h" role="row"><span role="columnheader">{p.cmpL}</span><span role="columnheader">{p.cmpR}</span></div>
              {p.rows.map(([a, b]) => (
                <div className="r" role="row" key={a}><span role="cell">{a}</span><span role="cell">{b}</span></div>
              ))}
            </div>
            <div className="explain" style={{ marginTop: 22 }}>
              <b style={{ display: "block", color: "var(--ink)", fontSize: 18, marginBottom: 4 }}>{p.whereQ}</b>
              <p style={{ maxWidth: "52ch" }}>{p.whereA}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function How() {
  const { t } = useApp();
  return (
    <section className="sec">
      <div className="wrap">
        <h2>{t.how.h2}</h2>
        <ol className="route" style={{ marginTop: 22 }}>
          {t.how.steps.map(([a, b], i) => (
            <li className="stop" key={a}>
              <i aria-hidden>{i + 1}</i>
              <b style={{ display: "block", fontSize: 19, color: "var(--ink)" }}>{a}</b>
              <span style={{ fontSize: 16, color: "var(--muted)" }}>{b}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Founder({ src, initials, name, role, text }: { src: string; initials: string; name: string; role: string; text: string }) {
  const [failed, setFailed] = useState(!SHOW_FOUNDER_PHOTOS);
  return (
    <article className="founder-card">
      <div className={`photo ${failed ? "initials" : ""}`} aria-hidden={failed}>
        {failed ? initials : <img src={src} alt={name} width={96} height={112} loading="lazy" onError={() => setFailed(true)} />}
      </div>
      <div>
        <b style={{ fontSize: 19, color: "var(--ink)", display: "block" }}>{name}</b>
        <span style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)", display: "block", marginBottom: 6 }}>{role}</span>
        <p style={{ fontSize: 16, lineHeight: 1.4 }}>{text}</p>
      </div>
    </article>
  );
}

function Team() {
  const { t } = useApp();
  const tm = t.team;
  return (
    <section className="sec" id="team" style={{ scrollMarginTop: 20 }}>
      <div className="wrap">
        <h2>{tm.h2}</h2>
        <div className="grid gap-5 lg:grid-cols-2" style={{ marginTop: 20 }}>
          <Founder src={rishPhoto.url} initials="R" name="Rish" role={tm.rishiRole} text={tm.rishi} />
          <Founder src={satwikPhoto.url} initials="S" name="Satwik" role={tm.satwikRole} text={tm.satwik} />
        </div>
        <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
          <div className="obj letter" style={{ marginTop: 22 }}>
            <p>{tm.letter}</p>
            <p style={{ marginTop: 8, fontWeight: 700, color: "var(--ink)" }}>{tm.sig}</p>
            <p>
              {SUPPORT_TEXT_NUMBER ? (
                <>{tm.qText(SUPPORT_TEXT_NUMBER).replace(/\.$/, "")}.</>
              ) : (
                <a href={`mailto:${SUPPORT_EMAIL}`} style={{ color: "var(--ink)" }}>{tm.qEmail(SUPPORT_EMAIL)}</a>
              )}
            </p>
          </div>
          <div className="backers" style={{ marginTop: 22 }}>
            <h3 style={{ fontSize: 19 }}>{tm.backedBy}</h3>
            <ul className="grid gap-2" style={{ marginTop: 10 }}>
              {tm.backers.map(([n, d]) => (
                <li key={n} style={{ fontSize: 16, borderBottom: "1.5px solid var(--line)", paddingBottom: 9 }}>
                  <b style={{ color: "var(--ink)" }}>{n}</b>, {d}
                </li>
              ))}
            </ul>
            <p className="small" style={{ marginTop: 14 }}>{tm.company}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function SpotBar({ taken, cap }: { taken: number; cap: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const filled = Math.min(20, Math.round((taken / cap) * 20));
  const [n, setN] = useState(filled);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !ref.current) return;
    setN(0);
    const io = new IntersectionObserver((es) => {
      if (es[0]?.isIntersecting) {
        io.disconnect();
        for (let i = 1; i <= filled; i++) setTimeout(() => setN(i), (500 / Math.max(1, filled)) * i);
      }
    });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [filled]);
  return (
    <div className="bar" ref={ref} aria-hidden>
      {Array.from({ length: 20 }, (_, i) => <i key={i} className={i < n ? "f" : ""} />)}
    </div>
  );
}

function Spots({ stats }: { stats: Stats | undefined }) {
  const { t } = useApp();
  if (!showCounts(stats)) return null;
  const s = stats!;
  const keys = ["bay_area", "los_angeles", "new_york"] as const;
  const tradeLabel = (k: string | null) => {
    const i = k ? TRADE_KEYS.indexOf(k as (typeof TRADE_KEYS)[number]) : -1;
    return i >= 0 && k !== "other" ? `${t.sheet.tradeList[i]} pro` : t.spots.defaultTrade;
  };
  return (
    <section className="sec">
      <div className="wrap">
        <h2>{t.spots.h2}</h2>
        <p className="sub">{t.spots.sub}</p>
        <div className="grid gap-4 lg:grid-cols-3" style={{ marginTop: 20 }}>
          {keys.map((k) => {
            const cap = CITY_SPOTS[k];
            const n = s.cities[k] ?? 0;
            const left = cap == null ? null : Math.max(0, cap - n);
            return (
              <div className="obj" style={{ padding: "14px 16px" }} key={k}>
                <div className="flex items-baseline justify-between gap-2">
                  <b style={{ fontSize: 19, color: "var(--ink)" }}>{t.cities[k]}</b>
                  <span className="tnum" style={{ fontWeight: 600, fontSize: 15, color: "var(--ink)" }}>
                    {cap == null ? t.spots.joined(n) : t.spots.taken(Math.min(n, cap), cap)}
                  </span>
                </div>
                {cap != null && <SpotBar taken={Math.min(n, cap)} cap={cap} />}
                {left === 0 && (
                  <div className="mt-3 flex items-center gap-3">
                    <span className="stamp">{t.spots.full}</span>
                    <span style={{ fontSize: 15 }}>{t.spots.next}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {showRecent(s) && (
          <div style={{ marginTop: 18, fontSize: 15 }}>
            <h3 style={{ fontSize: 18 }}>{t.spots.recent}</h3>
            {s.recent.map((r, i) => (
              <p key={i} style={{ padding: "7px 0", borderBottom: "1.5px dashed var(--line)" }}>
                {tradeLabel(r.trade)}, {r.place}, {t.spots.when[r.when]}
              </p>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function Faq() {
  const { t } = useApp();
  const f = t.faq.items;
  const items: [string, string][] = [
    f.catch, f.card, f.number, f.approve,
    ...(CREW_FREE ? [f.free] : []),
    ...(NO_APP_NEEDED ? [f.app] : []),
    [f.where[0], t.paid.whereA] as [string, string],
    f.paid, f.callers, f.mine, f.real, f.start,
    ...(SPANISH_CALLS ? [f.spanish] : []),
    ...(PAYOUT_TIMING ? [[f.payout[0], PAYOUT_TIMING] as [string, string]] : []),
  ];
  const [open, setOpen] = useState<Set<number>>(new Set([0, 1]));
  return (
    <section className="sec">
      <div className="wrap">
        <h2>{t.faq.h2}</h2>
        <div className="obj lg:max-w-[760px]" style={{ marginTop: 18, padding: "0 18px" }}>
          {items.map(([q, a], i) => {
            const isOpen = open.has(i);
            return (
              <div key={q} style={{ borderBottom: i < items.length - 1 ? "1.5px solid var(--line)" : 0 }}>
                <h3 style={{ fontSize: 18 }}>
                  <button
                    type="button"
                    className="faq-q"
                    aria-expanded={isOpen}
                    aria-controls={`faq-${i}`}
                    onClick={() => {
                      const n = new Set(open);
                      if (isOpen) n.delete(i);
                      else { n.add(i); track("faq_open", { question: i + 1 }); }
                      setOpen(n);
                    }}
                  >
                    <span>{q}</span>
                    <span className={`pm ${isOpen ? "open" : ""}`} aria-hidden />
                  </button>
                </h3>
                <div id={`faq-${i}`} hidden={!isOpen}>
                  <p style={{ fontSize: 17, paddingBottom: 16 }}>{a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Final({ stats, finalRef }: { stats: Stats | undefined; finalRef: React.RefObject<HTMLElement | null> }) {
  const { t, city, openSheet } = useApp();
  const left = showCounts(stats) ? spotsLeft(stats, city) : null;
  return (
    <section className="band sec" ref={finalRef}>
      <div className="wrap lg:text-center">
        <h2 className="lg:mx-auto lg:max-w-[20ch]">{t.final.h2}</h2>
        {left != null && city && <p className="live">{t.live.left(left, t.cities[city])}</p>}
        <div className="mx-auto lg:max-w-[360px]" style={{ marginTop: 22 }}>
          <button type="button" className="btn" onClick={() => openSheet("final")}>{t.cta}</button>
          <Checks items={t.checks} />
        </div>
      </div>
    </section>
  );
}

export function Landing() {
  const { data: stats, isLoading } = useStats();
  const heroBtn = useRef<HTMLButtonElement>(null);
  const finalRef = useRef<HTMLElement>(null);

  return (
    <>
      <TopBar />
      <main>
        <Hero stats={stats} loading={isLoading} btnRef={heroBtn} />
        <Trust />
        <Pain />
        <TwoThings />
        <Day />
        <ProQuote />
        <PaidDetail />
        <How />
        <Team />
        <Spots stats={stats} />
        <Faq />
        <Final stats={stats} finalRef={finalRef} />
      </main>
      <Footer />
      <SignupSheet />
    </>
  );
}

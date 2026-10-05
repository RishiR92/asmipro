import * as Dialog from "@radix-ui/react-dialog";
import { Link } from "@tanstack/react-router";
import { AsYouType, isValidPhoneNumber } from "libphonenumber-js";
import { useState } from "react";
import callBase from "@/assets/scene-call-base.webp.asset.json";
import callLime from "@/assets/scene-call-lime.webp.asset.json";
import { getAttribution, track, useApp } from "@/lib/app-context";
import { CREW_KEYS, TRADE_KEYS } from "@/lib/dict";
import { NEXT_STEPS_TIMING, REFERRAL_BUMP, SITE_URL, type CityKey } from "@/config";
import { Plate } from "./chrome";

const CITY_KEYS: CityKey[] = ["bay_area", "los_angeles", "new_york", "other"];

type Saved = { token: string | null; ref_code: string | null; position: number | null; city: CityKey };

async function post(body: unknown) {
  const r = await fetch("/api/public/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const j = await r.json().catch(() => ({}));
  return { ok: r.ok && j.ok, data: j };
}

export function SignupFlow({ onClose }: { onClose?: () => void }) {
  const { t, lang, city: ctxCity, setCity, variant } = useApp();
  const s = t.sheet;
  const [step, setStep] = useState(1);
  const [city, setCityLocal] = useState<CityKey | null>(ctxCity);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [hp, setHp] = useState("");
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState<Saved | null>(null);
  // step 2
  const [trades, setTrades] = useState<string[]>([]);
  const [tradeOther, setTradeOther] = useState("");
  const [crew, setCrew] = useState<string | null>(null);
  const [zip, setZip] = useState("");
  const [biz, setBiz] = useState("");
  const [email, setEmail] = useState("");
  // step 3
  const [called, setCalled] = useState(false);
  const [copied, setCopied] = useState(false);

  async function submit1(e: React.FormEvent) {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (!city) er.city = s.errCity;
    if (!name.trim()) er.name = s.errName;
    if (!isValidPhoneNumber(phone, "US")) er.phone = s.errPhone;
    if (!consent) er.consent = s.errConsent;
    setErrs(er);
    track("step1_submit");
    if (Object.keys(er).length) {
      Object.keys(er).forEach((f) => track("step1_error", { field: f }));
      document.getElementById(`f-${Object.keys(er)[0]}`)?.focus();
      return;
    }
    setBusy(true);
    try {
      const { ok, data } = await post({
        stage: 1, city, name, phone, consent, lang, variant, hp,
        consent_text: t.consentText, attribution: getAttribution(),
      });
      if (!ok) {
        if (data?.error === "phone") setErrs({ phone: s.errPhone });
        else setErrs({ net: s.errNet });
        track("step1_error", { field: data?.error || "network" });
        return;
      }
      setCity(city!);
      setSaved({ token: data.token, ref_code: data.ref_code, position: data.position, city: city! });
      track("step1_success", { city });
      setStep(2);
    } catch {
      setErrs({ net: s.errNet });
      track("step1_error", { field: "network" });
    } finally {
      setBusy(false);
    }
  }

  async function submit2(e: React.FormEvent) {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (zip && !/^\d{5}$/.test(zip)) er.zip = s.errZip;
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) er.email = s.errEmail;
    setErrs(er);
    if (Object.keys(er).length) return;
    setBusy(true);
    track("step2_submit", { trades: trades.length, crew });
    try {
      if (saved?.token) {
        const { ok } = await post({ stage: 2, token: saved.token, trades, trade_other: tradeOther, crew_size: crew, zip, business_name: biz, email });
        if (!ok) { setErrs({ net: s.errNet }); return; }
      }
      setStep(3);
    } catch {
      setErrs({ net: s.errNet });
    } finally {
      setBusy(false);
    }
  }

  const shareUrl = (() => {
    const base = SITE_URL || (typeof window !== "undefined" ? window.location.origin : "");
    return saved?.ref_code ? `${base}/?ref=${saved.ref_code}` : base + "/";
  })();
  const shareMsg = `${s.shareText} ${shareUrl}`;

  async function share() {
    track("share_click", { method: "share" });
    if (navigator.share) {
      try { await navigator.share({ text: s.shareText, url: shareUrl }); } catch { /* cancelled */ }
    } else copy();
  }
  async function copy() {
    track("share_click", { method: "copy" });
    try { await navigator.clipboard.writeText(shareMsg); setCopied(true); } catch { /* ignore */ }
  }
  async function callMe() {
    track("demo_request");
    if (saved?.token) await post({ stage: 3, token: saved.token, demo_call_requested: true }).catch(() => {});
    setCalled(true);
  }

  const Title = onClose ? Dialog.Title : "h1";

  return (
    <div>
      <div className="flex items-center justify-between mono" style={{ fontWeight: 700, fontSize: 14, color: "var(--ink)", letterSpacing: ".06em" }}>
        <span>{s.workOrder}</span>
        {onClose && (
          <Dialog.Close className="xbtn" aria-label={s.close} />
        )}
      </div>
      <div className="prog" aria-hidden>
        {[1, 2, 3].map((i) => <i key={i} className={i <= step ? "f" : ""} />)}
      </div>

      {step === 1 && (
        <form onSubmit={submit1} noValidate>
          <Title style={{ fontSize: 30, lineHeight: 1.1, fontWeight: 700, color: "var(--ink)" }}>{s.h}</Title>
          <p style={{ fontSize: 16, marginTop: 6 }}>{s.hSub}</p>

          <fieldset>
            <legend className="flabel">{s.where}</legend>
            <div className="chips" role="radiogroup" aria-label={s.where} id="f-city" tabIndex={-1}>
              {CITY_KEYS.map((c) => (
                <button key={c} type="button" role="radio" aria-checked={city === c} onClick={() => { setCityLocal(c); setErrs((e) => ({ ...e, city: "" })); }}>
                  {t.cities[c]}
                </button>
              ))}
            </div>
            <p className="err" aria-live="polite">{errs.city}</p>
          </fieldset>

          <label className="flabel" htmlFor="f-name">{s.name}</label>
          <input id="f-name" className="field" autoComplete="name" placeholder={s.namePh} value={name} maxLength={80}
            onChange={(e) => setName(e.target.value)} aria-invalid={!!errs.name} aria-describedby="e-name" />
          <p className="err" id="e-name" aria-live="polite">{errs.name}</p>

          <label className="flabel" htmlFor="f-phone">{s.phone}</label>
          <input id="f-phone" className="field" type="tel" inputMode="tel" autoComplete="tel" placeholder="(415) 555-0123" value={phone}
            onChange={(e) => {
              const v = e.target.value;
              setPhone(v.length < phone.length ? v : new AsYouType("US").input(v));
            }}
            aria-invalid={!!errs.phone} aria-describedby="e-phone" />
          <p className="err" id="e-phone" aria-live="polite">{errs.phone}</p>

          <div className="hp" aria-hidden>
            <label htmlFor="company_website">Company website</label>
            <input id="company_website" name="company_website" tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} />
          </div>

          <label className="consent" htmlFor="f-consent">
            <input id="f-consent" type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} aria-describedby="e-consent" />
            <span>
              <b>{s.consentBold}</b>
              {s.consentPre}
              <Link to="/terms" target="_blank" rel="noopener">{s.terms}</Link>
              {s.and}
              <Link to="/privacy" target="_blank" rel="noopener">{s.privacy}</Link>.
            </span>
          </label>
          <p className="err" id="e-consent" aria-live="polite">{errs.consent}</p>

          <button type="submit" className="btn mt-4" disabled={busy}>{busy ? s.saving : s.h}</button>
          <p className="err text-center" aria-live="polite">{errs.net}</p>
          <p className="text-center" style={{ fontSize: 15, color: "var(--muted)", marginTop: 10 }}>{s.under}</p>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={submit2} noValidate>
          <Title style={{ fontSize: 30, lineHeight: 1.1, fontWeight: 700, color: "var(--ink)" }}>{s.s2h}</Title>
          <p style={{ fontSize: 16, marginTop: 6 }}>{s.s2sub}</p>

          <fieldset>
            <legend className="flabel">{s.trades}</legend>
            <div className="chips">
              {TRADE_KEYS.map((k, i) => (
                <button key={k} type="button" aria-pressed={trades.includes(k)}
                  onClick={() => setTrades((tr) => (tr.includes(k) ? tr.filter((x) => x !== k) : [...tr, k]))}>
                  {s.tradeList[i]}
                </button>
              ))}
            </div>
          </fieldset>
          {trades.includes("other") && (
            <>
              <label className="flabel" htmlFor="f-other">{s.whichTrade}</label>
              <input id="f-other" className="field" value={tradeOther} maxLength={60} onChange={(e) => setTradeOther(e.target.value)} />
            </>
          )}

          <fieldset>
            <legend className="flabel">{s.crew}</legend>
            <div className="chips" role="radiogroup" aria-label={s.crew}>
              {CREW_KEYS.map((k, i) => (
                <button key={k} type="button" role="radio" aria-checked={crew === k} onClick={() => setCrew(k)}>{s.crewList[i]}</button>
              ))}
            </div>
          </fieldset>

          <label className="flabel" htmlFor="f-zip">{s.zip}</label>
          <input id="f-zip" className="field" inputMode="numeric" autoComplete="postal-code" maxLength={5} value={zip}
            onChange={(e) => setZip(e.target.value.replace(/\D/g, "").slice(0, 5))} aria-describedby="e-zip" />
          <p className="err" id="e-zip" aria-live="polite">{errs.zip}</p>

          <label className="flabel" htmlFor="f-biz">{s.biz}</label>
          <input id="f-biz" className="field" autoComplete="organization" maxLength={120} value={biz} onChange={(e) => setBiz(e.target.value)} />

          <label className="flabel" htmlFor="f-email">{s.email}</label>
          <input id="f-email" className="field" type="email" autoComplete="email" maxLength={200} value={email} onChange={(e) => setEmail(e.target.value)} aria-describedby="e-email" />
          <p className="err" id="e-email" aria-live="polite">{errs.email}</p>

          <button type="submit" className="btn mt-4" disabled={busy}>{busy ? s.saving : s.save}</button>
          <p className="err text-center" aria-live="polite">{errs.net}</p>
          <div className="text-center">
            <button type="button" className="linkbtn" onClick={() => { track("step2_skip"); setStep(3); }}>{s.skip}</button>
          </div>
        </form>
      )}

      {step === 3 && saved && (
        <div>
          <Title className="sr-only">{s.s2h}</Title>
          <div style={{ position: "relative", width: "70%", margin: "0 auto" }}>
            <Plate base={callBase.url} lime={callLime.url} alt="" w={720} h={518} eager />
            <span className="stamp" style={{ position: "absolute", right: -8, top: 8, transform: "rotate(-5deg)" }}>{s.onList}</span>
          </div>
          <div className="text-center" style={{ marginTop: 10 }}>
            {saved.position != null && <b className="tnum" style={{ display: "block", fontSize: 40, color: "var(--ink)", lineHeight: 1 }}>#{saved.position}</b>}
            <span style={{ fontSize: 17, fontWeight: 600, color: "var(--ink)" }}>
              {saved.city === "other" ? s.onTheList : s.inCity(t.cities[saved.city])}
            </span>
          </div>
          <div className="dashrows">
            <p><b style={{ color: "var(--ink)" }}>1.</b> {s.step1}</p>
            <p><b style={{ color: "var(--ink)" }}>2.</b> {s.step2(t.citiesShort[saved.city])}{NEXT_STEPS_TIMING ? ` ${NEXT_STEPS_TIMING}` : ""}</p>
            <p><b style={{ color: "var(--ink)" }}>3.</b> {s.step3}</p>
          </div>
          <div className="card2">
            <p style={{ fontWeight: 700, color: "var(--ink)", fontSize: 17 }}>{s.knowPro}</p>
            {REFERRAL_BUMP > 0 && <p style={{ fontSize: 15, marginTop: 4 }}>{s.bump(REFERRAL_BUMP)}</p>}
            <div className="grid grid-cols-3 gap-2 mt-3">
              <button type="button" className="btn-2 lime" onClick={share}>{s.share}</button>
              <a className="btn-2 text-center" style={{ textDecoration: "none" }} href={`sms:?&body=${encodeURIComponent(shareMsg)}`} onClick={() => track("share_click", { method: "sms" })}>{s.textIt}</a>
              <button type="button" className="btn-2" onClick={copy} aria-live="polite">{copied ? s.copied : s.copy}</button>
            </div>
          </div>
          <div className="card2">
            <p style={{ fontWeight: 700, color: "var(--ink)", fontSize: 17 }}>{s.call}</p>
            {called ? (
              <p className="mt-2" role="status" style={{ fontWeight: 600 }}>{s.callDone}</p>
            ) : (
              <button type="button" className="btn-2 w-full mt-3" onClick={callMe}>{s.callBtn}</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function SignupSheet() {
  const { sheetOpen, closeSheet } = useApp();
  return (
    <Dialog.Root open={sheetOpen} onOpenChange={(o) => !o && closeSheet()}>
      <Dialog.Portal>
        <Dialog.Overlay className="backdrop" />
        <Dialog.Content className="sheet" aria-describedby={undefined}>
          <div className="sheet-scroll">
            <div className="handle" aria-hidden />
            <SignupFlow onClose={closeSheet} />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

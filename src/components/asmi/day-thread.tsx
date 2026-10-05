import { useEffect, useRef, useState } from "react";
import { track, useApp } from "@/lib/app-context";

type Item = { k: "ts" | "in" | "out" | "stamp"; key: string; role?: number };

// Role indexes: 0 Front desk, 1 Estimator, 2 Parts runner, 3 Paid jobs, 4 Dispatcher, 5 Bookkeeper
const SCRIPT: Item[] = [
  { k: "ts", key: "6:30 AM" },
  { k: "in", key: "m1" },
  { k: "ts", key: "7:12 AM" },
  { k: "in", key: "m2", role: 0 },
  { k: "out", key: "m3" },
  { k: "stamp", key: "s3" },
  { k: "ts", key: "7:47 AM" },
  { k: "out", key: "m4" },
  { k: "in", key: "m5", role: 1 },
  { k: "out", key: "m6" },
  { k: "stamp", key: "s6", role: 2 },
  { k: "ts", key: "9:40 AM" },
  { k: "in", key: "m7", role: 3 },
  { k: "out", key: "m8" },
  { k: "stamp", key: "s8" },
  { k: "ts", key: "11:20 AM" },
  { k: "out", key: "m9", role: 4 },
  { k: "in", key: "m10" },
  { k: "ts", key: "6:30 PM" },
  { k: "in", key: "m11", role: 5 },
  { k: "stamp", key: "s11" },
];

export function DayThread() {
  const { t } = useApp();
  const m = t.day.msgs as Record<string, string>;
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(SCRIPT.length); // SSR and reduced motion: final state
  const [typing, setTyping] = useState(-1);
  const [role, setRole] = useState<number | null>(null);
  const [runId, setRunId] = useState(0);
  const timers = useRef<number[]>([]);

  const play = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setShown(0);
    setRole(null);
    let at = 200;
    SCRIPT.forEach((it, i) => {
      if (it.k === "in") {
        timers.current.push(window.setTimeout(() => setTyping(i), at));
        at += 400;
      }
      timers.current.push(
        window.setTimeout(() => {
          setTyping(-1);
          setShown(i + 1);
          if (it.role != null) setRole(it.role);
          if (i === SCRIPT.length - 1) track("thread_complete");
        }, at),
      );
      at += it.k === "ts" ? 250 : 700;
    });
    setRunId((r) => r + 1);
  };

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;
    setShown(0);
    const io = new IntersectionObserver(
      (es) => {
        if (es[0]?.isIntersecting) {
          io.disconnect();
          play();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      timers.current.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const done = shown >= SCRIPT.length;

  return (
    <div>
      <div className="phone" ref={ref}>
        <div className="ph-top">
          <span className="av" aria-hidden>a</span>
          <div>
            <b style={{ fontSize: 16, color: "var(--ink)" }}>Asmi</b>
            <small style={{ display: "block", fontSize: 14, color: "var(--muted)" }}>{t.day.biz}</small>
          </div>
        </div>
        <ol className="thread" aria-label={t.day.h2}>
          {SCRIPT.map((it, i) => {
            const visible = i < shown;
            const isTyping = typing === i;
            const cls = !visible && !isTyping ? "hidden-slot" : "";
            if (it.k === "ts") return <li key={i} className={`ts ${cls}`}>{it.key}</li>;
            if (it.k === "stamp")
              return (
                <li key={i} className={`stamp ${visible && runId ? "land" : ""} ${cls}`}>{m[it.key]}</li>
              );
            return (
              <li key={i} className={`bub ${it.k} ${cls}`} style={isTyping ? { visibility: "visible" } : undefined}>
                <span className="sr-only">{it.k === "in" ? "Asmi: " : `${t.day.you}: `}</span>
                {isTyping ? (
                  <>
                    <span style={{ visibility: "hidden", display: "block", height: 0, overflow: "hidden" }}>{m[it.key]}</span>
                    <span className="dots" aria-hidden><i /><i /><i /></span>
                  </>
                ) : (
                  m[it.key]
                )}
              </li>
            );
          })}
        </ol>
      </div>
      <div className="roles" aria-hidden>
        {t.day.roles.map((r, i) => (
          <span key={r} className={role === i ? "on" : ""}>{r}</span>
        ))}
      </div>
      <div className="text-center" style={{ minHeight: 48 }}>
        {done && runId > 0 && (
          <button type="button" className="linkbtn" onClick={play}>{t.day.replay}</button>
        )}
      </div>
    </div>
  );
}

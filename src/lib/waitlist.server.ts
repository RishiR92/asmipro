import { parsePhoneNumberFromString } from "libphonenumber-js";
import { REFERRAL_BUMP, type CityKey } from "@/config";

const CITIES: CityKey[] = ["bay_area", "los_angeles", "new_york", "other"];
const TRADES = ["plumbing", "electrical", "hvac", "handyman", "roofing", "general_contractor", "cleaning", "other"];
const CREW = ["just_me", "2_5", "6_10", "10_plus"];

const json = (body: unknown, status = 200, extra: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", ...extra } });

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

async function sha(s: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 32);
}

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) || null : null);

function refCode() {
  const a = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const b = crypto.getRandomValues(new Uint8Array(8));
  return Array.from(b, (x) => a[x % a.length]).join("");
}

// 10 requests per IP per 10 minutes for saves; events get a looser bucket.
async function limited(db: Awaited<ReturnType<typeof admin>>, ip: string, bucket: string, max: number) {
  const key = bucket + ":" + (await sha(ip));
  const since = new Date(Date.now() - 10 * 60 * 1000).toISOString();
  const { count } = await db.from("rate_limits").select("id", { count: "exact", head: true }).eq("key", key).gte("created_at", since);
  if ((count ?? 0) >= max) return true;
  await db.from("rate_limits").insert({ key });
  if (Math.random() < 0.02) await db.from("rate_limits").delete().lt("created_at", new Date(Date.now() - 3600_000).toISOString());
  return false;
}

async function position(db: Awaited<ReturnType<typeof admin>>, row: { city: string; created_at: string; referral_count: number }) {
  const { count } = await db
    .from("waitlist_signups")
    .select("id", { count: "exact", head: true })
    .eq("city", row.city)
    .not("confirmed_at", "is", null)
    .lte("created_at", row.created_at);
  return Math.max(1, (count ?? 1) - row.referral_count * REFERRAL_BUMP);
}

async function syncSheet(stage: number, row: any) {
  const url = process.env['APPS_SCRIPT_URL'];
  const secret = process.env['APPS_SCRIPT_SECRET'];
  if (!url || !secret) return;
  try {
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret,
        stage,
        phone: row.phone_e164,
        name: row.name,
        email: row.email ?? "",
        city: row.city,
        service_city: row.service_city ?? "",
        trade: (row.trades ?? []).join(", "),
        trade_other: row.trade_other ?? "",
        size: row.crew_size ?? "",
        zip: row.zip ?? "",
        business: row.business_name ?? "",
        wants_demo: !!row.demo_call_requested,
        src: row.src ?? "",
        utm_source: row.utm_source ?? "",
        utm_medium: row.utm_medium ?? "",
        utm_campaign: row.utm_campaign ?? "",
        utm_content: row.utm_content ?? "",
        referrer: row.referrer ?? "",
        user_agent: row.user_agent ?? "",
      }),
    });
    if (!r.ok) console.error("sheet sync failed", r.status);
  } catch {
    console.error("sheet sync failed");
  }
}

export async function handleSignup(request: Request) {
  const raw = await request.text();
  if (raw.length > 10_000) return json({ ok: false, error: "too_large" }, 413);
  let body: any;
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ ok: false, error: "bad_json" }, 400);
  }
  const db = await admin();
  const ip = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  if (body.stage === "event") {
    if (await limited(db, ip, "ev", 120)) return json({ ok: false }, 429);
    const name = str(body.name, 40);
    if (!name) return json({ ok: false }, 400);
    await db.from("events").insert({
      name,
      session_id: str(body.session_id, 64),
      variant: str(body.variant, 4),
      src: str(body.src, 40),
      lang: str(body.lang, 4),
      meta: body.meta && typeof body.meta === "object" ? body.meta : null,
    });
    return json({ ok: true });
  }

  if (await limited(db, ip, "su", 10)) return json({ ok: false, error: "rate_limited" }, 429);

  if (body.stage === 1) {
    if (body.hp) return json({ ok: true, token: null, ref_code: null, position: null, city: body.city ?? null });
    const name = str(body.name, 80);
    const city = body.city as CityKey;
    if (!name) return json({ ok: false, error: "name" }, 400);
    if (!CITIES.includes(city)) return json({ ok: false, error: "city" }, 400);
    const serviceCity = str(body.service_city, 100);
    if (city === "other" && !serviceCity) return json({ ok: false, error: "service_city" }, 400);
    if (body.consent !== true) return json({ ok: false, error: "consent" }, 400);
    const ph = typeof body.phone === "string" ? parsePhoneNumberFromString(body.phone, "US") : undefined;
    if (!ph || !ph.isValid() || ph.country !== "US") return json({ ok: false, error: "phone" }, 400);
    const phone = ph.number;
    const lang = body.lang === "es" ? "es" : "en";
    const a = body.attribution && typeof body.attribution === "object" ? body.attribution : {};

    const { data: existing } = await db.from("waitlist_signups").select("*").eq("phone_e164", phone).maybeSingle();
    const fields = {
      name,
      city,
      service_city: city === "other" ? serviceCity : null,
      consent: true,
      consent_at: new Date().toISOString(),
      consent_text: str(body.consent_text, 600),
      lang,
      variant: str(body.variant, 4),
    };
    let row: any;
    if (existing) {
      const { data } = await db
        .from("waitlist_signups")
        .update({ ...fields, ref_code: existing.ref_code ?? refCode(), edit_token: existing.edit_token ?? crypto.randomUUID() })
        .eq("id", existing.id)
        .select("*")
        .single();
      row = data;
    } else {
      const referred = str(a.ref, 16);
      const { data, error } = await db
        .from("waitlist_signups")
        .insert({
          ...fields,
          phone_e164: phone,
          ref_code: refCode(),
          edit_token: crypto.randomUUID(),
          referred_by: referred,
          src: str(a.src, 40),
          utm_source: str(a.utm_source, 100),
          utm_medium: str(a.utm_medium, 100),
          utm_campaign: str(a.utm_campaign, 100),
          utm_content: str(a.utm_content, 100),
          utm_term: str(a.utm_term, 100),
          referrer: str(a.referrer, 300),
          user_agent: str(request.headers.get("user-agent"), 300),
          stage: 1,
        })
        .select("*")
        .single();
      if (error) {
        console.error("insert failed", error.code);
        return json({ ok: false, error: "server" }, 500);
      }
      row = data;
    }
    await syncSheet(1, row);
    return json({ ok: true, token: row.edit_token, ref_code: row.ref_code, city: row.city });
  }

  const token = str(body.token, 40);
  if (!token || !/^[0-9a-f-]{36}$/i.test(token)) return json({ ok: false, error: "token" }, 400);

  if (body.stage === 2) {
    const trades = Array.isArray(body.trades) ? body.trades.filter((x: unknown) => TRADES.includes(x as string)) : [];
    const zip = str(body.zip, 5);
    if (zip && !/^\d{5}$/.test(zip)) return json({ ok: false, error: "zip" }, 400);
    const email = str(body.email, 200);
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return json({ ok: false, error: "email" }, 400);
    const { data: current } = await db.from("waitlist_signups").select("id, confirmed_at, referred_by").eq("edit_token", token).maybeSingle();
    if (!current) return json({ ok: false, error: "token" }, 404);
    const confirmingNow = !current.confirmed_at;
    const { data, error } = await db
      .from("waitlist_signups")
      .update({
        trades,
        trade_other: trades.includes("other") ? str(body.trade_other, 60) : null,
        crew_size: CREW.includes(body.crew_size) ? body.crew_size : null,
        zip,
        business_name: str(body.business_name, 120),
        email,
        stage: 2,
        confirmed_at: current.confirmed_at ?? new Date().toISOString(),
      })
      .eq("edit_token", token)
      .select("*")
      .maybeSingle();
    if (error || !data) return json({ ok: false, error: "token" }, 404);
    if (confirmingNow && current.referred_by) {
      const { data: refRow } = await db.from("waitlist_signups").select("id, referral_count").eq("ref_code", current.referred_by).not("confirmed_at", "is", null).maybeSingle();
      if (refRow && refRow.id !== data.id) await db.from("waitlist_signups").update({ referral_count: refRow.referral_count + 1 }).eq("id", refRow.id);
    }
    await syncSheet(2, data);
    return json({ ok: true, position: await position(db, data) });
  }

  if (body.stage === 3) {
    const { data } = await db
      .from("waitlist_signups")
      .update({ demo_call_requested: true, stage: 3 })
      .eq("edit_token", token)
      .select("*")
      .maybeSingle();
    if (!data) return json({ ok: false, error: "token" }, 404);
    await syncSheet(3, data);
    return json({ ok: true });
  }

  return json({ ok: false, error: "stage" }, 400);
}

// Zip prefix to neighborhood or city. Falls back to the metro name.
const ZIP_PLACES: [string, string][] = [
  ["941", "San Francisco"], ["945", "East Bay"], ["946", "Oakland"], ["947", "Berkeley"], ["940", "Peninsula"],
  ["943", "Palo Alto"], ["950", "San Jose"], ["951", "San Jose"], ["949", "Marin"],
  ["900", "Los Angeles"], ["902", "South Bay"], ["903", "Inglewood"], ["904", "Santa Monica"], ["905", "Torrance"],
  ["906", "Whittier"], ["907", "Long Beach"], ["908", "Long Beach"], ["910", "Pasadena"], ["911", "Pasadena"],
  ["912", "Glendale"], ["913", "San Fernando Valley"], ["914", "San Fernando Valley"], ["915", "Burbank"],
  ["100", "Manhattan"], ["101", "Manhattan"], ["102", "Manhattan"], ["104", "Bronx"], ["103", "Staten Island"],
  ["112", "Brooklyn"], ["110", "Queens"], ["113", "Queens"], ["114", "Queens"], ["116", "Queens"],
];
const METRO: Record<string, string> = { bay_area: "Bay Area", los_angeles: "Los Angeles", new_york: "New York", other: "" };

export async function handleStats() {
  const db = await admin();
  const { data } = await db.from("waitlist_signups").select("city, created_at, trades, zip").not("confirmed_at", "is", null);
  const rows = data ?? [];
  const cities = { bay_area: 0, los_angeles: 0, new_york: 0, other: 0 } as Record<string, number>;
  for (const r of rows) cities[r.city] = (cities[r.city] ?? 0) + 1;
  const now = Date.now();
  const week = rows.filter((r) => now - new Date(r.created_at).getTime() < 7 * 86400_000);
  const recent = week
    .filter((r) => now - new Date(r.created_at).getTime() >= 15 * 60_000)
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, 6)
    .map((r) => {
      const age = now - new Date(r.created_at).getTime();
      const place = (r.zip && ZIP_PLACES.find(([p]) => r.zip!.startsWith(p))?.[1]) || METRO[r.city] || "";
      return {
        trade: r.trades && r.trades.length ? r.trades[0] : null,
        place,
        when: age < 86400_000 ? "today" : age < 2 * 86400_000 ? "yesterday" : "this week",
      };
    })
    .filter((r) => r.place);
  return json(
    { total: rows.length, cities, recent7d: week.length, recent },
    200,
    { "Cache-Control": "public, max-age=60, s-maxage=60" },
  );
}

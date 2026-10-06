import { useApp } from "@/lib/app-context";

function CompanyTicker({ label, names }: { label: string; names: string[] }) {
  return (
    <span className="company-proof-row">
      <span>{label}</span>
      <span className="sr-only">{names.join(", ")}</span>
      <span className="company-ticker" aria-hidden="true">
        <span className="company-ticker-track">
          {[...names, names[0]].map((name, index) => <b key={`${name}-${index}`}>{name}</b>)}
        </span>
      </span>
      <b className="company-static" aria-hidden="true">{names.join(", ")}</b>
    </span>
  );
}

export function CompanyProof() {
  const { t } = useApp();
  return (
    <div className="company-proof">
      <CompanyTicker label={t.trust.teamLabel} names={t.trust.teamNames} />
      <CompanyTicker label={t.trust.backedLabel} names={t.trust.backedNames} />
    </div>
  );
}
CREATE TABLE public.waitlist_signups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  name text NOT NULL,
  phone_e164 text NOT NULL UNIQUE,
  city text NOT NULL CHECK (city IN ('bay_area','los_angeles','new_york','other')),
  consent boolean NOT NULL DEFAULT false,
  consent_at timestamptz,
  consent_text text,
  consent_version text NOT NULL DEFAULT 'v1',
  lang text,
  trades text[],
  trade_other text,
  crew_size text,
  zip text,
  business_name text,
  email text,
  demo_call_requested boolean NOT NULL DEFAULT false,
  ref_code text UNIQUE,
  referred_by text,
  referral_count int NOT NULL DEFAULT 0,
  variant text, src text,
  utm_source text, utm_medium text, utm_campaign text, utm_content text, utm_term text,
  referrer text, user_agent text,
  stage int NOT NULL DEFAULT 1,
  edit_token uuid UNIQUE DEFAULT gen_random_uuid()
);
CREATE INDEX ON public.waitlist_signups (city, created_at);
GRANT ALL ON public.waitlist_signups TO service_role;
ALTER TABLE public.waitlist_signups ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  name text NOT NULL,
  session_id text, variant text, src text, lang text,
  meta jsonb
);
GRANT ALL ON public.events TO service_role;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.rate_limits (
  id bigserial PRIMARY KEY,
  key text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON public.rate_limits (key, created_at);
GRANT ALL ON public.rate_limits TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public.rate_limits_id_seq TO service_role;
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.touch_updated_at() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;
CREATE TRIGGER waitlist_touch BEFORE UPDATE ON public.waitlist_signups FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
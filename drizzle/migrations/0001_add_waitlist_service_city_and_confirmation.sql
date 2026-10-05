ALTER TABLE public.waitlist_signups
  ADD COLUMN service_city text,
  ADD COLUMN confirmed_at timestamp with time zone;
COMMENT ON COLUMN public.waitlist_signups.service_city IS 'Free-text city entered when the pro selects somewhere else.';
COMMENT ON COLUMN public.waitlist_signups.confirmed_at IS 'Set only after the pro completes the second waitlist step.';
ALTER TABLE public.waitlist_signups
  ADD CONSTRAINT waitlist_service_city_length CHECK (service_city IS NULL OR char_length(service_city) <= 100) NOT VALID;

-- Site settings table for admin controls (buy button modes etc.)
CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read settings (needed for storefront)
CREATE POLICY "Anyone can read site settings"
ON public.site_settings FOR SELECT
TO authenticated, anon
USING (true);

-- Only admins can modify settings
CREATE POLICY "Admins can update site settings"
ON public.site_settings FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert site settings"
ON public.site_settings FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Insert default buy button settings
INSERT INTO public.site_settings (key, value) VALUES 
('buy_button_config', '{"online_payment_enabled": true, "whatsapp_enabled": true, "whatsapp_number": "+918870226867"}'::jsonb);

-- Clear old mock/test orders
DELETE FROM public.orders WHERE 1=1;

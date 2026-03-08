INSERT INTO storage.buckets (id, name, public) VALUES ('brand-assets', 'brand-assets', true) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can view brand assets" ON storage.objects FOR SELECT USING (bucket_id = 'brand-assets');
CREATE POLICY "Admins can upload brand assets" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'brand-assets' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update brand assets" ON storage.objects FOR UPDATE USING (bucket_id = 'brand-assets' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete brand assets" ON storage.objects FOR DELETE USING (bucket_id = 'brand-assets' AND public.has_role(auth.uid(), 'admin'));
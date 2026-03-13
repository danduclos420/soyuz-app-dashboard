-- FIX RLS FOR APP_CONFIG AND SITE_STYLES
-- Allow read access to config keys (like qb_token) so UI can show status
CREATE POLICY "Allow public read access to app_config" 
ON public.app_config FOR SELECT 
USING (true);

-- Allow public read access to site_styles for design persistence
CREATE POLICY "Allow public read access to site_styles" 
ON public.site_styles FOR SELECT 
USING (true);

-- Ensure admin/devtool can write to site_styles
CREATE POLICY "Allow admin/devtool to update site_styles" 
ON public.site_styles FOR ALL
USING (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'role' = 'devtool')
WITH CHECK (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'role' = 'devtool');

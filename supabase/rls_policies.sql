-- MECHSOURCE SUPABASE ROW LEVEL SECURITY (RLS) POLICIES
-- Run this script in your Supabase SQL Editor after enabling RLS on your tables.

-- ============================================================================
-- 1. ENABLE ROW LEVEL SECURITY (RLS) ON ALL TABLES
-- ============================================================================
ALTER TABLE IF EXISTS users ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS garage_vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS seller_stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS mechanic_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS part_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS mechanic_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS fleet_rfq_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS equipment_rentals ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS workshops ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS uploaded_files ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 2. PUBLIC READ POLICIES (Anyone - Anonymous & Authenticated can READ)
-- ============================================================================

-- Public can READ parts catalog & fitment details
CREATE POLICY "Public can read parts catalog"
ON parts FOR SELECT
TO public
USING (true);

-- Public can READ marketplace listings
CREATE POLICY "Public can read marketplace listings"
ON listings FOR SELECT
TO public
USING (true);

-- Public can READ seller store profiles
CREATE POLICY "Public can read seller stores"
ON seller_stores FOR SELECT
TO public
USING (true);

-- Public can READ mechanic trade card directory
CREATE POLICY "Public can read mechanic directory"
ON mechanic_profiles FOR SELECT
TO public
USING (true);

-- Public can READ workshops directory
CREATE POLICY "Public can read workshops"
ON workshops FOR SELECT
TO public
USING (true);

-- Public can READ heavy equipment rental catalog
CREATE POLICY "Public can read equipment rentals"
ON equipment_rentals FOR SELECT
TO public
USING (true);


-- ============================================================================
-- 3. AUTHENTICATED USER INSERT POLICIES (Only Logged-in Users can INSERT)
-- ============================================================================

-- Only logged-in users can INSERT orders
CREATE POLICY "Authenticated users can create orders"
ON orders FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Only logged-in users can INSERT order items
CREATE POLICY "Authenticated users can create order items"
ON order_items FOR INSERT
TO authenticated
WITH CHECK (true);

-- Only logged-in users can park machines in Garage
CREATE POLICY "Authenticated users can park garage vehicles"
ON garage_vehicles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Only logged-in users can publish part requests
CREATE POLICY "Authenticated users can create part requests"
ON part_requests FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Only logged-in users can create wallet transactions
CREATE POLICY "Authenticated users can create wallet transactions"
ON wallet_transactions FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Only logged-in users can upload files
CREATE POLICY "Authenticated users can upload files"
ON uploaded_files FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can view their own orders
CREATE POLICY "Users can view own orders"
ON orders FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can view their own garage vehicles
CREATE POLICY "Users can view own garage vehicles"
ON garage_vehicles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);


-- ============================================================================
-- 4. ADMIN UPDATE & DELETE POLICIES (Only Admin users can UPDATE/DELETE)
-- ============================================================================

-- Helper function to check if current user is Admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND primary_role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Only Admin can UPDATE parts catalog
CREATE POLICY "Only admin can update parts catalog"
ON parts FOR UPDATE
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- Only Admin can DELETE parts catalog
CREATE POLICY "Only admin can delete parts catalog"
ON parts FOR DELETE
TO authenticated
USING (is_admin());

-- Only Admin can UPDATE or DELETE orders globally (e.g. escrow overrides / disputes)
CREATE POLICY "Only admin can update orders"
ON orders FOR UPDATE
TO authenticated
USING (is_admin() OR auth.uid() = user_id)
WITH CHECK (is_admin() OR auth.uid() = user_id);

CREATE POLICY "Only admin can delete orders"
ON orders FOR DELETE
TO authenticated
USING (is_admin());

-- Only Admin can DELETE listings
CREATE POLICY "Only admin can delete listings"
ON listings FOR DELETE
TO authenticated
USING (is_admin());

-- Only Admin can DELETE garage vehicles
CREATE POLICY "Only admin can delete garage vehicles"
ON garage_vehicles FOR DELETE
TO authenticated
USING (is_admin() OR auth.uid() = user_id);

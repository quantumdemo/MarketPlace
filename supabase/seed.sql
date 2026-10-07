-- MECHSOURCE DEVELOPMENT DATABASE SEED DATA
-- Optional script to populate test data for local development or demo environments.
-- Do not run this script on clean production databases!

INSERT INTO parts (id, category, category_name, name, oem_number, description, quality_grade, image_url)
VALUES
  ('prt-01', 'FUL', 'Fuel System', 'Fuel filter element', '23390-0L070', 'High efficiency diesel fuel filter element for 1GD/2GD Toyota engines.', 'Genuine', 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=400&q=80'),
  ('prt-02', 'ENG', 'Engine', 'Bosch glow plug set', '19850-30010', 'Bosch rapid heating glow plug set for quick cold starts on diesel engines.', 'OEM-equivalent', 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=400&q=80'),
  ('prt-03', 'BRK', 'Brakes', 'Front brake pads (Pair)', '04465-0K340', 'Heavy duty metallic ceramic brake pad set with minimum dust.', 'OEM-equivalent', 'https://images.unsplash.com/photo-1600792580403-0d32f5117462?auto=format&fit=crop&w=400&q=80')
ON CONFLICT (id) DO NOTHING;

INSERT INTO seller_stores (id, store_name, location_name, is_open)
VALUES
  ('str-01', 'Diesel Pro Ikeja', 'Ikeja GRA, Lagos', true),
  ('str-02', 'Ladipo Auto Hub', 'Ladipo Market, Lagos', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO listings (id, store_id, part_id, price, stock_quantity, delivery_time_mins, is_same_day, brand, condition)
VALUES
  ('lst-101', 'str-01', 'prt-01', 18500.00, 12, 25, true, 'Denso', 'New'),
  ('lst-102', 'str-02', 'prt-02', 24000.00, 8, 45, true, 'Bosch', 'New')
ON CONFLICT (id) DO NOTHING;

-- MECHSOURCE RELATIONAL DATABASE SCHEMA
-- Designed for Supabase / PostgreSQL
-- Covers all core business domains: Users, Roles, Garage, Parts, Marketplace Listings,
-- Mechanics, Jobs, Orders, MechSource Protect Escrow, Wallet, Fleet, RFQs, Rentals, Workshops, Notifications.

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS & ROLES
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(250) NOT NULL,
    email VARCHAR(250),
    avatar_url TEXT,
    primary_role VARCHAR(50) NOT NULL DEFAULT 'driver', -- 'driver', 'fleet', 'seller', 'mechanic', 'admin'
    available_roles TEXT[] DEFAULT ARRAY['driver'],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. GARAGE VEHICLES (CUSTOMER & FLEET MACHINES)
CREATE TABLE IF NOT EXISTS garage_vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    vehicle_type VARCHAR(50) NOT NULL DEFAULT 'Car / SUV', -- 'Car / SUV', 'Truck', 'Generator', 'Heavy Plant'
    make VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INT NOT NULL,
    engine VARCHAR(100) NOT NULL,
    fuel_type VARCHAR(50) NOT NULL,
    nickname VARCHAR(100),
    vin VARCHAR(100),
    odometer_km INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'Running', -- 'Running', 'Service due', 'Down'
    is_fleet BOOLEAN DEFAULT FALSE,
    fleet_code VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. PARTS CATALOG & OEM MATCHING
CREATE TABLE IF NOT EXISTS parts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category VARCHAR(50) NOT NULL, -- 'ENG', 'FUL', 'SRV', 'BRK', 'SUS', 'ELC', 'CLG', 'BDY'
    category_name VARCHAR(100) NOT NULL,
    name VARCHAR(250) NOT NULL,
    oem_number VARCHAR(100) NOT NULL,
    description TEXT,
    image_url TEXT,
    quality_grade VARCHAR(50) DEFAULT 'OEM-equivalent', -- 'Genuine', 'OEM-equivalent', 'Aftermarket'
    compatible_vehicles JSONB DEFAULT '[]'::jsonb, -- Array of { make, model, year_start, year_end, engine }
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. SELLER STORES & MARKETPLACE LISTINGS
CREATE TABLE IF NOT EXISTS seller_stores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    store_name VARCHAR(250) NOT NULL,
    location_name VARCHAR(250) NOT NULL,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    is_open BOOLEAN DEFAULT TRUE,
    payout_due_date TIMESTAMP WITH TIME ZONE,
    pending_payout_amount DECIMAL(12,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID REFERENCES seller_stores(id) ON DELETE CASCADE,
    part_id UUID REFERENCES parts(id) ON DELETE CASCADE,
    price DECIMAL(12,2) NOT NULL,
    stock_quantity INT NOT NULL DEFAULT 1,
    delivery_time_mins INT DEFAULT 30,
    is_same_day BOOLEAN DEFAULT TRUE,
    brand VARCHAR(100),
    condition VARCHAR(50) DEFAULT 'New',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. MECHANIC PROFILES & SKILLS
CREATE TABLE IF NOT EXISTS mechanic_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    specialisations TEXT[] DEFAULT ARRAY[]::text[],
    rating DECIMAL(3,2) DEFAULT 5.0,
    jobs_completed INT DEFAULT 0,
    is_online BOOLEAN DEFAULT TRUE,
    is_taking_jobs BOOLEAN DEFAULT TRUE,
    callout_fee DECIMAL(12,2) DEFAULT 5000.00,
    standard_service_fee DECIMAL(12,2) DEFAULT 15000.00,
    id_verified BOOLEAN DEFAULT TRUE,
    guarantor_verified BOOLEAN DEFAULT TRUE,
    skills_tested BOOLEAN DEFAULT TRUE,
    location_name VARCHAR(250) DEFAULT 'Ikeja GRA, Lagos',
    distance_km DECIMAL(5,2) DEFAULT 1.2,
    eta_mins INT DEFAULT 15,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. ORDERS, JOB SHEETS & MECHSOURCE PROTECT ESCROW
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(50) PRIMARY KEY, -- e.g. MS-89241
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    vehicle_id UUID REFERENCES garage_vehicles(id) ON DELETE SET NULL,
    mechanic_id UUID REFERENCES mechanic_profiles(id) ON DELETE SET NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Seller packing', -- 'Packing', 'On the way', 'Fitted', 'Completed', 'Disputed'
    delivery_address TEXT NOT NULL,
    subtotal_parts DECIMAL(12,2) NOT NULL,
    delivery_fee DECIMAL(12,2) DEFAULT 0.00,
    labour_fee DECIMAL(12,2) DEFAULT 0.00,
    total_amount DECIMAL(12,2) NOT NULL,
    escrow_status VARCHAR(50) NOT NULL DEFAULT 'HELD', -- 'HELD', 'RELEASED', 'REFUNDED'
    fitting_included BOOLEAN DEFAULT FALSE,
    estimated_arrival_mins INT DEFAULT 25,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id VARCHAR(50) REFERENCES orders(id) ON DELETE CASCADE,
    listing_id UUID REFERENCES listings(id) ON DELETE SET NULL,
    part_id UUID REFERENCES parts(id) ON DELETE SET NULL,
    part_name VARCHAR(250) NOT NULL,
    oem_number VARCHAR(100),
    store_name VARCHAR(250) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(12,2) NOT NULL
);

-- 7. MECHANIC JOB EXECUTION (6-STEP PROGRESS)
CREATE TABLE IF NOT EXISTS jobs (
    id VARCHAR(50) PRIMARY KEY, -- e.g. J-4091
    order_id VARCHAR(50) REFERENCES orders(id) ON DELETE CASCADE,
    mechanic_id UUID REFERENCES mechanic_profiles(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    vehicle_info VARCHAR(250) NOT NULL,
    pickup_store_name VARCHAR(250),
    earnings DECIMAL(12,2) NOT NULL,
    current_step INT DEFAULT 1, -- 1 to 6
    is_active BOOLEAN DEFAULT TRUE,
    before_photos TEXT[] DEFAULT ARRAY[]::text[],
    after_photos TEXT[] DEFAULT ARRAY[]::text[],
    customer_signed_off BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. WALLET & TRANSACTIONS
CREATE TABLE IF NOT EXISTS wallet_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'HELD', 'FUNDED', 'RELEASED', 'REFUND', 'MOBILE_FITTING'
    description TEXT NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    is_credit BOOLEAN NOT NULL,
    order_id VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. LOCAL PART REQUESTS (BIDDING)
CREATE TABLE IF NOT EXISTS part_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    part_name VARCHAR(250) NOT NULL,
    vehicle_info VARCHAR(250) NOT NULL,
    oem_number VARCHAR(100),
    photo_url TEXT,
    distance_km DECIMAL(5,2) DEFAULT 3.4,
    expires_in_mins INT DEFAULT 60,
    quote_count INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'OPEN', -- 'OPEN', 'QUOTED', 'EXPIRED'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. FLEET RFQ & B2B PROCUREMENT
CREATE TABLE IF NOT EXISTS fleet_rfqs (
    id VARCHAR(50) PRIMARY KEY, -- e.g. RFQ-9021
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    company_name VARCHAR(250) NOT NULL,
    title VARCHAR(250) NOT NULL,
    vehicle_count INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'OPEN', -- 'OPEN', 'AWARDED', 'CLOSED'
    expires_in_hours INT DEFAULT 6,
    items JSONB DEFAULT '[]'::jsonb,
    maintenance_spend_october DECIMAL(12,2) DEFAULT 1850000.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS rfq_quotes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rfq_id VARCHAR(50) REFERENCES fleet_rfqs(id) ON DELETE CASCADE,
    seller_name VARCHAR(250) NOT NULL,
    tag VARCHAR(50) DEFAULT 'BEST VALUE',
    quality_grade VARCHAR(50) DEFAULT 'OEM-equivalent',
    delivery_timeframe VARCHAR(100) DEFAULT 'Tomorrow',
    payment_terms VARCHAR(100) DEFAULT '30-day credit',
    amount DECIMAL(12,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING' -- 'PENDING', 'AWARDED', 'REJECTED'
);

-- 11. HEAVY EQUIPMENT RENTAL
CREATE TABLE IF NOT EXISTS equipment_rentals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(250) NOT NULL,
    specifications VARCHAR(250) NOT NULL,
    daily_rate DECIMAL(12,2) NOT NULL,
    availability_status VARCHAR(100) DEFAULT 'Available Mon',
    category VARCHAR(50) NOT NULL, -- 'Excavator', 'Backhoe', 'Forklift', 'Generator'
    image_url TEXT,
    requires_operator BOOLEAN DEFAULT TRUE
);

-- 12. WORKSHOPS
CREATE TABLE IF NOT EXISTS workshops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(250) NOT NULL,
    location VARCHAR(250) NOT NULL,
    distance_km DECIMAL(5,2) DEFAULT 2.1,
    free_bays INT DEFAULT 2,
    total_bays INT DEFAULT 6,
    specialties TEXT[] DEFAULT ARRAY[]::text[],
    is_busy BOOLEAN DEFAULT FALSE
);

-- 13. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL, -- 'ORDER', 'QUOTES', 'SERVICE', 'PRICE', 'MECH'
    title VARCHAR(250) NOT NULL,
    message TEXT NOT NULL,
    time_ago VARCHAR(50) NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 14. FILE & IMAGE UPLOADS
CREATE TABLE IF NOT EXISTS uploaded_files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    file_name VARCHAR(250) NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    file_url TEXT NOT NULL,
    purpose VARCHAR(100) NOT NULL, -- 'part_snap', 'mechanic_id', 'job_proof', 'vehicle_paper', 'seller_label'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

/*
 * MECHSOURCE TYPES & DATA PERSISTENCE LAYER
 * Provides full relational data structures, Supabase interface abstraction,
 * and a persistent local memory/localStorage fallback layer so the app functions
 * seamlessly both online with Supabase and offline in standalone web previews.
 */

export type UserRole = 'driver' | 'fleet' | 'seller' | 'mechanic' | 'admin';

export interface UserProfile {
  id: string;
  phone_number: string;
  full_name: string;
  email: string;
  avatar_url: string;
  primary_role: UserRole;
  available_roles: UserRole[];
}

export interface GarageVehicle {
  id: string;
  user_id: string;
  vehicle_type: 'Car / SUV' | 'Truck' | 'Generator' | 'Heavy Plant';
  make: string;
  model: string;
  year: number;
  engine: string;
  fuel_type: string;
  nickname?: string;
  vin?: string;
  odometer_km: number;
  status: 'Running' | 'Service due' | 'Down';
  is_fleet: boolean;
  fleet_code?: string;
}

export interface PartItem {
  id: string;
  category: 'ENG' | 'FUL' | 'SRV' | 'BRK' | 'SUS' | 'ELC' | 'CLG' | 'BDY';
  category_name: string;
  name: string;
  oem_number: string;
  description: string;
  image_url: string;
  quality_grade: 'Genuine' | 'OEM-equivalent' | 'Aftermarket';
  compatible_vehicles: Array<{
    make: string;
    model: string;
    year_start: number;
    year_end: number;
    engine: string;
  }>;
}

export interface SellerListing {
  id: string;
  store_id: string;
  store_name: string;
  location_name: string;
  part_id: string;
  part_name: string;
  oem_number: string;
  category: string;
  price: number;
  stock_quantity: number;
  delivery_time_mins: number;
  is_same_day: boolean;
  quality_grade: 'Genuine' | 'OEM-equivalent' | 'Aftermarket';
  image_url: string;
}

export interface MechanicProfile {
  id: string;
  user_id: string;
  name: string;
  specialisations: string[];
  rating: number;
  jobs_completed: number;
  is_online: boolean;
  is_taking_jobs: boolean;
  callout_fee: number;
  standard_service_fee: number;
  id_verified: boolean;
  guarantor_verified: boolean;
  skills_tested: boolean;
  location_name: string;
  distance_km: number;
  eta_mins: number;
  avatar_url: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  listing_id?: string;
  part_id?: string;
  part_name: string;
  oem_number: string;
  store_name: string;
  quantity: number;
  unit_price: number;
}

export interface OrderRecord {
  id: string;
  user_id: string;
  vehicle_id?: string;
  mechanic_id?: string;
  mechanic_name?: string;
  status: 'Packing' | 'On the way' | 'Fitted' | 'Completed' | 'Disputed';
  delivery_address: string;
  items: OrderItem[];
  subtotal_parts: number;
  delivery_fee: number;
  labour_fee: number;
  total_amount: number;
  escrow_status: 'HELD' | 'RELEASED' | 'REFUNDED';
  fitting_included: boolean;
  estimated_arrival_mins: number;
  created_at: string;
}

export interface MechanicJobStep {
  step_number: number;
  title: string;
  description: string;
  completed: boolean;
}

export interface MechanicJobRecord {
  id: string;
  order_id: string;
  mechanic_id: string;
  customer_name: string;
  customer_phone: string;
  vehicle_info: string;
  pickup_store_name: string;
  earnings: number;
  current_step: number;
  steps: MechanicJobStep[];
  is_active: boolean;
  before_photos: string[];
  after_photos: string[];
  customer_signed_off: boolean;
  distance_km: number;
  est_time_mins: number;
}

export interface WalletTransaction {
  id: string;
  type: 'HELD' | 'FUNDED' | 'RELEASED' | 'REFUND' | 'MOBILE_FITTING';
  description: string;
  amount: number;
  is_credit: boolean;
  order_id?: string;
  created_at: string;
}

export interface PartRequest {
  id: string;
  part_name: string;
  vehicle_info: string;
  oem_number: string;
  photo_url: string;
  distance_km: number;
  expires_in_mins: number;
  quote_count: number;
  status: 'OPEN' | 'QUOTED' | 'EXPIRED';
  time_ago: string;
}

export interface FleetRFQQuote {
  id: string;
  seller_name: string;
  tag: 'BEST VALUE' | 'GENUINE' | 'AFTERMARKET';
  quality_grade: string;
  delivery_timeframe: string;
  payment_terms: string;
  amount: number;
  status: 'PENDING' | 'AWARDED' | 'REJECTED';
}

export interface FleetRFQ {
  id: string;
  title: string;
  company_name: string;
  vehicle_count: number;
  status: 'OPEN' | 'AWARDED' | 'CLOSED';
  expires_in_hours: number;
  items: Array<{ name: string; qty: number }>;
  quotes: FleetRFQQuote[];
}

export interface EquipmentRental {
  id: string;
  title: string;
  specifications: string;
  daily_rate: number;
  availability_status: string;
  category: 'Excavator' | 'Backhoe' | 'Forklift' | 'Generator';
  image_url: string;
  requires_operator: boolean;
}

export interface Workshop {
  id: string;
  name: string;
  location: string;
  distance_km: number;
  free_bays: number;
  total_bays: number;
  specialties: string[];
  is_busy: boolean;
}

export interface NotificationItem {
  id: string;
  category: 'ORDER' | 'QUOTES' | 'SERVICE' | 'PRICE' | 'MECH';
  title: string;
  message: string;
  time_ago: string;
  read: boolean;
}

// INITIAL SEED DATA FOR INTERACTIVE PLATFORM PREVIEW
export const INITIAL_USER: UserProfile = {
  id: 'usr-001',
  phone_number: '+234 803 000 0000',
  full_name: 'Babajide Ogundele',
  email: 'jide@mechsource.ng',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  primary_role: 'driver',
  available_roles: ['driver', 'fleet', 'seller', 'mechanic', 'admin']
};

export const INITIAL_GARAGE: GarageVehicle[] = [
  {
    id: 'veh-01',
    user_id: 'usr-001',
    vehicle_type: 'Car / SUV',
    make: 'Toyota',
    model: 'Hilux',
    year: 2018,
    engine: '1GD-FTV',
    fuel_type: 'Diesel',
    nickname: 'NO. 01 Hilux 2018',
    vin: 'AHTFR22G90581920',
    odometer_km: 87412,
    status: 'Running',
    is_fleet: false
  },
  {
    id: 'veh-02',
    user_id: 'usr-001',
    vehicle_type: 'Car / SUV',
    make: 'Toyota',
    model: 'Corolla',
    year: 2014,
    engine: '2ZR-FE',
    fuel_type: 'Petrol',
    nickname: 'NO. 02 Corolla 2014',
    vin: '2T1BR32E85C10928',
    odometer_km: 112500,
    status: 'Running',
    is_fleet: false
  },
  {
    id: 'veh-03',
    user_id: 'usr-001',
    vehicle_type: 'Generator',
    make: 'Mikano / Perkins',
    model: '20kVA Silent',
    year: 2021,
    engine: 'Perkins 404D-22G',
    fuel_type: 'Diesel',
    nickname: 'NO. 03 Generator 20kVA',
    vin: 'GEN-20KVA-PERK-09',
    odometer_km: 3400,
    status: 'Service due',
    is_fleet: false
  }
];

export const INITIAL_PARTS: PartItem[] = [
  {
    id: 'prt-01',
    category: 'FUL',
    category_name: 'Fuel System',
    name: 'Fuel filter element',
    oem_number: '23390-0L070',
    description: 'High efficiency diesel fuel filter element for 1GD/2GD Toyota engines.',
    image_url: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=400&q=80',
    quality_grade: 'Genuine',
    compatible_vehicles: [
      { make: 'Toyota', model: 'Hilux', year_start: 2016, year_end: 2023, engine: '1GD-FTV / 2GD-FTV' },
      { make: 'Toyota', model: 'Fortuner', year_start: 2016, year_end: 2023, engine: '2.8D' },
      { make: 'Toyota', model: 'Hiace', year_start: 2019, year_end: 2023, engine: '1GD-FTV' }
    ]
  },
  {
    id: 'prt-02',
    category: 'ENG',
    category_name: 'Engine',
    name: 'Bosch glow plug set',
    oem_number: '19850-30010',
    description: 'Bosch rapid heating glow plug set for quick cold starts on diesel engines.',
    image_url: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=400&q=80',
    quality_grade: 'OEM-equivalent',
    compatible_vehicles: [
      { make: 'Toyota', model: 'Hilux', year_start: 2015, year_end: 2022, engine: '1GD-FTV' }
    ]
  },
  {
    id: 'prt-03',
    category: 'BRK',
    category_name: 'Brakes',
    name: 'Front brake pads (Pair)',
    oem_number: '04465-0K340',
    description: 'Heavy duty metallic ceramic brake pad set with minimum dust.',
    image_url: 'https://images.unsplash.com/photo-1600792580403-0d32f5117462?auto=format&fit=crop&w=400&q=80',
    quality_grade: 'OEM-equivalent',
    compatible_vehicles: [
      { make: 'Toyota', model: 'Hilux', year_start: 2016, year_end: 2023, engine: '1GD-FTV' }
    ]
  },
  {
    id: 'prt-04',
    category: 'SRV',
    category_name: 'Service & Filters',
    name: 'Engine oil filter',
    oem_number: '90915-YZZD2',
    description: 'Spin-on oil filter element with anti-drainback valve.',
    image_url: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=400&q=80',
    quality_grade: 'Genuine',
    compatible_vehicles: [
      { make: 'Toyota', model: 'Hilux', year_start: 2012, year_end: 2023, engine: '1GD-FTV / 2KD-FTV' }
    ]
  }
];

export const INITIAL_LISTINGS: SellerListing[] = [
  {
    id: 'lst-101',
    store_id: 'str-01',
    store_name: 'Diesel Pro Ikeja',
    location_name: 'Ikeja GRA, Lagos (1.2 km)',
    part_id: 'prt-01',
    part_name: 'Denso fuel filter',
    oem_number: 'REPL. 23390-0L070',
    category: 'FUL',
    price: 18500,
    stock_quantity: 12,
    delivery_time_mins: 25,
    is_same_day: true,
    quality_grade: 'Genuine',
    image_url: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'lst-102',
    store_id: 'str-02',
    store_name: 'Ladipo Auto Hub · Store 3',
    location_name: 'Ladipo Market, Lagos (6.5 km)',
    part_id: 'prt-02',
    part_name: 'Bosch glow plug set',
    oem_number: 'REPL. 19850-30010',
    category: 'ENG',
    price: 24000,
    stock_quantity: 8,
    delivery_time_mins: 45,
    is_same_day: true,
    quality_grade: 'OEM-equivalent',
    image_url: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'lst-103',
    store_id: 'str-03',
    store_name: 'Ojota Motor Parts',
    location_name: 'Ojota, Lagos (4.2 km)',
    part_id: 'prt-03',
    part_name: 'Hilux brake pads (front)',
    oem_number: '04465-0K340',
    category: 'BRK',
    price: 32000,
    stock_quantity: 15,
    delivery_time_mins: 35,
    is_same_day: true,
    quality_grade: 'Genuine',
    image_url: 'https://images.unsplash.com/photo-1600792580403-0d32f5117462?auto=format&fit=crop&w=400&q=80'
  }
];

export const INITIAL_MECHANICS: MechanicProfile[] = [
  {
    id: 'mech-01',
    user_id: 'usr-mech-01',
    name: 'Sampson "Diesel King" Okafor',
    specialisations: ['Toyota diesel', 'Injectors', 'Servicing', '1GD / 2GD'],
    rating: 4.9,
    jobs_completed: 142,
    is_online: true,
    is_taking_jobs: true,
    callout_fee: 5000,
    standard_service_fee: 15000,
    id_verified: true,
    guarantor_verified: true,
    skills_tested: true,
    location_name: 'Ikeja GRA, Lagos',
    distance_km: 1.2,
    eta_mins: 15,
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80'
  },
  {
    id: 'mech-02',
    user_id: 'usr-mech-02',
    name: 'Engineer Kabir Bawa',
    specialisations: ['Diesel trucks', 'MAN / Mack', 'Electrical systems'],
    rating: 4.8,
    jobs_completed: 98,
    is_online: true,
    is_taking_jobs: true,
    callout_fee: 7500,
    standard_service_fee: 20000,
    id_verified: true,
    guarantor_verified: true,
    skills_tested: true,
    location_name: 'Oregun, Ikeja',
    distance_km: 2.8,
    eta_mins: 25,
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80'
  },
  {
    id: 'mech-03',
    user_id: 'usr-mech-03',
    name: 'Chidi Gearbox & Clutch',
    specialisations: ['Manual gearbox', 'Clutch replacement', 'Heavy machinery'],
    rating: 4.7,
    jobs_completed: 210,
    is_online: false,
    is_taking_jobs: false,
    callout_fee: 6000,
    standard_service_fee: 18000,
    id_verified: true,
    guarantor_verified: true,
    skills_tested: true,
    location_name: 'Maryland, Lagos',
    distance_km: 4.1,
    eta_mins: 40,
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=250&q=80'
  }
];

export const INITIAL_ORDERS: OrderRecord[] = [
  {
    id: 'MS-89241',
    user_id: 'usr-001',
    mechanic_id: 'mech-01',
    mechanic_name: 'Sampson Okafor (Toyota Specialist)',
    status: 'On the way',
    delivery_address: 'Site office, Ikeja GRA, Lagos',
    items: [
      {
        id: 'itm-01',
        order_id: 'MS-89241',
        part_name: 'Denso fuel filter',
        oem_number: '23390-0L070',
        store_name: 'Diesel Pro Ikeja',
        quantity: 1,
        unit_price: 18500
      },
      {
        id: 'itm-02',
        order_id: 'MS-89241',
        part_name: 'Bosch glow plug set',
        oem_number: '19850-30010',
        store_name: 'Ladipo Auto Hub',
        quantity: 2,
        unit_price: 24000
      }
    ],
    subtotal_parts: 66500,
    delivery_fee: 2500,
    labour_fee: 12000,
    total_amount: 81000,
    escrow_status: 'HELD',
    fitting_included: true,
    estimated_arrival_mins: 25,
    created_at: new Date().toISOString()
  },
  {
    id: 'MS-89190',
    user_id: 'usr-001',
    status: 'Packing',
    delivery_address: 'Ladipo Auto Hub Store 3 (Pickup)',
    items: [
      {
        id: 'itm-03',
        order_id: 'MS-89190',
        part_name: 'Hilux brake pads (front)',
        oem_number: '04465-0K340',
        store_name: 'Ojota Motor Parts',
        quantity: 1,
        unit_price: 32000
      }
    ],
    subtotal_parts: 32000,
    delivery_fee: 0,
    labour_fee: 0,
    total_amount: 32000,
    escrow_status: 'HELD',
    fitting_included: false,
    estimated_arrival_mins: 15,
    created_at: new Date(Date.now() - 3600000 * 24).toISOString()
  }
];

export const INITIAL_JOB: MechanicJobRecord = {
  id: 'J-4091',
  order_id: 'MS-89241',
  mechanic_id: 'mech-01',
  customer_name: 'Babajide Ogundele',
  customer_phone: '+234 803 000 0000',
  vehicle_info: 'Toyota Hilux 2018 · 1GD-FTV Diesel',
  pickup_store_name: 'Diesel Pro Ikeja',
  earnings: 12000,
  current_step: 2,
  steps: [
    { step_number: 1, title: 'Arrived on site', description: 'Location confirmed automatically via GPS', completed: true },
    { step_number: 2, title: 'Before photos', description: 'Engine bay & old parts photographed', completed: true },
    { step_number: 3, title: 'Diagnose', description: 'Confirm fault matches the order details', completed: false },
    { step_number: 4, title: 'Fit parts', description: 'Fit fuel filter & 2 glow plugs', completed: false },
    { step_number: 5, title: 'Test run', description: 'Start engine, idle 5 min, check for leaks', completed: false },
    { step_number: 6, title: 'After photos', description: 'Old parts handed to customer for verification', completed: false }
  ],
  is_active: true,
  before_photos: ['https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=400&q=80'],
  after_photos: [],
  customer_signed_off: false,
  distance_km: 1.2,
  est_time_mins: 45
};

export const INITIAL_TRANSACTIONS: WalletTransaction[] = [
  {
    id: 'tx-01',
    type: 'HELD',
    description: 'Held in Protect · order #MS-89241',
    amount: 81000,
    is_credit: false,
    order_id: 'MS-89241',
    created_at: 'Today · released when fitted'
  },
  {
    id: 'tx-02',
    type: 'FUNDED',
    description: 'Funded by bank transfer',
    amount: 150000,
    is_credit: true,
    created_at: 'Today 10:15 AM'
  },
  {
    id: 'tx-03',
    type: 'RELEASED',
    description: 'Battery purchase · Ojota Parts',
    amount: 45000,
    is_credit: false,
    created_at: 'Yesterday · confirmed'
  },
  {
    id: 'tx-04',
    type: 'REFUND',
    description: 'Refund · wrong part dispute resolved',
    amount: 18500,
    is_credit: true,
    created_at: '3 days ago'
  }
];

export const INITIAL_PART_REQUESTS: PartRequest[] = [
  {
    id: 'req-01',
    part_name: 'Rear wiper motor',
    vehicle_info: 'Toyota Hilux 2018 · OEM 85110-0K020',
    oem_number: '85110-0K020',
    photo_url: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=400&q=80',
    distance_km: 3.4,
    expires_in_mins: 42,
    quote_count: 1,
    status: 'OPEN',
    time_ago: '18m ago'
  },
  {
    id: 'req-02',
    part_name: 'Turbo actuator',
    vehicle_info: 'Mitsubishi Canter 2016 · Engine 4M50',
    oem_number: 'ME223508',
    photo_url: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=400&q=80',
    distance_km: 6.0,
    expires_in_mins: 120,
    quote_count: 0,
    status: 'OPEN',
    time_ago: '1h ago'
  },
  {
    id: 'req-03',
    part_name: 'Alternator 24V Heavy Duty',
    vehicle_info: 'MAN TGS Truck · Photo only matched',
    oem_number: '51261017240',
    photo_url: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=400&q=80',
    distance_km: 11.0,
    expires_in_mins: 300,
    quote_count: 3,
    status: 'OPEN',
    time_ago: '2h ago'
  }
];

export const INITIAL_FLEET_RFQS: FleetRFQ[] = [
  {
    id: 'RFQ-9021',
    title: 'OIL SERVICE × 4 PICKUPS',
    company_name: 'DANGOTE LOGISTICS YARD',
    vehicle_count: 4,
    status: 'OPEN',
    expires_in_hours: 6,
    items: [
      { name: 'Oil filter · Hilux 1GD-FTV', qty: 4 },
      { name: 'Engine oil 5W-30 · 7 L', qty: 4 },
      { name: 'On-site service labour', qty: 1 }
    ],
    quotes: [
      {
        id: 'q-01',
        seller_name: 'Diesel Pro Ikeja',
        tag: 'BEST VALUE',
        quality_grade: 'OEM-equivalent',
        delivery_timeframe: 'Tomorrow',
        payment_terms: '30-day credit',
        amount: 240000,
        status: 'PENDING'
      },
      {
        id: 'q-02',
        seller_name: 'Ladipo Auto Hub',
        tag: 'GENUINE',
        quality_grade: 'Genuine OEM',
        delivery_timeframe: 'Tomorrow',
        payment_terms: 'Prepaid',
        amount: 285000,
        status: 'PENDING'
      },
      {
        id: 'q-03',
        seller_name: 'Ojota Parts Market',
        tag: 'AFTERMARKET',
        quality_grade: 'Aftermarket',
        delivery_timeframe: 'Today',
        payment_terms: 'Prepaid',
        amount: 210000,
        status: 'PENDING'
      }
    ]
  }
];

export const INITIAL_EQUIPMENT: EquipmentRental[] = [
  {
    id: 'eq-01',
    title: 'CAT Excavator 20t',
    specifications: '20 t · 1.0 m³ bucket · Hydraulic breaker ready',
    daily_rate: 185000,
    availability_status: 'Available Mon',
    category: 'Excavator',
    image_url: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=400&q=80',
    requires_operator: true
  },
  {
    id: 'eq-02',
    title: 'JCB Backhoe Loader 3CX',
    specifications: '4×4 · ±8 t · Dual bucket kit',
    daily_rate: 140000,
    availability_status: '2 nearby',
    category: 'Backhoe',
    image_url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=400&q=80',
    requires_operator: true
  },
  {
    id: 'eq-03',
    title: 'Toyota Diesel Forklift 3t',
    specifications: '3 t capacity · 4.5m mast height',
    daily_rate: 65000,
    availability_status: 'Available Tue',
    category: 'Forklift',
    image_url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&q=80',
    requires_operator: true
  },
  {
    id: 'eq-04',
    title: 'Mikano Diesel Generator 100kVA',
    specifications: '100 kVA · Silent canopy · Auto switch',
    daily_rate: 95000,
    availability_status: 'Available Mon',
    category: 'Generator',
    image_url: 'https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=400&q=80',
    requires_operator: false
  }
];

export const INITIAL_WORKSHOPS: Workshop[] = [
  {
    id: 'ws-01',
    name: 'Diesel Centre Ikeja',
    location: 'Oregun, Ikeja · 2.1 km',
    distance_km: 2.1,
    free_bays: 2,
    total_bays: 6,
    specialties: ['Diesel Injector bench', 'Trucks', 'Fuel pump calibration'],
    is_busy: false
  },
  {
    id: 'ws-02',
    name: 'Precision Auto Clinic',
    location: 'Ogba, Ikeja · 4.5 km',
    distance_km: 4.5,
    free_bays: 1,
    total_bays: 4,
    specialties: ['Toyota Gearbox', 'Diagnostics', 'AC recharge'],
    is_busy: false
  },
  {
    id: 'ws-03',
    name: 'Heavy Plant Mechanicals',
    location: 'Agbara Industrial Park · 38 km',
    distance_km: 38,
    free_bays: 0,
    total_bays: 8,
    specialties: ['Excavators', 'Hydraulics', 'Heavy Welding'],
    is_busy: true
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-01',
    category: 'ORDER',
    title: 'Rider is 10 minutes away',
    message: 'Denso fuel filter · Diesel Pro Ikeja',
    time_ago: '2m',
    read: false
  },
  {
    id: 'notif-02',
    category: 'QUOTES',
    title: '3 sellers answered your part request',
    message: 'Hilux 2018 rear wiper motor · quotes from Ladipo and Ojota',
    time_ago: '18m',
    read: false
  },
  {
    id: 'notif-03',
    category: 'SERVICE',
    title: 'Hilux oil change is due',
    message: 'You are close to your 5,000 km interval (87,412 km current reading)',
    time_ago: '1h',
    read: false
  },
  {
    id: 'notif-04',
    category: 'PRICE',
    title: 'Price dropped on a saved part',
    message: 'Bosch glow plug, Hilux 1GD-FTV dropped by ₦2,000',
    time_ago: '3h',
    read: true
  },
  {
    id: 'notif-05',
    category: 'MECH',
    title: 'Sampson Okafor sent a quote',
    message: 'Diagnosis + fuel filter fitting: ₦12,000 labour',
    time_ago: 'Yesterday',
    read: true
  }
];

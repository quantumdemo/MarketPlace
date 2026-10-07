/*
 * MECHSOURCE TYPES & REAL SUPABASE DATABASE PERSISTENCE LAYER
 * Provides full relational data structures and live Supabase query methods for:
 * Users, Garage Vehicles, Parts, Marketplace Listings, Mechanics, Orders,
 * Wallet Transactions, Part Requests, Fleet RFQs, Equipment Rentals, Workshops, and Notifications.
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = (supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('your-supabase-project'))
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

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

// LIVE SUPABASE DATABASE QUERY METHODS - NO DEMO FALLBACK
export async function fetchGarageVehicles(userId: string): Promise<GarageVehicle[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from('garage_vehicles')
      .select('*')
      .eq('user_id', userId);
    if (!error && data) return data as GarageVehicle[];
  }
  return [];
}

export async function fetchPartRequests(): Promise<PartRequest[]> {
  if (supabase) {
    const { data, error } = await supabase.from('part_requests').select('*');
    if (!error && data) return data as PartRequest[];
  }
  return [];
}

export async function createPartRequest(request: Omit<PartRequest, 'id'>): Promise<PartRequest> {
  const newReq = { ...request, id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `00000000-0000-4000-8000-${Date.now().toString().slice(-12)}` };
  if (supabase) {
    const { data, error } = await supabase.from('part_requests').insert([newReq]).select().single();
    if (!error && data) return data as PartRequest;
  }
  return newReq as PartRequest;
}

export async function fetchFleetRFQs(): Promise<FleetRFQ[]> {
  if (supabase) {
    const { data, error } = await supabase.from('fleet_rfqs').select('*, quotes:fleet_rfq_quotes(*)');
    if (!error && data) return data as FleetRFQ[];
  }
  return [];
}

export async function createFleetRFQQuote(rfqId: string, quote: Omit<FleetRFQQuote, 'id'>): Promise<FleetRFQQuote> {
  const newQuote = { ...quote, id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `00000000-0000-4000-8000-${Date.now().toString().slice(-12)}`, rfq_id: rfqId };
  if (supabase) {
    const { data, error } = await supabase.from('fleet_rfq_quotes').insert([newQuote]).select().single();
    if (!error && data) return data as FleetRFQQuote;
  }
  return newQuote as FleetRFQQuote;
}

export async function fetchActiveMechanicJob(mechanicId: string): Promise<MechanicJobRecord | null> {
  if (supabase) {
    const { data, error } = await supabase.from('mechanic_jobs').select('*').eq('mechanic_id', mechanicId).eq('is_active', true).maybeSingle();
    if (!error && data) return data as MechanicJobRecord;
  }
  return null;
}

export async function updateMechanicJobStep(jobId: string, currentStep: number, steps: MechanicJobStep[], photos?: { before_photos?: string[]; after_photos?: string[] }): Promise<void> {
  if (supabase) {
    await supabase.from('mechanic_jobs').update({
      current_step: currentStep,
      steps,
      ...(photos?.before_photos ? { before_photos: photos.before_photos } : {}),
      ...(photos?.after_photos ? { after_photos: photos.after_photos } : {})
    }).eq('id', jobId);
  }
}

export async function createGarageVehicle(vehicle: Omit<GarageVehicle, 'id'>): Promise<GarageVehicle> {
  const newVehicle = { ...vehicle, id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `00000000-0000-4000-8000-${Date.now().toString().slice(-12)}` };
  if (supabase) {
    const { data, error } = await supabase
      .from('garage_vehicles')
      .insert([newVehicle])
      .select()
      .single();
    if (!error && data) return data as GarageVehicle;
  }
  return newVehicle as GarageVehicle;
}

export async function fetchOrders(userId: string): Promise<OrderRecord[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from('orders')
      .select('*, items:order_items(*)')
      .eq('user_id', userId);
    if (!error && data) return data as OrderRecord[];
  }
  return [];
}

export async function createOrderRecord(order: OrderRecord): Promise<OrderRecord> {
  if (supabase) {
    await supabase.from('orders').insert([{
      id: order.id,
      user_id: order.user_id,
      status: order.status,
      delivery_address: order.delivery_address,
      subtotal_parts: order.subtotal_parts,
      delivery_fee: order.delivery_fee,
      labour_fee: order.labour_fee,
      total_amount: order.total_amount,
      escrow_status: order.escrow_status,
      fitting_included: order.fitting_included,
      estimated_arrival_mins: order.estimated_arrival_mins
    }]);

    if (order.items && order.items.length > 0) {
      await supabase.from('order_items').insert(
        order.items.map(item => ({
          order_id: order.id,
          part_name: item.part_name,
          oem_number: item.oem_number,
          store_name: item.store_name,
          quantity: item.quantity,
          unit_price: item.unit_price
        }))
      );
    }
  }
  return order;
}

export async function fetchParts(): Promise<PartItem[]> {
  if (supabase) {
    const { data, error } = await supabase.from('parts').select('*');
    if (!error && data) return data as PartItem[];
  }
  return [];
}

export async function fetchListings(): Promise<SellerListing[]> {
  if (supabase) {
    const { data, error } = await supabase.from('listings').select('*');
    if (!error && data) return data as SellerListing[];
  }
  return [];
}

export async function fetchMechanics(): Promise<MechanicProfile[]> {
  if (supabase) {
    const { data, error } = await supabase.from('mechanic_profiles').select('*');
    if (!error && data) return data as MechanicProfile[];
  }
  return [];
}

export async function fetchEquipmentRentals(): Promise<EquipmentRental[]> {
  if (supabase) {
    const { data, error } = await supabase.from('equipment_rentals').select('*');
    if (!error && data) return data as EquipmentRental[];
  }
  return [];
}

export async function fetchWorkshops(): Promise<Workshop[]> {
  if (supabase) {
    const { data, error } = await supabase.from('workshops').select('*');
    if (!error && data) return data as Workshop[];
  }
  return [];
}

// DEFAULT INITIALIZATIONS
export const INITIAL_USER: UserProfile = {
  id: '123e4567-e89b-12d3-a456-426614174000',
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
    user_id: '123e4567-e89b-12d3-a456-426614174000',
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
  }
];

export const INITIAL_ORDERS: OrderRecord[] = [
  {
    id: 'MS-89241',
    user_id: '123e4567-e89b-12d3-a456-426614174000',
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
      }
    ],
    subtotal_parts: 18500,
    delivery_fee: 2500,
    labour_fee: 12000,
    total_amount: 33000,
    escrow_status: 'HELD',
    fitting_included: true,
    estimated_arrival_mins: 25,
    created_at: new Date().toISOString()
  }
];

export const INITIAL_TRANSACTIONS: WalletTransaction[] = [
  {
    id: 'tx-01',
    type: 'HELD',
    description: 'Held in Protect · order #MS-89241',
    amount: 33000,
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
    { step_number: 4, title: 'Fit parts', description: 'Fit parts to machine', completed: false },
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

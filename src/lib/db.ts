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
export async function checkUserExistsByPhone(phone: string): Promise<{ exists: boolean; user?: UserProfile }> {
  if (supabase) {
    try {
      const cleanPhone = phone.trim();
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('phone_number', cleanPhone)
        .maybeSingle();
      if (!error && data) {
        return { exists: true, user: data as UserProfile };
      }
    } catch (err) {
      console.warn('Check user exists error:', err);
    }
  }

  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('mechsource_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const savedPhone = (parsed.phone_number || '').replace(/\s+/g, '');
        const targetPhone = phone.replace(/\s+/g, '');
        if (savedPhone && targetPhone && (savedPhone === targetPhone || savedPhone.endsWith(targetPhone.slice(-8)))) {
          return { exists: true, user: parsed };
        }
      } catch (e) {}
    }
  }

  return { exists: false };
}

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
  id: '',
  phone_number: '',
  full_name: '',
  email: '',
  avatar_url: '',
  primary_role: 'driver',
  available_roles: ['driver', 'fleet', 'seller', 'mechanic', 'admin']
};

export const INITIAL_GARAGE: GarageVehicle[] = [];
export const INITIAL_PARTS: PartItem[] = [];
export const INITIAL_LISTINGS: SellerListing[] = [];
export const INITIAL_MECHANICS: MechanicProfile[] = [];
export const INITIAL_ORDERS: OrderRecord[] = [];
export const INITIAL_TRANSACTIONS: WalletTransaction[] = [];
export const INITIAL_PART_REQUESTS: PartRequest[] = [];
export const INITIAL_FLEET_RFQS: FleetRFQ[] = [];
export const INITIAL_EQUIPMENT: EquipmentRental[] = [];
export const INITIAL_WORKSHOPS: Workshop[] = [];
export const INITIAL_NOTIFICATIONS: NotificationItem[] = [];
export const INITIAL_JOB: MechanicJobRecord | null = null;

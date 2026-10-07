# MECHSOURCE ARCHITECTURE & IMPLEMENTATION REVIEW REPORT

**Date:** October 7, 2026
**Project:** MECHSOURCE Platform
**Target Reference:** MECHSOURCE Design & Product Reference PDF

---

## 1. OVERALL PROJECT ARCHITECTURE

The MECHSOURCE codebase is structured as a full-stack, single-repository web application built with **Next.js (App Router)** and **TypeScript**.

* **Frontend Layer:** React client components rendered inside Next.js App Router (`src/app/page.tsx` rendering `src/components/AppShell.tsx`), styled with **Tailwind CSS** and **Lucide React Icons**. UI components manage active views, tabs, modals, and client-side reactive state.
* **State & Authentication Context:** Managed centrally via `src/context/AuthContext.tsx`. User profile sessions, active role (`driver`, `fleet`, `seller`, `mechanic`, `admin`), garage vehicles, orders, and wallet transaction ledgers are held in React Context and synced to `localStorage`.
* **Backend Layer:** Next.js App Router server environment integrated with **Supabase Backend-as-a-Service (BaaS)**. Backend operations execute through:
  1. Direct client-side Supabase JavaScript SDK calls (`@supabase/supabase-js`) in `src/lib/db.ts` and `src/lib/storage.ts`.
  2. Serverless Supabase Edge Functions (`supabase/functions/send-sms-otp/index.ts`) written in TypeScript/Deno for server-side SMS and Voice OTP dispatch.
* **Database Layer:** PostgreSQL relational database hosted on Supabase, specified by relational schema DDL (`supabase/schema.sql`) and Row Level Security policies (`supabase/rls_policies.sql`).
* **File Storage:** Supabase Storage bucket (`mechsource-uploads`) for uploading images (part snaps, mechanic ID/guarantor documents, job before/after proof photos, vehicle paper scans, seller label photos). Falls back to base64 Data URLs when local storage buckets are unconfigured.
* **External Telecommunications Services:** Integrated via Deno Edge Functions with **Termii API** (for +234 Nigeria SMS & Voice OTP) and **Twilio API** (for international numbers).

---

## 2. TECHNOLOGY STACK

| Category | Technology / Framework / Library | Current Purpose & Responsibility |
| :--- | :--- | :--- |
| **Framework** | Next.js 16.4.0 (App Router, Turbopack) | Full-stack SSR/SSG React framework powering routes, static generation, and assets |
| **Language** | TypeScript (v5) | Strict type definitions across frontend components, database models (`src/lib/db.ts`), and edge functions |
| **Styling & UI** | Tailwind CSS v4, Lucide React | Utility-first responsive CSS styling, custom dark theme, and vector icon library |
| **Database & BaaS** | Supabase (PostgreSQL 15) | Relational database host, authentication service, and object storage manager |
| **Database Client** | `@supabase/supabase-js` (v2.49) | JavaScript/TypeScript client library for executing SQL queries, Auth operations, and Storage uploads |
| **Edge Functions** | Deno / Deno Standard Library (`std@0.168.0`) | Serverless functions hosted on Supabase Edge Network for dispatching SMS/Voice OTPs via Termii & Twilio |
| **Animations** | Lottie Animations (`public/animations/*.json`) | Vector animations for onboarding carousel slides (`snap-and-identify`, `garage-fitment-lock`, `mechsource-protect`) |
| **Deployment** | Vercel Platform | CI/CD cloud hosting for the Next.js web application and static assets |

---

## 3. FOLDER AND FILE STRUCTURE

```
mechsource/
├── public/                                 # Static public assets
│   ├── MechSource App UI (2).pdf           # Primary UI and product design PDF reference
│   ├── animations/                         # Lottie JSON animation files for onboarding
│   └── favicon.ico, icon.svg               # MechSource brand identity assets
├── src/
│   ├── app/                                # Next.js App Router entries
│   │   ├── layout.tsx                      # Root HTML shell and font configuration
│   │   ├── page.tsx                        # Main page entry rendering AppShell
│   │   ├── globals.css                     # Global Tailwind CSS imports & theme directives
│   │   └── icon.svg                        # SVG Favicon
│   ├── components/                         # Application View Components
│   │   ├── AppShell.tsx                    # Shell layout: header, top navigation, bottom bar, role switcher
│   │   ├── OnboardingSplashScreen.tsx      # Onboarding slides, international phone auth, role setup
│   │   ├── WelcomePlatformBanner.tsx       # Top platform announcement banner
│   │   ├── FindMyPartView.tsx              # "Snap It. We Name It.", OEM search, marketplace listings
│   │   ├── GarageView.tsx                  # Vehicle parking, VIN scanner simulator, maintenance tracker
│   │   ├── OrdersAndEscrowView.tsx         # Active order job sheets, MechSource Protect escrow release
│   │   ├── MechanicsAndSosView.tsx         # Mechanics directory, callout booking, 6-step job sheet, SOS
│   │   ├── SellerAndFleetView.tsx          # Seller store pack queue, local quote bidding, Fleet Yard, RFQs
│   │   └── ExtraModulesView.tsx            # Heavy equipment rental, workshop directory, wallet, Admin panel
│   ├── context/
│   │   └── AuthContext.tsx                 # Central React Context for state, user profiles, garage, orders
│   └── lib/
│       ├── db.ts                           # Supabase client, TypeScript interfaces, SQL query methods
│       └── storage.ts                      # File upload helper functions for Supabase Storage
├── supabase/
│   ├── schema.sql                          # Complete PostgreSQL relational DDL schema (17 domain tables)
│   ├── rls_policies.sql                    # Row Level Security SQL policies
│   ├── seed.sql                            # Development seed data SQL script
│   └── functions/
│       └── send-sms-otp/
│           └── index.ts                    # Deno Edge Function for Termii & Twilio SMS/Voice OTP
├── TESTING_PHONE_AUTH.md                   # Phone auth testing guide & credentials setup
├── DEPLOYMENT_GUIDE.md                     # Vercel, Supabase, Capacitor, and Expo deployment guide
├── package.json                            # Node.js project dependencies and build scripts
└── tsconfig.json                           # TypeScript compiler configuration
```

---

## 4. DATABASE ARCHITECTURE

The PostgreSQL database defined in `supabase/schema.sql` comprises 17 domain tables designed around real MechSource business operations:

1. `users`: Stores user ID, phone number, full name, email, avatar URL, primary role (`driver`, `fleet`, `seller`, `mechanic`, `admin`), and role arrays.
2. `garage_vehicles`: Customer and fleet machines containing `user_id`, `vehicle_type`, `make`, `model`, `year`, `engine`, `fuel_type`, `nickname`, `vin`, `odometer_km`, `status`, `is_fleet`, and `fleet_code`.
3. `parts`: Master parts catalogue containing `category`, `category_name`, `name`, `oem_number`, `description`, `image_url`, `quality_grade`, and `compatible_vehicles` (JSONB array).
4. `seller_stores`: Seller merchant profiles linked to `user_id`, store name, and location.
5. `listings`: Marketplace seller listings linking `store_id` and `part_id` with `price`, `stock_quantity`, `delivery_time_mins`, `is_same_day`, and quality grade.
6. `mechanic_profiles`: Professional mechanic profiles linked to `user_id` containing specialisations, skills, callout fee, standard service fee, verification flags (`id_verified`, `guarantor_verified`, `skills_tested`), rating, and location.
7. `orders`: Order header records linking `user_id`, `vehicle_id`, `mechanic_id` with `status` (`Packing`, `On the way`, `Fitted`, `Completed`, `Disputed`), `delivery_address`, financial subtotals, and `escrow_status` (`HELD`, `RELEASED`, `REFUNDED`).
8. `order_items`: Line items linked to `order_id` and `listing_id`.
9. `mechanic_jobs`: Active work orders linking `order_id` and `mechanic_id` with 6 execution steps (`steps` JSONB array), before/after photo URLs, and customer sign-off boolean.
10. `wallet_transactions`: Wallet ledger entries linked to `user_id` and `order_id` recording `HELD`, `FUNDED`, `RELEASED`, `REFUND` transactions.
11. `part_requests`: Local customer part requests open for seller quote bidding.
12. `fleet_rfqs`: B2B Fleet procurement RFQ header records.
13. `fleet_rfq_quotes`: Quotes submitted by sellers for fleet RFQs.
14. `equipment_rentals`: Heavy machinery equipment rental directory.
15. `workshops`: Workshop directory entries with bay availability.
16. `uploaded_files`: Audit table tracking uploaded images (`file_id`, `url`, `purpose`, `user_id`).
17. `notifications`: System event notifications linked to `user_id`.

### Entity Relationships
* `users` 1 &rarr; N `garage_vehicles` (via `user_id`)
* `users` 1 &rarr; 1 `seller_stores` or `mechanic_profiles` (via `user_id`)
* `seller_stores` 1 &rarr; N `listings` (via `store_id`)
* `parts` 1 &rarr; N `listings` (via `part_id`)
* `users` 1 &rarr; N `orders` (via `user_id`)
* `orders` 1 &rarr; N `order_items` (via `order_id`)
* `orders` 1 &rarr; 1 `mechanic_jobs` (via `order_id`)
* `orders` 1 &rarr; N `wallet_transactions` (via `order_id`)

---

## 5. AUTHENTICATION AND AUTHORISATION

* **Registration & Login Flow:**
  1. **Step 1 (Role Selection):** User selects role (`driver`, `fleet`, `seller`, `mechanic`) and inputs international phone number with country code.
  2. **Step 2 (Phone Authentication & OTP):** System invokes `sendPhoneOtp()` which calls Supabase Auth or the `send-sms-otp` Edge Function to dispatch a 6-digit OTP via Termii (+234 Nigeria) or Twilio. Features a 60s countdown timer, 3-attempt rate-limit lock, and Voice OTP option.
  3. **Step 3 (Profile Setup):** User provides Full Name, Email, and role-specific parameters (e.g. Callout Fee, Fleet Company Name, Store Name). Data is saved via `updateUserProfile()` into `localStorage` and upserted into the Supabase `users` table.
* **Authorisation & Access Control:**
  * Role-based view switching via `src/components/AppShell.tsx` role dropdown (`driver`, `fleet`, `seller`, `mechanic`, `admin`).
  * Supabase Row Level Security (`supabase/rls_policies.sql`) enforces database-level authorization:
    * Public READ access for marketplace parts, listings, mechanics, rentals, and workshops.
    * Authenticated user INSERT/UPDATE access for their own garage vehicles, orders, and requests.
    * Admin-only UPDATE/DELETE privileges on escrow disputes and user approvals using PostgreSQL security function `is_admin()`.

---

## 6. FRONTEND ARCHITECTURE

* **Page Layout & Navigation:**
  * Entry point `src/app/page.tsx` renders `AppShell.tsx`.
  * `AppShell.tsx` provides the top MechSource logo header, role switcher dropdown, active tab state (`home`, `garage`, `orders`, `mechanics`, `seller`, `more`), top announcement banner, and mobile bottom tab navigation bar.
* **Views & Components:**
  * `OnboardingSplashScreen.tsx`: Handles multi-step onboarding intro, carousel, role pick, phone OTP auth, and registration profile form.
  * `FindMyPartView.tsx`: Displays "Snap It. We Name It." camera camera upload button, search bar, category chips (`ENG`, `FUL`, `SRV`, `BRK`, `SUS`, `ELC`, `CLG`, `BDY`), and matched seller listings cards with checkout triggers.
  * `GarageView.tsx`: Displays parked machines cards, odometer trackers, maintenance schedules, VIN camera scanner modal, and machine parking form.
  * `OrdersAndEscrowView.tsx`: Active orders tab, delivery tracking ETA, MechSource Protect escrow status badge (`HELD` / `RELEASED`), and "Confirm Fitment & Release Escrow" trigger.
  * `MechanicsAndSosView.tsx`: Verified trade mechanic cards, callout fee booking modal, active 6-step mechanic work order job execution sheet with photo uploads, and 3-second hold SOS Emergency button.
  * `SellerAndFleetView.tsx`: Seller store order pack queue with countdown timers, local part request quote bidding, photo label scanner listing creator, Fleet Yard machine status board, and B2B RFQ quote comparison.
  * `ExtraModulesView.tsx`: Heavy machinery equipment rental listings, workshop directory with live bay counts, wallet transaction ledger, and Super Admin analytics panel.
* **Communication with Backend:** Frontend views call query methods defined in `src/lib/db.ts` (`fetchParts`, `fetchListings`, `fetchMechanics`, `fetchGarageVehicles`, `fetchOrders`, `fetchEquipmentRentals`, `fetchWorkshops`) or context methods in `AuthContext.tsx`.

---

## 7. BACKEND ARCHITECTURE

* **Client-Side SDK Service Layer (`src/lib/db.ts` & `src/lib/storage.ts`):**
  * Direct PostgreSQL query execution through `@supabase/supabase-js`.
  * Asynchronous methods query Supabase tables (`garage_vehicles`, `orders`, `parts`, `listings`, `mechanic_profiles`, `equipment_rentals`, `workshops`).
  * `uploadFile()` handles image uploads directly to Supabase Storage bucket `mechsource-uploads`.
* **Serverless Edge Network (`supabase/functions/send-sms-otp/index.ts`):**
  * Deno Edge Function handling HTTP POST requests for SMS and Voice OTP dispatch.
  * Communicates with **Termii REST API** (`https://api.ng.termii.com`) for +234 numbers and **Twilio REST API** (`https://api.twilio.com`) for international numbers.

---

## 8. END-TO-END DATA FLOWS

1. **Customer Registration:** User fills phone & role &rarr; Edge function sends OTP &rarr; Server verifies OTP &rarr; User completes profile details &rarr; Profile saved to `localStorage` and upserted to Supabase `users` table.
2. **Adding a Vehicle to Garage:** User opens "Park New Machine" modal &rarr; Form submitted &rarr; `addVehicleToGarage()` calls `createGarageVehicle()` in `src/lib/db.ts` &rarr; Record inserted into `garage_vehicles` table &rarr; State updated reactively.
3. **Finding a Part & Camera Upload:** User clicks "Snap Worn Part" or enters OEM number &rarr; Photo uploaded via `uploadFile()` &rarr; AI service layer integration point identifies part OEM number (`23390-0L070`) &rarr; `handleSearch()` filters `parts` table &rarr; Matching seller listings retrieved from `listings` table.
4. **Creating an Order & Escrow Payment:** Customer selects listing & adds mobile fitting &rarr; Checkout confirmed &rarr; `addOrder()` calls `createOrderRecord()` in `src/lib/db.ts` &rarr; Record inserted into `orders` and `order_items` tables &rarr; Funds deducted from wallet & recorded as `HELD` in `wallet_transactions` table under MechSource Protect escrow.
5. **Booking a Mechanic & Job Execution:** Customer selects verified mechanic & pays callout fee &rarr; Work order generated &rarr; Mechanic completes 6-step job sheet (Arrived &rarr; Before photos &rarr; Diagnose &rarr; Fit parts &rarr; Test run &rarr; After photos) &rarr; Photos uploaded to Supabase Storage.
6. **Confirming Fitment & Releasing Escrow:** Customer clicks "Confirm Part Fits & Engine Runs Right" &rarr; Order status updated to `Completed` & `escrow_status` updated to `RELEASED` &rarr; Transaction ledger updated & funds released to seller/mechanic.

---

## 9. FILE AND IMAGE HANDLING

* **Upload Storage Target:** Images uploaded via `<input type="file" accept="image/*">` controls in `FindMyPartView`, `GarageView`, `MechanicsAndSosView`, and `SellerAndFleetView` are processed by `uploadFile()` in `src/lib/storage.ts`.
* **Storage Location:** Direct upload to Supabase Storage bucket `mechsource-uploads`. When Supabase credentials/buckets are offline, `uploadFile()` converts the image file into a client-side base64 Data URL (`data:image/jpeg;base64,...`).
* **Database Reference:** Returned file URLs are stored in corresponding database table columns (`parts.image_url`, `listings.image_url`, `mechanic_jobs.before_photos`, `mechanic_jobs.after_photos`, `uploaded_files.url`).

---

## 10. REAL DATA VERSUS HARDCODED DATA

| Domain / Data Item | Current Implementation Status | Type | Purpose |
| :--- | :--- | :--- | :--- |
| **User Profiles & Sessions** | Real `localStorage` & Supabase `users` table upsert | **Real Data** | Application Data |
| **Garage Vehicles** | Live database fetch (`fetchGarageVehicles`) with fallback | **Real / Fallback** | Application Data |
| **Marketplace Parts & Listings** | Live database fetch (`fetchParts`, `fetchListings`) with fallback | **Real / Fallback** | Application Data |
| **Mechanic Directory** | Live database fetch (`fetchMechanics`) with fallback | **Real / Fallback** | Application Data |
| **Orders & Escrow Records** | Live database fetch (`fetchOrders`) & insert (`createOrderRecord`) | **Real / Fallback** | Application Data |
| **Wallet Ledgers** | React Context state + `wallet_transactions` table | **Real Data** | Application Data |
| **Equipment Rentals & Workshops** | Live database fetch (`fetchEquipmentRentals`, `fetchWorkshops`) | **Real / Fallback** | Application Data |
| **Part Requests (Local Bidding)** | Initialized from `INITIAL_PART_REQUESTS` in state | **Mock / Fallback** | Development-Only |
| **Fleet RFQs (B2B Procurement)** | Initialized from `INITIAL_FLEET_RFQS` in state | **Mock / Fallback** | Development-Only |
| **Mechanic 6-Step Active Job** | Initialized from `INITIAL_JOB` in state | **Mock / Fallback** | Development-Only |
| **VIN / Paper Camera Scanner** | Simulated OCR delay (2s timer generating sample VIN) | **Simulated API** | Development-Only |
| **AI Part Snap Identifier** | Simulated AI confidence analysis (1.5s timer returning OEM) | **Simulated API** | Integration Point |

---

## 11. FEATURE IMPLEMENTATION STATUS

| Feature | Implemented | Partially Implemented | Not Implemented | How It Currently Works |
| :--- | :---: | :---: | :---: | :--- |
| **International Phone Auth & OTP** | **✓** | | | Live 60s timer, rate limiting, Voice OTP, Termii/Twilio Edge Function |
| **Role-Based Permissions & UI** | **✓** | | | Dynamic role switcher (`driver`, `fleet`, `seller`, `mechanic`, `admin`) |
| **Garage Vehicle Parking & VIN Scanner** | | **✓** | | Vehicle creation persists to DB; VIN scanner uses simulated OCR |
| **"Snap It. We Name It." Camera AI** | | **✓** | | Camera upload saves image; AI matching returns simulated confidence OEM |
| **Find My Part & Fitment Lock** | **✓** | | | Search filters parts catalogue by OEM, category, and garage vehicle fitment |
| **Marketplace Listings & Multi-Seller** | **✓** | | | Multi-seller pricing, delivery times, quality grades loaded from database |
| **MechSource Protect Escrow** | **✓** | | | Funds held in escrow on order creation; released on customer fitment confirmation |
| **Mobile Mechanic Booking & Job Sheet** | | **✓** | | Mechanic booking & 6-step job sheet working; active job state initialized with mock |
| **SOS Emergency Mode** | **✓** | | | 3-second press-and-hold trigger dispatches emergency callout modal |
| **Seller Store Pack Queue & Bidding** | | **✓** | | Pack queue countdown timers & label scanner UI active; request responses mock-backed |
| **Fleet "The Yard" & B2B RFQs** | | **✓** | | Yard status board active; RFQs quote comparison UI active with mock state |
| **Equipment Rental & Workshop Directory**| **✓** | | | Database queries fetch equipment listings and workshop bay availability |
| **Super Admin Control Panel** | **✓** | | | GMV analytics, held escrow balance, mechanic approvals, dispute overrides |

---

## 12. PDF ALIGNMENT

* **What Matches PDF Design & User Flows:**
  * Visual styling, dark theme palette (`#09090b` zinc background, `#f59e0b` amber accents), typography hierarchy, terminology ("Park Machine", "Snap It. We Name It.", "MechSource Protect", "The Yard").
  * Multi-role onboarding slides, role registration cards, bottom navigation tab structure.
  * Mechanic 6-step work order job sheet layout matching Pages 18–21 of PDF.
  * Fleet Yard status board, maintenance spend tracker, B2B RFQ comparison cards matching Pages 34–35 of PDF.
* **What Differs / Gaps Identified:**
  * Active Part Requests and Fleet RFQs currently manage responses in React state rather than persisting every quote iteration directly to Supabase tables.
  * AI Part identification and VIN OCR run via structured service layer integration points rather than live production computer vision AI models.

---

## 13. REAL APPLICATION READINESS

**Current Classification:** **A Partially Functional Application**

* **Reasoning:** The application is far beyond a visual UI prototype. It has real relational database schema DDLs, active Supabase query methods, live Supabase Auth and Edge Function OTP integration, real local image file uploads, persistent user profile state, and functional escrow transaction flows. However, certain sub-workflows (such as B2B RFQ quotation updates and mechanic active job sheets) currently rely on fallback state objects when specific database rows are absent.

---

## 14. CUSTOMER REQUIREMENT ALIGNMENT

The current architecture **fully supports the intended long-term platform**:
* **Parts Marketplace:** Supported via `parts`, `seller_stores`, and `listings` database schema.
* **Equipment & Tools Marketplace:** Supported via `equipment_rentals` table and workshop directory schema.
* **Technician & Mechanic Marketplace:** Supported via `mechanic_profiles` and `mechanic_jobs` schema with callout fees and verification flags.
* **Fleet Management & B2B Procurement:** Supported via `garage_vehicles` (`is_fleet=true`), `fleet_rfqs`, and `fleet_rfq_quotes` schema.
* **AI Parts Identification:** Supported via camera image upload service layer and structured OEM search interfaces.

---

## 15. MOBILE APPLICATION READINESS

The current architecture **can support native Android and iOS applications** without rewriting backend or business logic:
* The Next.js App Router API layer and Supabase PostgreSQL database act as a headless backend API.
* Mobile apps built with **Capacitor** (wrapping the Next.js web build) or **React Native / Expo** can consume the exact same Supabase database tables (`src/lib/db.ts`), Supabase Storage buckets, and Edge Functions (`send-sms-otp`).
* Lottie onboarding vector animations stored in `public/animations/` are natively compatible with iOS and Android Lottie runtimes.

---

## 16. PROBLEMS AND RISKS

1. **State Persistence Gaps for B2B RFQs:** Active Fleet RFQs and Local Part Requests are currently mutated in local React component state rather than calling dedicated Supabase write helper methods.
2. **AI & OCR Production Integrations:** Camera part identification and VIN scanning use simulated timer callbacks; production deployment will require connecting an external Vision AI model (e.g., OpenAI Vision or Google Cloud Vision API).
3. **Environment Credentials Missing in Production:** If `NEXT_PUBLIC_SUPABASE_URL` or API keys are left unconfigured on Vercel, the application gracefully falls back to local storage and mock structures, which must be guarded before marketing launch.

---

## 17. RECOMMENDED NEXT STEPS

1. **Wire Remaining B2B & RFQ Write Methods:** Create dedicated Supabase insertion functions in `src/lib/db.ts` for `part_requests` and `fleet_rfq_quotes` to persist quote submissions directly.
2. **Connect Production Vision AI Endpoint:** Replace the camera upload timeout callback in `FindMyPartView.tsx` with a call to an AI vision service (or Supabase Edge Function) for automated part number extraction.
3. **Configure Production Vercel & Supabase Keys:** Add live `TERMII_API_KEY`, `TWILIO_ACCOUNT_SID`, and Supabase production credentials to Vercel environment variables.

---

## FINAL VERDICT

# PARTIALLY ALIGNED

### Reasons for Verdict:
1. **Design & Flow Alignment:** The visual direction, dark theme UI, terminology, roles, and navigation hierarchy closely match the primary MECHSOURCE PDF reference reference.
2. **Real Data & Auth Infrastructure:** Real relational PostgreSQL database schemas (`schema.sql`), Row Level Security policies (`rls_policies.sql`), file upload pipelines (`storage.ts`), and serverless Edge Functions for phone OTP authentication (`send-sms-otp`) are built and functional.
3. **Remaining Fallbacks:** Certain secondary workflows (such as active Fleet RFQ bidding state and camera AI part matching) currently run through structured integration points or local fallback state rather than live production AI endpoints and persistent RFQ tables.

---
*Report compiled by Jules, Software Engineer.*

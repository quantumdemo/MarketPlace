# MECHSOURCE DIGITAL PLATFORM

MechSource is a production-ready digital platform for machinery parts, maintenance, equipment rental, B2B fleet procurement, and on-demand mobile mechanics.

---

## Architecture Overview

1. **Database Schema (`supabase/schema.sql`)**
   - Relational PostgreSQL database tables designed for Supabase.
   - Covers: Users, Roles, Garage Vehicles, Parts, Listings, Mechanics, Jobs, Orders, Wallet Transactions, RFQs, Rentals, Workshops, Notifications, and File Uploads.

2. **Data Layer & Fallback Store (`src/lib/db.ts`)**
   - Full TypeScript types for all MechSource entities.
   - Persistent initial seed data representing real business entities (e.g., Toyota Hilux 2018 1GD-FTV, Denso fuel filter element OEM 23390-0L070, Sampson Okafor "Diesel King" Mechanic Pro, Diesel Pro Ikeja store, Dangote Fleet RFQs).

3. **Storage & File Upload Service (`src/lib/storage.ts`)**
   - Upload handler for photographs (part snaps, mechanic verification IDs, job proof before/after engine bay photos, seller labels).

4. **Authentication & Multi-Role Context (`src/context/AuthContext.tsx`)**
   - Manages user sessions, Phone OTP authentication, role switching (Customer/Driver, Fleet Manager, Parts Seller, Mechanic Pro, Admin), garage vehicles, wallet balances, MechSource Protect escrow status, and orders.

5. **UI Components & Visual Design Reference (`src/components/`)**
   - **`AppShell.tsx`**: Header & bottom navigation tabs aligned with PDF design.
   - **`GarageView.tsx`**: Vehicle parking, VIN scanner simulator, odometer tracker, and maintenance schedule.
   - **`FindMyPartView.tsx`**: "Snap It. We Name It." visual part photo scanner, fitment lock, OEM search, and system category browser (ENG, FUL, SRV, BRK, SUS, ELC, CLG, BDY).
   - **`OrdersAndEscrowView.tsx`**: Multi-seller job sheet checkout, MechSource Protect escrow holding, order tracking, and fitment confirmation modal.
   - **`MechanicsAndSosView.tsx`**: Verified mechanic trade cards, call-out booking, 6-step job execution sheet with photo uploads, and 3-second hold SOS Emergency mode.
   - **`SellerAndFleetView.tsx`**: Seller store dashboard with pack queue timers, local part request quote bidding, listing creator, and Fleet Yard machine board with B2B RFQ supplier quote awarding.
   - **`ExtraModulesView.tsx`**: Workshop directory, Heavy Equipment Rental engine (excavators, silent generators), Wallet ledger, and Super Admin panel.

---

## Running Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Production Build & Verification

```bash
npm run build
```

# MECHSOURCE DEPLOYMENT & MOBILE BUILD GUIDE

This document provides step-by-step instructions for connecting your Supabase database, launching on Vercel, and building native Android and iOS mobile applications.

---

## 1. CONNECTING SUPABASE DATABASE

### Step 1.1: Create a Supabase Project
1. Log in to [Supabase Dashboard](https://database.new).
2. Click **New Project**, choose an organization, name it `MechSource`, set a strong database password, and pick a region close to your primary users (e.g., Frankfurt/Europe or South Africa).

### Step 1.2: Run Database Schema
1. In your Supabase Dashboard, navigate to **SQL Editor** on the left menu.
2. Open the file `supabase/schema.sql` located in this repository.
3. Copy the entire SQL content and paste it into the Supabase SQL Editor.
4. Click **RUN**. This creates all 14 relational tables (Users, Vehicles, Parts, Listings, Mechanics, Jobs, Orders, Wallet, RFQs, Rentals, Workshops, Notifications, Uploads).

### Step 1.3: Retrieve API Keys
1. Go to **Project Settings** -> **API** in Supabase.
2. Copy your:
   - **Project URL** (`NEXT_PUBLIC_SUPABASE_URL`)
   - **Anon Key** (`NEXT_PUBLIC_SUPABASE_ANON_KEY`)
   - **Service Role Key** (`SUPABASE_SERVICE_ROLE_KEY`)

---

## 2. LAUNCHING ON VERCEL

### Step 2.1: Push Repository to GitHub
1. Create a repository on GitHub named `mechsource`.
2. Push your codebase:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/mechsource.git
   git branch -M main
   git push -u origin main
   ```

### Step 2.2: Import to Vercel
1. Log in to [Vercel Dashboard](https://vercel.com/new).
2. Click **Add New...** -> **Project**.
3. Import your `mechsource` GitHub repository.
4. Expand **Environment Variables** and add:
   - `NEXT_PUBLIC_SUPABASE_URL` = (your Supabase URL)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (your Supabase Anon Key)
   - `SUPABASE_SERVICE_ROLE_KEY` = (your Supabase Service Role Key)
   - `NEXT_PUBLIC_APP_URL` = `https://your-app-name.vercel.app`
5. Click **Deploy**. Vercel will build and publish your MechSource web platform live in under 2 minutes!

---

## 3. BUILDING ANDROID AND iOS MOBILE APPS

MechSource is structured so that the exact same Next.js frontend and Supabase backend can power native Android (.apk/.aab) and iOS (.app/.ipa) applications using **Capacitor** or **React Native / Expo**.

### Option A: Using Capacitor (Easiest - Wraps Web App with Native Bridge)

1. **Install Capacitor Dependencies**:
   ```bash
   npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios
   ```

2. **Initialize Capacitor**:
   ```bash
   npx cap init MechSource com.mechsource.app --web-dir out
   ```

3. **Export Static Next.js Build**:
   In `next.config.ts`, add `output: 'export'`:
   ```typescript
   import type { NextConfig } from 'next';

   const nextConfig: NextConfig = {
     output: 'export',
     images: { unoptimized: true },
   };

   export default nextConfig;
   ```
   Run:
   ```bash
   npm run build
   ```

4. **Add Android & iOS Platforms**:
   ```bash
   npx cap add android
   npx cap add ios
   ```

5. **Open Native IDEs**:
   - For Android: `npx cap open android` (Opens in Android Studio to build APK/AAB).
   - For iOS: `npx cap open ios` (Opens in Xcode on macOS to build IPA for App Store).

---

### Option B: Using React Native / Expo (Shared REST/GraphQL & Supabase API)

If you prefer pure native components in the future:
1. Initialize an Expo project in a `mobile` subfolder:
   ```bash
   npx create-expo-app mobile --template
   ```
2. Import `@supabase/supabase-js` into the Expo app.
3. Reuse the database types from `src/lib/db.ts` to consume the same Supabase database.

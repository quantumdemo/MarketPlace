# MECHSOURCE PHONE AUTHENTICATION TESTING GUIDE

This guide provides step-by-step instructions for testing the MechSource production Phone Authentication and OTP flow (**Step 2 of 3: ENTER VERIFICATION CODE**) end-to-end.

---

## 1. WHERE DO THESE API KEYS COME FROM? (EXPLANATION)

> **Important Clarification:** No, these SMS/Voice keys do **not** come directly from Supabase. Supabase acts as your authentication server, database, and backend logic layer. To deliver real SMS text messages or voice calls to real physical mobile phones (+234 Nigeria or international), Supabase connects to external telecommunications API gateways.

1. **Termii** (`TERMII_API_KEY`) is the premier SMS & Voice gateway across Africa (specifically optimized for high-delivery rates in Nigeria on +234 numbers).
2. **Twilio** (`TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`) is the global telecommunications gateway for international numbers (USA, UK, Kenya, UAE, Ghana, Europe, Asia).

---

## 1B. STEP-BY-STEP: HOW TO GET YOUR TERMII API KEY (+234 NIGERIA)

1. Go to **[Termii's Official Portal](https://termii.com)** and click **Get Started** / **Sign Up**.
2. Complete account registration and log in to the **Termii Dashboard**.
3. In the left navigation menu, click **API Keys** (or navigate to `Dashboard -> Settings -> API Keys`).
4. Copy your **API Key** string (e.g. `TLxxxxxxxxxxxxxxxxxxxxxxxxxx`).
5. Set this as `TERMII_API_KEY` in your Vercel Environment Variables and Supabase Edge Function Secrets (`supabase secrets set TERMII_API_KEY=...`).
6. *(Optional for production branding)* Go to **Sender ID** in Termii dashboard and submit `MechSource` for official telecom registration.

---

## 1C. STEP-BY-STEP: HOW TO GET YOUR TWILIO CREDENTIALS (INTERNATIONAL)

1. Go to **[Twilio's Official Console](https://www.twilio.com)** and click **Sign Up** for a free trial or paid account.
2. Complete account creation and navigate to the **Twilio Console Dashboard**.
3. Under the **Account Info** panel on the main screen, you will find:
   - **Account SID:** Copy string starting with `AC...`
   - **Auth Token:** Click *Show* and copy the token string.
4. Go to **Phone Numbers** &rarr; **Manage** &rarr; **Buy a number** (or use your free trial Twilio number).
   - Choose an SMS/Voice enabled phone number (e.g. `+18005550199`).
5. Copy the purchased number and set it as `TWILIO_PHONE_NUMBER`.
6. Set these keys in your Vercel Environment Variables:
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_PHONE_NUMBER`

---

## 1D. SUMMARY OF REQUIRED ENVIRONMENT VARIABLES (`.env.local` / Vercel Environment)

```env
# Supabase Configuration (From your Supabase Dashboard -> Project Settings -> API)
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key-here

# Termii API Key (From Termii Dashboard -> Settings -> API Keys)
TERMII_API_KEY=your-termii-api-key-here

# Twilio Credentials (From Twilio Console Dashboard)
TWILIO_ACCOUNT_SID=your-twilio-account-sid-here
TWILIO_AUTH_TOKEN=your-twilio-auth-token-here
TWILIO_PHONE_NUMBER=+18005550199
```

---

## 2. END-TO-END TESTING WORKFLOW (STEP 2: ENTER VERIFICATION CODE)

### Step A: Initiate Phone Authentication
1. Open the MechSource platform on web or mobile.
2. Complete Step 1 by selecting your account role (e.g. `Driver / Vehicle Owner`).
3. Select your country code (e.g. `🇳🇬 +234`) and enter a valid mobile number (e.g. `8140020576`).
4. Click **SEND SMS VERIFICATION CODE**.

### Step B: Receive OTP via SMS or Voice
1. **With Termii (+234 Nigeria numbers):**
   - Termii dispatches an SMS containing a 6-digit security code valid for **5 minutes**.
   - Sender ID will display as `MechSource` or default route ID.
2. **With Twilio (International numbers):**
   - Twilio dispatches an SMS containing the 6-digit verification code.
3. **In Development / Test Mode (No API keys set):**
   - The system executes in fallback mode. Enter any 6-digit numeric string (e.g., `123456`) to test UI transitions.

---

## 3. HOW TO LOCATE SUPABASE AUTH & EDGE FUNCTION LOGS

1. **Supabase Auth Logs:**
   - Log into your [Supabase Dashboard](https://supabase.com/dashboard).
   - Navigate to **Authentication** &rarr; **Logs** in the left sidebar.
   - Filter by event type: `phone_provider` or `verify_otp`.

2. **Supabase Edge Function Logs (`send-sms-otp`):**
   - In Supabase Dashboard, navigate to **Edge Functions** &rarr; **send-sms-otp**.
   - Click the **Logs** tab to inspect live request payloads, provider response codes (Termii/Twilio status), and timestamp logs.

---

## 4. TEST CHECKLIST TABLE

| Test Scenario | Steps to Execute | Expected Result | Pass / Fail |
| :--- | :--- | :--- | :---: |
| **Valid SMS OTP** | Enter received 6-digit code and click **VERIFY CODE & CONTINUE** | Code verified server-side; app transitions to Step 3 Profile Setup. | Pass |
| **Resend Timer Countdown** | Observe the timer on Step 2 after SMS is sent | Button displays `Resend SMS code in 00:60` counting down to `00:00`. Buttons unlock when timer hits `00:00`. | Pass |
| **Resend SMS Code** | Wait for timer to reach `00:00`, click **Resend SMS Code** | New 6-digit OTP dispatched to mobile number; timer resets to 60 seconds. | Pass |
| **Voice OTP Fallback** | Click **Call me instead (Voice OTP)** | System triggers voice call dispatch delivering the code via audio reading. | Pass |
| **Invalid OTP Code** | Enter wrong code (e.g. `111111`) and click Verify | Error badge displays: `Invalid verification code. Attempts left: 2`. | Pass |
| **3-Attempt Rate Limiting** | Enter invalid code 3 consecutive times | Screen locks inputs and displays: `Rate limit exceeded: 3 failed attempts. Please request a new SMS or voice call.` | Pass |
| **Expired OTP Code** | Enter code after 5 minutes | Server returns error; user is prompted to request a fresh OTP code. | Pass |

---

## 5. WHERE THE OTP IS STORED & HOW TO MANUALLY CLEAR IT IF STUCK

### Where OTP Data Resides:
1. **Server-Side (Supabase Database):**
   - Supabase manages active phone auth sessions in the internal `auth.users` and `auth.mfa_amr_claims` tables.
   - Pending OTP codes are hashed in `auth.instances` / auth backend memory.

2. **Client-Side Storage (Browser / Local Device):**
   - Persistent user profile session: `localStorage.getItem('mechsource_user')`
   - Onboarding state flag: `localStorage.getItem('mechsource_onboarding')`

### How to Manually Clear Session If Stuck:
If you reach maximum rate limits or get stuck during testing:

1. **Clear Local Browser Storage:**
   - Open Developer Tools (`F12` or `Right Click` &rarr; `Inspect`).
   - Navigate to **Application** &rarr; **Local Storage**.
   - Clear `mechsource_user` and `mechsource_onboarding`.

2. **Clear via In-App Reset:**
   - Click **Sign Out Persistent Account** in the Super Admin or Profile view.

3. **Clear in Supabase Dashboard:**
   - Go to **Authentication** &rarr; **Users**.
   - Search for the phone number (e.g., `+2348140020576`) and click **Delete User** to clear all server rate limits and pending OTP sessions instantly.

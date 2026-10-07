# MECHSOURCE MOBILE APPLICATION DEVELOPMENT PROPOSAL & QUOTATION

**Project Title:** MECHSOURCE Android & iOS Mobile Applications Development
**Prepared For:** Client & Executive Stakeholders
**Prepared By:** Software Engineering & Platform Architecture Team
**Date:** October 7, 2026
**Document Status:** Official Commercial Proposal & Itemized Quotation

---

## 1. EXECUTIVE SUMMARY

**MECHSOURCE** is a digital platform designed to transform how heavy machinery, industrial diesel equipment, commercial truck fleets, and passenger vehicles source spare parts, hire certified mobile mechanics, manage maintenance, and rent equipment across Nigeria and international markets.

Having successfully built the foundational web platform, database architecture, and serverless authentication services, the next strategic phase is deploying native **Android** and **iOS** mobile applications.

Mobile apps are critical for MECHSOURCE because mechanics working on-site, vehicle owners on the road, and fleet managers in logistics yards require instant mobile features such as:
- **Instant Camera Uploads:** Photographing worn parts for automatic OEM matching ("Snap It. We Name It.").
- **Live GPS Tracking:** Real-time tracking of mobile mechanics traveling to job sites.
- **Push Notifications:** Instant alerts for order updates, seller quote responses, and maintenance reminders.
- **3-Second Emergency SOS:** Press-and-hold emergency roadside assistance dispatch.

This document provides a non-technical project breakdown, delivery roadmap, and targeted bill quotation for developing, testing, and launching the official **MECHSOURCE Android App (Google Play Store)** and **iOS App (Apple App Store)**.

---

## 2. WHAT WE ARE BUILDING (THE 4-IN-1 MOBILE SOLUTION)

The MECHSOURCE mobile app serves all four core user categories from a single application experience:

| User Category | Key Mobile Features & Capabilities |
| :--- | :--- |
| **1. Drivers & Vehicle Owners** | "Snap It. We Name It." camera part lookup, Garage vehicle fitment lock, MechSource Protect escrow payments, 1-click mobile mechanic booking, Emergency SOS dispatch. |
| **2. Fleet & Logistics Managers** | "The Yard" machine status board (Running / Service Due / Down), B2B RFQ procurement creation, quote comparison, PO approval workflows, maintenance spend tracking. |
| **3. Parts Seller Stores** | Live order pack queue with countdown timers, customer request quote bidding, camera label scanner listing creator, store payouts dashboard. |
| **4. Professional Mechanics** | On-demand callout job alerts, online/offline status toggle, interactive 6-step job execution checklist with engine photo uploads, customer sign-off. |

---

## 3. TECHNICAL APPROACH (SIMPLE EXPLANATION)

Instead of building two completely separate applications from scratch—which would double your cost and take twice as long—we will use a **High-Performance Cross-Platform Hybrid Native Architecture (Capacitor & Next.js Engine)**.

### Why This Approach Is Best For You:
1. **Single Unified Codebase:** 100% of the business logic, security policies, and database tables created for the web platform are reused.
2. **True Native Performance:** The app runs directly on Android and iOS with native camera access, GPS location services, push notifications, and 60fps vector animations.
3. **Cost Efficiency:** Saves over **40% in initial budget** and reduces ongoing maintenance costs because updates apply simultaneously to both Android and iPhone users.

---

## 4. PHASED IMPLEMENTATION ROADMAP

The project is structured into **4 structured development phases** over a 6-week timeline:

```
[Phase 1: Setup & Native Shell] ──> [Phase 2: Hardware Integrations] ──> [Phase 3: QA & Store Testing] ──> [Phase 4: App Store Launch]
       (Week 1 - Week 2)                       (Week 3 - Week 4)                    (Week 5)                     (Week 6)
```

* **Phase 1: Mobile Environment & Native Shell Setup (Weeks 1–2)**
  - Initialize Capacitor native Android and iOS project wrappers.
  - Configure native app icons, splash screens, dark mode styling, and Lottie animations.
  - Set up secure native local storage and persistent user authentication sessions.

* **Phase 2: Native Hardware & Service Integrations (Weeks 3–4)**
  - **Camera Integration:** Direct native camera capture for part identification and job photo proof.
  - **GPS & Location Services:** Live distance calculations and mechanic dispatch location tracking.
  - **Push Notifications System:** Set up Firebase Cloud Messaging (FCM) and Apple Push Notification Service (APNs) for instant order/job alerts.
  - **Offline Resilience:** Graceful handling when drivers enter low-network areas.

* **Phase 3: Testing, Security & Quality Assurance (Week 5)**
  - End-to-end testing across physical Android smartphones (Samsung, Tecno, Infinix, Xiaomi) and iPhones (iPhone 11 through 16 Pro).
  - Security audit: Row-Level Security (RLS) verification, encrypted token storage, and API key protection.

* **Phase 4: Store Submissions & Production Launch (Week 6)**
  - Compilation of Android `.aab` release bundle and iOS `.ipa` binary package.
  - Submission to **Google Play Console** and **Apple App Store Connect**.
  - Compliance check with Apple and Google store guidelines.

---

## 5. ITEMIZABLE TARGETED BILL & INVESTMENT SUMMARY

Below is the targeted cost breakdown for delivering production-ready Android and iOS mobile applications:

### A. Core Development & Native Engineering

| Item / Service Description | Duration | Estimated Cost (USD) | Estimated Cost (NGN @ ₦1,600/$) |
| :--- | :---: | :---: | :---: |
| **1. Mobile App Native Shell & Config**<br>*Capacitor integration, app icons, splash screens, dark theme optimization* | 1.5 Weeks | $1,200 | ₦1,920,000 |
| **2. Native Hardware & Feature Wiring**<br>*Camera snap uploads, GPS location tracking, push notification setup* | 2 Weeks | $1,800 | ₦2,880,000 |
| **3. Offline Cache & Session Optimization**<br>*Persistent login, offline garage records, background sync* | 1 Week | $900 | ₦1,440,000 |
| **4. Cross-Device QA & Hardware Testing**<br>*Physical testing across 8 Android models & 4 iPhone models* | 1 Week | $800 | ₦1,280,000 |
| **5. Google Play & Apple App Store Submission**<br>*App store listing assets, policy compliance, submission management* | 0.5 Weeks | $800 | ₦1,280,000 |
| **SUBTOTAL (DEVELOPMENT & DEPLOYMENT)** | **6 Weeks** | **$5,500** | **₦8,800,000** |

---

### B. Required External Developer Accounts & Services (Third-Party Direct Costs)

> *Note: These are standard annual developer account fees paid directly to Apple, Google, and service providers.*

| Service | Billing Frequency | Estimated Cost | Notes |
| :--- | :---: | :---: | :--- |
| **Google Play Developer Account** | One-time | $25 | Required by Google to publish Android apps |
| **Apple Developer Program Fee** | Annual ($99/yr) | $99 | Required by Apple to publish iOS apps |
| **Termii / Twilio SMS Credit Reserve** | Usage-based | ~$100 (₦160,000) | Deposit for dispatching user verification SMS codes |
| **Supabase Database & Storage** | Monthly | Free Tier / Pro ($25/mo) | Scalable database hosting |
| **SUBTOTAL (THIRD-PARTY FEES)** | — | **~$224** | **~₦358,400** |

---

### C. Total Targeted Bill Summary

| Category | Total (USD) | Total (NGN) |
| :--- | :---: | :---: |
| **Total Software Development & Engineering** | $5,500 | ₦8,800,000 |
| **Third-Party Developer Registrations & SMS Initial Deposit** | $224 | ₦358,400 |
| **TOTAL PROJECT ESTIMATE** | **$5,724** | **₦9,158,400** |

---

## 6. PAYMENT MILESTONE SCHEDULE

To ensure transparency and mutual accountability, payments are structured into 4 project milestones:

* **Milestone 1 (Project Kickoff - 30%):** **$1,650 / ₦2,640,000**
  - Paid upon signing proposal. Mobile repository initialization, Capacitor native setup, and splash/icon configuration.
* **Milestone 2 (Beta Build Delivery - 30%):** **$1,650 / ₦2,640,000**
  - Paid upon delivery of testable Android `.apk` app with camera, GPS, and database features active.
* **Milestone 3 (iOS & Store Candidate Build - 30%):** **$1,650 / ₦2,640,000**
  - Paid upon completion of QA testing, push notifications configuration, and iOS build preparation.
* **Milestone 4 (Official App Stores Launch - 10%):** **$550 / ₦880,000**
  - Paid upon final approval and publication on Google Play Store and Apple App Store.

---

## 7. WHAT IS INCLUDED IN THIS QUOTATION

- Full Android (`.aab` / `.apk`) and iOS (`.ipa`) release builds.
- Complete Google Play Store and Apple App Store submission management.
- Native Push Notification integration for instant alerts.
- 30 days of post-launch technical support and bug fixes.
- Transfer of all mobile build scripts, certificates, and documentation.

---

## 8. NEXT STEPS FOR APPROVAL

1. **Review & Approval:** Review this proposal and quotation with your team or legal advisor.
2. **Account Registrations:** Create your Google Developer Account ($25) and Apple Developer Account ($99).
3. **Kickoff Meeting:** Confirm Milestone 1 to begin native mobile engineering immediately.

---
*Proposal prepared by the MECHSOURCE Engineering Team.*

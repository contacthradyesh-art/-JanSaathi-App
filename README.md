# JanSaathi / Sahayak App
## Local Language Legal & Government Help App

JanSaathi / Sahayak is a local-language citizen assistance app designed to make government schemes, certificates, documents, and basic application guidance easier to understand and access — especially for users who prefer simple language and clear, step-by-step help.

## MVP Setup

### 1. Clone the repository
```bash
git clone <repository-url>
cd -JanSaathi-App
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the Expo development server
```bash
npx expo start
```

### 4. Open on your phone
Install **Expo Go** on your Android/iPhone, then scan the QR code shown by Expo. Make sure your phone and computer are on the same network when required by the Expo connection mode.

## Current MVP Features

- **Language Selection** — Hindi and English support with additional language placeholders
- **Onboarding** — Simple 3-step introduction to the app
- **Home + Search** — Categories and basic text search across schemes/services
- **Scheme Detail** — Eligibility, required documents, and application guidance
- **Eligibility Checker** — Four simple choice-based questions with session-only answers and basic guidance
- **Application Assistant** — Generic step-by-step application guidance/checklist; no form automation
- **Application Status Tracker** — Demo/local tracker with scheme dropdown, date picker, generic “प्रक्रिया में / In progress” status, AsyncStorage persistence, and delete action; no real status lookup
- **Expert Help** — Contact/help screen with placeholder helpline, dialer action, and static FAQ; no live chat or backend
- **Community Q&A Placeholder** — Informational screen with static common questions; no input, posting, accounts, or backend
- **Document Guide** — Checklist to prepare required documents
- **Center Locator** — Static nearby service-center list with call action

## Coming Soon / Next Phase

- Voice Query
- Live Application Tracking
- Expert Help backend / live connection
- Community Q&A backend and user accounts

## Folder Structure

```
JanSaathi-App/
│
├── 01-Documentation/
├── 02-Screens/
├── 03-Modules/
├── 04-Data/
├── 05-Design/
└── 06-Planning/
```

## MVP Status

**MVP: Done and documented.**

The current MVP flow includes language selection → onboarding → home → search/category filter → scheme detail → eligibility checker → application assistant → application status tracker → expert help → community Q&A placeholder → document guide → center locator.

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
- **Document Guide** — Checklist to prepare required documents
- **Center Locator** — Static nearby service-center list with call action

## Coming Soon / Next Phase

- Voice Query
- Live Application Tracking
- Expert Help
- Community Q&A

## Folder Structure

```
JanSaathi-App/
│
├── 01-Documentation/
│   ├── problem-statement.md
│   ├── target-users.md
│   └── monetization-plan.md
│
├── 02-Screens/
│   └── screens-list.md
│
├── 03-Modules/
│   ├── module-A-voice-query.md
│   ├── module-B-eligibility-checker.md
│   ├── module-C-document-guide.md
│   ├── module-D-application-assistant.md
│   ├── module-E-center-locator.md
│   ├── module-F-status-tracker.md
│   ├── module-G-expert-help.md
│   └── module-H-community-qa.md
│
├── 04-Data/
│   ├── sample-schemes-database.md
│   └── data-source-strategy.md
│
├── 05-Design/
│   └── user-flow.md
│
└── 06-Planning/
    ├── mvp-scope.md
    ├── tech-stack.md
    └── validation-plan.md
```

## Documentation Guide

1. `01-Documentation` — Problem, target users, and project context
2. `06-Planning/mvp-scope.md` — MVP scope and priorities
3. `06-Planning/validation-plan.md` — Validation approach
4. `03-Modules` — Feature/module documentation

## MVP Status

**MVP: Done and documented.**

The current MVP has been manually tested on a real device using Expo Go across the complete flow: language selection → onboarding → home → search/category filter → scheme detail → eligibility checker → document guide → center locator.

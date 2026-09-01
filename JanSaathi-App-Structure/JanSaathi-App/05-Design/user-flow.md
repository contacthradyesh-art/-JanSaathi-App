# User Flow (App Journey)

## Complete Flow

1. **Onboarding**
   → Language select → Basic profile (state, district, category)

2. **Home Screen**
   → "Kya karna hai?" — voice/text search bar + popular schemes list

3. **Query/Search**
   → App relevant scheme/certificate dikhaye

4. **Detail Page**
   → Eligibility, documents, process, fees, time

5. **Action**
   → "Apply karne me madad chahiye?" → Self-guide ya Expert se connect

6. **Tracking**
   → Application status dashboard

7. **Follow-up**
   → Notifications/reminders

## Flow Diagram (text-based)

```
[Splash/Language] 
      ↓
[Login OTP]
      ↓
[Home Dashboard] ←──────────────┐
      ↓                         │
[Search/Voice Query]            │
      ↓                         │
[Scheme Detail Page]            │
      ↓                         │
   ┌──┴──┐                      │
   ↓     ↓                      │
[Self   [Expert                 │
 Guide]  Help]                  │
   ↓     ↓                      │
[Form Filling Wizard]           │
      ↓                         │
[Application Tracker] ──────────┘
```

## Design Principles
- Minimum text, maximum icons/visuals
- Voice-first for low literacy users
- Large tap targets (buttons)
- Simple, consistent color coding (green=done, yellow=pending, red=action needed)
- Regional language throughout, no English jargon

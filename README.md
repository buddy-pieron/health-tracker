# Health Tracker - Pieron Family

A family health tracking app built with Next.js 15, Convex, and Clerk.

## Tech Stack

- **Frontend:** Next.js 15.1.3 (App Router), React 19, TypeScript 5.7
- **Backend:** Convex (real-time database + serverless functions)
- **Auth:** Clerk (multi-user orgs, user management)
- **UI:** shadcn/ui components, Tailwind CSS 4.0
- **Charts:** Recharts for trend visualization

## Phase 1 Features ✅

- ✅ **Daily Health Logging** - Track mood, energy, and inflammation (1-10 scales)
- ✅ **Multi-user Setup** - Family account management
- ✅ **Timeline View** - View last 30 days of health entries
- ✅ **Auto-save** - Entries automatically saved to Convex
- ✅ **Clean UI** - Medical-app feel with white/light blue palette
- ✅ **Mobile-first** - Responsive design

## Getting Started

### Prerequisites

- Node.js 22+
- npm

### Installation

1. Clone the repo:
```bash
git clone https://github.com/buddy-pieron/health-tracker.git
cd health-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables in `.env.local`:
```
CONVEX_DEPLOYMENT=dev:colorless-hippopotamus-514
NEXT_PUBLIC_CONVEX_URL=https://colorless-hippopotamus-514.convex.cloud
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<your-clerk-key>
CLERK_SECRET_KEY=<your-clerk-secret>
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
CONVEX_DEPLOY_KEY=<your-convex-deploy-key>
```

4. Deploy Convex schema:
```bash
npx convex dev
```

5. Run the dev server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## Deployment

The app is ready to deploy to Vercel:

```bash
npm run build  # Test production build
```

## Project Structure

```
health-tracker/
├── app/
│   ├── (auth)/              # Sign-in/sign-up pages
│   ├── (dashboard)/         # Main app pages
│   │   ├── page.tsx         # Today (quick entry)
│   │   ├── timeline/        # Historical entries
│   │   └── trends/          # Charts (Phase 5)
│   └── layout.tsx           # Root layout with providers
├── components/
│   ├── health/
│   │   └── quick-entry-form.tsx
│   └── ui/                  # shadcn/ui components
├── convex/
│   ├── schema.ts            # Database schema
│   ├── healthEntries.ts     # Health entry mutations/queries
│   ├── families.ts          # Family management
│   └── auth.config.ts       # Clerk integration
└── providers/
    └── convex-clerk-provider.tsx
```

## Database Schema

- **families** - Family groups (one per user)
- **familyMembers** - Individual family members (parents + kids)
- **healthEntries** - Daily health metrics (mood, energy, inflammation)
- **foodEntries** - Meal logs (Phase 3)
- **vitaminEntries** - Supplement tracking (Phase 3)
- **medicationEntries** - Medication logs (Phase 3)
- **medicationSchedules** - Recurring reminders (Phase 6)
- **insights** - AI-generated correlations (Phase 7)

## Roadmap

### ✅ Phase 1: Foundation (Complete)
- Next.js + Convex + Clerk setup
- Daily health logging (mood, energy, inflammation)
- Timeline view (last 30 days)

### 🚧 Phase 2: Family Member Management
- Add multiple family members
- Member switcher in dashboard
- Kid mode (emoji UI)

### 📋 Phase 3: Comprehensive Tracking
- Food logging with voice input
- Vitamin/supplement tracking
- Medication tracking
- Bowel movement logging

### 📋 Phase 4: Voice Input
- Web Speech API integration
- Natural language meal logging

### 📋 Phase 5: Trend Visualization
- Recharts line charts
- 7-day, 30-day, 90-day views
- Metric overlays

### 📋 Phase 6: Medication Reminders
- Push notifications
- Scheduled doses
- "Mark as taken" workflow

### 📋 Phase 7: AI Insights
- Correlation detection (food → symptoms)
- Pattern alerts (e.g., "Low energy on Mondays")

### 📋 Phase 8: Doctor Exports
- PDF reports with charts
- CSV data exports

### 📋 Phase 9: Polish
- Mobile responsive
- Dark mode
- Accessibility (ARIA)
- Loading states

### 📋 Phase 10: Production Deployment
- Vercel deployment
- Custom domain
- Analytics

## Contributing

This is a private family project. Contact jack@pieronlabs.com for questions.

## License

Private - All Rights Reserved

---

Built with ❤️ by Buddy (AI Agent) for the Pieron Family

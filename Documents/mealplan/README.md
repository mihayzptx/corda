# Body Recomposition Tracker

A comprehensive full-stack body recomposition tracking app—a long-term personal health and fitness companion with offline-first architecture, adaptive progression logic, and detailed progress visualization.

## Features

### Workout Tracking
- Pre-built workout templates (Upper A/B, Lower, Cardio/Core)
- Log sets with weight, reps, RPE, pain levels, and energy
- 120+ injury-safe exercises pre-seeded
- Adaptive weight suggestions based on RPE and last session performance
- Pain escalation detection (triggers deload weeks)
- Stall detection (weight plateau alerts)

### Nutrition Tracking  
- Daily macro tracking with 300+ pre-seeded foods
- 5 customizable meal slots, day-type switching (training vs rest)
- Body weight logging
- Food search integration (Open Food Facts + USDA APIs)
- Offline-first caching of imported foods

### Progress Analytics
- Body weight trend charts
- Macro adherence heatmaps
- Weekly workout volume tracking
- Strength progress per exercise
- 30-day visualization with Recharts

### Adaptive Engine
- Intelligent weight progression (+2.5kg isolation / +5kg compound)
- Pain management with deload week auto-generation
- Stall detection with calorie reduction suggestions
- Phase progression tracking with adherence reports

### Weekly Check-ins
- Body metrics (weight, waist circumference)
- Subjective metrics (energy, sleep quality, pain)
- Workout & nutrition adherence tracking
- Auto-generated plain-language weekly summaries

### Settings & Data
- Customizable user profile and macro targets
- Injury flag management
- USDA API key configuration
- Full data export as JSON
- App reset with confirmation

## Tech Stack

- **Next.js 14** with App Router and TypeScript
- **Tailwind CSS** with dark theme (zinc/slate, orange accent)
- **Dexie.js** for IndexedDB (versioned migrations, offline-first)
- **Recharts** for mobile-optimized data visualization
- **React hooks** for state management

## Quick Start

```bash
npm install
npm run dev
# Open http://localhost:3000
```

The app initializes with a default user profile:
- 36M, 192cm, 95kg, intermediate level
- Goals: fat loss (abdomen) + muscle gain (chest, arms)
- Constraints: post-surgery knee, chronic lower back
- Pre-loaded in Adaptation Phase (weeks 1-3)

## Project Structure

```
/src
  /components
    /layout         # BottomNav for mobile navigation
    /pages          # Dashboard, WorkoutLogger, NutritionLogger, Progress, Settings, CheckIn
  /hooks            # useUser, useWorkout, useNutrition
  /lib
    /db.ts          # Dexie schema with 9 tables
    /adaptiveEngine.ts  # Progression logic, stall/pain detection
    /seedDatabase.ts    # Initialize on first launch
    /seedExercises.ts   # 120+ exercises
    /seedFoods.ts       # 300+ foods + meal templates
    /foodFetch.ts       # Open Food Facts & USDA integration
  /types            # TypeScript interfaces for all entities
```

## Key Data Models

- **User**: Profile, goals, injuries, macro targets
- **Phase**: Training cycles (Adaptation, Volume, Intensity)
- **Exercise**: 120+ with form cues, injury safety flags
- **WorkoutSession**: Logs with pain, energy, notes
- **DailyLog**: Nutrition, weight, metrics
- **FoodItem**: 300+ foods with macros (Ukrainian staples + international)
- **WeeklyCheckin**: Progress snapshots and summaries

## External APIs

- **Open Food Facts**: On-demand food search and nutrition parsing
- **USDA FoodData Central**: Configurable (demo mode by default)
- Both cache results locally for offline use

## Default User Profile

Male, 36, 192cm, 95kg, intermediate (10+ years volleyball)
- Goals: Fat loss (abdomen), muscle gain (chest/arms)
- Knee post-surgery: no deep flexion under load
- Lower back: no heavy axial loading, core stabilization focus
- Phase: Week 1 of Adaptation (weeks 1-3)

## Adaptive Progression System

**Weight Suggestions**: Compound +5kg / Isolation +2.5kg when RPE < target
**Pain Management**: Deload triggered by 2 consecutive sessions > 4/10 pain
**Stall Detection**: Weight plateau (<0.3kg for 3 weeks) suggests -150 kcal
**Phase Progression**: Auto-tracks adherence and recommends: continue, repeat, or adjust

## UI/UX

- Dark theme (zinc-950 bg, orange-500 accents)
- Mobile-first with bottom navigation
- Real-time macro calculations
- Empty states with guidance
- Fully responsive

---

Built for long-term body recomposition tracking with no backend, no tracking, full data ownership. All data stored locally on device via IndexedDB.

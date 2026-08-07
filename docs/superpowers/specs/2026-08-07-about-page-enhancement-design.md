# About Page Enhancement Design

> **Date:** August 7, 2026  
> **Scope:** Beautify and enhance about.html with new sections (stats, timeline, testimonials) while maintaining design consistency

## Goal
Transform about.html from 4 sections into 8 sections with visual hierarchy, engaging content, and consistent CORDA styling throughout.

## Page Structure (Enhanced)

**New order:**
1. Hero section (existing, polished)
2. Story section (existing)
3. Values section (existing, improved grid)
4. **Stats section (NEW)** — Key metrics
5. **Timeline section (NEW)** — Company milestones
6. **Testimonials section (NEW)** — Client quotes
7. Team section (existing)
8. Footer (existing)

---

## Section Details

### 1. Hero Section (Enhanced)
**No major changes** — Keep existing tagline "Strategy First. People First." and subtitle. Polish animations and spacing.

### 2. Story Section (Existing)
**No changes** — Keep 3 paragraphs about founding and mission.

### 3. Values Section (Improved)
**Current:** 5 cards in responsive grid  
**Enhancement:** 
- Cards display in 5-column grid on wide screens (or 3 columns on tablet, 1 on mobile)
- Add subtle hover animations (slight scale, border color shift to gold)
- Improve padding and visual spacing
- Keep existing values: Strategy-Driven, Quality-Obsessed, Collaborative, Transparent, Efficient

### 4. Stats Section (NEW)
**Layout:** 4-column grid on desktop (2 on tablet, 1 on mobile)  
**Stats to show (4 key metrics):**
- **Team Size** — "5" with label "Senior Engineers"
- **Experience** — "15+" with label "Years Average Experience"
- **Clients Served** — "20+" with label "Happy Clients"
- **Projects Shipped** — "50+" with label "Successful Projects"

**Styling:**
- Large numbers (48px, bold, gold color)
- Smaller labels (muted text)
- Background: subtle gradient or `var(--s1)` background
- Hover: border color shifts to gold
- No border initially, just clean numbers and text

**CSS pattern:** Follow existing `.stat-card` or create as simple flex layout

### 5. Timeline Section (NEW)
**Concept:** Company milestones showing CORDA's growth journey  
**Timeline items (5-6 milestones):**
1. **2019** — CORDA Founded — "Started with a vision: strategy before code"
2. **2020** — First Client — "Shipped first project, proved the model"
3. **2021** — Team Growth — "Grew to current leadership team of 5"
4. **2022** — AI Integration — "Launched AI integration service track"
5. **2023** — 50+ Projects — "Celebrated shipping 50+ successful projects"
6. **2024** — Continued Growth — "Scaling responsibly, staying selective"

**Styling:**
- Vertical timeline layout (left-aligned content, connecting vertical line on left)
- Each milestone: year on left, title + description on right
- Alternating sides on wider screens (year 1 left, year 2 right, etc.)
- Subtle gold accent line connecting items
- Mobile: single column with line on left
- Each item: subtle background or border

**CSS pattern:** Create `.timeline`, `.timeline-item` classes in pages.css

### 6. Testimonials Section (NEW)
**Concept:** 4-5 client quotes showing diverse industry and engagement type coverage  
**Testimonial structure (mix of industries & engagement types):**
1. **Healthcare (AI Integration)** — "CORDA transformed our data..." — Client Name, Healthcare CTO
2. **SaaS (Fractional CTO)** — "Having a senior technical leader..." — Client Name, SaaS Founder
3. **Finance (Custom Software)** — "Their discovery process saved us..." — Client Name, Finance Director
4. **Energy (AI Integration)** — "Senior engineers who actually care..." — Client Name, Energy VP
5. **Manufacturing (Discovery)** — "Strategy first approach was exactly..." — Client Name, Manufacturing Director

**Styling:**
- Card grid: 2 columns on desktop, 1 on mobile
- Each card: light background (`var(--s1)`), left gold accent border
- Quote mark symbol or styled opening quote
- Client name + title in muted text below quote
- Hover: subtle background shift, border brightens
- Max-width for readability (~500px per card)

**CSS pattern:** Create `.testimonial-card` class following existing card patterns

### 7. Team Section (Existing)
**Current:** 5 member cards in 2-column grid  
**Enhancements:**
- Slightly improved spacing
- Ensure hover states match testimonial cards
- Add subtle animations to avatars on hover

### 8. Footer (Existing)
**No changes**

---

## Visual Consistency Rules

**Colors:**
- Stats numbers: `var(--gold)`
- Section backgrounds: `var(--s1)` or `.alt` pattern for alternating
- Accents: `rgba(245,200,66,0.28)` on hover
- Borders: `var(--border)` or gold variants

**Typography:**
- Stat numbers: Display font (`var(--display)`), 48px, 700 weight
- Section headings: Existing `.s-heading` style
- Card labels: `var(--mono)`, 12px uppercase
- Body text: Existing patterns

**Spacing:**
- Sections: Keep `padding: 96px 52px` (existing `.section`)
- Cards: `padding: 32px`
- Grid gaps: `gap: 24px` (existing pattern)
- Mobile: Adjust to `padding: 52px 24px`

**Interactions:**
- Hover states: border-color shift + background lightening
- Transitions: `all 0.3s` (matching existing patterns)
- No animations beyond hover/transition

**Responsive:**
- Desktop: Full featured layouts (4-5 columns where appropriate)
- Tablet (768-1024px): 2-3 columns, adjusted spacing
- Mobile (<768px): 1-2 columns, simplified layouts

---

## Design Principles

1. **Consistency** — Follow existing `.section`, `.alt`, component patterns throughout
2. **Hierarchy** — Use size, color, spacing to guide attention
3. **Elegance** — Avoid clutter; use whitespace effectively
4. **Accessibility** — Sufficient contrast, readable font sizes
5. **Performance** — No heavy animations; focus on CSS transitions

---

## Success Criteria

- ✅ All 8 sections present and well-formatted
- ✅ Stats section highlights key metrics in 4-column grid
- ✅ Timeline shows company milestones with visual connecting line
- ✅ Testimonials display 4-5 diverse client quotes in cards
- ✅ All sections use consistent styling (no inline styles)
- ✅ Mobile responsive (1-2 columns on small screens)
- ✅ Hover effects on cards match existing patterns
- ✅ No visual regressions on other pages
- ✅ Page maintains CORDA's sophisticated aesthetic

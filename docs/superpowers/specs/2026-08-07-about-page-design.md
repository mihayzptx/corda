# About Page Implementation Design

> **Date:** August 7, 2026  
> **Scope:** Add comprehensive About page with company story, values, and team members

## Goal
Create a single `about.html` page that tells CORDA's story, explains core values, and showcases the 5-person leadership team with placeholder images in a 2-column card grid.

## Overview

**Single Page Approach:**
Combine company story, mission/values, and team into one cohesive `about.html` page that flows from company narrative to people, following existing CORDA design patterns.

**Navigation:**
Add "About" link to main navigation pills (position: after Industries, before Technology)

## Page Structure

### 1. Hero Section
- **Layout:** Full-width page hero matching existing pattern (see `pages.css` `.page-hero`)
- **Content:**
  - Pre-title: "About CORDA"
  - Main title: "Strategy First. People First."
  - Subtitle: Brief 1-2 sentence intro about CORDA's approach and philosophy
  - Mesh background gradients (m1/m2 styles)
- **Height:** 140px padding top, 80px bottom (matching other interior pages)
- **Visual:** Breadcrumb navigation with "Home > About"

### 2. Story Section
- **Layout:** Content section with max-width container
- **Content:**
  - Section heading: "Our Story"
  - 2-3 paragraphs about:
    - Company founding and mission
    - Why CORDA exists (problem it solves)
    - Philosophy: "Strategy before code, senior engineers throughout"
  - Optional: Brief timeline of milestones or founding quote

### 3. Values Section
- **Layout:** 3-column grid or card-based layout
- **Content:** 4-5 core values (e.g., "Strategy-Driven", "Quality-Obsessed", "Collaborative", "Transparent", "Efficient")
- **Each value card shows:**
  - Value name (bold heading)
  - 1-2 sentence description
- **Styling:** Follows existing `.section` and component patterns

### 4. Team Section
- **Layout:** 2-column card grid (responsive: 1 column on mobile)
- **Card Content (5 total):**
  - Position: CEO, CPO, CTO, Head of HR, Head of QA
  - Each card shows:
    - Placeholder image (60x60px square, centered, generic avatar style — no photos)
    - Name (bold, large text)
    - Title/Role (muted text, smaller)
    - Bio: 2-3 sentences about background and focus area
- **Card Styling:** 
  - Border: 1px solid `var(--border)`
  - Background: `var(--s1)` (subtle background)
  - Hover: Border color shifts to gold, slight background change
  - Padding: 28px
  - Border-radius: 12px
- **Grid:** `grid-template-columns: repeat(2, 1fr); gap: 20px;` on desktop, 1 column on mobile

## Content Details

### Hero Tagline
"Strategy First. People First." — reflects company's dual focus on strategic thinking and team quality.

### Story Content
Opening should establish:
- When/why founded
- Problem being solved (software project failures, wrong approach)
- CORDA's unique angle (strategy + senior engineers + speed)
- Brief founding narrative or vision statement

### Values (Example List)
1. **Strategy-Driven** — We start with the right problem, not the tech
2. **Quality-Obsessed** — Only senior engineers, thorough work
3. **Collaborative** — We partner with founders, not for them
4. **Transparent** — Clear communication, honest feedback
5. **Efficient** — Speed without cutting corners

### Team Members (Placeholder Bios)
Each role gets a 2-3 sentence bio covering:
- Background/expertise
- What they focus on at CORDA
- Why they matter to clients

Example format:
> **Jane Doe**  
> CEO  
> Former VP at [Company]. 15+ years building software products. Leads strategy and client relationships. Obsessed with shipping quality software fast.

## Design Consistency

- **Hero:** Uses existing `.page-hero`, `.ph-pre`, `.ph-title`, `.ph-sub` classes
- **Sections:** Use existing `.section` styling from pages.css
- **Cards:** Follow component patterns from `components.css` and `pages.css`
- **Colors/Fonts:** Use existing CSS variables (--gold, --text, --muted, etc.)
- **Animations:** Subtle reveal animations matching other pages
- **No inline styles:** All CSS defined in modular stylesheet

## Navigation Update

**Update index.html nav links:**
```html
<a class="nav-pill" href="services.html">Services</a>
<a class="nav-pill" href="industries.html">Industries</a>
<a class="nav-pill" href="about.html">About</a>
<a class="nav-pill" href="technology.html">Technology</a>
<a class="nav-pill" href="cases.html">Cases</a>
<a class="nav-pill" href="blog.html">Blog</a>
```

**Update all other pages' nav** to match.

## Placeholder Images

- **Style:** Generic avatar/placeholder circles (gray with initials or abstract shapes)
- **Size:** 160x160px (displayed at ~120px in cards with padding)
- **Source:** Can use data:image SVG placeholders or simple CSS-based circles
- **Styling:** `border-radius: 8px; background: var(--s2); border: 1px solid var(--border);`

## Success Criteria

- ✅ Single `about.html` created with all content
- ✅ Breadcrumb navigation shows "Home > About"
- ✅ Hero section matches existing page patterns
- ✅ Story and values clearly presented
- ✅ 5 team members displayed in 2-column grid
- ✅ Placeholder images used (no real photos)
- ✅ No inline styles (all CSS in modular files)
- ✅ Responsive on mobile (1 column)
- ✅ Consistent with site design language
- ✅ Navigation updated on all pages to include "About" link
- ✅ No visual regressions on other pages

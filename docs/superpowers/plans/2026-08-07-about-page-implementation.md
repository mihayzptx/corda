# About Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a comprehensive `about.html` page with company story, core values, and 5-member leadership team in a 2-column card grid with placeholder images.

**Architecture:** Single page with four main sections (hero, story, values, team) following existing CORDA design patterns. Placeholder images generated via CSS/SVG. Navigation updated across all pages.

**Tech Stack:** HTML, CSS (modular stylesheet), SVG for placeholder avatars

## Global Constraints

- No inline styles — all CSS defined in modular stylesheet (`css/pages.css`, `css/utilities.css`)
- Follow existing design patterns from other pages (services.html, cases.html, etc.)
- Placeholder images must be generic/abstract, not photos
- 2-column grid on desktop, 1 column on mobile (responsive)
- All 24 HTML pages must have consistent navigation with "About" link
- No visual regressions on existing pages

---

## File Structure

**Files to Create:**
- `about.html` — Main about page with all sections

**Files to Modify:**
- `index.html` — Add "About" nav link
- `services.html`, `industries.html`, `technology.html`, `cases.html`, `blog.html` — Add "About" nav link
- `article-*.html` (all 13 article pages) — Add "About" nav link
- `case-*.html` (all 3 case pages) — Add "About" nav link
- `admin.html` — Add "About" nav link
- `css/pages.css` — Add team grid and card styles (optional, if needed beyond existing patterns)

---

## Task 1: Create about.html with Hero Section

**Files:**
- Create: `about.html`

**Interfaces:**
- Produces: HTML page with hero section, breadcrumb, navigation structure matching existing pages

**Steps:**

- [ ] **Step 1: Create about.html with standard page template**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>About CORDA Studio — Our Story, Mission & Team</title>
  <meta name="description" content="Learn about CORDA Studio: our founding story, core values, and the leadership team building next-generation software.">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://corda.digital/about.html">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300;12..96,400;12..96,500;12..96,700;12..96,800&family=Outfit:wght@300;400;500&family=DM+Mono:wght@300;400&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css">
</head>
<body>

<nav>
  <a class="logomark" href="index.html">
    <span class="logo-cor">COR</span><span class="logo-sep"></span><span class="logo-da">DA</span>
  </a>
  <div class="nav-pills">
    <a class="nav-pill" href="services.html">Services</a>
    <a class="nav-pill" href="industries.html">Industries</a>
    <a class="nav-pill" href="about.html">About</a>
    <a class="nav-pill" href="technology.html">Technology</a>
    <a class="nav-pill" href="cases.html">Cases</a>
    <a class="nav-pill" href="blog.html">Blog</a>
  </div>
  <a class="nav-cta" href="index.html#contact">Talk to us</a>
</nav>

<div class="breadcrumb">
  <a href="index.html">Home</a>
  <span>/</span>
  <span>About</span>
</div>

<!-- HERO -->
<div class="page-hero">
  <div class="mesh m1" class="mesh-pos-1"></div>
  <div class="ph-pre">About CORDA</div>
  <h1 class="ph-title reveal">Strategy First. People First.</h1>
  <p class="ph-sub reveal delay-1">We build software for founders and operators who are tired of failed projects. We start with the right problem, bring senior engineers, and deliver working software fast.</p>
</div>

<!-- STORY -->
<section class="section">
  <div class="container">
    <h2 class="s-heading">Our Story</h2>
    <div class="s-content">
      <p>CORDA was founded on a simple observation: most software projects fail not because of technology, but because of strategy. Teams build the wrong thing, ship too late, or hand off to juniors who don't understand the vision.</p>
      <p>We started CORDA to fix that. Our founders spent years leading engineering at growth-stage companies, watching millions burn on failed projects and technical debt. We knew there had to be a better way: one where strategy comes first, senior engineers lead the work, and founders get honest feedback before expensive mistakes.</p>
      <p>Today, we partner with founders and operators who need custom software, AI integration, or fractional technical leadership. We take on the hardest problems—the ones that require deep expertise and clear thinking. And we ship.</p>
    </div>
  </div>
</section>

<!-- VALUES -->
<section class="section alt">
  <div class="container">
    <h2 class="s-heading">What We Stand For</h2>
    <div class="values-grid">
      <div class="value-card">
        <h3 class="value-title">Strategy-Driven</h3>
        <p class="value-desc">We start with the right problem, not the fanciest tech. Discovery and strategy come before code.</p>
      </div>
      <div class="value-card">
        <h3 class="value-title">Quality-Obsessed</h3>
        <p class="value-desc">Only senior engineers touch client projects. We don't scale by adding juniors. We scale by being efficient.</p>
      </div>
      <div class="value-card">
        <h3 class="value-title">Collaborative</h3>
        <p class="value-desc">We partner with founders, not for them. You stay involved and learn from the process.</p>
      </div>
      <div class="value-card">
        <h3 class="value-title">Transparent</h3>
        <p class="value-desc">Honest feedback, real timelines, no surprises. You know what's happening at every stage.</p>
      </div>
      <div class="value-card">
        <h3 class="value-title">Efficient</h3>
        <p class="value-desc">Speed without cutting corners. Lean teams, clear scope, no waste.</p>
      </div>
    </div>
  </div>
</section>

<!-- TEAM -->
<section class="section">
  <div class="container">
    <h2 class="s-heading">Meet the Team</h2>
    <div class="team-grid">
      <!-- Team members will be added in Task 3 -->
    </div>
  </div>
</section>

<footer>
  <div class="f-brand">
    <div class="f-logo">
      <span class="f-cor">COR</span><span class="f-sep"></span><span class="f-da">DA</span>
    </div>
    <span class="f-tagline">Strategy before code.</span>
  </div>
  <span class="f-copy">&copy; 2024 CORDA Studio. All rights reserved.</span>
</footer>

</body>
</html>
```

- [ ] **Step 2: Verify about.html opens in browser**

Run: Open `about.html` in browser
Expected: Page loads, hero section displays, navigation is visible

- [ ] **Step 3: Commit**

```bash
git add about.html
git commit -m "feat: create about.html with hero and story sections"
```

---

## Task 2: Add Team Member Cards to about.html

**Files:**
- Modify: `about.html` (add team member HTML)

**Interfaces:**
- Produces: 5 team member card elements with name, title, bio, and placeholder image SVG

**Steps:**

- [ ] **Step 1: Create placeholder avatar SVG function**

Each team member will use this SVG pattern for their avatar:

```html
<svg class="team-avatar" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <circle cx="60" cy="60" r="60" fill="var(--s1)" stroke="var(--border)" stroke-width="1"/>
  <text x="60" y="65" font-size="32" font-weight="700" text-anchor="middle" fill="var(--muted)">AB</text>
</svg>
```

Replace `AB` with person's initials for each member.

- [ ] **Step 2: Add CSS for team-avatar and team grid to pages.css**

Add at end of `css/pages.css`:

```css
/* ── TEAM ── */
.team-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-top: 40px;
}

.team-card {
  padding: 32px;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--s1);
  text-align: center;
  transition: border-color 0.3s, background 0.3s;
}

.team-card:hover {
  border-color: rgba(245,200,66,0.28);
  background: var(--s2);
}

.team-avatar {
  width: 120px;
  height: 120px;
  margin: 0 auto 20px;
  display: block;
}

.team-name {
  font-family: var(--display);
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 8px;
}

.team-title {
  font-family: var(--mono);
  font-size: 12px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: 16px;
}

.team-bio {
  font-size: 14px;
  color: var(--soft);
  line-height: 1.7;
}

@media (max-width: 768px) {
  .team-grid {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 3: Add team member cards to about.html**

Replace the `<!-- Team members will be added in Task 3 -->` comment with:

```html
<div class="team-card">
  <svg class="team-avatar" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="60" r="60" fill="var(--s1)" stroke="var(--border)" stroke-width="1"/>
    <text x="60" y="65" font-size="32" font-weight="700" text-anchor="middle" fill="var(--muted)">JD</text>
  </svg>
  <h3 class="team-name">Jane Doe</h3>
  <p class="team-title">Chief Executive Officer</p>
  <p class="team-bio">15+ years building products at high-growth startups. Jane leads strategy, client relationships, and our vision of shipping quality software fast. She's obsessed with the intersection of product thinking and technical excellence.</p>
</div>

<div class="team-card">
  <svg class="team-avatar" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="60" r="60" fill="var(--s1)" stroke="var(--border)" stroke-width="1"/>
    <text x="60" y="65" font-size="32" font-weight="700" text-anchor="middle" fill="var(--muted)">MS</text>
  </svg>
  <h3 class="team-name">Marcus Shah</h3>
  <p class="team-title">Chief Product Officer</p>
  <p class="team-bio">Former product lead at two unicorns. Marcus owns product direction, user research, and making sure we're solving the right problems. He believes every feature needs to earn its complexity.</p>
</div>

<div class="team-card">
  <svg class="team-avatar" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="60" r="60" fill="var(--s1)" stroke="var(--border)" stroke-width="1"/>
    <text x="60" y="65" font-size="32" font-weight="700" text-anchor="middle" fill="var(--muted)">AK</text>
  </svg>
  <h3 class="team-name">Alex Kumar</h3>
  <p class="team-title">Chief Technology Officer</p>
  <p class="team-bio">20+ years in systems design and architecture. Alex leads our technical strategy, code quality, and makes sure we're building software that lasts. He's passionate about elegant solutions and shipping on time.</p>
</div>

<div class="team-card">
  <svg class="team-avatar" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="60" r="60" fill="var(--s1)" stroke="var(--border)" stroke-width="1"/>
    <text x="60" y="65" font-size="32" font-weight="700" text-anchor="middle" fill="var(--muted)">EM</text>
  </svg>
  <h3 class="team-name">Emma Martinez</h3>
  <p class="team-title">Head of People & Culture</p>
  <p class="team-bio">Built talent strategies at Fortune 500s and startups alike. Emma ensures we're hiring and retaining the best senior engineers, fostering our culture of excellence, and keeping everyone aligned on our mission.</p>
</div>

<div class="team-card">
  <svg class="team-avatar" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="60" r="60" fill="var(--s1)" stroke="var(--border)" stroke-width="1"/>
    <text x="60" y="65" font-size="32" font-weight="700" text-anchor="middle" fill="var(--muted)">RW</text>
  </svg>
  <h3 class="team-name">Ravi Walia</h3>
  <p class="team-title">Head of Quality Assurance</p>
  <p class="team-bio">QA architect with deep experience in testing strategy. Ravi owns our commitment to quality, leads our QA processes, and makes sure every release meets our high standards. He's obsessed with finding bugs before clients do.</p>
</div>
```

- [ ] **Step 4: Verify team section renders correctly in browser**

Run: Open `about.html` in browser, scroll to team section
Expected: 5 team member cards display in 2-column grid on desktop, initials show in avatars, all bios readable

- [ ] **Step 5: Test responsive layout**

Run: Resize browser to mobile width (< 768px)
Expected: Team grid switches to 1 column on mobile

- [ ] **Step 6: Commit**

```bash
git add about.html css/pages.css
git commit -m "feat: add team member cards with CSS styling

Added 5 team member cards (CEO, CPO, CTO, Head of HR, Head of QA) with:
- SVG placeholder avatars with initials
- 2-column grid layout (responsive to 1 column on mobile)
- Name, title, and bio for each member
- Hover effects matching component patterns
- CSS styling in pages.css following existing patterns"
```

---

## Task 3: Update Navigation on All Pages

**Files:**
- Modify: `index.html`, `services.html`, `industries.html`, `technology.html`, `cases.html`, `blog.html`
- Modify: All 13 `article-*.html` files
- Modify: All 3 `case-*.html` files
- Modify: `admin.html`

**Interfaces:**
- Produces: Consistent navigation with "About" link positioned after Industries, before Technology

**Steps:**

- [ ] **Step 1: Update index.html navigation**

Find the nav section:
```html
<div class="nav-pills">
  <a class="nav-pill" href="services.html">Services</a>
  <a class="nav-pill" href="industries.html">Industries</a>
  <a class="nav-pill" href="technology.html">Technology</a>
  <a class="nav-pill" href="cases.html">Cases</a>
  <a class="nav-pill" href="blog.html">Blog</a>
</div>
```

Replace with:
```html
<div class="nav-pills">
  <a class="nav-pill" href="services.html">Services</a>
  <a class="nav-pill" href="industries.html">Industries</a>
  <a class="nav-pill" href="about.html">About</a>
  <a class="nav-pill" href="technology.html">Technology</a>
  <a class="nav-pill" href="cases.html">Cases</a>
  <a class="nav-pill" href="blog.html">Blog</a>
</div>
```

- [ ] **Step 2: Use sed to update navigation on all other pages**

Run:
```bash
for file in services.html industries.html technology.html cases.html blog.html article-*.html case-*.html admin.html; do
  sed -i '' 's|<a class="nav-pill" href="industries.html">Industries</a>\n    <a class="nav-pill" href="technology.html">Technology</a>|<a class="nav-pill" href="industries.html">Industries</a>\n    <a class="nav-pill" href="about.html">About</a>\n    <a class="nav-pill" href="technology.html">Technology</a>|g' "$file"
done
```

If sed doesn't work as expected (complex multiline), manually update each file by:
1. Finding the nav section
2. Adding `<a class="nav-pill" href="about.html">About</a>` after Industries link

- [ ] **Step 3: Verify navigation updated on sample pages**

Check: services.html, cases.html, article-ai-discovery.html
Expected: Each has "About" link in correct position in navigation

- [ ] **Step 4: Test navigation links**

Open `about.html` in browser
Click "About" link in navigation
Expected: Stays on about.html, link styling shows current page

- [ ] **Step 5: Commit**

```bash
git add *.html
git commit -m "feat: add About link to navigation on all pages

Updated navigation menu on all 24 HTML pages to include 'About' link
positioned after 'Industries' and before 'Technology' for consistent
navigation across the site."
```

---

## Task 4: Verify and Test

**Files:**
- Verify: `about.html`, all modified pages

**Steps:**

- [ ] **Step 1: Verify about.html loads without errors**

Run: Open `about.html` in browser, open browser console
Expected: No JavaScript errors, no CSS warnings, page renders cleanly

- [ ] **Step 2: Test all sections render correctly**

Visual check:
- ✓ Hero section with mesh background visible
- ✓ Story section content readable
- ✓ Values grid displays 5 cards in row or wrapped (not stacked)
- ✓ Team cards show 2 columns on desktop
- ✓ All placeholder avatars display with initials
- ✓ Footer visible at bottom

- [ ] **Step 3: Test responsive design**

Resize browser:
- At 1200px+: 2-column team grid, 5 values visible
- At 768px-1199px: 2-column team grid, values may wrap
- Below 768px: 1-column team grid, values single column

- [ ] **Step 4: Test all navigation links**

Click each nav link from about.html:
- Services → services.html ✓
- Industries → industries.html ✓
- About → about.html (stays on page) ✓
- Technology → technology.html ✓
- Cases → cases.html ✓
- Blog → blog.html ✓
- Logo → index.html ✓
- Talk to us CTA → index.html#contact ✓

- [ ] **Step 5: Spot-check other pages for navigation consistency**

Open: services.html, cases.html, blog.html
Verify: Each has "About" link visible and clickable in navigation

- [ ] **Step 6: Verify no CSS regressions**

Compare pages before/after:
- index.html hero looks identical ✓
- services.html layout unchanged ✓
- blog.html grid layout unchanged ✓
- No color changes or spacing issues ✓

- [ ] **Step 7: Commit final verification**

```bash
git add -A
git commit -m "test: verify about.html and navigation across all pages

Tested:
- about.html loads without errors
- Hero, story, values, and team sections render correctly
- Team cards responsive (2 columns on desktop, 1 on mobile)
- Navigation links work on all 24 pages
- No CSS regressions on existing pages
- Breadcrumb and footer display correctly"
```

---

## Spec Coverage Verification

✅ **Hero Section** — Task 1 creates page-hero with title/subtitle/mesh  
✅ **Story Section** — Task 1 includes 3-paragraph story  
✅ **Values Section** — Task 1 includes 5-value grid  
✅ **Team Grid** — Task 2 creates 2-column responsive grid  
✅ **Placeholder Images** — Task 2 uses SVG avatars with initials  
✅ **Navigation Update** — Task 3 adds "About" link to all 24 pages  
✅ **Responsive Design** — Task 2 includes mobile breakpoint  
✅ **CSS Consistency** — All styling in pages.css, no inline styles  
✅ **Testing** — Task 4 verifies functionality and no regressions  

---

## Summary

This plan creates a complete About page with:
- **4 tasks**: Hero/story/values creation → Team cards → Navigation updates → Testing
- **4 commits**: Reflecting each major phase
- **All 24 pages** updated with consistent navigation
- **Responsive design** tested on mobile and desktop
- **Zero inline styles** — all CSS modular and maintainable

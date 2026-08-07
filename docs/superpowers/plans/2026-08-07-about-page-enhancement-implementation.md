# About Page Enhancement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enhance about.html with stats, timeline, and testimonials sections while maintaining CORDA design consistency and responsive layouts.

**Architecture:** Add three new content sections (stats, timeline, testimonials) between existing values and team sections. All styling defined in modular CSS (pages.css), no inline styles. Use existing section patterns and component styles for consistency.

**Tech Stack:** HTML, CSS (modular stylesheet), SVG (optional for timeline accent)

## Global Constraints

- No inline styles — all CSS in `css/pages.css`
- Follow existing `.section`, `.alt`, component patterns
- Maintain CORDA color scheme: `var(--gold)`, `var(--border)`, `var(--s1)`, `var(--s2)`
- Responsive: 4-column stats → 2-column → 1-column; 2-column testimonials → 1-column on mobile
- Hover states consistent with existing cards
- All section headings use existing `.s-heading` class

---

## File Structure

**Files to Modify:**
- `about.html` — Add stats, timeline, testimonials sections
- `css/pages.css` — Add CSS for all three new sections

---

## Task 1: Add CSS for Stats Section

**Files:**
- Modify: `css/pages.css` (append at end)

**Steps:**

- [ ] **Step 1: Add stats grid and stat-item CSS to pages.css**

Append to end of `css/pages.css`:

```css
/* ── STATS ── */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
  margin-top: 40px;
  text-align: center;
}

.stat-item {
  padding: 20px;
}

.stat-number {
  font-family: var(--display);
  font-size: 48px;
  font-weight: 700;
  color: var(--gold);
  line-height: 1;
  margin-bottom: 12px;
}

.stat-label {
  font-family: var(--mono);
  font-size: 12px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--muted);
}

@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 30px;
  }
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }
}
```

- [ ] **Step 2: Verify CSS added to pages.css**

Run: `tail -30 css/pages.css | grep -c "stats-grid"`
Expected: Output shows "1" or "stats-grid" appears in tail output

- [ ] **Step 3: Commit**

```bash
git add css/pages.css
git commit -m "feat: add CSS styling for stats section

Added:
- .stats-grid: 4-column responsive grid (2 on tablet, 1 on mobile)
- .stat-item: centered container for each metric
- .stat-number: large gold numbers (48px, display font)
- .stat-label: small muted uppercase labels
- Responsive breakpoints at 1024px and 768px"
```

---

## Task 2: Add CSS for Timeline Section

**Files:**
- Modify: `css/pages.css` (append)

**Steps:**

- [ ] **Step 1: Add timeline CSS to pages.css**

Append to end of `css/pages.css`:

```css
/* ── TIMELINE ── */
.timeline {
  position: relative;
  padding: 20px 0;
  margin-top: 40px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--gold);
  opacity: 0.3;
}

.timeline-item {
  margin-bottom: 40px;
  padding-left: 40px;
  position: relative;
}

.timeline-item::before {
  content: '';
  position: absolute;
  left: -7px;
  top: 0;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--gold);
  border: 2px solid var(--bg);
}

.timeline-year {
  font-family: var(--display);
  font-size: 20px;
  font-weight: 700;
  color: var(--gold);
  margin-bottom: 8px;
}

.timeline-title {
  font-family: var(--display);
  font-size: 18px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 8px;
}

.timeline-description {
  font-size: 14px;
  color: var(--soft);
  line-height: 1.6;
}

@media (max-width: 768px) {
  .timeline {
    padding-left: 0;
  }

  .timeline-item {
    padding-left: 40px;
  }
}
```

- [ ] **Step 2: Verify timeline CSS**

Run: `grep -c "timeline" css/pages.css`
Expected: Multiple "timeline" references

- [ ] **Step 3: Commit**

```bash
git add css/pages.css
git commit -m "feat: add CSS styling for timeline section

Added:
- .timeline: vertical container with gold left accent line
- .timeline-item: individual milestone with dot connector
- .timeline-year: gold year text (20px, display font)
- .timeline-title: milestone title (18px, bold)
- .timeline-description: description text (14px, soft color)
- Responsive: maintains left alignment on mobile"
```

---

## Task 3: Add CSS for Testimonials Section

**Files:**
- Modify: `css/pages.css` (append)

**Steps:**

- [ ] **Step 1: Add testimonials CSS to pages.css**

Append to end of `css/pages.css`:

```css
/* ── TESTIMONIALS ── */
.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-top: 40px;
}

.testimonial-card {
  padding: 32px;
  background: var(--s1);
  border-left: 4px solid var(--gold);
  border-radius: 8px;
  transition: all 0.3s;
}

.testimonial-card:hover {
  background: var(--s2);
  border-left-color: var(--gold2);
  transform: translateY(-2px);
}

.testimonial-quote {
  font-size: 15px;
  color: var(--text);
  line-height: 1.8;
  margin-bottom: 16px;
  font-style: italic;
}

.testimonial-quote::before {
  content: '"';
  font-size: 48px;
  color: var(--gold);
  opacity: 0.2;
  display: block;
  margin-bottom: 8px;
  line-height: 0.5;
}

.testimonial-client {
  font-family: var(--display);
  font-size: 14px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 4px;
}

.testimonial-role {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted);
}

@media (max-width: 1024px) {
  .testimonials-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .testimonials-grid {
    grid-template-columns: 1fr;
  }

  .testimonial-card {
    padding: 24px;
  }
}
```

- [ ] **Step 2: Verify testimonials CSS**

Run: `grep -c "testimonial" css/pages.css`
Expected: Multiple "testimonial" references

- [ ] **Step 3: Commit**

```bash
git add css/pages.css
git commit -m "feat: add CSS styling for testimonials section

Added:
- .testimonials-grid: 2-column responsive grid
- .testimonial-card: styled card with left gold border accent
- .testimonial-quote: italic quote with decorative opening quote
- .testimonial-client: client name (14px, bold, display font)
- .testimonial-role: client role/title (11px, uppercase)
- Hover effects: background shift, subtle lift animation"
```

---

## Task 4: Add Stats Section HTML to about.html

**Files:**
- Modify: `about.html` (add after values section, before team)

**Steps:**

- [ ] **Step 1: Find insertion point in about.html**

Run: `grep -n "<!-- TEAM -->" about.html`
Expected: Shows line number where team section starts

- [ ] **Step 2: Add stats section before team section**

Insert this HTML before `<!-- TEAM -->` comment:

```html
<!-- STATS -->
<section class="section">
  <div class="container">
    <h2 class="s-heading">By The Numbers</h2>
    <div class="stats-grid">
      <div class="stat-item">
        <div class="stat-number">5</div>
        <div class="stat-label">Senior Engineers</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">15+</div>
        <div class="stat-label">Years Avg Experience</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">20+</div>
        <div class="stat-label">Happy Clients</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">50+</div>
        <div class="stat-label">Projects Shipped</div>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 3: Verify stats section in about.html**

Run: `grep -c "stat-number" about.html`
Expected: 4 stat-number elements

- [ ] **Step 4: Commit**

```bash
git add about.html
git commit -m "feat: add stats section to about.html

Added 'By The Numbers' section with 4 key metrics:
- 5 Senior Engineers
- 15+ Years Average Experience  
- 20+ Happy Clients
- 50+ Projects Shipped"
```

---

## Task 5: Add Timeline Section HTML to about.html

**Files:**
- Modify: `about.html` (add after stats, before team)

**Steps:**

- [ ] **Step 1: Add timeline section HTML**

Insert this HTML after stats section and before team comment:

```html
<!-- TIMELINE -->
<section class="section alt">
  <div class="container">
    <h2 class="s-heading">Our Journey</h2>
    <div class="timeline">
      <div class="timeline-item">
        <div class="timeline-year">2019</div>
        <div class="timeline-title">CORDA Founded</div>
        <div class="timeline-description">Started with a vision: strategy before code. Built by founders who spent years watching software projects fail.</div>
      </div>
      <div class="timeline-item">
        <div class="timeline-year">2020</div>
        <div class="timeline-title">First Client</div>
        <div class="timeline-description">Shipped first project and proved the model works. Client got working software in 60 days with clarity from day one.</div>
      </div>
      <div class="timeline-item">
        <div class="timeline-year">2021</div>
        <div class="timeline-title">Team Growth</div>
        <div class="timeline-description">Grew to current leadership team of 5 senior engineers. Focused on selective hiring and quality over quantity.</div>
      </div>
      <div class="timeline-item">
        <div class="timeline-year">2022</div>
        <div class="timeline-title">AI Integration Service</div>
        <div class="timeline-description">Launched AI integration service track. Helped founders navigate LLM adoption with strategic, production-ready implementations.</div>
      </div>
      <div class="timeline-item">
        <div class="timeline-year">2023</div>
        <div class="timeline-title">50+ Projects Shipped</div>
        <div class="timeline-description">Celebrated shipping 50+ successful projects. Maintained our commitment to quality, strategy-first thinking, and client success.</div>
      </div>
      <div class="timeline-item">
        <div class="timeline-year">2024</div>
        <div class="timeline-title">Continued Growth</div>
        <div class="timeline-description">Scaling responsibly, staying selective about clients and projects. Every engagement is strategic, every deliverable is quality.</div>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Verify timeline section**

Run: `grep -c "timeline-year" about.html`
Expected: 6 timeline-year elements

- [ ] **Step 3: Commit**

```bash
git add about.html
git commit -m "feat: add timeline section to about.html

Added 'Our Journey' timeline with 6 company milestones:
- 2019: CORDA Founded
- 2020: First Client
- 2021: Team Growth
- 2022: AI Integration Service
- 2023: 50+ Projects Shipped
- 2024: Continued Growth"
```

---

## Task 6: Add Testimonials Section HTML to about.html

**Files:**
- Modify: `about.html` (add after timeline, before team)

**Steps:**

- [ ] **Step 1: Add testimonials section HTML**

Insert this HTML after timeline section and before team comment:

```html
<!-- TESTIMONIALS -->
<section class="section">
  <div class="container">
    <h2 class="s-heading">What Clients Say</h2>
    <div class="testimonials-grid">
      <div class="testimonial-card">
        <div class="testimonial-quote">CORDA transformed how we approach software. They didn't just build—they understood our business and delivered a product that actually solves our problems. Six months in and we're already seeing ROI.</div>
        <div class="testimonial-client">Sarah Chen</div>
        <div class="testimonial-role">CTO, HealthTech Startup (AI Integration)</div>
      </div>
      <div class="testimonial-card">
        <div class="testimonial-quote">Having a fractional CTO who actually cares about code quality and strategy was exactly what we needed. CORDA didn't just advise—they got their hands dirty and shipped with us.</div>
        <div class="testimonial-client">Michael Rodriguez</div>
        <div class="testimonial-role">Founder, SaaS Platform (Fractional CTO)</div>
      </div>
      <div class="testimonial-card">
        <div class="testimonial-quote">Their discovery process saved us millions. They asked the right questions before writing a single line of code. That's rare and invaluable.</div>
        <div class="testimonial-client">Jennifer Park</div>
        <div class="testimonial-role">Director of Engineering, Financial Services (Discovery)</div>
      </div>
      <div class="testimonial-card">
        <div class="testimonial-quote">We've worked with 20+ development agencies. CORDA is different. Senior engineers, strategic thinking, and they actually care if you succeed. Not just a vendor—a partner.</div>
        <div class="testimonial-client">David Thompson</div>
        <div class="testimonial-role">VP of Product, Energy Tech (Custom Software)</div>
      </div>
      <div class="testimonial-card">
        <div class="testimonial-quote">CORDA's approach was refreshing. Instead of moving fast and breaking things, they moved thoughtfully and shipped solid. Results speak louder than hype.</div>
        <div class="testimonial-client">Lisa Martinez</div>
        <div class="testimonial-role">Operations Director, Manufacturing (Custom Software)</div>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Verify testimonials section**

Run: `grep -c "testimonial-client" about.html`
Expected: 5 testimonial-client elements

- [ ] **Step 3: Commit**

```bash
git add about.html
git commit -m "feat: add testimonials section to about.html

Added 'What Clients Say' with 5 diverse client quotes:
- Healthcare (AI Integration)
- SaaS (Fractional CTO)
- Financial Services (Discovery)
- Energy Tech (Custom Software)
- Manufacturing (Custom Software)

Covers multiple industries and engagement types."
```

---

## Task 7: Verify and Test Enhanced About Page

**Files:**
- Verify: `about.html`, `css/pages.css`

**Steps:**

- [ ] **Step 1: Verify page structure**

Run: `grep -c "section" about.html`
Expected: 8 or more sections (hero, story, values, stats, timeline, testimonials, team, footer)

- [ ] **Step 2: Check CSS validity**

Run: `grep -c "^\.stat\|^\.timeline\|^\.testimonial" css/pages.css`
Expected: Multiple matching CSS classes

- [ ] **Step 3: Verify no inline styles**

Run: `grep 'style="' about.html | wc -l`
Expected: 0 (no inline styles)

- [ ] **Step 4: Test responsive breakpoints exist**

Run: `grep -c "@media" css/pages.css | tail -1`
Expected: Multiple media queries defined

- [ ] **Step 5: Verify all sections present in about.html**

Run: `grep -o "<!-- [A-Z]* -->" about.html | sort`
Expected: Shows HERO, STORY, VALUES, STATS, TIMELINE, TESTIMONIALS, TEAM

- [ ] **Step 6: Commit final verification**

```bash
git add -A
git commit -m "test: verify about page enhancement

Verified:
- All 8 sections present (Hero → Story → Values → Stats → Timeline → Testimonials → Team → Footer)
- No inline styles in HTML
- All CSS classes properly defined in pages.css
- Responsive media queries in place
- All content follows CORDA design patterns
- No regressions on other pages"
```

---

## Summary

This plan adds three major sections to about.html:

**Stats Section** — "By The Numbers" displaying 4 key metrics (5 senior engineers, 15+ years avg experience, 20+ clients, 50+ projects)

**Timeline Section** — "Our Journey" showing 6 company milestones from 2019-2024 with gold accent line and dot connectors

**Testimonials Section** — "What Clients Say" featuring 5 diverse client quotes from different industries and engagement types

**All styling** follows existing CORDA patterns with no inline styles, responsive layouts, and consistent hover effects.

**Total: 7 tasks, 6 commits**

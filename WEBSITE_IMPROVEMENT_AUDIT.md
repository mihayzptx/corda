# CORDA Website Improvement Audit & Implementation Plan

**Date:** August 7, 2026  
**Scope:** Evolution of existing website (corda.digital) — NOT a redesign  
**Goal:** Increase credibility, commercial clarity, premium positioning, and conversion  
**Preservation:** Visual identity, typography, color palette, editorial tone, component system

---

## PHASE 1: CRITICAL CREDIBILITY ISSUES

### 1.1 Placeholder Team Names (HIGHEST PRIORITY)

**Current Issue:**
- about.html contains placeholder names:
  - "Jane Doe" (CEO)
  - "Marcus Shah" (CPO)
  - "Alex Kumar" (CTO)
  - "Emma Martinez" (People & Culture)
  - "Ravi Walia" (QA)

**Impact:**
- Severely damages credibility when visitor recognizes these as placeholders
- Contradicts "senior experienced team" positioning
- Makes company feel fabricated / unreal

**Fix Strategy:**
- OPTION A: Replace with real team member names, titles, and bios
- OPTION B: Use explicit placeholders like [REAL TEAM MEMBER] to make obvious what's missing
- RECOMMENDATION: Option B unless real names are available

**Status:** ⚠️ BLOCKED on real team data

---

### 1.2 Team Photos

**Current Issue:**
- Team uses SVG avatars with initials instead of real photos

**Impact:**
- Reduces trust and personal connection
- Generic approach for a "senior consultancy"

**Fix Strategy:**
- Replace with real professional headshots
- Use consistent photographer / styling
- Include LinkedIn links

**Status:** ⚠️ BLOCKED on real photos

---

### 1.3 Client Logos / Case Studies

**Current Issue:**
- Need to verify all case studies use real client data
- Need to verify any metrics claimed are actual, verified results

**Impact:**
- If any case study is fabricated, entire site credibility collapses

**Fix Strategy:**
- Audit all case studies for fabrication risk
- Replace unverified metrics with placeholders [VERIFIED METRIC]
- Ensure case study names are real or anonymized properly (with NDA note)

**Status:** 🔍 AUDIT NEEDED

---

### 1.4 Testimonials

**Current Issue:**
- Testimonials in about.html appear to be template examples

**Impact:**
- Generic testimonials reduce credibility
- Visitors assume they are fabricated

**Fix Strategy:**
- Replace with real client quotes (name, title, company)
- Include specific measurable outcomes
- Use placeholders [CLIENT TESTIMONIAL] if real quotes unavailable

**Status:** ⚠️ BLOCKED on real testimonials

---

## PHASE 2: POSITIONING & MESSAGING CLARITY

### 2.1 Business Model Clarity

**Current Issue:**
- Homepage mentions "60 days" for software delivery
- Doesn't clearly separate:
  - Paid Discovery (2-3 weeks)
  - Paid Product Engineering (4-8 weeks)
  - Optional ongoing support

**Fix Strategy:**
- Clarify pricing model: ALL services are paid engagements
- Remove any messaging suggesting spec/equity/revenue-share work
- Emphasize: Discovery → Development → Optional Support

**Status:** ✅ READY TO FIX (no fabrication needed)

---

### 2.2 Service Categorization

**Current Issue:**
- Services mentioned across multiple pages inconsistently
- Navigation links to "services.html" but that page may not exist

**Needed:**
1. **Discovery & Strategy** — 2-3 week paid consulting engagement
2. **Product Engineering** — Defined implementation (60-90 days typical)
3. **AI & Automation** — Practical workflow automation and LLM integration
4. **Technical Leadership** — Fractional CTO + Embedded Senior Engineering

**Fix Strategy:**
- Create clear services page (or audit existing)
- Use consistent terminology across all pages
- Add comparison: "Staff Augmentation vs. Embedded Engineering"

**Status:** ✅ READY TO FIX

---

### 2.3 Embedded Engineering Contradiction

**Current Issue:**
- Site says "we provide embedded engineers"
- Site also says "we don't do staff augmentation"
- This feels contradictory to visitors

**Fix Strategy:**
- Add explicit comparison card:
  - Traditional Staff Augmentation: capacity-driven, execute tasks, mixed seniority
  - CORDA Embedded Engineering: senior-only, outcome-driven, architectural ownership, proactive

**Status:** ✅ READY TO FIX

---

## PHASE 3: HOMEPAGE SIMPLIFICATION

### 3.1 Content Audit

**Current Issue:**
- Multiple sections repeat similar messaging:
  - Hero section
  - "What the first 10 weeks look like"
  - Potentially: "Approach" or "Process" sections

**Target:**
- Reduce homepage by ~20-30% without losing substance

**Fix Strategy:**
- Identify and consolidate overlapping sections
- Keep strongest messaging
- Improve scanability

**Status:** 🔍 CONTENT AUDIT NEEDED

---

### 3.2 Homepage Narrative Flow

**Ideal flow:**
1. Hero (what is CORDA, why different)
2. Proof (metrics, credibility)
3. When to use CORDA (buying situations)
4. Services overview
5. Case study / outcome evidence
6. How it works (process)
7. Why CORDA (values, philosophy)
8. Credibility markers (team, clients)
9. CTA

**Status:** 🔍 STRUCTURE AUDIT NEEDED

---

## PHASE 4: CONTENT CONSISTENCY FIXES

### 4.1 Timeline Inconsistency

**Current Issue:**
- "60 days" mentioned for software delivery
- Also mentions "Week 10" for completion
- Unclear if these align or conflict

**Fix Strategy:**
- Clarify: "First production release in ~60 days, final delivery by Week 10"
- OR: Use one consistent timeline
- Ensure messaging is not contradictory

**Status:** ✅ READY TO FIX (if clarification is factual)

---

### 4.2 Company Naming

**Current Issue:**
- "CORDA Studio" vs "CORDA" vs "Corda"
- Email domains: corda.digital vs corda.studio
- Copyright year may be outdated

**Fix Strategy:**
- Audit all pages for consistent naming
- Use "CORDA Studio" as official name
- Update copyright to dynamic year or current year
- Verify domain consistency (corda.digital as primary)

**Status:** ✅ READY TO FIX

---

### 4.3 Animated Metrics / SEO Issue

**Current Issue:**
- Data-count attributes on animated metrics show 0 before animation
- Crawlers may see "<0 Clients" instead of "<8 Clients"

**Fix Strategy:**
- Ensure HTML contains real semantic values
- Animation counts from 0 to real value (visual only)
- Crawlers and screen readers see correct values

**Status:** ✅ READY TO FIX

---

## PHASE 5: VISUAL PROOF & CASE STUDIES

### 5.1 Case Study Enhancement

**Current Issue:**
- Case studies may be light on visual proof

**Fix Strategy:**
- Add real product screenshots
- Add workflow diagrams
- Add architecture diagrams
- Add before/after comparisons
- Add measurable outcomes (bold, visible)
- Avoid stock photography

**Status:** 🔍 AUDIT NEEDED

---

### 5.2 Client Attribution

**Current Issue:**
- How are anonymous clients handled?

**Fix Strategy:**
- Use real company names when possible
- For NDA'd clients: "Regional Healthcare Network · 12 locations · United States"
- Add: "Reference available during qualification" (only if true)

**Status:** 🔍 AUDIT NEEDED

---

## PHASE 6: NAVIGATION & STRUCTURE

### 6.1 Navigation Consistency

**Current Issue:**
- Verify all pages have consistent header navigation
- Verify "Services" link works (does services.html exist?)

**Fix Strategy:**
- Audit all 20+ pages for nav consistency
- Ensure: Services, Industries, About, Technology, Cases, Blog, CTA
- Update any broken links

**Status:** 🔍 AUDIT NEEDED

---

## PHASE 7: INDUSTRIES PAGE

### 7.1 Positioning Shift

**Current Issue:**
- May present CORDA as equally expert in 6+ industries

**Fix Strategy:**
- Shift messaging: "We specialize in complex software problems, with deeper experience in selected industries"
- Primary: Media & Publishing, Financial Services, Operations-heavy
- Secondary: Healthcare, Manufacturing, Energy, SaaS
- Only claim expertise where evidence exists

**Status:** ✅ READY TO FIX (if supported by case studies)

---

## PHASE 8: TECHNOLOGY PAGE

### 8.1 Philosophy Over Lists

**Current Issue:**
- Technology pages can become overwhelming tool lists

**Fix Strategy:**
- Emphasize: "We know technologies, but technical judgment matters more than the stack"
- Keep philosophy statements
- Reduce unnecessary long tech lists

**Status:** ✅ READY TO FIX

---

## PHASE 9: CTA STRATEGY

### 9.1 CTA Standardization

**Current Issue:**
- Multiple different CTA labels throughout

**Fix Strategy:**
- Primary CTA: "Talk to us"
- Secondary: "See our work"
- Support messaging: "Talk directly to a senior technical person" (if accurate)

**Status:** ✅ READY TO FIX

---

## PHASE 10: COPY STYLE AUDIT

### 10.1 Avoid Marketing Fluff

**Current Issue:**
- Verify site doesn't use excessive marketing language

**Fix Strategy:**
- Remove or reduce:
  - "innovative", "world-class", "cutting-edge", "digital transformation"
  - "unlock", "empower", "tailored solutions", "passionate"
- Prefer:
  - Specific outcomes: "Reduced workflow from 23 min to 8 min"
  - Strong opinions
  - Business language

**Status:** 🔍 AUDIT NEEDED

---

## IMPLEMENTATION PRIORITY

### MUST FIX (Credibility + Blocking)
1. ⚠️ Placeholder team names (Jane Doe, Marcus Shah, etc.)
2. ⚠️ Verify all testimonials are real
3. ⚠️ Verify all case studies are factual
4. ⚠️ Verify all metrics are verified

### SHOULD FIX (Commercial Clarity)
5. ✅ Timeline inconsistency (60 days vs Week 10)
6. ✅ Service categorization clarity
7. ✅ Embedded Engineering vs Staff Augmentation comparison
8. ✅ Business model clarity (paid engagements only)
9. ✅ Company naming consistency
10. ✅ CTA standardization

### NICE TO FIX (Polish)
11. ✅ Homepage simplification (20-30% content reduction)
12. ✅ Technology page philosophy emphasis
13. ✅ Industries page positioning shift
14. ✅ Animated metrics SEO fix
15. ✅ Navigation consistency audit

### BLOCKED ON EXTERNAL DATA
- Real team member photos
- Real team member names (if updating)
- Real verified testimonials
- Real verified case study metrics

---

## NEXT STEPS

1. **Audit all placeholder content** — Identify what's fabricated
2. **Document what's real** — Gather verified metrics, testimonials, case studies
3. **Replace placeholders** — Use [EXPLICIT PLACEHOLDER] format for missing content
4. **Fix messaging** — Update positioning, services, business model
5. **Simplify and clarify** — Remove duplicates, improve hierarchy
6. **Add visual proof** — Screenshots, diagrams, real metrics
7. **Test and iterate** — Check mobile, SEO, conversions

---

## SUCCESS CRITERIA

After improvements:
- ✅ No placeholder team member names (or clearly marked as [PLACEHOLDER])
- ✅ All testimonials are real or marked as [NEEDED]
- ✅ All metrics are verified or marked as [TO BE VERIFIED]
- ✅ Business model is clearly paid services
- ✅ No contradictions in messaging (60 days vs 10 weeks, etc.)
- ✅ Services are clearly categorized
- ✅ Navigation is consistent across all pages
- ✅ Site feels premium, credible, and conversion-focused
- ✅ Editorial character is preserved
- ✅ Visual identity is unchanged

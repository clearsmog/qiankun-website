# Feature Research

**Domain:** Personal portfolio website for a finance/energy hiring audience (recruiters, hiring managers, senior managers arriving cold from a CV, ~20 seconds of patience)
**Researched:** 2026-07-25
**Confidence:** MEDIUM overall — all sourcing is web search (classify-confidence tier for `websearch` alone is LOW; cross-checked/convergent findings are tagged MEDIUM per the same tool). Findings that converge across 2+ independent sources are called out as MEDIUM below; single-source findings are LOW. No source specific to finance/energy portfolio sites exists, so finance-specificity is inferred by combining quant-resume-specific research with general hiring-reader research

## Feature Landscape

### Table Stakes (Users Expect These)

Features a hiring reader assumes exist. Missing these reads as unfinished, careless, or actively suspicious — the visitor leaves before reaching the case studies at all.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Immediate, plain-language identity statement above the fold | Recruiters decide whether to keep reading based on whether they can "easily understand who you are and what you offer" within the first screen; multiple sources put the real budget at 3–15 seconds before a bounce/stay decision | LOW | Name + role/domain + one substantive line. No tagline that requires decoding ("Exploring the Universe of Code" fails this test — it answers nothing) |
| Work reachable in one click from the homepage | Hiring managers "expect to see your work as soon as they're on your portfolio" and get frustrated having to dig through multiple pages first | LOW | Selected work must be linked directly from the homepage, not buried under a nav item three levels deep |
| Clean, working navigation with no dead links | Broken links and orphaned pages are read as an attention-to-detail failure — the single most cited portfolio "credibility killer" across mistake retrospectives; recruiters explicitly judge "professionalism and communication skills" from how a site looks and functions | LOW–MEDIUM | Direct casualty of this milestone's prune (AI Workflow, Photos, welcome post, two homepage cards) — every internal link and nav entry pointing at a deleted page must be removed, not just left as a 404 |
| Zero typos / grammar errors | Called out repeatedly as one of the fastest ways to lose credibility with a hiring audience — "attention to detail" is explicitly one of the top things recruiters say they infer from a site | LOW | One careful proofread pass post-rewrite; higher stakes than on a casual site because errors read as sloppy quant work by association |
| A small, curated set of work (not everything you've ever done) | Hiring managers consistently report preferring 3–5 strong projects over a large volume of average ones; "recruiters don't have time to review everything" | LOW | Already satisfied — 5 case studies is inside the range research supports as the sweet spot |
| Quantified outcomes stated plainly, not just methodology | Quant-specific resume research: hiring managers want "quantifiable results... Sharpe ratios, revenue impact" stated explicitly, not left for the reader to infer from a methods description | LOW–MEDIUM | Applies directly to Focus Area 2 below — case studies need an outcome line surfaced near the top, not only buried in the analysis |
| Working, professional contact path (email at minimum) | A site with no way to make contact, or only a contact form with no visible email, reads as incomplete; recruiters need a fast, frictionless way to follow up | LOW | Direct `mailto:` or a plainly stated email address beats a contact form for this audience — see Focus Area 5 |
| Mobile-readable layout | Recruiters and hiring managers frequently open CV links from phone/tablet between meetings; a layout that breaks on mobile reads exactly like a broken link does | LOW–MEDIUM | Already in this milestone's Design scope ("verify on mobile and dark mode") |
| Current, non-stale dates where dates appear at all | "An outdated portfolio can give recruiters the impression that you're either not active in your field or not committed to keeping up" — but this cuts both ways for a small site (see Anti-Features: stale blog dates) | LOW | Prefer omitting dates on evergreen content (About, case studies) over showing a date that ages the whole site by association |

### Differentiators (Competitive Advantage)

Not required for a baseline professional impression, but these are where this specific site can read as unusually strong for the audience, aligned with the Core Value of an accurate, favourable 20-second impression.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Outcome-first case study framing (result in the first sentence, method as supporting detail) | Directly matches how hiring managers say they read technical work: "start with the outcome... before/after," then skim for the story. A reader with 20 seconds per case study needs to get the "so what" without reading the methodology | LOW (framing/copy change only — no new analysis, respects Out of Scope) | This is the single highest-leverage differentiator available given the constraint that case study substance can't change — it's a rewrite of leads/summaries and the `/projects/` index cards, not the analysis itself |
| A one-line "why this matters" translation layer for quant methods | General technical-writing-for-non-technical-audience research is consistent: define jargon in practical terms, don't just expand acronyms; the reader is a senior finance/energy hiring manager, not a fellow quant, so domain fluency can't be assumed for every technique (e.g., BRAIN alpha research, factor models) | LOW–MEDIUM | One clarifying sentence per case study, not a rewrite of the technical content — respects "no rewriting existing case study analysis" |
| A genuinely specific, verifiable About page (credentials + one line of professional narrative, no claims that can't be backed up) | Hiring-manager research on personal-site About pages converges on: succinct value proposition, clear professional identity up front, specific/verifiable achievements, omit anything unverifiable — this is a real differentiator only because the current About page fails all of it ("I'm passionate about technology") | LOW | Direct replacement target already scoped in PROJECT.md Active requirements |
| Consistent, restrained visual system across all pages (type, spacing, chart styling) | Visual craft is explicitly named as something recruiters judge in the first seconds, before they even read content — "visual design... critical in capturing recruiter attention before they move on" | MEDIUM | Already scoped as this milestone's Design work; the differentiator is that most personal sites in this niche don't bother, so consistency alone stands out |
| A homepage that reads as intentional restraint, not absence | The distinction between "unfinished minimal" and "confident minimal" is structure, hierarchy, and a clear path to the work — not decoration. A one-line homepage without a clear next step reads as an unfinished stub; the same content with strong typographic hierarchy and an unambiguous path into the work reads as confident | LOW–MEDIUM | This is the single biggest execution risk in the whole milestone — see Anti-Features for the failure mode |

### Anti-Features (Commonly Requested, Often Problematic)

Evaluated against the specific list in the research brief, plus items surfaced independently in research.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|------------------|-------------|
| "Work in Progress" badges on any page | Feels honest / transparent to the builder | Universally read as unfinished by an outside visitor with no context on your roadmap; an incomplete section with a WIP label is worse than no section at all — this is explicitly why PROJECT.md already deletes the AI Workflow section | Ship only finished pages. If something isn't done, don't publish it |
| Stale-dated blog posts / visible "last updated" dates that are old | Feels like proof of ongoing activity | Cuts the other way for a low-cadence site: a visibly old date signals inactivity and unmaintained content, which is explicitly called out in research as a credibility hit ("not committed to keeping up with industry standards") | Keep dates on posts if genuinely useful for context, but don't foreground staleness anywhere near the homepage; do not manufacture a fake sense of freshness — Out of Scope already excludes new blog cadence, so simply don't let old dates dominate the visual hierarchy |
| Personal photo galleries | Feels personable, "shows who I am" | Research is unambiguous here — "employers and clients don't care what you do in your free time," and personal-life content on a hiring-facing site is neutral at best, a liability at worst (nothing to do with the professional narrative, dilutes the 20-second scan with irrelevant content) | Already scoped for deletion in PROJECT.md. Correct call — do not reinstate in any form |
| Skill bars / percentage ratings (e.g. "Python 90%, R 75%") | Feels like a clear, scannable summary of ability | Called out directly in portfolio-mistake research as "an elegant way of showing employers where your skills are lacking" — arbitrary percentages have no external validity and a hiring manager cannot use "Python 90%" as evidence of anything; for a finance audience, self-rated skill percentages read as unsophisticated | Let the case studies demonstrate capability. If a skills list is needed at all, a plain unranked list of tools/methods used is safer than any rated/graphed version |
| Testimonials | Feels like third-party social proof | Not addressed directly in the sources found, but reasoning from adjacent findings: testimonials on a personal portfolio (as opposed to a company site) read as unverifiable and slightly try-hard unless from named, checkable professional sources — and Out of Scope already forbids surfacing former-employer/trading detail, which is exactly the context a testimonial would need to be credible | Omit. If third-party validation matters, it belongs on LinkedIn (where it's platform-verified) not self-hosted on the CV-linked site |
| Visitor counters | Feels like proof of traffic/relevance | A visitor counter signals nothing to a hiring manager except that the site owner cares about vanity metrics; it was standard on late-1990s personal homepages and now reads as a dated, unprofessional signal by association — no source recommends this for any professional context found | Omit entirely. Use privacy-respecting analytics (already in place via GA) for the owner's own insight, never surfaced to visitors |
| Animated hero effects (parallax, particle backgrounds, elaborate entrance animations) | Feels impressive / demonstrates technical polish | Adds load time and motion for a reader who has ~20 seconds and wants the identity statement immediately, not a show; also directly conflicts with this milestone's own `prefers-reduced-motion` accessibility audit item | Static, fast-loading hero with strong typography. Motion, if any, should be a subtle micro-interaction (e.g. chart entrance) not a homepage set-piece |
| Chatbots | Feels modern / helpful | A hiring manager visiting a CV-linked personal site does not want to negotiate with a bot to get information that should be readable directly; adds a jarring, out-of-place interaction pattern to a static content site and undermines the "quiet and confident" tone PROJECT.md explicitly wants | Just make the content directly readable and the contact path (email/LinkedIn) directly visible |
| Newsletter signup popups | Feels like audience-building | Interrupts the 20-second scan with a modal asking for an email address before the visitor has even judged whether the site is worth their time — actively hostile to the stated Core Value; also nothing on this site (blog cadence explicitly Out of Scope) currently justifies collecting subscribers | Omit entirely. No newsletter, no popup, no exit-intent modal |
| Hamburger menu hiding navigation on desktop | Feels clean/minimal | Explicitly named in portfolio-mistake research as adding friction — "use visible navigation links instead to reduce friction" — for an ~11-page site there is no density problem that justifies hiding the menu | A visible, flat top-level nav (Home / Projects / Blog / About / Contact) works fine at this page count; reserve collapse behaviour for mobile only, where it's expected |
| Contact forms as the only way to reach you | Feels safer / filters spam | For a hiring-audience CV-linked site, a form adds a step between "I want to reach this person" and doing so, and can misfire (no confirmation, spam filters); the research consensus on this audience favours a direct, low-friction path | Lead with a plain, clickable email address (and/or LinkedIn), keep a form (if any) as a secondary option, not the only one |
| Multiple loud contact CTAs / "Let's work together!" language repeated across pages | Feels proactive about signalling availability | Reads as eager-to-please rather than confident; for a portfolio (not a freelancer landing page or job-application microsite — PROJECT.md explicitly rejects "career narrative" framing) this tips into looking like a job-seeking microsite rather than a body of work | One clear, calm Contact page/link is sufficient. Let the work carry the case; don't ask for the job on every page |
| CV/resume PDF hosted on the site | Feels convenient for the visitor | Already explicitly Out of Scope in PROJECT.md — a generic hosted CV would undercut the CV tailored per application | N/A — do not build, confirmed by both research and PROJECT.md |

### A note on GitHub as an expected link

General developer-portfolio research treats a GitHub link as close to table stakes ("if one dev has a website but the other has better GitHub contributions, I'd give higher priority to GitHub"). That signal is written for software-engineering hiring, where GitHub activity is the primary credibility proxy. For this audience — finance/energy hiring managers evaluating quantitative and analytical capability — GitHub is a secondary, not primary, credibility source; the primary proxy is the case study write-ups themselves plus LinkedIn (professional identity/verification) and email (direct contact). A GitHub link is reasonable to include if code backing the case studies is public and clean, but it should not be positioned as a required piece of the identity/contact set for this reader.

## Feature Dependencies

```
Prune dead sections (AI Workflow, Photos, welcome post, filler cards)
    └──requires-before──> Nav/link audit for 404s
                              └──enables──> Minimal homepage can point confidently at a small, complete set of destinations

Outcome-first case study reframing
    └──requires──> Case study index (projects/index.md) rewritten to lead with outcome per card
                       └──enhances──> Minimal homepage's "straight into selected work" promise (the work it points to must itself be scannable in seconds)

Rewritten About page
    └──enhances──> Contact page (a reader who trusts the About bio is more likely to use Contact)

Consistent typographic/visual system
    └──enhances──> ALL of the above (a strong system makes even minimal content read as intentional rather than unfinished)

Anti-features (WIP badges, photo gallery, skill bars, testimonials, popups, chatbots)
    └──conflicts──> Core Value (20-second favourable, accurate impression) — each one either adds friction, adds irrelevant content, or reads as trying too hard
```

### Dependency Notes

- **Nav/link audit must happen before or alongside pruning, not after:** a dead-section deletion that leaves a dangling nav item or internal link is strictly worse than the section existing, because it converts a content problem into a broken-site problem — the single most-cited credibility killer found in research.
- **Outcome-first framing enhances the minimal homepage:** the minimal homepage's whole bet is "the work speaks for itself" — that bet only pays off if the work, on arrival, is legible in the same handful of seconds the homepage itself is judged in. A homepage that behaves minimally but hands off to a project index that still leads with methodology recreates the 20-second problem one click later.
- **Visual system enhances everything:** this is the mechanism by which "minimal" reads as "confident" rather than "incomplete" — research is consistent that the differentiator between the two is structure, hierarchy, and typographic care, not the amount of content.
- **Anti-features conflict with Core Value directly:** each one was evaluated individually above against the same test — does it cost the reader time/trust without adding verifiable signal for this specific audience. All eleven fail that test.

## MVP Definition

Framed as "what this milestone must ship" rather than a hypothetical v1, since this is a brownfield polish pass on an existing site, not a greenfield build.

### Launch With (this milestone)

- [ ] Clean nav/IA with zero dead links after pruning — table stakes, non-negotiable
- [ ] Minimal, plain-language homepage identity statement with a direct path into work — table stakes + primary differentiator opportunity
- [ ] Outcome-first framing on the `/projects/` index and case study leads — highest-leverage differentiator available within Out of Scope constraints
- [ ] Rewritten, specific, verifiable About page — table stakes (current version actively fails it)
- [ ] Reviewed Contact page: direct email/LinkedIn, no form-only path, no desperate tone — table stakes
- [ ] Consistent type/spacing/chart system across all remaining pages — differentiator, and the mechanism that makes minimal read as confident
- [ ] Mobile + dark mode verification — table stakes
- [ ] Confirm none of the eleven anti-features are present anywhere on the site (including the two remaining blog posts and case studies) — a final audit pass, not new build work

### Add After Validation (future, if ever)

- [ ] GitHub link, only if the underlying case-study code is genuinely clean and public-ready — currently not confirmed either way; treat as optional, not required
- [ ] Any additional case study — explicitly Out of Scope this milestone

### Future Consideration / Explicitly Not This Site

- [ ] CV PDF hosting, testimonials, skill graphs, visitor counters, chatbots, newsletter — all rejected as anti-features per above, not deferred-but-planned, simply not appropriate for this site's audience and Core Value

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Dead-link/nav audit after pruning | HIGH | LOW | P1 |
| Minimal homepage rewrite | HIGH | LOW | P1 |
| Outcome-first case study/index framing | HIGH | LOW | P1 |
| About page rewrite | HIGH | LOW | P1 |
| Contact page review | MEDIUM | LOW | P1 |
| Typographic/visual system consistency | HIGH | MEDIUM | P1 |
| Mobile/dark-mode verification | MEDIUM | LOW | P1 |
| Anti-feature final audit (no WIP badges, no stale-date prominence, etc.) | MEDIUM | LOW | P1 |
| GitHub link (conditional on code quality) | LOW | LOW | P3 |

**Priority key:**
- P1: Must have for this milestone's Core Value to hold
- P2: Should have — none identified beyond P1/P3 for this scope; this is a deliberately small, finished site, not a phased feature rollout
- P3: Nice to have, optional, not required for the milestone to succeed

## Competitor Feature Analysis

Not a market-competition scenario in the usual sense — a personal CV-linked site has no direct "competitors" a visitor comparisons-shops against in the moment. The comparable reference class is: (a) other quant/data-science portfolio sites, and (b) the researched norms for what hiring managers say they want across that reference class. Both are folded into Table Stakes/Differentiators above rather than repeated in matrix form, since a plain feature-parity table would misrepresent the actual decision context (a hiring manager doesn't tab-compare portfolio sites; they judge each cold, once, against an internal bar).

## Sources

- [What US Recruiters Look for in a Digital Portfolio — Fueler](https://fueler.io/blog/what-us-recruiters-look-for-in-a-digital-portfolio) — MEDIUM confidence (industry blog, not primary research, but consistent with other sources)
- [How Recruiters and Hiring Managers Actually Look at Your Portfolio — Opendoors Careers](https://blog.opendoorscareers.com/p/how-recruiters-and-hiring-managers-actually-look-at-your-portfolio) — MEDIUM
- [Portfolio Link Section That Impresses Recruiters in Seconds — Resumly](https://www.resumly.ai/blog/portfolio-link-section-that-impresses-recruiters-in-seconds) — MEDIUM
- [Don't Waste Time on a (React) Portfolio Website — 60+ Hiring Managers Survey — Profy.dev / DEV Community mirror](https://dev.to/profydev/this-survey-among-60-hiring-managers-reveals-don-t-waste-your-time-on-a-react-portfolio-website-17ge) — MEDIUM (largest actual hiring-manager sample found among sources used; developer-hiring context, generalised carefully to this finance audience; single source so capped at MEDIUM per classify-confidence, not HIGH)
- [12 Things You Should Remove From Your Portfolio Website Immediately — Matt Olpinski](https://mattolpinski.com/articles/fix-your-portfolio/) — MEDIUM (single practitioner's opinion piece, but highly specific and consistent with other anti-feature findings; primary source for skill-graph, hamburger-menu, and personal-intro findings)
- [Dataquest: Build a Data Science Portfolio](https://www.dataquest.io/blog/build-a-data-science-portfolio/) — MEDIUM (industry education content, consistent across multiple similar sources)
- [The Resume of the Quant Analyst — Street of Walls](https://www.streetofwalls.com/finance-training-courses/quantitative-hedge-fund-training/quant-analyst-resume/) — MEDIUM (finance-specific recruiting content; source of the "avoid color/logos/photos, use quantifiable metrics" finding directly relevant to this audience; single source so capped at MEDIUM)
- [How to Write a Professional Bio — Indeed](https://www.indeed.com/career-advice/career-development/guide-to-writing-a-bio-with-examples) — MEDIUM
- [Personal Websites for Job Seekers — FlexJobs / Forbes / LinkedIn Pulse pieces] — LOW-MEDIUM (general career-advice content, several independent authors converging on the same About-page guidance, treated as directionally reliable due to convergence rather than any single source's authority)
- General technical-writing-for-non-technical-audience guidance (LinkedIn Advice, Document360, Lucidchart, Mercedes Bernard blog) — LOW-MEDIUM (aggregated web guidance, not finance-specific, used only to support the "lead with outcome, define jargon" recommendation which is independently corroborated by the recruiter-scan research above)
- Website navigation/IA best-practice aggregation (WPDesigns, GoDaddy, WebFX, Orbit Media) — LOW-MEDIUM (general web-design guidance, used only for the flat-nav/no-hamburger-at-this-scale recommendation)

**Gap acknowledged:** no source found is specific to "quantitative finance/energy portfolio site" as a category — this category is small enough that no dedicated research literature exists. Findings are triangulated from (a) general recruiter/hiring-manager portfolio research, (b) quant/finance resume-specific research, and (c) portfolio-mistake retrospectives, cross-checked for consistency. Treat conclusions as strong directional guidance, not as validated for this exact audience segment.

---
*Feature research for: personal quant-finance portfolio site, hiring audience*
*Researched: 2026-07-25*
</content>

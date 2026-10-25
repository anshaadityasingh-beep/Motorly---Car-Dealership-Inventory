# 08 — Visual Polish, Responsiveness & UX Pass

Read `00_master_context.md` first. Prerequisite: prompts 05–07 complete. Keep all tests green; add tests only for new behaviour.

## Goal
Make the app look like a premium product, since design is explicitly judged.

## Tasks
1. **Landing/hero area** at the top of the dashboard: headline, short tagline, summary stats (total vehicles, categories) — tasteful, not bloated.
2. **Auth pages:** split layout (brand imagery/gradient on one side, form on the other on desktop; stacked on mobile).
3. **Micro-interactions:** card hover lift, smooth button/toast transitions, skeleton shimmer, subtle page transitions. Respect `prefers-reduced-motion`.
4. **Consistency audit:** spacing scale, typography hierarchy, colour usage, icon style (use inline SVG or an icon set only if I approve the dependency).
5. **Responsive audit** at 360, 768, 1024, 1440 px: no horizontal scroll, touch targets ≥ 44px, mobile nav works.
6. **Accessibility audit:** landmarks, heading order, labels, focus management in modals (trap + restore), colour contrast, alt text.
7. **Empty/error/offline** states reviewed; 404 page designed.
8. Favicon, page `<title>` and meta tags, Open Graph tags.
9. Performance: lazy-load routes, image `loading="lazy"`, confirm `npm run build` output is small and warning-free.

## Definition of done
Visual and a11y checklist completed with a short summary of changes; tests and build green.

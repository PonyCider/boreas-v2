# Checkout form cinematic design

**Date:** 2026-08-08
**Scope:** Right panel of the pricing checkout modal.

## Understanding

- Keep the existing four buyer fields and Mercado Pago flow.
- Increase visual impact without changing pricing, APIs, or checkout behavior.
- Use components and patterns from the UI registries configured for Boreas.
- Target WCAG 2.2 AA across keyboard, touch, and assistive technology use.
- Allow strong decorative motion when it remains legible, responsive, and optional through reduced-motion preferences.

## Final direction

The form uses a cinematic interaction model:

- An animated electric border frames the form and responds to focus and validation state.
- Fields validate on blur and on submit, never on every keystroke.
- A valid completed field transitions its leading icon into a check and emits a short visual pulse.
- A progress indicator reports how many required fields are complete.
- The existing pricing `FloatingTooltip` explains why contact details are requested.
- The primary CTA uses a specular treatment, provides a valid-submit click spark, and morphs into a busy state while the checkout is created.
- Mobile keeps non-cursor animation. `prefers-reduced-motion` keeps semantic state changes while removing travel, pulsing, and particle motion.

## Accessibility requirements

- Native labels and `required` semantics remain present.
- Inputs keep correct `type`, `autocomplete`, `inputMode`, `aria-invalid`, and `aria-describedby` values.
- Blur validation errors are descriptive and announced without moving surrounding controls.
- Submit validation focuses the first invalid field.
- Progress uses a polite live region; request failures use an alert.
- The form exposes `aria-busy` while creating the checkout.
- Focus indicators remain visible with at least a two-pixel perimeter treatment.
- Privacy-link behavior identifies that it opens in a new tab.
- All decorative effects ignore pointer events and cannot block input activation.

## Decision log

1. Selected the cinematic option over restrained and editorial alternatives for stronger visual impact.
2. Kept all four existing fields to preserve the current lead handoff.
3. Selected validation on blur and submit to avoid noisy feedback during typing.
4. Added per-field completion animation and a form-level completion count.
5. Reused the pricing `FloatingTooltip` rather than introducing another explanation pattern.
6. Kept all payment and server behavior unchanged.

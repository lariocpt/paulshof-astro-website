# Proposed brand guideline

**Status: design proposal.** Retain **No 5 on Franschhoek** as the business name; Paulshof
is the location, not an approved rebrand. Generated lettering is concept art and must
never replace the verified name or a production wordmark.

## Tone and photography

Warm, personal and clear. Lead with the property and a straightforward booking or enquiry
action. Use actual, locally hosted property images when implementing; the generated
concepts contain illustrative architecture/interiors and are not marketing evidence of
real facilities. Avoid unverified luxury claims, ratings, awards, availability or prices.
Preserve verified contact/location content.

## Colour tokens and measured contrast

Ratios use opaque sRGB foreground/background pairs calculated by image_contrast. Do not
apply the results to translucent surfaces or photography.

| Role                    | Foreground / background | Ratio    | Normal text |
| ----------------------- | ----------------------- | -------- | ----------- |
| Body                    | #282521 / #FAF6EF       | 14.158:1 | AAA         |
| Brand heading/link      | #7D252B / #FAF6EF       | 8.977:1  | AAA         |
| Primary button          | #FFFFFF / #7D252B       | 9.671:1  | AAA         |
| Botanical heading/link  | #445447 / #FAF6EF       | 7.483:1  | AAA         |
| Secondary filled button | #FFFFFF / #445447       | 8.062:1  | AAA         |

Use separate background, surface, text, accent-text, accent-fill and on-accent roles.
Borders and non-text controls require their own applicable contrast checks. Underline text
links; do not rely on colour alone. Focus indicators must remain visible across every
surface. Verify all states and themes in implementation.

## Type and spacing

Propose a restrained serif display face with a clear sans-serif body/UI face. Choose
locally packaged, licensed fonts after approval; the mockups do not prove specific font
availability. Keep the browser-relative root size, rem/em spacing, readable body text
around 1rem, generous line-height and a moderate prose measure. Avoid all-caps paragraphs
and decorative text over busy photographs.

## Components and layout

Give mobile the same business identity and booking action as desktop. Replace the
oversized masthead with a compact wordmark, adaptable navigation and one clear CTA. Use
consistent card image ratios, a predictable spacing scale and small, stable borders. Keep
mobile cards single-column, expanding as content allows. Use source breakpoints as
regression targets, not as a mandate to copy the old layout. Test 320px, enlarged text and
zoom as well as the captured widths.

## Asset rules

The PNG concepts are for composition and art direction only. Their small text and some
spelling are imperfect, and their apparent colour values are not the canonical tokens
above. Build actual headings, labels, buttons and wordmarks as accessible HTML/vector
assets. Do not use a generated full-page mockup as the website itself. See the
[design library](../designs/README.md) for provenance.

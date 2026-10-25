# Existing theme and critique

The current identity is **No 5 on Franschhoek**, in Paulshof. The domain name is not a
replacement business name. Preserve the existing name and verified contact information
when implementation begins.

## Observed visual system

The home page has a large photographic masthead with the red “5”/bird mark, white display
lettering, a red booking link and telephone strip. A white desktop navigation bar sits
above a translucent light-grey content panel. The main page includes a welcome/video area,
two circular image links, extensive body copy, location information and a compact footer.
Burgundy/red headings and rounded, gradient red buttons supply most emphasis. Repeated
page shells, galleries and attraction articles share the same theme.

Computed CSS declares Century Gothic with Arial/Helvetica/sans-serif fallbacks for most
text and Georgia/Times/serif in some headings. A declared family is not proof that that
font is installed or actually selected on the capture machine. Frequent computed colours
include #383838, #9E0000, white and black. Third-party review widgets introduce additional
typography and colours.

## Findings grounded in screenshots

1. At 400px the masthead lettering, logo and booking area visibly collide or clip. The
   document-overflow probe reports no horizontal overflow, illustrating why that metric
   alone cannot establish successful reflow.
2. Desktop navigation becomes a compact MENU control on mobile. Capture did not exercise
   that menu, keyboard access or expanded states; those require testing.
3. Dense long paragraphs, small UI text and competing photo backgrounds reduce
   scanability. Group the same verified content into short semantic sections.
4. Circular images and heavy button gradients visually compete with the property
   photographs. A simpler card system can improve hierarchy without losing content.
5. Embedded map areas can be blank in automated capture. Treat third-party embeds as an
   independently tested dependency; provide a usable address/directions link.
6. The captured footer displays an old copyright year. Establish the correct
   ownership/date policy instead of inventing current business facts.

## Accessibility evidence and limits

Opaque #9E0000 text against white has measured contrast 8.558:1, so red is not inherently
the problem. Actual small text, transparent panels, image overlays, focus states, form
errors and third-party widgets need separate checks. The palette calculations below do not
certify the site. Prioritise readable type, visible focus, semantic navigation, clear link
names and mobile header reflow.

## Proposed direction

Retain the warm burgundy identity, pair it with ivory and restrained botanical green, and
use calm editorial hierarchy. Give property photography a stable frame and text an opaque
surface. Preserve business content and booking intent; do not introduce fabricated rates,
reviews, awards or amenities.

# Reusable Astro component inventory

The live sitemap and capture metadata show repeated theme/page fragments. These are
proposed responsibilities for implementation, not newly built components.

| Component                          | Ownership and inputs                                            | Responsive/accessibility responsibility                               |
| ---------------------------------- | --------------------------------------------------------------- | --------------------------------------------------------------------- |
| Layout                             | Document, head, navigation, footer and the single main landmark | Preserve the existing ClientRouter and CSP contracts                  |
| SiteHeader                         | Verified brand mark/name, booking link and contact data         | Keep the wordmark and CTA readable at 320px and zoom                  |
| SiteNavigation                     | Shared ordered routes and current-page state                    | Real links, labelled menu button, focus and Escape behaviour          |
| BookingCallToAction                | Verified destination, label and optional context                | One consistent primary treatment; no fabricated booking handler       |
| PageIntro                          | Heading, summary, optional breadcrumb                           | One page h1 and clear heading order                                   |
| PropertyHero                       | Actual local property image/video and content                   | Reserve dimensions, useful alt, opaque copy surface, reduced motion   |
| FeatureCard                        | Image, heading, short copy and one destination                  | Shared card template; intentional image crop and keyboard target      |
| GallerySection                     | Typed images grouped by verified room/area labels               | Responsive image delivery and stable anchors; no duplicated markup    |
| AttractionCard / AttractionArticle | Sitemap article data, image and verified text                   | One article shell and one list item template                          |
| GuestFeedback                      | Verified existing reviews or external review link               | Never synthesize testimonials or ratings                              |
| LocationPanel                      | Address, directions link, optional external map                 | Works without loading the embed; consent/loading states if applicable |
| ContactPanel                       | Verified phone/email and form contract                          | Keep demo submission disabled until a real handler is implemented     |
| SiteFooter                         | Shared identity/contact/legal data                              | Readable wrap, current route-independent data                         |

Use typed MDX collections for editorial content and site.ts for shared identity and
labels. Pages compose existing Layout; extract shared fragments into their own templates
rather than cloning HTML. Keep component CSS scoped and use semantic colour tokens. Source
page routes, headings, font stacks and repeated DOM classes are retained in the capture
evidence; classes are candidates, not proof that every matching element deserves a new
component.

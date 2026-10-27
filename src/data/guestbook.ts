/**
 * Verified guest quotations.
 *
 * Every string here is quoted from the guest-testimonials page as it was captured on the
 * previous site (the `/767-2/` capture, 2026-10-26). They are reproduced as written, with
 * only whitespace normalised. No author is attached: the source does not name them, and
 * inventing one would be a fabricated fact. No aggregate rating or review schema is
 * published anywhere — the old Trustindex widget and its stars are gone, and these plain
 * quotations replace it. When a rating appears inside a guest's own words it is their
 * sentence, not a score the site is claiming; the home-page set below deliberately avoids
 * those so no number reads as an endorsement by the property.
 *
 * Full migration to a typed `reviews` collection is tracked for the content phase.
 */
export interface GuestQuote {
  text: string;
}

export const guestQuotes: GuestQuote[] = [
  {
    text: 'The family atmosphere & all the help in organising travel & tourism. Anyone who knows us and who comes to stay in Johannesburg will stay here from now on.',
  },
  {
    text: 'This is really a wonderful establishment which I love coming to stay at.',
  },
  {
    text: 'I experienced a warm reception received throughout my stay, awesome hospitality and wonderful friendly staff. It’s like a home away from home experience.',
  },
  {
    text: 'Very friendly environment. Comfortable and clean rooms. Thank you so much for all of your help!',
  },
  {
    text: 'Service is wonderful, rooms are beautiful and staff friendly as well as the hostess.',
  },
  {
    text: 'Excellent. Very central. I’d definitely consider No 5 on Franschoek for a future visit and recommend to family and friends.',
  },
  {
    text: 'Warm, friendly welcome. A strength is the comfort and convenience. I’d definitely consider a future visit.',
  },
  {
    text: 'The welcome is warm and makes one feel at home, thank you. I felt love in your home and feel sure that you extend this to all of your guests.',
  },
  {
    text: 'Rooms are very nice and comfortable. Good service. Independent from the main house. We will definitely recommend to family and friends when they visit SA.',
  },
];

/** The three shown as a teaser on the home page. */
export const featuredGuestQuotes = guestQuotes.slice(0, 3).map((q) => q.text);

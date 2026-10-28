// Shared identity and UI labels. Editorial page copy belongs in the content collections.
//
// The contact strings below are the property's own, reproduced exactly as they are
// published: the phone number with its spaced national dialling code, the mobile as the
// site prints it, the address with its postal code. Changing any of them is an owner
// decision, not a copy edit, so `tel:` hrefs are derived values kept beside the display
// string they come from.

export const site = {
  name: 'No 5 On Franschoek',
  shortName: 'No 5',
  tagline: 'A bed and breakfast in Paulshof, Sandton.',
  titleSuffix: 'Bed and Breakfast in Paulshof, Sandton',
  description:
    'Nicki and Mary host No 5 On Franschoek, a bed and breakfast of en-suite bedrooms on Franschoek Lane in Paulshof, Sandton.',
  email: 'nicki.cottle@mweb.co.za',
  hosts: 'Nicki and Mary',
  phone: {
    label: '+27 (0)11 803 6064',
    href: 'tel:+27118036064',
  },
  // The site prints this as one line, "Nicki Cell: +27 (0) 82 821 6669". It is split so a
  // definition list can label the number without reprinting the label.
  mobile: {
    term: 'Nicki Cell',
    display: '+27 (0) 82 821 6669',
    full: 'Nicki Cell: +27 (0) 82 821 6669',
    href: 'tel:+27828216669',
  },
  address: {
    first: '5 Franschoek Lane',
    locality: 'Paulshof',
    city: 'Sandton',
    postalCode: '2191',
    full: '5 Franschoek Lane, Paulshof, Sandton, 2191',
  },
  booking: {
    label: 'Book Online Here',
    href: 'https://www.nightsbridge.co.za/bridge/Search?bbid=11881',
  },
  locale: 'en-ZA',
  localeOg: 'en_ZA',
  indexable: process.env.SITE_INDEXABLE === 'true',
  theme: { light: '#faf6ef', accent: '#7d252b' },
  ui: {
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    // The header strip the property runs today reads "For A Luxury Bed And Breakfast In
    // Paulshof Call +27 (0)11 803 6064"; kept as one string so the number appears once.
    call: 'Call +27 (0)11 803 6064',
    /** First half of that strip; the number is linked separately. */
    callStrip: 'For A Luxury Bed And Breakfast In Paulshof',
    contact: 'Contact us',
    footer: 'Luxury Bed and Breakfast Sandton',
    // The enquiry form is a demo until a real handler is configured. The labels and the
    // status line all say so in plain terms: nothing here may imply a message reached the
    // property, and the note points back at the phone and email that actually do.
    name: 'Name',
    email: 'Email',
    message: 'Message',
    submit: 'Preview enquiry',
    formNote:
      'This form is a preview and does not send or store your message. Phone or email reaches Nicki or Mary directly.',
    formResult: 'Preview complete. No message was sent or stored.',
  },
} as const;

/**
 * Routes in the order the property publishes them. An entry appears here only once its
 * page exists in `src/pages`, because the built-output check resolves every internal
 * link and would otherwise be satisfied by a page that no longer exists.
 */
export const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Gallery', href: '/gallery/' },
  { label: 'Rates', href: '/rates/' },
  { label: 'Guest Book', href: '/guest-book/' },
  { label: 'Directions', href: '/map/' },
  { label: 'Things To Do', href: '/things-to-do/' },
  { label: 'Contact Us', href: '/contact-us/' },
] as const;

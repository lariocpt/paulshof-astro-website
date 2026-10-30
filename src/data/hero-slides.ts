import { site } from '../site';
import { photoBySlug, type Photo } from './photography';

/**
 * The four banner slides that follow the home page's opening slide.
 *
 * The opening slide's copy lives in `src/content/pages/home.mdx` (heading, eyebrow and
 * body) and stays there so the page meta and the hero can never drift apart; only the
 * slides the banner adds are new copy, so they are authored here. Each lead is the
 * property's own published sentences, adapted to this site's voice ("Johannesburg", not
 * the old site's "Joburg"), with links that resolve to routes which already exist.
 *
 * Every photograph is an archive frame — see `docs/content/photo-provenance.csv`. The
 * alts are authored here because the provenance file has no alt-text column.
 */

export interface HeroSlideLeadPart {
  text: string;
  /** When present, the part renders as a link to `href`. */
  href?: string;
}

export interface HeroSlide {
  eyebrow?: string;
  title: string;
  lead: HeroSlideLeadPart[];
  photo: Photo;
  alt: string;
}

export const additionalHeroSlides: HeroSlide[] = [
  {
    eyebrow: 'Self catering',
    title: 'Spacious, self catering accommodation',
    lead: [
      {
        text: 'We have recently introduced four self catering rooms, so you can provide and cook your own food, and every en-suite bedroom is queen sized, well equipped and appointed. ',
      },
      { text: 'See the rooms', href: '/gallery/' },
      { text: ', or ' },
      { text: 'take a virtual tour', href: '/virtual-tours/' },
      { text: '.' },
    ],
    photo: photoBySlug('room-2-05.jpg'),
    alt: 'A self catering room with queen bed and kitchenette',
  },
  {
    eyebrow: 'Business & leisure',
    title: 'Ideal for business or leisure stays',
    lead: [
      {
        text: 'Nicki and Mary are your hosts at No 5 On Franschoek, where the peaceful environment belies the fact that we are conveniently located minutes away from some of Johannesburg’s biggest business districts — Rivonia, Sunninghill, Woodmead, Bryanston, Fourways, Midrand, Randburg and the Sandton CBD. ',
      },
      { text: 'Get directions', href: '/map/' },
      { text: ', or browse ' },
      { text: 'what to do nearby', href: '/things-to-do/' },
      { text: '.' },
    ],
    photo: photoBySlug('room-3-05.jpg'),
    alt: 'An en-suite bedroom with red bedding, dressed for a restful stay',
  },
  {
    eyebrow: 'Everyday comforts',
    title: 'Free Wi-Fi – Secure Parking – Excellent Location',
    lead: [
      {
        text: 'A 200 meg fibre line keeps the Wi-Fi fast at no additional charge, parking is secure and on-site, the pool sparkles in the garden, and the neighbouring Greenbelt is open to guests for nature walks. ',
      },
      { text: 'Contact us', href: '/contact-us/' },
      { text: ' for details.' },
    ],
    photo: photoBySlug('exterior-gardens-12.jpg'),
    alt: 'The brick facade and garage, with secure on-site parking',
  },
  {
    eyebrow: 'Book direct',
    title: 'Book Direct Today',
    lead: [
      {
        text: 'Flexible packages are available for short and long term stays: full bed and breakfast, self catering, or room only. ',
      },
      { text: 'See the rates', href: '/rates/' },
      { text: ', or ' },
      { text: 'call us', href: site.phone.href },
      { text: '.' },
    ],
    photo: photoBySlug('exterior-gardens-25.jpeg'),
    alt: 'The sparkling pool at dusk, lit with fairy lights',
  },
];

// Shared identity and UI labels. Editorial page copy belongs in the content collections.
export const site = {
  name: 'Website Starter',
  shortName: 'Starter',
  tagline: 'A clear starting point for your next website.',
  titleSuffix: 'An Astro website example',
  description:
    'A neutral example website with reusable Astro components, typed content, accessible navigation, and themed styles.',
  email: 'hello@example.com',
  locale: 'en',
  localeOg: 'en_US',
  indexable: process.env.SITE_INDEXABLE === 'true',
  theme: { light: '#f8fafc', dark: '#101827', accent: '#3730a3' },
  ui: {
    contact: 'View the contact example',
    approach: 'Explore the approach',
    footer: 'Example content for a website you will make your own.',
    name: 'Name',
    email: 'Email',
    budget: 'Budget range (optional)',
    brief: 'Project brief',
    submit: 'Preview submission',
    formNote: 'This example does not send or store messages.',
    formResult: 'Demo complete. No message was sent or stored.',
  },
} as const;

export const navItems = [
  { label: 'Services', href: '/services/' },
  { label: 'Work', href: '/work/' },
  { label: 'Portfolio', href: '/portfolio/' },
  { label: 'Approach', href: '/approach/' },
  { label: 'About', href: '/about/' },
] as const;

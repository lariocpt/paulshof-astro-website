import type { ImageMetadata } from 'astro';

/**
 * Property photography, imported through `astro:assets`.
 *
 * Every file lives in `src/assets/property/<group>/` and is traceable to the source path
 * on the previous site through `docs/content/photo-provenance.csv`, which is also where
 * alt text is reviewed before it ships. Nothing here is generated imagery, and no
 * third-party logo was carried over: attraction imagery stayed behind on purpose.
 */
/**
 * Every frame is imported as a module so `astro:assets` owns the file, its dimensions and
 * its format. `import.meta.glob` with `{ eager: true }` hands back the same
 * `ImageMetadata` a static `import img from './photo.jpg'` would; the `?metadata` query is
 * not resolved through a glob in this pipeline, so it is deliberately not used here.
 */
const photographs = import.meta.glob('../assets/property/*/*.{jpg,jpeg}', {
  eager: true,
}) as Record<string, { default: ImageMetadata }>;

export interface Photo {
  /** File name, also the key used in the provenance CSV. */
  slug: string;
  image: ImageMetadata;
  width: number;
  height: number;
}

export interface PhotoGroup {
  /** URL-safe group name, used for the gallery anchor. */
  id: string;
  /** Heading as the property labels the group. */
  label: string;
  photos: Photo[];
}

/**
 * Groups as the previous gallery published them, in published order: the kitchen frames
 * were shown inside "Interior", so they are grouped that way here too. Order is explicit
 * rather than alphabetical because the published order is the one guests follow.
 */
const groups: { id: string; label: string; folders: string[] }[] = [
  {
    id: 'exterior-and-gardens',
    label: 'Exterior & Gardens',
    folders: ['exterior-gardens'],
  },
  { id: 'interior', label: 'Interior', folders: ['interior', 'kitchen'] },
  { id: 'room-1', label: 'Room 1 — Self Catering', folders: ['room-1'] },
  { id: 'room-2', label: 'Room 2 — Self Catering', folders: ['room-2'] },
  { id: 'room-3', label: 'Room 3', folders: ['room-3'] },
  { id: 'room-4', label: 'Room 4 — Self Catering', folders: ['room-4'] },
  { id: 'room-5', label: 'Room 5', folders: ['room-5'] },
  { id: 'room-6', label: 'Room 6', folders: ['room-6'] },
  { id: 'room-7', label: 'Room 7 — Poolside Room', folders: ['room-7'] },
];

/**
 * Images held back from publication. `property-02.jpg` is a group portrait of four
 * people; the copy names two hosts, so the picture cannot be captioned from the evidence
 * and waits for the owner to confirm who appears in it and whether it may run at all.
 */
const held = new Set(['property-02.jpg']);

function folderOf(key: string): string {
  return key.split('/').at(-2) ?? '';
}

function slugOf(key: string): string {
  return key.slice(key.lastIndexOf('/') + 1);
}

const available = Object.entries(photographs)
  .map(([key, namespace]) => {
    const image = namespace.default;
    return {
      folder: folderOf(key),
      photo: {
        slug: slugOf(key),
        image,
        width: image.width,
        height: image.height,
      } satisfies Photo,
    };
  })
  .filter(({ photo }) => photo.width > 0 && photo.height > 0)
  .filter(({ photo }) => !held.has(photo.slug))
  .sort((a, b) =>
    a.photo.slug.localeCompare(b.photo.slug, 'en', { numeric: true }),
  );

/** The published gallery groups, in published order. */
export const photoGroups: PhotoGroup[] = groups.map((group) => ({
  id: group.id,
  label: group.label,
  photos: available
    .filter(({ folder }) => group.folders.includes(folder))
    .map(({ photo }) => photo),
}));

/** Images outside the gallery groups: hero and section photography. */
export const standalonePhotos: Photo[] = available
  .filter(({ folder }) => folder === 'property')
  .map(({ photo }) => photo);

export const allPhotos: Photo[] = [
  ...photoGroups.flatMap((group) => group.photos),
  ...standalonePhotos,
];

export function photoBySlug(slug: string): Photo {
  const found = allPhotos.find((photo) => photo.slug === slug);
  if (!found) throw new Error(`Unknown property photograph: ${slug}`);
  return found;
}

/**
 * The only frames wide enough for a large opening image. Two source files exceed 1000px;
 * the rest of the archive is 600–999px, so no layout may assume it can serve a 2880px
 * full-bleed hero. Images are never upscaled, only downscaled.
 */
export const heroPhoto = photoBySlug('property-03.jpg');

/**
 * The widest frame in a group, used where one image has to stand for the whole group.
 * Width rather than area: the layouts are landscape-led, and a portrait frame would be
 * cropped to an unusable strip.
 */
export function groupCover(group: PhotoGroup): Photo {
  return group.photos.reduce(
    (widest, photo) => (photo.width > widest.width ? photo : widest),
    group.photos[0]!,
  );
}

/** Group covers in published order, for the home page and the room list. */
export const groupCovers = photoGroups.map((group) => ({
  group,
  cover: groupCover(group),
}));

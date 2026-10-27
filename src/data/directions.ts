/**
 * Turn-by-turn directions, as the previous site published them under "Map & Directions"
 * (captured 2026-10-26). Kept faithful to the source landmarks and road numbers; obvious
 * typographical slips were corrected, no route step was invented. The property's own advice
 * to search the suburb name rather than "Sandton" is preserved, because the pin is wrong
 * otherwise — the reason this rebuild sends guests to a map by labelled link rather than an
 * embed that would carry a different default.
 */
export const directionsRouteLabel = 'From the N1 Rivonia off-ramp';

/** The property's search advice, shown beside the map links. */
export const directionsSearchNote =
  'In Google Maps, type the suburb “Paulshof” as well as the street — searching only “Sandton” drops the pin in the wrong place.';

export const directionsSteps: string[] = [
  'Coming from the west: turn left at the off-ramp robot onto Witkoppen Road (R564 towards Fourways).',
  'Coming from the east (Joburg International or Pretoria): turn left at the off-ramp robot, go under the highway bridge keeping in the left-hand lane (R564 towards Fourways), then turn left into Witkoppen Road with Builder’s Warehouse on your right. Take care not to rejoin the highway — stay on R564 towards Fourways.',
  'Travel along Witkoppen Road. At the second robot, turn right into Stonehaven Road — Fury Ford on your left, Cambridge Shopping Centre (Woolworths and Nando’s) on your right.',
  'Travel through the security boom.',
  'Turn right into Drakenstein Road.',
  'Take the first left into Maluti Road. Maluti makes a 90° turn to the right; take the first left into Franschoek Lane.',
];

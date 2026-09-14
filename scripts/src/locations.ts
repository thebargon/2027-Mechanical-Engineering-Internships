// Require a supported location, rather than guessing from an employer's headquarters.
// Bare remote/US-wide and unresolved multi-location postings are intentionally excluded.
export function locationPriority(location: string | null): number {
  if (!location) return 3;
  let best = 3;
  for (const raw of location.split(/[;\n|]/)) {
    const s = raw.trim();
    if (/\b(?:Canada|Costa Rica|Mexico|India|Singapore|Australia|United Kingdom)\b/i.test(s) || /^CA-(?:ON|QC|NS|BC|AB|MB|NB|NL|PE|SK)-/i.test(s)) continue;
    const california = /\bCalifornia\b/i.test(s) || /(?:^|[,\s-])CA(?:$|[,\s-])/.test(s) && !/^CA-/.test(s);
    const indiana = /\bIndiana\b/i.test(s) || /(?:^|[,\s-])IN(?:$|[,\s-])/.test(s);
    const local = /^(?:(?:South Bay|Greater|Downtown),?\s+)?(?:Los Angeles|Orange County|Irvine|Costa Mesa|Tustin|Hawthorne|El Segundo|Long Beach|Torrance|Pasadena|Anaheim|Newport Beach|Huntington Beach|Santa Ana|Lake Forest|San Jose|Santa Clara|Sunnyvale|San Diego|San Francisco|Fremont|Mountain View|Palo Alto|Carlsbad|Sacramento)$/i.test(s);
    if (california || local) {
      const laoc = /\b(?:Los Angeles|Orange County|Irvine|Costa Mesa|Tustin|Hawthorne|El Segundo|Long Beach|Torrance|Pasadena|Anaheim|Newport Beach|Huntington Beach|Santa Ana|Lake Forest)\b/i.test(s);
      best = Math.min(best, laoc ? 0 : 1);
    } else if (indiana) best = Math.min(best, 2);
  }
  return best;
}
export function isPreferredLocation(location: string | null): boolean { return locationPriority(location) < 3; }

/**
 * Normalize a string by applying various transformations.
 */
export function normalizeString(
  str: string,
  options: {
    /**
     * Removes diacritics. For example, "é" becomes "e", "ç" becomes "c", etc.
     */
    removeDiacritics?: boolean;

    /**
     * Replaces all hyphens (including repeating) with a single space.
     */
    removeHyphens?: boolean;
  },
): string {
  let _string = str;

  if (options.removeDiacritics) {
    _string = _string.normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
  }

  _string = _string.trim();

  if (options.removeHyphens) {
    // remove repeating hyphens and replace with a single space
    _string = _string.replaceAll(/-+/g, " ");
  }

  return _string;
}

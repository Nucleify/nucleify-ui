export function formatTileCount(count: string | number | undefined): string {
  if (count === undefined || count === null || count === '') {
    return '';
  }

  return String(count);
}

export function formatSecondaryCount(
  countSecondary: number | string | undefined,
): string {
  if (
    countSecondary === undefined ||
    countSecondary === null ||
    countSecondary === ''
  ) {
    return '';
  }

  const value =
    typeof countSecondary === 'number'
      ? countSecondary
      : Number(countSecondary);
  const safe = Number.isFinite(value) ? value : 0;

  return `${safe} new`;
}

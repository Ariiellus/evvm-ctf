// Converts a Unix timestamp (seconds) to ISO datetime string.
export const unixTimestampToDatetime = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toISOString().slice(0, 16);
};
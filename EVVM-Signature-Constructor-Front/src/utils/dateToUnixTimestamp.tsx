// Converts a date string to a Unix timestamp (seconds).
export const dateToUnixTimestamp = (datetimeString: string): number => {
  const date = new Date(datetimeString);
  return Math.floor(date.getTime() / 1000);
};
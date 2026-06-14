/** Normalize a date (string "YYYY-MM-DD" or Date) to a UTC timestamp Date. */
export function toUTCTimeStamp(date) {
  if (date instanceof Date) return date;
  const s = String(date);
  return new Date(
    Number(s.substring(0, 4)),
    Number(s.substring(5, 7)) - 1,
    Number(s.substring(8, 10)),
    8,
  );
}

/** Convert a Date (or ISO string) to a `yyyy-mm-dd` value for <input type="date">. */
export function toDateInputValue(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const offsetMs = d.getTimezoneOffset() * 60_000;
  return new Date(d.getTime() - offsetMs).toISOString().slice(0, 10);
}

/** Today as a `yyyy-mm-dd` value. */
export function todayInputValue(): string {
  return toDateInputValue(new Date());
}

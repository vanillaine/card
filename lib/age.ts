export function ageOn(birthDate: string, timeZone = "Asia/Jakarta", now = new Date()): number {
  const [by, bm, bd] = birthDate.split("-").map(Number);
  const [y, m, d] = new Intl.DateTimeFormat("en-CA", { timeZone })
    .format(now)
    .split("-")
    .map(Number);

  return y - by - (m < bm || (m === bm && d < bd) ? 1 : 0);
}

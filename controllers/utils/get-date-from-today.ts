export function getDateFromToday(daysFromToday: number): Date {
  const today = new Date();
  return new Date(today.setDate(today.getDate() + daysFromToday));
}

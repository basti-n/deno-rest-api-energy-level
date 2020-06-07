export function isSameDay(date1: string | Date, date2: string | Date): boolean {
  const first = new Date(date1);
  const second = new Date(date2);

  if (first.getFullYear() !== second.getFullYear()) {
    return false;
  }

  if (first.getMonth() !== second.getMonth()) {
    return false;
  }

  if (first.getDate() !== second.getDate()) {
    return false;
  }

  return true;
}

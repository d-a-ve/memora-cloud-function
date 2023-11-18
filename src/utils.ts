// This should always be in sync with the frontend
export const changeDateToString = (d: Date): string => {
  const currDate = new Date(d);
  const currYear = currDate.getFullYear();
  const currMonth = currDate.getMonth();
  const currDay = currDate.getDate();

  return `${currYear}-${currMonth + 1}-${currDay}`;
}
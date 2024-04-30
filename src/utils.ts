// This should always be in sync with the frontend
export const changeDateToString = (d: Date): string => {
  const currDate = new Date(d);
  const currYear = currDate.getFullYear();
  const currMonth = currDate.getMonth();
  const currDay = currDate.getDate();

  return `${currYear}-${addZeroIfNeeded(currMonth + 1)}-${addZeroIfNeeded(
    currDay
  )}`;
};

export const addZeroIfNeeded = (num: number): string => {
  return num < 10 ? `0${num}` : `${num}`;
};

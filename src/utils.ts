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

export const arrayToCommaSeparatedString = (arr: string[]): string => {
  const len = arr.length;
  if (len === 0) return "";

  if (len === 1) {
    return arr[0];
  }

  if (len === 2) {
    return `${arr[0]} and ${arr[1]}`;
  }

  const lastItem = arr.pop();
  return `${arr.join(", ")}, and ${lastItem}`;
};

export function repeatEndDate(startDate, monthsToAdd) {
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + monthsToAdd);
    return date.toString(); // Returns date in the desired format
  }
  
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export function formatDate(date: Date | undefined) {

  // escape where date is undefined
  if (!date) {
    return { month: null, date: null, year: null }
  };

  var dt = new Date(date)

  return {
    month: months[dt.getMonth()],
    date: dt.getDate(),
    year: dt.getFullYear()
  };
}
export function formatIndianDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;

  const day = date.getDate();
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  // Add ordinal suffix (st, nd, rd, th)
  let suffix = "th";
  if (day === 1 || day === 21 || day === 31) suffix = "st";
  else if (day === 2 || day === 22) suffix = "nd";
  else if (day === 3 || day === 23) suffix = "rd";

  return `${day}${suffix} ${month} ${year}`;
}

export function getTodayDateString(): string {
  // Returns date in YYYY-MM-DD format based on IST (Asia/Kolkata)
  const options = { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" } as const;
  const formatter = new Intl.DateTimeFormat("en-CA", options);
  return formatter.format(new Date());
}

export function formatDateToSlug(dateStr: string): string {
  return dateStr.replace(/\//g, "-");
}

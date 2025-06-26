let MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];

export const convertDate = (str = "2021-03-07", addedDays = 0, indianformat = false) => {
  // Handle null, undefined, or non-string inputs
  if (!str) {
    str = new Date().toISOString().split('T')[0]; // Use current date as fallback
  }
  
  // If str is already a Date object, convert to string
  if (str instanceof Date) {
    str = str.toISOString().split('T')[0];
  }
  
  // Convert to string if it's not already a string
  if (typeof str !== 'string') {
    str = String(str);
  }
  
  // If str is a string but contains 'T' (ISO format), extract the date part
  if (typeof str === 'string' && str.includes('T')) {
    str = str.split('T')[0];
  }
  
  var date = new Date(str),
    mnth = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + (date.getDate() + addedDays)).slice(-2);
  if (indianformat) {
    return [day, mnth, date.getFullYear()].join("-");
  } else {
    return [date.getFullYear(), mnth, day].join("-");
  }
};


export const getCurrentDate = (indianformat = false) => {
  let date = new Date();
  let mnth = ("0" + (date.getMonth() + 1)).slice(-2);
  let day = ("0" + (date.getDate())).slice(-2);
  if (indianformat) {
    return [day, mnth, date.getFullYear()].join("-");
  } else {
    return [date.getFullYear(), mnth, day].join("-");
  }
};


export const getFancyDateFormat = (date) => {
  let mainDate = new Date(date);
  // let timeText = date.toString().split("T")[1].split(".")[0];
  let datetext = `${MONTHS[mainDate.getMonth()]} ${(mainDate.getDate())}, ${mainDate.getFullYear()}`;
  return datetext;
};

export const lastUpdatedDateFormat = (dateString) => {
  const currentDate = new Date();
  const inputDate = new Date(dateString);
  const diffHours = Math.floor((currentDate - inputDate) / (1000 * 60 * 60));
  
  if (diffHours < 24) {
    // Within the last 24 hours, show in "hours ago" format
    if (diffHours < 1) {
      return "a few minutes ago";
    } else if (diffHours === 1) {
      return "1 hour ago";
    } else {
      return `${diffHours} hours ago`;
    }
  } else {
    // More than 24 hours ago, show in the specified format
    const day = inputDate.getDate();
    const month = MONTHS[inputDate.getMonth()];
    const year = inputDate.getFullYear();
    const hours = inputDate.getHours();
    const minutes = inputDate.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;
    
    // Add ordinal suffix to day
    let dayOrdinal = day;
    if (day % 10 === 1 && day !== 11) dayOrdinal += 'st';
    else if (day % 10 === 2 && day !== 12) dayOrdinal += 'nd';
    else if (day % 10 === 3 && day !== 13) dayOrdinal += 'rd';
    else dayOrdinal += 'th';
    
    return `${dayOrdinal} ${month}, ${year} at ${hour12}:${minutes} ${ampm}`;
  }
};
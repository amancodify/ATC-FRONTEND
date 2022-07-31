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

export const convertDate = (str="2021-03-07", addedDays = 0, indianformat = false) => {
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
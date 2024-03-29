export const formatTime = (hours, minutes, military = false) => {
  let formattedHours,
    formattedMinutes,
    suffix = "";

  if (!military) {
    if (hours > 12) {
      formattedHours = hours - 12;
      suffix = " PM";
    } else {
      suffix = " AM";
    }
  } else {
    formattedHours = hours;
  }

  if (minutes < 10) {
    formattedMinutes = "0" + minutes;
  } else {
    formattedMinutes = minutes;
  }

  return formattedHours + ":" + formattedMinutes + suffix;
};

export const formatTimeString = (timeString) => {
  // convert HH:MM string to HHMM number
  const hours = parseInt(timeString.slice(0, 2)),
    minutes = parseInt(timeString.slice(3, 5));

  return formatTime(hours, minutes);
};

export function getTime(date: Date | string): string {
  date = getLocalDateFromUTC(date);

  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
}

export function getDate(date: Date | string): string {
  date = getLocalDateFromUTC(date);

  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month < 10 ? '0' : ''}${month}/${day < 10 ? '0' : ''}${day}/${year}`;
}

export function getTimeSince(date: Date | string): string {
  date = getLocalDateFromUTC(date);

  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  if (seconds < 60) { // 1 minute
    return `${seconds} seconds ago`;
  } else if (seconds < 3600) { // 1 hour
    return `${Math.floor(seconds / 60)} minutes ago`;
  } else if (seconds < 86400) { // 1 day
    return `${Math.floor(seconds / 3600)} hours ago`;
  } else if (seconds < 604800) { // 1 week
    return `${Math.floor(seconds / 86400)} days ago`;
  } else {
    return "a long time ago";
  }
}

export function getMessageDate(date: Date | string): string {
  date = getLocalDateFromUTC(date);

  const now = new Date();
  const localNow = getLocalDateFromUTC(now);

  if (localNow.getDate() === date.getDate() &&
    localNow.getMonth() === date.getMonth() &&
    localNow.getFullYear() === date.getFullYear()) {
    return `Today at ${getTime(date)}`;
  } else if (localNow.getDate() - 1 === date.getDate() &&
    localNow.getMonth() === date.getMonth() &&
    localNow.getFullYear() === date.getFullYear()) {
    return `Yesterday at ${getTime(date)}`;
  } else {
    return getDate(date);
  }
}

export function getLocalDateFromUTC(date: Date | string): Date {
  // Ensure the date is a Date object
  if (typeof date === 'string') {
    date = new Date(date);
  }
  // Convert to local time
  const localDate = new Date(date.getTime() + date.getTimezoneOffset());

  return localDate;
}
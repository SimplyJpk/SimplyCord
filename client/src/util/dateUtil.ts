export function getTime(date: Date): string {
  date = getLocalDateFromUTC(date);

  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
}

export function getDate(date: Date): string {
  date = getLocalDateFromUTC(date);

  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month < 10 ? '0' : ''}${month}/${day < 10 ? '0' : ''}${day}/${year}`;
}

export function getTimeSince(date: Date): string {
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

export function getMessageDate(date: Date): string {
  date = getLocalDateFromUTC(date);

  const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);

  if (localDate.getDate() === date.getDate()) {
    return `Today at ${getTime(localDate)}`;
  } else if (localDate.getDate() + 1 === date.getDate()) {
    return `Yesterday at ${getTime(localDate)}`;
  } else {
    return getDate(localDate);
  }
}

export function getLocalDateFromUTC(date: Date): Date {
  date = new Date(date);

  // Convert to local time
  const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  return localDate;
}
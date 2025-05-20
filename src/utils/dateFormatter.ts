export function formatTimeDifference(dateTimeString: string): string {
  const now = new Date();
  const past = new Date(dateTimeString);
  const differenceInSeconds = Math.floor(
    (now.getTime() - past.getTime()) / 1000
  );

  if (differenceInSeconds < 60) {
    return "A few seconds ago";
  } else if (differenceInSeconds < 3600) {
    const minutes = Math.floor(differenceInSeconds / 60);
    return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  } else if (differenceInSeconds < 86400) {
    const hours = Math.floor(differenceInSeconds / 3600);
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  } else if (differenceInSeconds < 604800) {
    const days = Math.floor(differenceInSeconds / 86400);
    return `${days} day${days === 1 ? "" : "s"} ago`;
  } else if (differenceInSeconds < 2592000) {
    const weeks = Math.floor(differenceInSeconds / 604800);
    return `${weeks} week${weeks === 1 ? "" : "s"} ago`;
  } else if (differenceInSeconds < 31536000) {
    const months = Math.floor(differenceInSeconds / 2592000);
    return `${months} month${months === 1 ? "" : "s"} ago`;
  } else {
    const years = Math.floor(differenceInSeconds / 31536000);
    return `${years} year${years === 1 ? "" : "s"} ago`;
  }
}

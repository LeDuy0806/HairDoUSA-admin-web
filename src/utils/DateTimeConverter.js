export const isoStringToShortDate = isoString => {
  const date = new Date(isoString);
  const options = {
    timeZone: 'America/Los_Angeles',
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  };

  return date.toLocaleDateString('en-US', options);
};

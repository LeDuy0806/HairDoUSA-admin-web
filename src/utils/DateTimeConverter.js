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

export const weekNumberToDateRange = (
  weekNumber,
  year = new Date().getFullYear(),
) => {
  try {
    if (weekNumber < 1 || weekNumber > 53) {
      throw new Error('Week number must be between 1 and 53');
    }

    // Find the first day of the year
    const firstDayOfYear = new Date(year, 0, 1);

    // Calculate days needed to get to the first day of the first week
    // First week is the week containing the first Thursday of the year (ISO 8601)
    // Calculate day of week, where Monday is 1 and Sunday is 7
    const dayOfWeek = firstDayOfYear.getDay() || 7; // Convert 0 (Sunday) to 7

    // Adjust for ISO week (week 1 is the week with the first Thursday)
    const daysToFirstMonday = dayOfWeek > 1 ? 9 - dayOfWeek : 1;

    // First Monday of the first week
    const firstMondayOfYear = new Date(year, 0, daysToFirstMonday);

    // Calculate the Monday of the requested week
    const mondayOfRequestedWeek = new Date(firstMondayOfYear);
    mondayOfRequestedWeek.setDate(
      firstMondayOfYear.getDate() + (weekNumber - 1) * 7,
    );

    // Calculate the Sunday of the requested week
    const sundayOfRequestedWeek = new Date(mondayOfRequestedWeek);
    sundayOfRequestedWeek.setDate(mondayOfRequestedWeek.getDate() + 6);

    // Format the dates as mm/dd
    const formatDate = date => `${date.getMonth() + 1}/${date.getDate()}`;

    return `${formatDate(mondayOfRequestedWeek)} - ${formatDate(sundayOfRequestedWeek)}`;
  } catch (error) {
    console.error('Error converting week number:', error);
    return `Week ${weekNumber}`;
  }
};

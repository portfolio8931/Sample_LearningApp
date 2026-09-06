export const calcProgressPercentage = (
  current: number,
  total: number,
): number => {
  if (total <= 0) return 0;

  const percentage = Math.round((current / total) * 100);
  return Math.min(100, Math.max(0, percentage));
};

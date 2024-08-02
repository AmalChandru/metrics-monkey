export function formatDuration(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const formatted = [
    days > 0 ? `${days}d` : null,
    hours % 24 > 0 ? `${hours % 24}h` : null,
    minutes % 60 > 0 ? `${minutes % 60}m` : null,
    seconds % 60 > 0 ? `${seconds % 60}s` : null,
  ].filter(Boolean).join(' ');

  return formatted || '0s';
}

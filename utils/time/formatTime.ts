export const formatTime = (time: number) => {
  const hours = time > 0 ? Math.floor(time / 3600) : Math.ceil(time / 3600);
  const minutesRaw = time > 0 ? Math.floor((time % 3600) / 60) : Math.ceil((time % 3600) / 60);
  const secondsRaw = time % 60;

  if (hours !== 0) {
    const minutes = Math.abs(minutesRaw).toString().padStart(2, '0');
    const seconds = Math.abs(secondsRaw).toString().padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
  }

  if (minutesRaw !== 0) {
    const seconds = Math.abs(secondsRaw).toString().padStart(2, '0');

    return `${minutesRaw}:${seconds}`;
  }

  return secondsRaw.toString();
};

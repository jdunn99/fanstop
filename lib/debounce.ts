export function debounce<T extends any[]>(
  fn: (...args: T) => void,
  delay: number
) {
  let timerId: NodeJS.Timeout;
  return (...args: T) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      fn.apply(null, args);
    }, delay);
  };
}

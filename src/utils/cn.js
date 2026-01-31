/**
 * Utility for conditionally joining class names together
 * Similar to clsx/classnames libraries
 */
export function cn(...inputs) {
  return inputs
    .flat()
    .filter((x) => typeof x === 'string' && x.trim() !== '')
    .join(' ');
}

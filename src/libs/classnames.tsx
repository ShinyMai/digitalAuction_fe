export default function cn(
  base: string,
  params?: Record<string, boolean>
): string {
  let className = base;
  if (params) {
    for (const paramKey in params) {
      if (params[paramKey]) {
        className += ` ${paramKey}`;
      }
    }
  }
  return className;
}

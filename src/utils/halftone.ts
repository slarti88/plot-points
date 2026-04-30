export function halftone(color = '#15131a', opacity = 0.5, size = 6): string {
  const c = encodeURIComponent(color)
  return `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'%3E%3Ccircle cx='${size / 2}' cy='${size / 2}' r='0.9' fill='${c}' fill-opacity='${opacity}'/%3E%3C/svg%3E")`
}

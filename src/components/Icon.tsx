// 24×24 line icons drawn with the text colour
const PATHS = {
  back: 'M17 12H7M11 7l-5 5 5 5',
  close: 'M7 7l10 10M17 7L7 17',
  erase: 'M9 6h10a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9l-6-6zM12 10l4 4M16 10l-4 4',
}

export type IconName = keyof typeof PATHS

export function Icon({ name, size = 28 }: { name: IconName; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={PATHS[name]} />
    </svg>
  )
}
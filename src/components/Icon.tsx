// 24×24 line icons drawn with the text colour
const PATHS = {
  back: 'M17 12H7M11 7l-5 5 5 5',
  close: 'M7 7l10 10M17 7L7 17',
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
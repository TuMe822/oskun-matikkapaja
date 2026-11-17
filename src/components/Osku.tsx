import oskuUrl from '../assets/osku.webp'

export function Osku({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  return (
    <div className={`osku osku--${size}`}>
      <img src={oskuUrl} alt="Osku" />
    </div>
  )
}
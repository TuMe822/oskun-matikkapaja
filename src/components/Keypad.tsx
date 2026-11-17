import { Icon } from './Icon'

interface Props {
  onDigit: (digit: string) => void
  onErase: () => void
  onSubmit: () => void
  disabled?: boolean
  labels: { erase: string; ok: string }
}

const DIGITS = ['1', '2', '3', '4', '5', '6', '7', '8', '9']

// Own keypad: no on-screen keyboard popping up, same layout on every device
export function Keypad({ onDigit, onErase, onSubmit, disabled = false, labels }: Props) {
  return (
    <div className="keypad">
      {DIGITS.map((digit) => (
        <button key={digit} type="button" className="key" disabled={disabled} onClick={() => onDigit(digit)}>
          {digit}
        </button>
      ))}
      <button type="button" className="key" disabled={disabled} onClick={onErase} aria-label={labels.erase}>
        <Icon name="erase" />
      </button>
      <button type="button" className="key" disabled={disabled} onClick={() => onDigit('0')}>
        0
      </button>
      <button type="button" className="key key--ok" disabled={disabled} onClick={onSubmit}>
        {labels.ok}
      </button>
    </div>
  )
}

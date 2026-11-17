import { useId } from 'react'

interface Props {
  label: string
  values: readonly number[]
  selected: number
  onSelect: (value: number) => void
  format?: (value: number) => string
}

// Buttons with aria-pressed instead of fieldset/radios: see README (iPad rules)
export function ChoiceGroup({ label, values, selected, onSelect, format = String }: Props) {
  const id = useId()
  return (
    <section className="options">
      <h2 id={id}>{label}</h2>
      <div className="pills" role="group" aria-labelledby={id}>
        {values.map((value) => (
          <button
            key={value}
            type="button"
            className="pill"
            aria-pressed={value === selected}
            onClick={() => onSelect(value)}
          >
            {format(value)}
          </button>
        ))}
      </div>
    </section>
  )
}

interface Props {
  value: string | null
  onChange: (value: string | null) => void
  
  onKeyDown?: (key: string) => void
  autofocus?: boolean
  placeholder?: string
}

const Input: React.FC<Props> = props => {
  const {
    value,
    onChange,

    onKeyDown,
    autofocus,
    placeholder,
  } = props

  function handleValueChange(event: React.ChangeEvent<HTMLInputElement>) {
    const receivedValue = event.target.value
    const newValue = receivedValue !== '' ? receivedValue : null
    onChange(newValue)
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    const key = event.key
    onKeyDown!(key)
  }

  return (
    <input
      value={value ?? ''}
      onChange={handleValueChange}
      onKeyDown={onKeyDown && handleKeyDown}
      autoFocus={autofocus}
      placeholder={placeholder}
      className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring" />
  )
}

export default Input
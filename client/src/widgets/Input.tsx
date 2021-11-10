import React from "react"

interface Props {
  value: string | null
  onValueChange: (value: string | null) => void
  
  onSubmit?: () => void
  emptyStringAsNull?: boolean
  autofocus?: boolean
}

const Input: React.FC<Props> = props => {
  const {
    value,
    onValueChange,

    onSubmit,
    autofocus,
  } = props

  const emptyStringAsNull = props.emptyStringAsNull ?? true

  function handleEnterPressed() {
    if (value && onSubmit) {
      onSubmit()
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    const key = event.key
    switch (key) {
      case 'Enter':
        handleEnterPressed()
        break
    }
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    let newValue: string | null = event.target.value
    if (newValue === '' && emptyStringAsNull) {
      newValue = null
    }
    onValueChange(newValue)
  }

  return (
    <input
      value={value || ''}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      autoFocus={autofocus}
      className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" />
  )
}

export default Input
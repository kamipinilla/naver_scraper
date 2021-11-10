import { useState } from 'react'

const Pill: React.FC = props => {
  const {
    children
  } = props

  return (
    <div className="w-full inline-block rounded-full text-white bg-blue-500 px-2 py-1 text-xs font-bold">
      {children}
    </div>
  )
}

interface Props {
  onSubmit: (value: string) => void
  
  onCancel?: () => void
  showHowTo?: boolean
  errorMessage?: string
  autofocus?: boolean
  clearAfterSubmit?: boolean
  onTypingResumed?: () => void
}

const SubmitInput: React.FC<Props> = props => {
  const {
    onSubmit,
    onCancel,

    errorMessage,
    autofocus,
    onTypingResumed,
  } = props

  const showHowTo = props.showHowTo ?? false
  const clearAfterSubmit = props.clearAfterSubmit ?? false

  const [value, setValue] = useState<string | null>(null)

  function handleValueChange(event: React.ChangeEvent<HTMLInputElement>) {
    const receivedValue = event.target.value
    const newValue = receivedValue !== '' ? receivedValue : null
    setValue(newValue)

    if (errorMessage && onTypingResumed) {
      onTypingResumed()
    }
  }

  function handleEnterPressed() {
    if (value) {
      onSubmit(value)
      if (clearAfterSubmit) {
        setValue(null)
      }
    }
  }

  function handleEscapePressed() {
    if (onCancel) {
      onCancel()
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    const key = event.key
    switch (key) {
      case 'Enter':
        handleEnterPressed()
        break
      case 'Escape':
        handleEscapePressed()
        break
    }
  }

  return (
    <div className="space-y-2">
      {showHowTo &&
        <div className="flex space-x-1">
          <div>Press</div>
          <Pill>{value ? 'Enter' : 'Escape'}</Pill>
          <div>to {value ? 'submit' : 'exit'}</div>
        </div>
      }
      <input
        value={value ?? ''}
        onChange={handleValueChange}
        onKeyDown={handleKeyDown}
        autoFocus={autofocus}
        className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring" />
      {errorMessage && 
        <div className="text-red-600">{errorMessage}</div>
      }
    </div>
  )
}

export default SubmitInput
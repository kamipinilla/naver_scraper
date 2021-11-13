import { useCallback, useEffect, useState } from 'react'
import { Key } from '../types'
import Input from './Input'
import Pill from './Pill'

interface Props {
  onSubmit: (value: string) => void
  onCancel: () => void

  initialValue?: string
  onValueChangeInfo?: (value: string | null) => void
  showHowTo?: boolean
  errorMessage?: string
  autofocus?: boolean
  placeholder?: string
}

const SubmitInput: React.FC<Props> = props => {
  const {
    onSubmit,
    onCancel,

    onValueChangeInfo,
    errorMessage,
    autofocus,
    placeholder,
  } = props

  const showHowTo = props.showHowTo ?? false

  const [initialValue] = useState<string | null>(props.initialValue ?? null)
  const [value, setValue] = useState<string | null>(initialValue)

  useEffect(function notifyValueChangeInfo() {
    if (onValueChangeInfo) {
      onValueChangeInfo(value)
    }
  }, [value, onValueChangeInfo])

  const handleEnterPressed = useCallback(() => {
    if (value && !errorMessage) {
      onSubmit(value)
      setValue(null)
    }
  }, [value, errorMessage, onSubmit])

  const handleEscapePressed = useCallback(() => {
    onCancel()
  }, [onCancel])

  const handleKeyDown = useCallback((inputKey: string) => {
    const key = inputKey as Key
    switch (key) {
      case 'Enter':
        handleEnterPressed()
        break
      case 'Escape':
        handleEscapePressed()
        break
    }
  }, [handleEnterPressed, handleEscapePressed])

  return (
    <div className="space-y-4">
      <Input
        value={value}
        onChange={setValue}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autofocus={autofocus} />
      {showHowTo &&
        <div className="flex space-x-1">
          <div>Press</div>
          <Pill>{value !== initialValue ? 'Enter' : 'Escape'}</Pill>
          <div>to {value !== initialValue ? 'submit' : 'exit'}</div>
        </div>
      }
      {errorMessage && 
        <div className="text-red-600">{errorMessage}</div>
      }
    </div>
  )
}

export default SubmitInput
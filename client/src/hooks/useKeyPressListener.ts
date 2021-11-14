import { useCallback, useEffect } from 'react'
import { Key } from '../types'

export default function useKeyPressListener(handler: (key: Key) => void, element: any = window): void {
  const handleKeyDown = useCallback((event: any) => {
    const key = event.key
    handler(key)
  }, [handler])

  useEffect(function addKeyDownListener() {
    const keyDownEvent = 'keydown'
    element.addEventListener(keyDownEvent, handleKeyDown)

    return () => {
      element.removeEventListener(keyDownEvent, handleKeyDown)
    }
  }, [element, handleKeyDown])
}
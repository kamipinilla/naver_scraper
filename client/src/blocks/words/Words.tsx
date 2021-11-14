import React, { useCallback, useEffect, useState } from 'react'
import { Word } from '../../../../server/types'
import { getWords } from '../../api/words'
import useKeyPressListener from '../../hooks/useKeyPressListener'
import { Key } from '../../types'

const Words: React.FC = () => {
  const [position, setPosition] = useState<number | null>(null)
  const [words, setWords] = useState<Word[] | null>(null)
  useEffect(function loadWords() {
    getWords().then(words => {
      setWords(words)
      setPosition(0)
    })
  }, [])
  const word = (words !== null && position !== null) ? words[position] : null

  const incrementPosition = useCallback((): void => {
      if (position !== null && position !== 0) {
        setPosition(position - 1)
      }
  }, [position])

  const decrementPosition = useCallback((): void => {
    if (words !== null && position !== null && position !== words.length - 1) {
      setPosition(position + 1)
    }
  }, [position, words])

  const goToWordId = useCallback((): void => {
    if (words === null) {
      return
    }

    const rawWordId = prompt('Enter the id')
    if (rawWordId === null) {
      return
    }

    const wordId = parseInt(rawWordId)
    if (isNaN(wordId)) {
      alert('Invalid number')
      return
    }

    const wordIndex = words.findIndex(word => word.id === wordId)
    if (wordIndex === -1) {
      alert(`Word not found: id=${wordId}`)
      return
    }

    setPosition(wordIndex)
  }, [words])

  const handleKeyPress = useCallback((key: Key): void => {
    switch (key) {
      case 'ArrowLeft': {
        incrementPosition()
        break
      }
      case 'ArrowRight': {
        decrementPosition()
        break
      }
      case 'g': {
        goToWordId()
        break
      }
    }
  }, [incrementPosition, decrementPosition, goToWordId])

  useKeyPressListener(handleKeyPress)

  if (!word) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <div>{word.id}</div>
      <div>{word.name}</div>
    </div>
  )
}

export default Words
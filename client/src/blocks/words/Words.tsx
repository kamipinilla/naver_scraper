import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Word } from '../../../../server/types'
import { getWords } from '../../api/words'
import useKeyPressListener from '../../hooks/useKeyPressListener'
import { Key } from '../../types'
import { join } from 'path'
import { getUserPosition, setUserPosition } from '../../api/userPosition'

const Words: React.FC = () => {
  const [position, setPosition] = useState<number | null>(null)
  const [words, setWords] = useState<Word[] | null>(null)
  useEffect(function loadWords() {
    getWords().then(setWords)
  }, [])
  const word = (words !== null && position !== null) ? words[position] : null

  useEffect(function setInitialPosition() {
    if (words !== null) {
      getUserPosition().then(setPosition)
    }
  }, [words])

  useEffect(function cachePosition() {
    if (position !== null) {
      setUserPosition(position)
    }
  }, [position])

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

  const jumpToWordId = useCallback((): void => {
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

  const navigate = useNavigate()
  const location = useLocation()
  
  const navigateToWord = useCallback((): void => {
    if (words !== null && position !== null) {
      const wordId = words[position].id
      navigate(join(location.pathname, wordId.toString()))
    }
  }, [words, position, location, navigate])

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
      case 'Enter': {
        navigateToWord()
        break
      }
      case 'g': {
        jumpToWordId()
        break
      }
    }
  }, [incrementPosition, decrementPosition, jumpToWordId, navigateToWord])

  useKeyPressListener(handleKeyPress)

  if (!word) {
    return null
  }

  return (
    <div className="flex-col text-center space-y-2 text-6xl pt-12 w-full">
      <div>{word.id}</div>
      <div>{word.name}</div>
    </div>
  )
}

export default Words
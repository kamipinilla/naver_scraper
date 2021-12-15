import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { NewSentPair } from '../../../../server/db/types'
import { SentPair, Word, WordId } from '../../../../server/types'
import { getHtmlContent } from '../../api/htmlUpdates'
import { deleteSentPair } from '../../api/sentPairs'
import { addSentPair, getSentPairs, getWord } from '../../api/words'
import useKeyPressListener from '../../hooks/useKeyPressListener'
import useNumberParam from '../../hooks/useNumberParam'
import { extractNaverExamples, getNaverUrl } from '../../scraper'
import { Key, NaverExample } from '../../types'
import H from '../../widgets/H'
import SelectedSentPair from './SelectedSentPair'

function shortenOrigin(origin: string): string {
  if (origin === "Oxford Advanced Learner's English-Korean Dictionary") {
    return 'Oxford Dictionary'
  }
  if (origin.includes('User translation')) {
    return 'User Translation'
  }

  return origin
}

function sentPairEqualsNaverExample(sentPair: SentPair, naverExample: NaverExample): boolean {
  const naverTargetSent = naverExample.targetSent
  const naverSourceSent = naverExample.sourceSent

  const originalTargetSent = sentPair.origTargetSent ?? sentPair.targetSent
  const originalSourceSent = sentPair.origSourceSent ?? sentPair.sourceSent
  return originalTargetSent === naverTargetSent && originalSourceSent === naverSourceSent
}

const WordComponent: React.FC = () => {
  const wordId: WordId = useNumberParam('wordId')
  const navigate = useNavigate()
  
  const [word, setWord] = useState<Word | null>(null)
  useEffect(function loadWord() {
    getWord(wordId).then(setWord)
  }, [wordId])

  const [selectedSentPairs, setSelectedSentPairs] = useState<SentPair[] | null>(null)
  const fetchSelectedSentPairs = useCallback((): void => {
    getSentPairs(wordId).then(setSelectedSentPairs)
  }, [wordId])
  useEffect(fetchSelectedSentPairs, [fetchSelectedSentPairs])

  const [naverExamples, setNaverExamples] = useState<NaverExample[] | null>(null)
  const [page, setPage] = useState<number | null>(null)
  const [isScraping, setIsScraping] = useState<boolean>(false)
  const [position, setPosition] = useState<number | null>(null)

  const [isEditing, setIsEditing] = useState<boolean>(false)

  const scrapeNaver = useCallback((): void => {
    if (word !== null) {
      setIsScraping(true)
      const nextPage = page !== null ? (page + 1) : 1
      const naverUrl = getNaverUrl(word.name, nextPage)
      window.open(naverUrl)
    }
  }, [word, page])

  useEffect(function checkIfScrapeAutomatically() {
    if (selectedSentPairs !== null && selectedSentPairs.length === 0 && naverExamples === null) {
      scrapeNaver()
    }
  }, [selectedSentPairs, naverExamples, scrapeNaver])

  const fetchNaverExamples = useCallback(() => {
    getHtmlContent().then(content => {
      const fetchedNaverExamples = extractNaverExamples(content)
      if (naverExamples === null) {
        setNaverExamples(fetchedNaverExamples)
        setPage(1)
        setPosition(0)
      } else {
        const totalNaverExamples = naverExamples.concat(fetchedNaverExamples)
        setNaverExamples(totalNaverExamples)
        setPage(page! + 1)
        setPosition(position! + 1)
      }
    })
  }, [naverExamples, page, position])

  const onVisibilityChange = useCallback(() => {
    if (!document.hidden && isScraping) {
      setIsScraping(false)
      fetchNaverExamples()
    }
  }, [isScraping, fetchNaverExamples])

  useEffect(function addVisibilityChangeListener() {
    const visibilityChangeEvent = 'visibilitychange'
    document.addEventListener(visibilityChangeEvent, onVisibilityChange)
    return () => {
      document.removeEventListener(visibilityChangeEvent, onVisibilityChange)
    }
  }, [onVisibilityChange])

  const naverExampleAlreadySelected = useCallback((naverExample: NaverExample): boolean => {
    if (!selectedSentPairs) {
      throw Error("Can't add naver example without loaded selected sent pairs")
    }

    const alreadySelected = selectedSentPairs.some(sentPair => sentPairEqualsNaverExample(sentPair, naverExample))

    return alreadySelected
  }, [selectedSentPairs])

  const getNotSelectedNaverList = useCallback(() => {
    return naverExamples !== null ? naverExamples.filter(naverExample => {
      return !naverExampleAlreadySelected(naverExample)
    }) : null
  }, [naverExamples, naverExampleAlreadySelected])

  const addCurrentExampleToSelected = useCallback((): void => {
    const notSelectedNaverList = getNotSelectedNaverList()
    if (notSelectedNaverList === null) throw Error()

    const naverExample = notSelectedNaverList[position!]
    const shouldDecreasePosition = position === notSelectedNaverList.length - 1

    const newSentPair: NewSentPair = {
      targetSent: naverExample.targetSent,
      sourceSent: naverExample.sourceSent,
    }

    addSentPair(wordId, newSentPair).then(() => {
      fetchSelectedSentPairs()
      if (shouldDecreasePosition) {
        setPosition(position - 1)
      }
    })
  }, [wordId, fetchSelectedSentPairs, getNotSelectedNaverList, position])

  const handleRemoveSentPair = useCallback((sentPair: SentPair): void => {
    let shouldIncreasePosition = false
    if (naverExamples !== null) {
      const naverExamplesReAddPosition = naverExamples!.findIndex(naverExample => sentPairEqualsNaverExample(sentPair, naverExample))
      shouldIncreasePosition = naverExamplesReAddPosition <= position!
    }
    deleteSentPair(sentPair.id).then(() => {
      fetchSelectedSentPairs()
      if (shouldIncreasePosition) {
        setPosition(position! + 1)
      }
    })
  }, [fetchSelectedSentPairs, naverExamples, position])

const decrementPosition = useCallback((): void => {
  if (position !== null && position !== 0) {
    setPosition(position - 1)
  }
}, [position])

const incrementPosition = useCallback((): void => {
  const notSelectedNaverList = getNotSelectedNaverList()
  if (notSelectedNaverList !== null && position !== null) {
    if (position !== notSelectedNaverList.length - 1) {
      setPosition(position + 1)
    } else {
      scrapeNaver()
    }
  }
}, [position, getNotSelectedNaverList, scrapeNaver])

const goToWords = useCallback((): void => {
  navigate('/words')
}, [navigate])

  const handleKeyPress = useCallback((key: Key): void => {
    if (isEditing) {
      return
    }

    switch (key) {
      case 'ArrowLeft': {
        decrementPosition()
        break
      }
      case 'ArrowRight': {
        incrementPosition()
        break
      }
      case 'Enter': {
        if (naverExamples !== null) {
          addCurrentExampleToSelected()
        } else {
          scrapeNaver()
        }
        break
      }
      case 'Escape': {
        goToWords()
      }
    }
  }, [incrementPosition, decrementPosition, addCurrentExampleToSelected, scrapeNaver, goToWords, naverExamples, isEditing])

  useKeyPressListener(handleKeyPress)

  if (word === null || selectedSentPairs === null) {
    return null
  }

  const notSelectedNaver = getNotSelectedNaverList()

  return (
    <div className="flex-col space-y-10">
      <div className="flex-col space-y-2 text-4xl">
        <div>{word.id}</div>
        <div>{word.name}</div>
      </div>
      {notSelectedNaver !== null && position !== null &&
        <div className="h-48 flex-col">
          <div className="bg-gray-100 p-5 rounded-md flex-col space-y-3">
            <div className="text-3xl">{notSelectedNaver[position].targetSent}</div>
            <div>{notSelectedNaver[position].sourceSent}</div>
            <div>{shortenOrigin(notSelectedNaver[position].origin)}</div>
          </div>
        </div>
      }
      {selectedSentPairs.length !== 0 &&
        <div className="flex-col space-y-3">
          <H size="md">Selected</H>
          <div className="flex-col space-y-3">
            {selectedSentPairs.map(sentPair => {
              return (
                <SelectedSentPair
                  key={sentPair.id}
                  sentPair={sentPair}
                  isEditing={isEditing}
                  onIsEditingChange={setIsEditing}
                  onRemoveSentPair={handleRemoveSentPair}
                  onSentPairUpdated={fetchSelectedSentPairs} />
              )
            })}
          </div>
        </div>
      }
    </div>
  )
}

export default WordComponent
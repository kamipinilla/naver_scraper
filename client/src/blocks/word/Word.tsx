import React, { useCallback, useEffect, useState } from 'react'
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
  switch (origin) {
    case "Oxford Advanced Learner's English-Korean Dictionary": {
      return 'Oxford'
    }
    default: {
      return origin
    }
  }
}

function sentPairEqualsNaverExample(sentPair: SentPair, naverExample: NaverExample): boolean {
  const naverTargetSent = naverExample.sentPair.targetSent
  const naverSourceSent = naverExample.sentPair.sourceSent

  const originalTargetSent = sentPair.origTargetSent ?? sentPair.targetSent
  const originalSourceSent = sentPair.origSourceSent ?? sentPair.sourceSent
  return originalTargetSent === naverTargetSent && originalSourceSent === naverSourceSent
}

const WordComponent: React.FC = () => {
  const wordId: WordId = useNumberParam('wordId')
  
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
      targetSent: naverExample.sentPair.targetSent,
      sourceSent: naverExample.sentPair.sourceSent,
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

  const handleKeyPress = useCallback((key: Key): void => {
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
    }
  }, [incrementPosition, decrementPosition, addCurrentExampleToSelected, scrapeNaver, naverExamples])

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
        <div className="h-32 flex-col bg-gray-100 p-5 rounded-md">
          <div className="flex-col space-y-3">
            <div>{notSelectedNaver[position].sentPair.targetSent}</div>
            <div>{notSelectedNaver[position].sentPair.sourceSent}</div>
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
                  sentPair={sentPair}
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
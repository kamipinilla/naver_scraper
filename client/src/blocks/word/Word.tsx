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

  const scrapeNaver = useCallback((): void => {
    if (word !== null) {
      setIsScraping(true)
      const nextPage = page !== null ? (page + 1) : 1
      const naverUrl = getNaverUrl(word.name, nextPage)
      window.open(naverUrl)
    }
  }, [word, page])

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
    const naverTargetSent = naverExample.sentPair.targetSent
    const naverSourceSent = naverExample.sentPair.sourceSent

    if (!selectedSentPairs) {
      throw Error("Can't add naver example without loaded selected sent pairs")
    }

    const alreadySelected = selectedSentPairs.some(sentPair => {
      return sentPair.targetSent === naverTargetSent && sentPair.sourceSent === naverSourceSent
    })

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

  const removeSentPair = useCallback((sentPair: SentPair): void => {
    let shouldIncreasePosition = false
    if (naverExamples !== null) {
      const naverExamplesReAddPosition = naverExamples!.findIndex(naverExample =>
        naverExample.sentPair.targetSent === sentPair.targetSent && naverExample.sentPair.sourceSent === sentPair.sourceSent
      )
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
        <div className="h-32 flex-col">
          <div className="flex-col space-y-3">
            <div>{notSelectedNaver[position].sentPair.targetSent}</div>
            <div>{notSelectedNaver[position].sentPair.sourceSent}</div>
            <div>{shortenOrigin(notSelectedNaver[position].origin)}</div>
          </div>
        </div>
      }
      <div className="flex-col space-y-3">
        {selectedSentPairs.length !== 0 && <H size="md">Selected</H>}
        <div className="flex-col space-y-3">
          {selectedSentPairs.map(sentPair => {
            return (
              <ul key={sentPair.id} onClick={() => removeSentPair(sentPair)} className="bg-blue-200 cursor-pointer p-2">
                <li>{sentPair.targetSent}</li>
                <li>{sentPair.sourceSent}</li>
              </ul>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default WordComponent
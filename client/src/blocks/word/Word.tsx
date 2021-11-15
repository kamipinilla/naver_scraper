import React, { useCallback, useEffect, useState } from 'react'
import { SentPair, Word, WordId } from '../../../../server/types'
import { getHtmlContent } from '../../api/htmlUpdates'
import { getSentPairs, getWord } from '../../api/words'
import useNumberParam from '../../hooks/useNumberParam'
import { extractNaverExamples, getNaverUrl } from '../../scraper'
import { NaverExample } from '../../types'
import Button from '../../widgets/Button'
import H from '../../widgets/H'

function getNaverExampleKey(naverExample: NaverExample): string {
  return naverExample.sentPair.targetSent + "/" + naverExample.sentPair.sourceSent
}

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
  const loadSelectedSentPairs = useCallback((): void => {
    getSentPairs(wordId).then(setSelectedSentPairs)
  }, [wordId])
  useEffect(loadSelectedSentPairs, [loadSelectedSentPairs])

  const [naverExamples, setNaverExamples] = useState<NaverExample[] | null>(null)
  const [page, setPage] = useState<number | null>(null)
  const [isScraping, setIsScraping] = useState<boolean>(false)

  const fetchNaverExamples = useCallback(() => {
    getHtmlContent().then(content => {
      const fetchedNaverExamples = extractNaverExamples(content)
      if (naverExamples === null) {
        setNaverExamples(fetchedNaverExamples)
        setPage(1)
      } else {
        const totalNaverExamples = naverExamples.concat(fetchedNaverExamples)
        setNaverExamples(totalNaverExamples)
        setPage(page! + 1)
      }
    })
  }, [naverExamples, page])

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

  if (word === null || selectedSentPairs === null) {
    return null
  }

  return (
    <div className="flex-col space-y-10">
      <div className="flex-col space-y-2 text-4xl">
        <div>{word.id}</div>
        <div>{word.name}</div>
      </div>
      <Button onClick={scrapeNaver}>Load Naver</Button>
      <div className="flex-col space-y-3">
        <H size="md">Selected</H>
        <div className="flex-col space-y-3">
          {selectedSentPairs.map(sentPair => {
            return (
              <ul key={sentPair.id}>
                <li>{sentPair.targetSent}</li>
                <li>{sentPair.sourceSent}</li>
              </ul>
            )
          })}
        </div>
      </div>
      <div className="flex-col space-y-3">
        <H size="md">Naver</H>
        <div className="flex-col space-y-3">
          {naverExamples !== null && naverExamples.map(naverExample => {
            return (
              <ul key={getNaverExampleKey(naverExample)}>
                <li>{naverExample.sentPair.targetSent}</li>
                <li>{naverExample.sentPair.sourceSent}</li>
                <li>{shortenOrigin(naverExample.origin)}</li>
              </ul>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default WordComponent
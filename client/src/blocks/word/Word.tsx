import React, { useCallback, useEffect, useState } from 'react'
import { SentPair, Word, WordId } from '../../../../server/types'
import { getHtmlContent } from '../../api/htmlUpdates'
import { getSentPairs, getWord } from '../../api/words'
import useNumberParam from '../../hooks/useNumberParam'
import { extractNaverExamples, getNaverUrl } from '../../scraper'
import { NaverExample } from '../../types'
import Button from '../../widgets/Button'
import H from '../../widgets/H'

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
  console.log(naverExamples)
  const [page, setPage] = useState<number | null>(null)
  const [isScraping, setIsScraping] = useState<boolean>(false)

  const fetchNaverExamples = useCallback(() => {
    getHtmlContent().then(content => {
      const naverExamples = extractNaverExamples(content)
      setNaverExamples(naverExamples)
    })
  }, [])

  const scrapeNaver = useCallback((): void => {
    if (word !== null) {
      setIsScraping(true)
      const naverUrl = getNaverUrl(word.name, page !== null ? page : 1)
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

  const selectedSentPairsListItems = selectedSentPairs.map(sentPair => {
    return (
      <ul key={sentPair.id}>
        <li>{sentPair.targetSent}</li>
        <li>{sentPair.sourceSent}</li>
      </ul>
    )
  })

  return (
    <div className="flex-col space-y-10">
      <div className="flex-col space-y-2 text-4xl">
        <div>{word.id}</div>
        <div>{word.name}</div>
      </div>
      <div>
        <H size="md">Selected</H>
        <div className="flex-col space-y-3">
          {selectedSentPairsListItems}
        </div>
      </div>
      {naverExamples === null && <Button onClick={scrapeNaver}>Load Naver</Button>}
    </div>
  )
}

export default WordComponent
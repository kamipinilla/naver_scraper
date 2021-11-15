import React, { useEffect, useState } from 'react'
import { SentPair, Word, WordId } from '../../../../server/types'
import { getSentPairs, getWord } from '../../api/words'
import useNumberParam from '../../hooks/useNumberParam'
import H from '../../widgets/H'

const WordComponent: React.FC = () => {
  const wordId: WordId = useNumberParam('wordId')
  
  const [word, setWord] = useState<Word | null>(null)
  useEffect(function loadWord() {
    getWord(wordId).then(setWord)
  }, [wordId])

  const [selectedSentPairs, setSelectedSentPairs] = useState<SentPair[] | null>(null)
  useEffect(function loadSelectedSentPairs() {
    getSentPairs(wordId).then(setSelectedSentPairs)
  }, [wordId])

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
    </div>
  )
}

export default WordComponent
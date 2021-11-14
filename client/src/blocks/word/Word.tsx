import React from 'react'
import { WordId } from '../../../../server/types'
import useNumberParam from '../../hooks/useNumberParam'

const wordIdParam = 'wordId'

const Word: React.FC = () => {
  const wordId: WordId = useNumberParam(wordIdParam)

  return (
    <div>{wordId}</div>
  )
}

export default Word
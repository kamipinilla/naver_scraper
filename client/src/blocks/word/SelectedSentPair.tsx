import { useEffect, useState } from 'react'
import { SentPair } from '../../../../server/types'
import Button from '../../widgets/Button'
import EditSelectedSentPair from './EditSelectedSentPair'

interface Props {
  sentPair: SentPair
  onIsEditingChange: (isEditing: boolean) => void
  onRemoveSentPair: (sentPair: SentPair) => void
  onSentPairUpdated: () => void
}

const SelectedSentPair: React.FC<Props> = props => {
  const {
    sentPair,
    onIsEditingChange,
    onRemoveSentPair,
    onSentPairUpdated,
  } = props

  const [isEditing, setIsEditing] = useState<boolean>(false)
  useEffect(function notifyOnIsEditingChange() {
    onIsEditingChange(isEditing)
  }, [onIsEditingChange, isEditing])

  let display
  if (isEditing) {
    display = (
      <EditSelectedSentPair
        sentPair={sentPair}
        onSentPairUpdated={() => { onSentPairUpdated(); setIsEditing(false) }}
        onCancel={() => setIsEditing(false)} />
    )
  } else {
    display = (
      <div className="flex space-x-6">
        <div className="flex-col rounded-md flex-1 cursor-pointer hover:bg-blue-200 bg-blue-100 p-5 space-y-2" onClick={() => onRemoveSentPair(sentPair)}>
          <div className="text-3xl">{sentPair.targetSent}</div>
          <div>{sentPair.sourceSent}</div>
        </div>
        <div className="flex items-center m-2">
          <Button onClick={() => setIsEditing(true)}>Edit</Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      {display}
    </div>
  )
}

export default SelectedSentPair
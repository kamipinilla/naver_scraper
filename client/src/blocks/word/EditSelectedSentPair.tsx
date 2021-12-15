import { useCallback, useState } from 'react'
import { UpdateSentPair } from '../../../../server/db/types'
import { SentPair } from '../../../../server/types'
import { updateSentPair } from '../../api/sentPairs'
import Button from '../../widgets/Button'
import Input from '../../widgets/Input'

interface Props {
  sentPair: SentPair,
  onSentPairUpdated: () => void
  onCancel: () => void,
}

const EditSelectedSentPair: React.FC<Props> = props => {
  const {
    sentPair,
    onSentPairUpdated,
    onCancel,
  } = props

  const [targetSent, setTargetSent] = useState<string>(sentPair.targetSent)
  const [sourceSent, setSourceSent] = useState<string>(sentPair.sourceSent)

  const anyChange = useCallback((): boolean => {
    return targetSent.trim() !== sentPair.targetSent || sourceSent.trim() !== sentPair.sourceSent
  }, [targetSent, sourceSent, sentPair])

  const handleSubmit = useCallback(function (): void {
    if (!anyChange()) throw Error()

    const update: UpdateSentPair = {}
    if (targetSent !== sentPair.targetSent) {
      update.targetSent = targetSent
    }
    if (sourceSent !== sentPair.sourceSent) {
      update.sourceSent = sourceSent
    }

    updateSentPair(sentPair.id, update).then(onSentPairUpdated)
    
  }, [anyChange, targetSent, sourceSent, sentPair, onSentPairUpdated])

  const handleTargetSentChange = useCallback((value: string | null): void => {
    if (value !== null) {
      setTargetSent(value)
    }
  }, [])

  const handleSourceSentChange = useCallback((value: string | null): void => {
    if (value !== null) {
      setSourceSent(value)
    }
  }, [])
  
  return (
    <div className="space-y-3">
      <Input
        value={targetSent}
        onChange={handleTargetSentChange}
        autofocus />
      <Input
        value={sourceSent}
        onChange={handleSourceSentChange} />
      <div className="flex space-x-2">
        {anyChange() && <Button type="dark" onClick={handleSubmit}>Submit</Button>}
        <Button onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  )
}

export default EditSelectedSentPair
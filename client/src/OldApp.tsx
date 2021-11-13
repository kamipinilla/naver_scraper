import { useCallback, useEffect, useState } from "react"
import { getHtmlContent } from "./api/htmlUpdates"
import { extractNaverExamples, getNaverUrl } from './scraper'
import { NaverExample } from "./types"
import Input from "./widgets/Input"

const App: React.FC = () => {
  const [naverExamples, setNaverExamples] = useState<NaverExample[] | null>(null)
  const [isFetching, setIsFetching] = useState<boolean>(false)
  const [searchWord, setSearchWord] = useState<string | null>('사랑')

  const updateNaverExamples = useCallback(() => {
    getHtmlContent().then(content => {
      const naverExamples = extractNaverExamples(content)
      setNaverExamples(naverExamples)
    })
  }, [])

  const onVisibilityChange = useCallback(() => {
    if (!document.hidden && isFetching) {
      updateNaverExamples()
      setIsFetching(false)
    }
  }, [isFetching, updateNaverExamples])

  useEffect(function addVisibilityChangeListener() {
    const visibilityChangeEvent = 'visibilitychange'
    document.addEventListener(visibilityChangeEvent, onVisibilityChange)
    return () => {
      document.removeEventListener(visibilityChangeEvent, onVisibilityChange)
    }
  }, [onVisibilityChange])
  
  const fetchHtml = useCallback(() => {
    if (searchWord) {
      setIsFetching(true)
      const page = 1
      const naverUrl = getNaverUrl(searchWord, page)
      window.open(naverUrl)
    }
  }, [searchWord])

  return (
    <div className="flex flex-col p-24 items-center space-y-12">
      <div>
        {/* <Input
          value={searchWord}
          onValueChange={setSearchWord}
          onSubmit={fetchHtml}
          autofocus /> */}
      </div>
      {naverExamples && 
        <div className="flex flex-col space-y-6">
          {naverExamples.map(naverExample => (
            <div key={naverExample.sentPair.sourceSent} className="flex flex-col space-y-2">
              <div>{naverExample.sentPair.targetSent}</div>
              <div>{naverExample.sentPair.sourceSent}</div>
              <div>{naverExample.origin}</div>
            </div>
          ))}
        </div>
      }
    </div>
  )
}

export default App
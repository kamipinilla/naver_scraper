import { useCallback, useEffect, useState } from "react"
import { getHtmlContent } from "./api/htmlUpdates"
import { NaverExample } from "./types"
import Input from "./widgets/Input"

function extractTargetSent(targetSection: Element): string {
  const targetSpan = targetSection.children[0]
  const targetTextRaw = (targetSpan as HTMLElement).innerText
  const targetText = targetTextRaw.trim()
  return targetText
}

function extractSourceSent(sourceSection: Element): string {
  const sourceP = sourceSection.children[0]
  const sourceTextRaw = (sourceP as HTMLElement).innerText
  const sourceSent = sourceTextRaw.trim()
  return sourceSent
}

function extractOrigin(originSection: Element): string {
  const originAnchor = originSection as HTMLElement
  const originRaw = originAnchor.innerText
  const origin = originRaw.trim()
  return origin
}

function rowToNaverExample(row: Element): NaverExample {
  const rowChildren = row.children

  const sourceSection = rowChildren[0]
  const sourceSent = extractSourceSent(sourceSection)
  
  const targetSection = rowChildren[1]
  const targetSent = extractTargetSent(targetSection)

  const originSection = rowChildren[2]
  const origin = extractOrigin(originSection)

  return {
    targetSent,
    sourceSent,
    origin,
  }
}

function extractNaverExamples(content: string): NaverExample[] {
  const root = new DOMParser().parseFromString(content, 'text/html')
  const n1 = root.getElementById('searchPage_example')
  const n2 = n1!.children[2]
  const rows = n2.children
  const naverExamples: NaverExample[] = []
  for (let i = 0; i < rows.length - 1; i++) {
    const row = rows[i]
    const naverExample = rowToNaverExample(row)
    naverExamples.push(naverExample)
  }

  return naverExamples
}

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
      window.open(`https://en.dict.naver.com/#/search?range=example&page=${page}&query=${searchWord}&shouldSearchVlive=false&haveTrans=exist:1`)
    }
  }, [searchWord])

  return (
    <div className="flex flex-col p-24 items-center space-y-12">
      <div>
        <Input
          value={searchWord}
          onValueChange={setSearchWord}
          onSubmit={fetchHtml}
          autofocus />
      </div>
      {naverExamples && 
        <div className="flex flex-col space-y-6">
          {naverExamples.map(naverExample => (
            <div key={naverExample.sourceSent} className="flex flex-col space-y-2">
              <div>{naverExample.targetSent}</div>
              <div>{naverExample.sourceSent}</div>
              <div>{naverExample.origin}</div>
            </div>
          ))}
        </div>
      }
    </div>
  )
}

export default App
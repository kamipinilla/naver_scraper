import { NaverExample } from './types'

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
    sourceSent,
    targetSent,
    origin,
  }
}

export function extractNaverExamples(content: string): NaverExample[] {
  const root = new DOMParser().parseFromString(content, 'text/html')
  const initialNodeId = 'searchPage_example'
  const n1 = root.getElementById(initialNodeId)
  if (!n1) {
    throw Error(`Initial node not found in HTML: ${initialNodeId}`)
  }
  const n2 = n1.children[2]
  const rows = n2.children
  const naverExamples: NaverExample[] = []
  for (let i = 0; i < rows.length - 1; i++) {
    const row = rows[i]
    const naverExample = rowToNaverExample(row)
    naverExamples.push(naverExample)
  }

  return naverExamples
}

export function getNaverUrl(searchWord: string, page: number = 1) {
  return `https://en.dict.naver.com/#/search?range=example&page=${page}&query=${searchWord}&shouldSearchVlive=false&haveTrans=exist:1`
}
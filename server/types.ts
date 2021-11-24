export interface HtmlUpdate {
  content: string
}

export type SentPairId = number
export interface SentPair {
  id: SentPairId
  targetSent: string
  sourceSent: string

  origTargetSent: string | null
  origSourceSent: string | null
}

export type WordId = number
export interface Word {
  id: WordId
  name: string
}
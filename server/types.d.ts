import { Document } from 'mongoose'

export interface HtmlUpdate {
  content: string
}

export interface HtmlUpdateDb extends HtmlUpdate, Document {}

export interface RestError {
  err: string
}

export interface SentPair {
  targetSent: string
  sourceSent: string
}

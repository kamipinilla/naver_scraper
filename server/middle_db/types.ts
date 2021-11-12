import { Document } from 'mongoose'
import { HtmlUpdate } from '../types'


export interface HtmlUpdateDb extends HtmlUpdate, Document {}

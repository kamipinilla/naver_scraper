import { Schema } from 'mongoose'

export const HtmlUpdateSchema = new Schema({
  content: { type: String, required: true }
})
import express from 'express'
import env from 'dotenv'
import mongoose from 'mongoose'
import api from './routes/api'

env.config()

const app = express()

app.use(express.json())
app.use('/api', api)

app.get('*', (req, res) => {
    const errorMsg = 'Invalid API URL: ' + req.url
    res.status(404).json({ err: errorMsg })
})

const port = process.env.PORT || 5000
app.listen(port)

console.log(`Listening on ${port}`)

async function startMongo() {
  const uri = process.env.DATABASE_URL
  if (!uri) {
    throw Error('No env variable found for mongo uri')
  }
  
  await mongoose.connect(uri);
  console.log('Connected to Mongo')
}

startMongo().catch(console.error)
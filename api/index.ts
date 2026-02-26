import express from 'express'
import cors from 'cors'
import connectDB from '../src/api/config/db.config'
import routes from '../src/api/routes'

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api', routes)

app.use(
  (
    err: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error('Error:', err)
    res.status(err.status || 500).json({
      success: false,
      message: err.message || '服务器错误',
      code: err.code || 'INTERNAL_ERROR',
    })
  }
)

let isConnected = false

const connectToDatabase = async () => {
  if (isConnected) return
  await connectDB()
  isConnected = true
}

export default async (req: express.Request, res: express.Response) => {
  await connectToDatabase()
  return app(req, res)
}

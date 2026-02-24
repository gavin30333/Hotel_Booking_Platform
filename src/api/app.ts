import express from 'express'
import cors from 'cors'
import connectDB from './config/db.config'
import routes from './routes'

const app = express()
const PORT = process.env.PORT || 3000

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

const startServer = async () => {
  try {
    await connectDB()
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
      console.log(`API endpoints:`)
      console.log(`  - GET  /api/health`)
      console.log(`  - GET  /api/public/home`)
      console.log(`  - GET  /api/public/hotels`)
      console.log(`  - GET  /api/public/hotels/:id`)
      console.log(`  - GET  /api/public/hotels/suggest`)
      console.log(`  - POST /api/user/auth/send-code`)
      console.log(`  - POST /api/user/auth/login`)
      console.log(`  - GET  /api/user/profile`)
      console.log(`  - PUT  /api/user/profile`)
      console.log(`  - POST /api/user/favorites`)
      console.log(`  - GET  /api/user/favorites`)
      console.log(`  - POST /api/user/orders`)
      console.log(`  - GET  /api/user/orders`)
      console.log(`  - GET  /api/user/orders/:id`)
      console.log(`  - PUT  /api/user/orders/:id/cancel`)
      console.log(`  - POST /api/user/orders/:id/pay`)
      console.log(`  - POST /api/user/orders/:id/review`)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

startServer()

export default app

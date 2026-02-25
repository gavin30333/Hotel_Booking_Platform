import mongoose from 'mongoose'

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/hotel_management'

let cachedConnection: typeof mongoose | null = null

const connectDB = async () => {
  if (cachedConnection && cachedConnection.connection.readyState === 1) {
    return cachedConnection
  }

  try {
    cachedConnection = await mongoose.connect(MONGODB_URI)
    console.log('MongoDB connected successfully')
    return cachedConnection
  } catch (error) {
    console.error('MongoDB connection error:', error)
    throw error
  }
}

export default connectDB

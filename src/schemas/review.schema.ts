import { Schema, Document, Model, model, Types } from 'mongoose'

export interface IReview extends Document {
  order: Types.ObjectId
  customer: Types.ObjectId
  hotel: Types.ObjectId
  rating: number
  content: string
  images?: string[]
  reply?: string
  createdAt: Date
  updatedAt: Date
}

const ReviewSchema = new Schema<IReview>(
  {
    order: { type: Schema.Types.ObjectId, ref: 'Order', required: true, unique: true },
    customer: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    hotel: { type: Schema.Types.ObjectId, ref: 'Hotel', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    content: { type: String, required: true },
    images: [{ type: String }],
    reply: { type: String },
  },
  {
    timestamps: true,
    collection: 'reviews',
  }
)

ReviewSchema.index({ order: 1 }, { unique: true, name: 'review_order_idx' })
ReviewSchema.index({ hotel: 1, createdAt: -1 }, { name: 'review_hotel_idx' })
ReviewSchema.index({ customer: 1 }, { name: 'review_customer_idx' })

export const ReviewModel: Model<IReview> = model<IReview>('Review', ReviewSchema)

export default ReviewSchema

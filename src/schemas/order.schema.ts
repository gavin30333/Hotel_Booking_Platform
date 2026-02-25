import { Schema, Document, Model, model, Types } from 'mongoose'

export interface IGuest {
  name: string
  phone: string
  idCard?: string
}

export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'confirmed'
  | 'checked_in'
  | 'completed'
  | 'cancelled'

export interface IOrder extends Document {
  orderNo: string
  customer: Types.ObjectId | string
  hotel: Types.ObjectId
  hotelName: string
  hotelAddress: string
  roomTypeId: string
  roomTypeName: string
  roomPrice: number
  checkIn: Date
  checkOut: Date
  nights: number
  guests: IGuest[]
  totalPrice: number
  discountAmount: number
  finalPrice: number
  status: OrderStatus
  remark?: string
  paidAt?: Date
  cancelledAt?: Date
  createdAt: Date
  updatedAt: Date
}

const GuestSchema = new Schema<IGuest>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    idCard: { type: String, required: false, default: '' },
  },
  { _id: false }
)

const OrderSchema = new Schema<IOrder>(
  {
    orderNo: { type: String, required: true, unique: true },
    customer: { type: Schema.Types.Mixed, required: true },
    hotel: { type: Schema.Types.ObjectId, ref: 'Hotel', required: true },
    hotelName: { type: String, required: true },
    hotelAddress: { type: String, required: true },
    roomTypeId: { type: String, required: true },
    roomTypeName: { type: String, required: true },
    roomPrice: { type: Number, required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    nights: { type: Number, required: true },
    guests: [GuestSchema],
    totalPrice: { type: Number, required: true },
    discountAmount: { type: Number, default: 0 },
    finalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: [
        'pending',
        'paid',
        'confirmed',
        'checked_in',
        'completed',
        'cancelled',
      ],
      default: 'pending',
      required: true,
    },
    remark: { type: String },
    paidAt: { type: Date },
    cancelledAt: { type: Date },
  },
  {
    timestamps: true,
    collection: 'orders',
  }
)

OrderSchema.index({ orderNo: 1 }, { unique: true, name: 'order_no_idx' })
OrderSchema.index(
  { customer: 1, createdAt: -1 },
  { name: 'customer_created_idx' }
)
OrderSchema.index({ hotel: 1 }, { name: 'order_hotel_idx' })
OrderSchema.index({ status: 1 }, { name: 'order_status_idx' })

export const OrderModel: Model<IOrder> = model<IOrder>('Order', OrderSchema)

export default OrderSchema

import { Schema, Document, Types, Model, model } from 'mongoose'

export interface IRoomDiscount {
  type: string
  value: number
  description: string
}

export interface IRoomType extends Document {
  hotelId: Types.ObjectId
  roomTypeName: string
  area: number
  bedType: string
  maxPeople: number
  originalPrice: number
  currentPrice: number
  breakfast: string
  cancelPolicy: string
  stock: number
  roomDiscount?: IRoomDiscount
  createTime: Date
  updateTime: Date
}

const RoomTypeSchema = new Schema<IRoomType>(
  {
    hotelId: { type: Schema.Types.ObjectId, ref: 'Hotel', required: true },
    roomTypeName: { type: String, required: true },
    area: { type: Number, required: true },
    bedType: {
      type: String,
      enum: [
        '单人床',
        '双人床',
        '大床',
        '榻榻米',
        '高低床',
        '大床+单人床',
        '大床+榻榻米',
      ],
      required: true,
    },
    maxPeople: { type: Number, required: true, min: 1, max: 4 },
    originalPrice: { type: Number, required: true },
    currentPrice: { type: Number, required: true },
    breakfast: {
      type: String,
      enum: ['无早餐', '单早', '双早', '自助早'],
      required: true,
    },
    cancelPolicy: {
      type: String,
      enum: ['免费取消', '限时取消', '不可取消'],
      required: true,
    },
    stock: { type: Number, required: true, min: 0 },
    roomDiscount: {
      type: {
        type: String,
        enum: ['stay_discount', 'advance_book', 'member_discount'],
        required: false,
      },
      value: { type: Number, required: false },
      description: { type: String, required: false },
    },
    createTime: { type: Date, default: Date.now, required: true },
    updateTime: { type: Date, default: Date.now, required: true },
  },
  {
    timestamps: { updatedAt: 'updateTime', createdAt: 'createTime' },
    collection: 'roomTypes',
  }
)

RoomTypeSchema.index(
  { hotelId: 1 },
  {
    name: 'hotel_id_idx',
  }
)

RoomTypeSchema.index(
  { currentPrice: 1 },
  {
    name: 'current_price_idx',
  }
)

RoomTypeSchema.index(
  { hotelId: 1, stock: 1 },
  {
    name: 'hotel_stock_idx',
  }
)

RoomTypeSchema.index(
  { cancelPolicy: 1 },
  {
    name: 'cancel_policy_idx',
  }
)

RoomTypeSchema.index(
  { hotelId: 1, currentPrice: 1 },
  {
    name: 'hotel_price_idx',
  }
)

RoomTypeSchema.index(
  { maxPeople: 1 },
  {
    name: 'max_people_idx',
  }
)

export const RoomTypeModel: Model<IRoomType> = model<IRoomType>(
  'RoomType',
  RoomTypeSchema
)

export default RoomTypeSchema

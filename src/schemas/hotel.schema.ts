import { Schema, Document, Model, model } from 'mongoose'

export interface IRoomType {
  _id?: string
  name: string
  nameEn?: string
  price: number
  originalPrice?: number
  area?: number
  bedType?: string
  maxOccupancy?: number
  breakfast?: boolean
  description?: string
  facilities?: string[]
  stock?: number
  images?: string[]
}

export interface INearbyAttraction {
  name: string
  distance?: string
  description?: string
}

export interface ITransportation {
  type: 'subway' | 'bus' | 'airport' | 'highspeed' | 'train' | 'other'
  name: string
  distance?: string
  description?: string
}

export interface IShoppingMall {
  name: string
  distance?: string
  description?: string
}

export interface IDiscount {
  _id?: string
  name: string
  type: 'percentage' | 'fixed' | 'special'
  value: number
  startDate?: string
  endDate?: string
  description?: string
  conditions?: string
}

export interface IPolicies {
  checkIn?: string
  checkOut?: string
  cancellation?: string
  extraBed?: string
  pets?: string
}

export interface IHotel extends Document {
  name: string
  nameEn?: string
  address: string
  starRating: 1 | 2 | 3 | 4 | 5
  phone: string
  description: string
  images: string[]
  status: 'draft' | 'pending' | 'online' | 'offline'
  auditStatus?: 'passed' | 'rejected'
  roomTypes: IRoomType[]
  openingDate?: string
  nearbyAttractions: INearbyAttraction[]
  transportations: ITransportation[]
  shoppingMalls: IShoppingMall[]
  discounts: IDiscount[]
  facilities: string[]
  policies: IPolicies
  creator?: string
  viewCount: number
  orderCount: number
  rating: number
  reviewCount: number
  createdAt: Date
  updatedAt: Date
}

const RoomTypeSchema = new Schema<IRoomType>(
  {
    name: { type: String, required: true },
    nameEn: { type: String },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    area: { type: Number },
    bedType: { type: String },
    maxOccupancy: { type: Number },
    breakfast: { type: Boolean, default: false },
    description: { type: String },
    facilities: [{ type: String }],
    stock: { type: Number, default: 10 },
    images: [{ type: String }],
  },
  { _id: true }
)

const NearbyAttractionSchema = new Schema<INearbyAttraction>(
  {
    name: { type: String, required: true },
    distance: { type: String },
    description: { type: String },
  },
  { _id: false }
)

const TransportationSchema = new Schema<ITransportation>(
  {
    type: {
      type: String,
      enum: ['subway', 'bus', 'airport', 'highspeed', 'train', 'other'],
      required: true,
    },
    name: { type: String, required: true },
    distance: { type: String },
    description: { type: String },
  },
  { _id: false }
)

const ShoppingMallSchema = new Schema<IShoppingMall>(
  {
    name: { type: String, required: true },
    distance: { type: String },
    description: { type: String },
  },
  { _id: false }
)

const DiscountSchema = new Schema<IDiscount>(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ['percentage', 'fixed', 'special'],
      required: true,
    },
    value: { type: Number, required: true },
    startDate: { type: String },
    endDate: { type: String },
    description: { type: String },
    conditions: { type: String },
  },
  { _id: true }
)

const PoliciesSchema = new Schema<IPolicies>(
  {
    checkIn: { type: String },
    checkOut: { type: String },
    cancellation: { type: String },
    extraBed: { type: String },
    pets: { type: String },
  },
  { _id: false }
)

const HotelSchema = new Schema<IHotel>(
  {
    name: { type: String, required: true },
    nameEn: { type: String },
    address: { type: String, required: true },
    starRating: { type: Number, required: true, min: 1, max: 5 },
    phone: { type: String, required: true },
    description: { type: String, required: true },
    images: [{ type: String }],
    status: {
      type: String,
      enum: ['draft', 'pending', 'online', 'offline'],
      default: 'online',
      required: true,
    },
    auditStatus: { type: String, enum: ['passed', 'rejected'] },
    roomTypes: [RoomTypeSchema],
    openingDate: { type: String },
    nearbyAttractions: [NearbyAttractionSchema],
    transportations: [TransportationSchema],
    shoppingMalls: [ShoppingMallSchema],
    discounts: [DiscountSchema],
    facilities: [{ type: String }],
    policies: PoliciesSchema,
    creator: { type: String },
    viewCount: { type: Number, default: 0, min: 0 },
    orderCount: { type: Number, default: 0, min: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0, min: 0 },
  },
  {
    timestamps: true,
    collection: 'hotels',
  }
)

HotelSchema.index({ name: 'text', address: 'text' }, { name: 'hotel_text_idx' })
HotelSchema.index({ status: 1 })
HotelSchema.index({ starRating: 1 })

export const HotelModel: Model<IHotel> = model<IHotel>('Hotel', HotelSchema)

export default HotelSchema

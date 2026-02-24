import { Schema, Document, Model, model } from 'mongoose'

export interface IHotSearchItem {
  hotelId?: string
  name: string
  rank: number
  score?: string
  price?: number
  description?: string
  imageUrl?: string
  tags?: string[]
}

export interface IRankingList {
  title: string
  type: 'luxury' | 'family' | 'business' | 'romantic' | 'budget' | 'custom'
  items: IHotSearchItem[]
}

export interface ICityHotSearch extends Document {
  city: string
  cityCode?: string
  hotTags: string[]
  rankingLists: IRankingList[]
  isActive: boolean
  priority: number
  updatedAt: Date
  createdAt: Date
}

const HotSearchItemSchema = new Schema<IHotSearchItem>(
  {
    hotelId: { type: Schema.Types.ObjectId, ref: 'Hotel' },
    name: { type: String, required: true },
    rank: { type: Number, required: true },
    score: { type: String },
    price: { type: Number },
    description: { type: String },
    imageUrl: { type: String },
    tags: [{ type: String }],
  },
  { _id: false }
)

const RankingListSchema = new Schema<IRankingList>(
  {
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ['luxury', 'family', 'business', 'romantic', 'budget', 'custom'],
      default: 'custom',
    },
    items: [HotSearchItemSchema],
  },
  { _id: true }
)

const CityHotSearchSchema = new Schema<ICityHotSearch>(
  {
    city: { type: String, required: true, unique: true, index: true },
    cityCode: { type: String },
    hotTags: [{ type: String }],
    rankingLists: [RankingListSchema],
    isActive: { type: Boolean, default: true },
    priority: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    collection: 'cityhotsearchs',
  }
)

CityHotSearchSchema.index({ city: 1, isActive: 1 })
CityHotSearchSchema.index({ priority: -1 })

export const CityHotSearchModel: Model<ICityHotSearch> = model<ICityHotSearch>(
  'CityHotSearch',
  CityHotSearchSchema
)

export default CityHotSearchSchema

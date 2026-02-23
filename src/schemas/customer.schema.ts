import { Schema, Document, Model, model, Types } from 'mongoose'

export interface ICustomer extends Document {
  phone: string
  nickname?: string
  avatar?: string
  favorites: Types.ObjectId[]
  createdAt: Date
  updatedAt: Date
}

const CustomerSchema = new Schema<ICustomer>(
  {
    phone: { type: String, required: true, unique: true },
    nickname: { type: String, default: '' },
    avatar: { type: String, default: '' },
    favorites: [{ type: Schema.Types.ObjectId, ref: 'Hotel', default: [] }],
  },
  {
    timestamps: true,
    collection: 'customers',
  }
)

CustomerSchema.index({ phone: 1 }, { unique: true, name: 'customer_phone_idx' })

export const CustomerModel: Model<ICustomer> = model<ICustomer>(
  'Customer',
  CustomerSchema
)

export default CustomerSchema

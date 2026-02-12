import { Schema, Document, Model, model } from 'mongoose';

export interface IDiscountInfo {
  type: string; //优惠类型
  value: number;//优惠值
  startTime: Date;
  endTime: Date;
  description: string;
}

export interface IHotel extends Document {
  hotelNameCn: string;
  hotelNameEn: string;
  hotelAddress: string;
  hotelScale: number;
  openTime: Date;
  star: number;
  score: number;
  tags: string[];
  nearbyAttractions?: string[];
  trafficAndMalls?: string[];
  discountInfo?: IDiscountInfo[];
  city: string;
  cityLevel: string;
  status: string;
  createTime: Date;
  updateTime: Date;
}

const HotelSchema = new Schema<IHotel>({
  hotelNameCn: { type: String, required: true },
  hotelNameEn: { type: String, required: true },
  hotelAddress: { type: String, required: true },
  hotelScale: { type: Number, required: true },
  openTime: { type: Date, required: true },
  star: { type: Number, required: true, min: 1, max: 5 },
  score: { type: Number, required: true, min: 4.0, max: 5.0, default: 4.5 },
  tags: { type: [String], required: true, default: [] },
  nearbyAttractions: { type: [String], default: [] },
  trafficAndMalls: { type: [String], default: [] },
  discountInfo: [{
    type: { type: String, enum: ['direct_reduce', 'member_discount', 'stay_discount', 'advance_book'], required: true },
    value: { type: Number, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    description: { type: String, required: true }
  }],
  city: { type: String, required: true },
  cityLevel: { type: String, enum: ['一线', '新一线', '二线', '三线'], required: true },
  status: { type: String, enum: ['online', 'offline', 'review'], default: 'online', required: true },
  createTime: { type: Date, default: Date.now, required: true },
  updateTime: { type: Date, default: Date.now, required: true }
}, {
  timestamps: { updatedAt: 'updateTime', createdAt: 'createTime' },
  collection: 'hotels'
});

HotelSchema.index({ hotelNameCn: 'text', hotelAddress: 'text' }, {
  name: 'hotel_text_search_idx',
  weights: { hotelNameCn: 10, hotelAddress: 5 }
});

HotelSchema.index({ cityLevel: 1, star: 1 }, {
  name: 'city_level_star_idx'
});

HotelSchema.index({ openTime: 1 }, {
  name: 'open_time_idx'
});

HotelSchema.index({ status: 1, updateTime: -1 }, {
  name: 'status_update_time_idx'
});

HotelSchema.index({ city: 1, star: 1 }, {
  name: 'city_star_idx'
});

HotelSchema.index({ score: -1 }, {
  name: 'score_idx'
});

export const HotelModel: Model<IHotel> = model<IHotel>('Hotel', HotelSchema);

export default HotelSchema;

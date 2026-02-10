import request from "./request";

// 酒店列表请求参数接口
export interface HotelListParams {
  page: number;
  pageSize: number;
  city?: string;
  checkInDate?: string;
  checkOutDate?: string;
  minPrice?: number;
  maxPrice?: number;
  starRating?: number[];
  facilities?: string[];
  sortBy?: "price_asc" | "price_desc" | "rating_desc" | "distance_asc";
}

// 酒店信息接口
export interface Hotel {
  id: string;
  name: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  starRating: number;
  rating: number;
  reviewCount: number;
  minPrice: number;
  imageUrl: string;
  tags: string[];
  facilities: string[];
  description: string;
}

// 酒店列表响应接口
export interface HotelListResponse {
  list: Hotel[];
  total: number;
  page: number;
  pageSize: number;
}

// 获取酒店列表
export const getHotelList = (params: HotelListParams) => {
  return request<HotelListResponse>({
    url: "/api/hotel/list",
    method: "get",
    params,
  });
};

// 获取酒店详情
export const getHotelDetail = (id: string) => {
  return request<Hotel>({
    url: `/api/hotel/${id}`,
    method: "get",
  });
};

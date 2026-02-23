export const getFiltersFromParams = (params: Record<string, string | undefined>) => {
  const {
    city,
    keyword,
    checkInDate,
    checkOutDate,
    rooms,
    adults,
    children,
  } = params

  const newFilters: Record<string, unknown> = {}
  let hasParams = false

  if (city) {
    newFilters.city = decodeURIComponent(city)
    hasParams = true
  }
  if (keyword) {
    newFilters.keyword = decodeURIComponent(keyword)
    hasParams = true
  }
  if (checkInDate) {
    newFilters.checkInDate = decodeURIComponent(checkInDate)
    hasParams = true
  }
  if (checkOutDate) {
    newFilters.checkOutDate = decodeURIComponent(checkOutDate)
    hasParams = true
  }
  if (rooms) {
    newFilters.rooms = Number(rooms)
  }
  if (adults) {
    newFilters.adults = Number(adults)
  }
  if (children) {
    newFilters.children = Number(children)
  }

  return { newFilters, hasParams }
}

export const formatSearchFilters = (params: Record<string, unknown>) => {
  const formattedFilters: Record<string, unknown> = {
    city: params.city as string,
    keyword: params.keyword as string,
    checkInDate: params.checkInDate as string,
    checkOutDate: params.checkOutDate as string,
    minPrice: params.minPrice ?? 0,
    maxPrice: params.maxPrice ?? 10000,
    starRating: (params.starRating as number[]) || [],
    facilities: (params.facilities as string[]) || [],
    rooms: (params.rooms as number) || 1,
    adults: (params.adults as number) || 2,
    children: (params.children as number) || 0,
  }

  if (params.sortBy) {
    formattedFilters.sortBy = params.sortBy
  }

  if (params.location) {
    formattedFilters.location = params.location
  }

  if (params.brand) {
    formattedFilters.brand = params.brand
  }

  if (params.minRating !== undefined) {
    formattedFilters.minRating = params.minRating
  }

  if (params.roomType) {
    formattedFilters.roomType = params.roomType
  }

  return formattedFilters
}

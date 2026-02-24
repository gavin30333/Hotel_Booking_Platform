import React from 'react'
import { HotelGuestSelection } from './HotelGuestSelection'
import { HomestayGuestSelection } from './HomestayGuestSelection'
import { GuestInfo } from '@/types/query.types'

interface Props {
  visible: boolean
  onClose: () => void
  value: GuestInfo
  onChange: (val: GuestInfo) => void
  type?: 'hotel' | 'homestay'
}

export const GuestSelectionPopup: React.FC<Props> = (props) => {
  const { type = 'hotel', ...rest } = props
  if (type === 'homestay') {
    return <HomestayGuestSelection {...rest} />
  }
  return <HotelGuestSelection {...rest} />
}

export { HotelGuestSelection, HomestayGuestSelection }

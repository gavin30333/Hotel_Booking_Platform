import React, { useEffect, useState } from 'react';
import { View, Text } from '@tarojs/components';
import { mockHotelDetail } from './mock/data';
import { HotelDetail } from './types';
import DetailHeader from './components/DetailHeader';
import HotelInfo from './components/HotelInfo';
import DateSelector from './components/DateSelector';
import Facilities from './components/Facilities';
import RoomList from './components/RoomList';
import ReviewPreview from './components/ReviewPreview';
import MapEntry from './components/MapEntry';
import BottomBar from './components/BottomBar';
import './index.less';

const UserDetail: React.FC = () => {
  const [detail, setDetail] = useState<HotelDetail | null>(null);

  useEffect(() => {
    // Simulate fetching data
    setDetail(mockHotelDetail);
  }, []);

  if (!detail) return null;

  const minPrice = detail.roomTypes.length > 0
    ? Math.min(...detail.roomTypes.map(r => r.price))
    : 0;

  return (
    <View className="detail-page">
      <DetailHeader images={detail.images} />
      <HotelInfo name={detail.name} stars="★★★★★" tags={detail.tags} />
      <DateSelector
        checkIn="2月16日"
        checkOut="2月17日"
        nights={1}
        guestInfo="1间 1人 0儿童"
      />
      <MapEntry address={detail.address} distance="距市中心 2.5km" />
      <ReviewPreview
        score={detail.rating}
        reviewCount={detail.reviewCount}
        topReview={detail.reviews?.[0]}
      />
      <Facilities items={detail.facilities} />
      <RoomList rooms={detail.roomTypes} />
      <BottomBar price={minPrice} />
    </View>
  );
};

export default UserDetail;

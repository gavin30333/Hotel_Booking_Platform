import React from 'react';
import { Swiper } from 'antd-mobile';
import { LeftOutline, HeartOutline, SendOutline } from 'antd-mobile-icons';
import Taro from '@tarojs/taro';
import './index.less';

interface DetailHeaderProps {
  images: string[];
}

const DetailHeader: React.FC<DetailHeaderProps> = ({ images }) => {
  const handleBack = () => {
    Taro.navigateBack();
  };

  const items = images.map((image, index) => (
    <Swiper.Item key={index}>
      <img 
        src={image} 
        alt={`detail-${index}`} 
        className="swiper-image" 
        draggable={false} 
      />
    </Swiper.Item>
  ));

  return (
    <div className="detail-header">
      <Swiper loop autoplay>
        {items}
      </Swiper>
      
      <div className="header-overlay">
        <div className="left-action" onClick={handleBack}>
           <LeftOutline fontSize={24} />
        </div>
        <div className="right-actions">
           <HeartOutline fontSize={24} />
           <SendOutline fontSize={24} />
        </div>
      </div>
    </div>
  );
};

export default DetailHeader;

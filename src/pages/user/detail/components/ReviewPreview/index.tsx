import React from 'react';
import { View, Text } from '@tarojs/components';
import { Review } from '../../types';
import './index.less';

interface ReviewPreviewProps {
  score: number;
  reviewCount: number;
  topReview?: Review;
}

const ReviewPreview: React.FC<ReviewPreviewProps> = ({ score, reviewCount, topReview }) => {
  return (
    <View className="review-preview">
      <View className="review-header">
        <View className="header-left">
          <View className="score-badge">
            <Text className="score-text">{score}</Text>
          </View>
          <Text className="rating-text">很好</Text>
        </View>
        <Text className="review-count">{reviewCount}条 &gt;</Text>
      </View>
      {topReview && (
        <View className="review-snippet">
          <Text className="snippet-text">“{topReview.content}”</Text>
        </View>
      )}
    </View>
  );
};

export default ReviewPreview;

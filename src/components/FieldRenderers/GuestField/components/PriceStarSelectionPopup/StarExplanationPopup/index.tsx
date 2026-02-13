import React from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import { Popup } from 'antd-mobile'
import { LeftOutline } from 'antd-mobile-icons'
import './StarExplanationPopup.less'

interface Props {
  visible: boolean
  onClose: () => void
}

export const StarExplanationPopup: React.FC<Props> = ({ visible, onClose }) => {
  return (
    <Popup
      visible={visible}
      onMaskClick={onClose}
      position="right"
      bodyStyle={{ width: '100vw', backgroundColor: '#fff' }}
    >
      <View className="star-explanation-container">
        <View className="header">
          <View className="back-btn" onClick={onClose}>
            <LeftOutline fontSize={24} color="#333" />
          </View>
          <Text className="title">星级/钻级说明</Text>
          <View className="placeholder" />
        </View>

        <ScrollView scrollY className="content">
          <View className="section">
            <View className="section-title-row">
              <Text className="icon star">★</Text>
              <Text className="section-title">酒店星级说明</Text>
            </View>
            <Text className="description">
              “5星级”、“4星级”、“3星级”等为挂牌星级酒店，即通过中国旅游饭店业协会的星级评定并获得相应称号的酒店。
            </Text>

            <View className="item">
              <View className="item-header">
                <Text className="item-title">5星 (豪华型酒店)</Text>
                <Text className="stars">★★★★★</Text>
              </View>
              <Text className="item-desc">
                装修豪华，服务贴心，可提供较多的增值服务
              </Text>
            </View>

            <View className="item">
              <View className="item-header">
                <Text className="item-title">4星 (高档型酒店)</Text>
                <Text className="stars">★★★★</Text>
              </View>
              <Text className="item-desc">
                装修高档，设施齐全，提供全面的优质服务
              </Text>
            </View>

            <View className="item">
              <View className="item-header">
                <Text className="item-title">3星 (舒适型酒店)</Text>
                <Text className="stars">★★★</Text>
              </View>
              <Text className="item-desc">
                装修良好，设施用品齐全，提供良好的服务，酒店提供商务和早餐服务
              </Text>
            </View>

            <View className="item">
              <View className="item-header">
                <Text className="item-title">2星 (经济型酒店)</Text>
                <Text className="stars">★★</Text>
              </View>
              <Text className="item-desc">
                酒店设有公共区域，提供基本设施服务
              </Text>
            </View>

            <View className="item">
              <View className="item-header">
                <Text className="item-title">1星 (平价型酒店)</Text>
                <Text className="stars">★</Text>
              </View>
              <Text className="item-desc">装修简单，提供基本的设施服务</Text>
            </View>
          </View>

          <View className="section">
            <View className="section-title-row">
              <Text className="icon diamond">◆</Text>
              <Text className="section-title">酒店钻级说明</Text>
            </View>
            <Text className="description">
              钻级是由携程基于酒店的综合信息，对酒店进行的整体评估，旨在为用户挑选酒店提供参考，使用“5钻(豪华)”、“4钻(高档)”、“3钻(舒适)”、“2钻(经济)”等进行分类，仅供参考
            </Text>

            <View className="item">
              <View className="item-header">
                <Text className="item-title">5钻 (豪华型酒店)</Text>
                <Text className="diamonds">◆◆◆◆◆</Text>
              </View>
              <Text className="item-desc">
                酒店环境豪华、服务细致、品味精致，可提供较多高品质增值服务等。
              </Text>
            </View>

            <View className="item">
              <View className="item-header">
                <Text className="item-title">4钻 (高档型酒店)</Text>
                <Text className="diamonds">◆◆◆◆</Text>
              </View>
              <Text className="item-desc">
                酒店服务设施完善、环境舒适，部分分店可提供商务服务和休闲活动。
              </Text>
            </View>

            <View className="item">
              <View className="item-header">
                <Text className="item-title">3钻 (舒适型酒店)</Text>
                <Text className="diamonds">◆◆◆</Text>
              </View>
              <Text className="item-desc">
                酒店提供宽敞的客房、齐全的便利设施、多样化的客房服务。
              </Text>
            </View>

            <View className="item">
              <View className="item-header">
                <Text className="item-title">2钻 (经济型酒店)</Text>
                <Text className="diamonds">◆◆</Text>
              </View>
              <Text className="item-desc">
                酒店设施基本完善，客房整洁，价格经济实惠。
              </Text>
            </View>

            <View className="item">
              <View className="item-header">
                <Text className="item-title">1钻 (平价型酒店)</Text>
                <Text className="diamonds">◆</Text>
              </View>
              <Text className="item-desc">
                酒店设备比较简单，只提供最基本的住宿条件
              </Text>
            </View>
          </View>

          <View className="section">
            <View className="section-title-row">
              <Text className="icon premium-diamond">◆</Text>
              <Text className="section-title">酒店金钻/铂钻说明</Text>
            </View>
            <Text className="description">
              由携程严格挑选的豪华酒店，追求奢华体验的首选之一
            </Text>

            <View className="item">
              <View className="item-header">
                <Text className="item-title">铂钻酒店 (超奢品质)</Text>
                <Text className="tag platinum">铂钻</Text>
              </View>
              <Text className="item-desc">
                追求奢华体验，保证您的旅程值回票价
              </Text>
            </View>

            <View className="item">
              <View className="item-header">
                <Text className="item-title">金钻酒店 (奢华体验)</Text>
                <Text className="tag gold">金钻</Text>
              </View>
              <Text className="item-desc">
                傲视同侪！领先同行的高级奢华酒店
              </Text>
            </View>
          </View>

          <View className="section">
            <View className="section-title-row">
              <Text className="icon homestay">●</Text>
              <Text className="section-title">民宿钻级说明</Text>
            </View>
            <Text className="description">
              民宿评价体系是携程对平台上所售卖的民宿、度假屋、旅馆等住宿，基于其掌握的综合信息，进行整体评估的评价体系。与酒店不同，这些住宿通常具有当地特色、个体经营等特点
            </Text>

            <View className="item">
              <View className="item-header">
                <Text className="item-title">5钻 (豪华型民宿)</Text>
                <Text className="circles">●●●●●</Text>
              </View>
              <Text className="item-desc">
                环境豪华，提供高水平的服务、多样化休闲娱乐设施，客房设备完备且品质高档。
              </Text>
            </View>

            <View className="item">
              <View className="item-header">
                <Text className="item-title">4钻 (高档型民宿)</Text>
                <Text className="circles">●●●●</Text>
              </View>
              <Text className="item-desc">
                环境典雅，提供个性化服务，客房设备完善且品质较好。
              </Text>
            </View>

            <View className="item">
              <View className="item-header">
                <Text className="item-title">3钻 (舒适型民宿)</Text>
                <Text className="circles">●●●</Text>
              </View>
              <Text className="item-desc">
                环境温馨、舒适，提供基本服务，客房设备齐全且美观实用。
              </Text>
            </View>

            <View className="item">
              <View className="item-header">
                <Text className="item-title">2钻 (经济型民宿)</Text>
                <Text className="circles">●●</Text>
              </View>
              <Text className="item-desc">
                环境整洁、干净，提供基本的保障设施和生活用品，可能无服务接待人员。
              </Text>
            </View>

            <View className="item">
              <View className="item-header">
                <Text className="item-title">1钻 (平价型民宿)</Text>
                <Text className="circles">●</Text>
              </View>
              <Text className="item-desc">
                装修简单、普通，仅提供最基本的住宿条件，可能无服务接待人员。
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </Popup>
  )
}

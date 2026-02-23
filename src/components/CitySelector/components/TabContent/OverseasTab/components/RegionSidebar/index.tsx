import React from 'react'
import { SideBar } from 'antd-mobile'
import { OverseasCategory } from '@/types/citySelector'
import './RegionSidebar.less'

interface RegionSidebarProps {
  categories: OverseasCategory[]
  activeKey: string
  onChange: (key: string) => void
}

export const RegionSidebar: React.FC<RegionSidebarProps> = ({
  categories,
  activeKey,
  onChange,
}) => {
  return (
    <SideBar
      activeKey={activeKey}
      onChange={onChange}
      className="region-sidebar"
    >
      {categories.map((item) => (
        <SideBar.Item key={item.key} title={item.title} />
      ))}
    </SideBar>
  )
}

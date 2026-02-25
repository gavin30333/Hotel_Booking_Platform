import React from 'react'
import { View } from '@tarojs/components'
import {
  FieldConfig,
  SearchParams,
  LocationData,
  DateRange,
  GuestInfo,
  TabType,
} from '@/types/query.types'
import {
  DateField,
  GuestField,
  LocationField,
  TagField,
} from '@/components/FieldRenderers'
import './FormField.less'

interface FormFieldProps {
  fields: FieldConfig[]
  formData: Partial<SearchParams>
  onUpdate: (key: keyof SearchParams, value: any) => void
  onSearch?: (data: any) => void
  onSceneChange?: (scene: TabType) => void
}

export const FormField: React.FC<FormFieldProps> = ({
  fields,
  formData,
  onUpdate,
  onSearch,
  onSceneChange,
}) => {
  const renderField = (config: FieldConfig) => {
    const value = formData[config.key as keyof SearchParams]

    switch (config.type) {
      case 'location':
        return (
          <LocationField
            key={config.key}
            config={config}
            value={value as LocationData}
            keyword={formData.keyword}
            onChange={(val) => onUpdate(config.key as keyof SearchParams, val)}
            onKeywordChange={(keyword) => onUpdate('keyword', keyword)}
            onSceneChange={onSceneChange}
          />
        )
      case 'date':
        return (
          <DateField
            key={config.key}
            config={config}
            value={value as DateRange}
            onChange={(val) => onUpdate(config.key as keyof SearchParams, val)}
          />
        )
      case 'guest':
        return (
          <GuestField
            key={config.key}
            config={config}
            value={value as GuestInfo}
            onChange={(val) => onUpdate(config.key as keyof SearchParams, val)}
          />
        )
      case 'tags':
        return (
          <TagField
            key={config.key}
            config={config}
            value={formData.keyword}
            onChange={(val) => {
              onUpdate('keyword', val)
              onUpdate('tags', val ? [val] : [])
            }}
            onSearch={(val) => {
              if (onSearch) {
                onSearch({
                  keyword: val,
                  tags: val ? [val] : [],
                })
              }
            }}
          />
        )
      default:
        return null
    }
  }

  return (
    <View className="form-container">
      {fields.map((field) => renderField(field))}
    </View>
  )
}

import React from 'react'
import { View } from '@tarojs/components'
import {
  FieldConfig,
  SearchParams,
  LocationData,
  DateRange,
  GuestInfo,
} from '@/types/query.types'
import {
  LocationField,
  DateField,
  GuestField,
  TagField,
} from '@/components/FieldRenderers'

interface FormFieldsProps {
  fields: FieldConfig[]
  formData: Partial<SearchParams>
  onUpdate: (key: keyof SearchParams, value: any) => void
  onSearch?: (data: any) => void
}

export const FormFields: React.FC<FormFieldsProps> = ({
  fields,
  formData,
  onUpdate,
  onSearch,
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
              // Update both keyword and tags array
              onUpdate('keyword', val)
              // Also update tags array with the single selected tag
              onUpdate('tags', val ? [val] : [])
            }}
            onSearch={(val) => {
              if (onSearch) {
                // Pass the immediate values as overrides to avoid stale state issues
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

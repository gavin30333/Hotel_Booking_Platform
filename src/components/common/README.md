# Common Components

This directory contains reusable UI components shared across the application. Components are organized by category.

## Categories

### `form`
Form-related components used for data input and search queries.
- **CalendarPicker**: Date selection component.
- **FormField**: Core form field renderer (renamed from `FormFields`).
- **SearchButton**: Main search action button.

### `popup`
Modal and popup components for selections and information.
- **GuestSelectionPopup**: Guest and room selection popup.
  - Contains nested `ChildAgeSelectionPopup`, `HotelGuestSelection`, `HomestayGuestSelection`.
- **PolicyPopup**: Displays booking policies.
- **PriceStarSelectionPopup**: Price range and star rating filter.

### `display`
Components for displaying information, cards, and status.
- **CityTag**: Tag component for city selection.
- **HotelCard**: Card component for displaying hotel information.
- **ImageCard**: Card component for displaying images with text.
- **LocationStatus**: Component indicating location status.

## Import Usage

All components should be imported using the `@/components/common/...` alias.

```typescript
import { CalendarPicker } from '@/components/common/form/CalendarPicker'
import { FormField } from '@/components/common/form/FormField'
import { HotelCard } from '@/components/common/display/HotelCard'
```

## Specialized Components (Moved)

Some components previously in `common` have been moved to their specific feature directories:
- `HistorySection` -> `src/components/CitySelector/HistorySection`
- `SearchHeader` -> `src/components/CitySelector/SearchHeader`
- `TabBar` -> `src/components/QueryCard/TabBar`

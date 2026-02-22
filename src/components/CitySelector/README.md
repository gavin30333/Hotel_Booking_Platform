# CitySelector Component

## Overview
The `CitySelector` is a comprehensive city selection component that supports:
- **Domestic Cities**: Grouped by alphabet with an index bar.
- **Overseas Cities**: Grouped by region with a sidebar.
- **Hot Search**: Displays popular cities and ranking lists.
- **History**: Recent search history.
- **Search**: Real-time search functionality.

## Directory Structure

```
src/components/CitySelector/
├── index.tsx                         # Main entry point
├── CitySelector.less                 # Main styles
└── components/
    └── TabContent/                   # Tab implementations
        ├── DomesticTab/              # Domestic cities tab
        ├── OverseasTab/              # Overseas cities tab
        └── HotSearchTab/             # Hot search tab
```

## Dependencies
This component relies on several shared resources moved to the root directory:

### Common Components
- `@/components/common/SearchHeader`: The search bar at the top.
- `@/components/common/LocationStatus`: Displays current location status.
- `@/components/common/HistorySection`: Displays search history.
- `@/components/common/CityTag`: Displays a city as a tag.
- `@/components/common/ImageCard`: Displays a card with an image (used in rankings).

### Data & Constants
- `@/constants/cityData.ts`: Domestic city data.
- `@/constants/overseasData.ts`: Overseas city data.
- `@/constants/hotSearchData.ts`: Hot search and ranking data.

### Types
- `@/types/citySelector.ts`: Type definitions for city data and component props.

## Usage

```tsx
import CitySelector from '@/components/CitySelector';

// Usage in a page
<CitySelector
  visible={isVisible}
  onClose={() => setIsVisible(false)}
  onSelect={(city) => handleSelect(city)}
/>
```

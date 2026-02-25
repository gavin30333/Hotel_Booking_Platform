# Refactor HotelCard Data Management Plan

## Objective
Migrate all hardcoded data in `HotelCard/index.tsx` to the `displayData` object and update the `HotelCard_Delivery_Note.md` documentation to classify the data.

## Steps

1.  **Refactor `d:\Hotel_Booking_Platform\src\components\common\display\HotelCard\index.tsx`**:
    *   Expand `displayData` object to include all static text and symbols currently hardcoded in the JSX.
    *   New fields to add:
        *   `diamondSymbol`: '♦'
        *   `goldDiamondText`: '金钻'
        *   `reviewSuffix`: '点评'
        *   `collectionSuffix`: '收藏'
        *   `distancePrefix`: '距您直线 '
        *   `rankingIcon`: '🏆'
        *   `currencySymbol`: '¥'
        *   `priceSuffix`: '起'
        *   `totalPricePrefix`: '晚 总价 ¥' (or handle the logic in `displayData` construction)
    *   Update the JSX to reference these `displayData` properties instead of the hardcoded strings.

2.  **Update `d:\Hotel_Booking_Platform\src\components\common\display\HotelCard\HotelCard_Delivery_Note.md`**:
    *   Rewrite Section 3 to "Data Classification Standard".
    *   **3.1 Backend Real Interface Data (Dynamic)**:
        *   List fields like `image`, `name`, `rating`, `distance`, `price`, `tags`.
        *   Include API path (`/public/hotels`), Method (`GET`), Parameters (`city`, `keyword`, etc.), Response example.
    *   **3.2 displayData Object Data (Static/Semi-static)**:
        *   List all properties of the refactored `displayData`.
        *   Add Type (string, number, boolean) and Description.
        *   Mark as "Constant" (e.g., symbols, static labels) or "To be expanded" (e.g., `diamonds`, `ranking`, `isGoldDiamond`).

## Verification
*   Check that `HotelCard` renders exactly the same as before (no visual regression).
*   Verify that `displayData` contains all text displayed on the card.
*   Verify documentation covers all fields in `displayData` with correct classification.

# Plan: Update Detail Page Carousel Image Logic

## Goal
Modify the logic for generating carousel images in the hotel detail page. Instead of using purely random mock data, the system should first prioritize the actual images returned by the backend (including the cover image). If the total number of images is less than 20, the list should be padded with mock images to reach a total of 20.

## User Requirements
1.  **Prioritize Backend Images**: Display images from the backend API first.
2.  **Minimum 20 Images**: If backend images are fewer than 20, generate additional images to reach at least 20.
3.  **Mock Source**: Use the specific mock pattern from `src/mock/index.ts` (`https://picsum.photos/...`) for the generated images.
4.  **Categorization**: Maintain the existing 5 categories ("封面", "精选", "位置", "点评", "相册").

## Implementation Steps

### 1. Modify `src/mock/carousel.ts`
Update the `getCarouselImages` function to accept an array of initial image URLs.

-   **Input**: Add `initialImages: string[]` parameter.
-   **Logic**:
    1.  **Process Initial Images**:
        -   Convert the `initialImages` strings into `CarouselItem` objects.
        -   **Categorization Strategy**:
            -   The first image is assigned to "封面" (Cover).
            -   The second and third images (if available) are assigned to "精选" (Featured).
            -   The rest of the initial images are assigned to "相册" (Gallery).
    2.  **Fill Remaining Slots**:
        -   Calculate how many more images are needed to reach 20.
        -   If needed, generate new images using `Mock.mock` with the pattern: `'https://picsum.photos/750/350?random=@integer(1, 1000)'`.
        -   **Category Balancing**: Ensure the generated images are distributed among "位置", "点评", and any other categories that might be empty or under-represented to ensure all 5 categories exist.
    3.  **Return**: A combined list of `CarouselItem` objects.

### 2. Update `src/pages/detail/index.tsx`
Refactor how `carouselData` is initialized.

-   **Dependency**: Update the `useMemo` hook to depend on `hotelImages`.
-   **Call**: Pass `hotelImages` (which comes from `hotel.images`) to the updated `getCarouselImages` function.
    ```typescript
    const carouselData = useMemo(() => {
      if (!hotel) return [];
      return getCarouselImages(hotel.images || []);
    }, [hotel]);
    ```

## Verification
-   **Scenario 1 (Few Backend Images)**: If backend returns 3 images, the carousel should have 20 items. The first 3 should match the backend URLs, and the rest should be random `picsum` images. Categories should include all 5 types.
-   **Scenario 2 (Many Backend Images)**: If backend returns 25 images, the carousel should use all of them (or cap at 20 if strict limit, but requirements imply "expand to 20", so >20 is likely fine to keep). *Decision: If >20, keep all of them.*
-   **Visual Check**: Verify the "Cover" tab selects the first image, and navigation works as expected.

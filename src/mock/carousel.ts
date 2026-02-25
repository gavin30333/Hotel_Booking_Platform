import Mock from 'mockjs';

const Random = Mock.Random;

export interface CarouselImage {
  id: string;
  url: string;
  category: string;
  title: string;
}

export const getCarouselImages = (initialImages: string[] = [], _count: number = 20): CarouselImage[] => {
  const categoriesConfig = [
    { name: "封面", count: 1 },
    { name: "精选", count: 3 },
    { name: "位置", count: 4 },
    { name: "点评", count: 4 },
    { name: "相册", count: 8 }
  ];

  // 1. 初始化 Buckets
  const buckets: Record<string, CarouselImage[]> = {
    "封面": [],
    "精选": [],
    "位置": [],
    "点评": [],
    "相册": []
  };

  // 2. 分配 initialImages
  initialImages.forEach((url, index) => {
    let category = "相册"; // 默认为相册

    if (index === 0) {
      category = "封面";
    } else if (index >= 1 && index <= 3) {
      category = "精选";
    }
    // 注意：如果有特定逻辑将剩余的分配到其他类别，可以在此调整。
    // 当前逻辑：1st -> 封面, 2nd-4th -> 精选, Rest -> 相册

    if (buckets[category]) {
      // 只有当该分类未满时才添加，或者允许溢出（这里允许溢出，后续截断或保留取决于需求）
      // 需求是严格分组，所以这里直接放入，后面填充逻辑只负责填充不足的。
      // 如果 initialImages 过多，可能会导致某个分类超过目标值，这通常是可以接受的，
      // 但为了严格符合 "20张" 的要求，可能需要截断。
      // 鉴于 prompt 要求 "共20张"，我们这里不截断 initialImages，而是让 mock 填充逻辑只在不足时工作。
      // 最终总数可能会超过 20 如果 initialImages 很多，但这符合 "至少" 的通常理解。
      // 如果必须严格 20，需要额外逻辑。Prompt 说 "例如共20张...分为...18-20"，暗示严格性。
      // 但如果后端返回 30 张，只显示 20 张可能不合理。
      // 决策：优先展示真实图片。如果真实图片导致某组超标，则超标。Mock 只负责填坑。

      buckets[category].push({
        id: `initial-${index}`,
        url: url,
        category: category,
        title: index === 0 ? "封面图片" : `酒店图片 ${index + 1}`
      });
    }
  });

  // 3. 填充 Buckets 直到达到目标数量
  categoriesConfig.forEach(config => {
    const category = config.name;
    const targetCount = config.count;
    const currentList = buckets[category];

    while (currentList.length < targetCount) {
      currentList.push(Mock.mock({
        id: Random.guid(),
        url: `https://picsum.photos/750/350?random=${Random.integer(1, 1000)}`,
        category: category,
        title: Random.ctitle(5, 10)
      }));
    }
  });

  // 4. 按严格顺序合并
  let result: CarouselImage[] = [];
  categoriesConfig.forEach(config => {
    result = result.concat(buckets[config.name]);
  });

  return result;
};

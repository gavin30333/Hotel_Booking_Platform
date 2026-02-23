# 通用文件组织与编码规范文档
## 1. 范围与背景
本规范基于查询页模块的现有架构梳理而成，旨在统一后续所有页面的开发标准与文件组织逻辑。
核心参考基准：QueryCard的配置化设计模式、CitySelector的组件拆分模式、基于Zustand的全局状态管理方案。

## 2. 核心维度规范
### A. 组件划分与引用规则 (Component Structure)
#### 现有约定 (已落地)
- 目录结构：强制采用「目录即组件」模式，每个组件拥有独立专属文件夹。
- 入口文件命名：组件文件夹下的TSX入口文件**必须**统一命名为 `index.tsx`，无例外。
  - 示例：src/components/QueryCard/index.tsx
- 组件拆分：复杂组件内部需通过 `components` 子目录进行子组件拆分，禁止扁平化堆叠代码。
  - 示例：src/components/CitySelector/components/TabContent/DomesticTab/index.tsx
- 设计模式：QueryCard采用「配置驱动 (Config-Driven)」模式，通过SCENE_CONFIGS定义表单结构，组件仅负责渲染逻辑，该模式为所有查询类组件的强制遵循标准。
- 导入规则：优先使用 @(src) 路径别名导入组件，仅组件内部子文件引用时可使用相对路径

#### 强制规范 (必须执行)
- 组件命名：组件文件夹名称强制采用 PascalCase (大驼峰) 命名法，需与组件导出名称完全一致。
- 样式文件命名：组件样式文件**必须**使用 `[ComponentName].less` 命名，禁止使用 `index.less`。
  - 示例：src/components/QueryCard/QueryCard.less（正确）、src/components/QueryCard/index.less（错误）
  - 理由：在编辑器Tab中可快速区分不同组件的样式文件，避免多个index.less造成视觉混淆。
- 组件抽离策略：
  1. 复用性判定：扫描代码时，只要判定组件存在**任何复用可能性**（哪怕仅潜在复用场景），必须将该组件迁移至根目录 `src/components/common/` 下统一维护；
  2. 非复用组件：无任何复用可能性的组件，严格遵循「谁使用谁维护」原则，存放至使用方目录下的 `components` 子文件夹中。
  - 示例：CitySelector存在跨页面复用可能 → 存放至 src/components/common/CitySelector/；QueryCard仅查询页使用 → 存放至 src/pages/query/components/QueryCard/

#### 整改建议
- 命名不一致问题：src/pages/user/search/index.less 需立即重命名为 src/pages/user/search/SearchPage.less；
- 所有组件目录下的 index.less 需在下次迭代中批量替换为 [ComponentName].less。

### B. 状态管理设计规则 (State Management)
#### 现有约定 (已落地)
- 状态分层：
  1. 业务状态：跨组件共享的业务数据（如查询表单数据、搜索条件），统一由全局Zustand Store管理；
  2. UI状态：组件内部交互状态（如CitySelector的activeTab、DateField的isCalendarVisible），使用组件内useState管理，禁止放入全局Store。
- 逻辑复用：复杂业务逻辑和状态更新逻辑，必须封装至Custom Hooks（如useQueryForm），UI组件仅调用Hook返回的方法，禁止在组件内直接编写业务逻辑。

#### 强制规范 (基于Zustand的执行方案)
- Store文件组织：
  1. 全局Store文件统一存放于 `src/store/` 目录下，按业务域拆分文件（如queryStore.ts、userStore.ts）；
  2. 每个Store文件内仅维护一个业务域的状态，禁止多业务域状态混杂；
  3. Store命名规则：文件命名为 `[业务域]Store.ts`，导出的Store Hook命名为 `use[业务域]Store`。
     - 示例：src/store/queryStore.ts → export const useQueryStore = create(...)
- 状态更新规则：
  1. 同步状态更新：直接在Store内定义setter方法，组件通过Hook调用更新；
  2. 异步状态更新：所有异步操作（如接口请求）必须封装在Store的action中，组件仅触发action，不处理异步逻辑；
  3. 单一数据源：跨页面/跨核心板块的共享数据（如搜索条件），必须下沉至Zustand Store，禁止通过多层Props透传。
- Hook存放规则：业务逻辑Hook统一存放至 `src/hooks/`（全局复用）或组件同级 `hooks/` 目录（组件内复用），命名强制以 `use` 开头。

### C. 工具函数组织规则 (Utils)
#### 现有约定 (已落地)
- 通用工具：全局复用的工具函数存放于 `src/utils/`（如dateFieldUtils.ts）；
- Mock数据：所有模拟数据统一存放于 `src/mock/`，与业务代码完全分离。

#### 强制规范 (必须执行)
- 职责单一：工具函数必须为纯函数，禁止包含JSX语法或Hooks逻辑；
- 就近原则：仅服务于特定组件的工具函数，必须存放至该组件目录下的 `utils.ts` 文件；仅全局复用的工具函数可放入 `src/utils/`。

### D. 常量配置管理规则 (Constants)
#### 现有约定 (已落地)
- 集中管理：业务配置项统一存放于 `src/constants/`（如QueryConfig.ts、cityData.ts）；
- 命名规范：常量变量名强制使用 UPPER_CASE_SNAKE_CASE（如SCENE_CONFIGS）。

#### 强制规范 (必须执行)
- 类型安全：所有配置文件必须严格定义TypeScript接口（如SceneConfig），每个配置项需标注类型，禁止使用any；
- 硬编码禁止：静态文本、枚举值、映射表等必须提取到常量文件，组件代码中禁止出现硬编码字符串/数值。

### E. 跨文件依赖与导入导出规则 (Imports & Exports)
#### 现有约定 (已落地)
- 路径别名：统一使用 `@/` 指向 `src/` 目录，禁止使用 `../../` 等深层相对路径；
- 类型定义：所有TypeScript类型定义统一存放于 `src/types/`，组件文件内禁止定义全局复用的类型。

#### 强制规范 (必须执行)
- 桶导出 (Barrel Export)：组件集合（如FieldRenderers）需在根目录创建 `index.ts` 文件统一导出所有子组件，外部引用时仅需导入根目录。
  - 示例：src/components/FieldRenderers/index.ts → export * from './DateField'
- 类型导出分离：类型导出需明确使用 `export type`，禁止与普通变量/组件混合导出。
- 循环依赖禁止：严格检查组件间引用关系，禁止父组件直接引用子组件的具体实现（如 import Child from './components/Child'），需通过配置或插槽解耦

#### 整改建议
- src/components/CitySelector/index.tsx 中混杂了 `export * from '@/types/citySelector'`，需修改为 `export type * from '@/types/citySelector'`，明确区分类型导出；
- 所有组件集合目录需补充index.ts桶导出文件，统一对外暴露接口。

## 3. 总结与执行路线
### 3.1 立即执行项 (优先级最高)
1. 所有新增页面/组件必须严格遵循Zustand状态管理规范，先创建对应Store文件再开发业务逻辑；
2. 新增组件强制使用 `index.tsx` (入口) + `[ComponentName].less` (样式) 命名规则；
3. 组件创建时立即判定复用性，按「common目录/使用方目录」分类存放。
4. 完成现有组件样式文件的重命名（index.less → [ComponentName].less）
5. 完成组件复用性梳理，将潜在复用组件迁移至 src/components/common/


import{j as e}from"./jsx-runtime-DaKQxgjo.js";import{r as o}from"./iframe-ChWeci5v.js";import{A as u}from"./AdvancedTable-Dh3Q6PrR.js";import"./preload-helper-C1FmrZbK.js";import"./index-CtX1QlzD.js";const c=a=>{const n=["技术部","产品部","设计部","运营部","市场部","人力资源部","财务部"],t=["在职","试用期","离职"],l=["张三","李四","王五","赵六","钱七","孙八","周九","吴十","郑十一","王十二"];return Array.from({length:a},(s,r)=>({id:`${r+1}`,name:l[r%l.length]+(r>=l.length?` ${Math.floor(r/l.length)+1}`:""),age:22+r%30,email:`user${r+1}@example.com`,department:n[r%n.length],salary:1e4+r%20*1e3,status:t[r%t.length],joinDate:`2023-${String(r%12+1).padStart(2,"0")}-${String(r%28+1).padStart(2,"0")}`}))},g=[{id:"name",accessorKey:"name",header:"姓名",size:120},{id:"age",accessorKey:"age",header:"年龄",size:80,meta:{type:"number"}},{id:"email",accessorKey:"email",header:"邮箱",size:200},{id:"department",accessorKey:"department",header:"部门",size:120},{id:"salary",accessorKey:"salary",header:"薪资",size:120,cell:({getValue:a})=>`¥${a().toLocaleString()}`,meta:{type:"number"}},{id:"status",accessorKey:"status",header:"状态",size:100},{id:"joinDate",accessorKey:"joinDate",header:"入职日期",size:120}],ge={title:"Components/AdvancedTable",component:u,parameters:{layout:"fullscreen",docs:{description:{component:`
# 高级表格组件 (AdvancedTable)

功能强大的企业级 React 表格组件，基于 \`@tanstack/react-table\` 和 \`@dnd-kit\` 构建。

## ✨ 核心特性

### 📝 数据编辑
- **单击编辑模式**：点击单元格直接进入编辑状态
- **双击编辑模式**：双击进入编辑，显示确认/取消按钮
- **自动保存**：失焦时自动保存编辑内容（可选）
- **列级编辑控制**：通过 \`meta.editable\` 单独禁用某些列的编辑

### 📋 Excel 粘贴
- 支持从 Excel、Google Sheets 等工具复制多行多列数据
- 按所见即所得顺序填充（先横向填充，再纵向填充）
- 超出行数时自动创建新行
- 提供详细的变更信息回调

### 🔍 列过滤
支持 12 种过滤操作符：
- **比较操作**：等于、不等于、大于、小于、大于等于、小于等于
- **文本操作**：包含、不包含、开头是、结尾是
- **空值操作**：为空、非空

### 📊 导出功能
- 导出为 Excel (.xlsx) 格式
- 三种导出范围：当前页、过滤后数据、全部数据
- 自动保留表格样式（表头、斑马纹、边框等）

### 🎯 列管理
- **拖拽排序**：拖动列头左侧的 ⋮⋮ 图标调整列顺序
- **调整宽度**：拖动列头右侧边界线
- **显示/隐藏**：通过列设置弹窗控制列的可见性

### 📄 分页
- 完整的分页导航（首页、上一页、下一页、末页）
- 自定义每页条数选择
- 快速跳转到指定页码

### 🎨 视觉效果
- **斑马纹**：交替行背景色，提升可读性
- **交叉高亮**：鼠标悬停时高亮当前行和列
- **多选单元格**：拖拽选择多个单元格
- **自定义颜色**：支持自定义各种颜色主题

### 🛠️ 工具栏
- **自定义按钮**：通过 \`toolbarButtons\` 参数在工具栏左侧添加自定义操作按钮
- **系统按钮**：导出和列设置按钮固定在工具栏右侧
- **灵活布局**：左右分区，清晰的功能划分

## 🚀 快速开始

\`\`\`tsx
import { AdvancedTable } from './components/AdvancedTable';
import type { ColumnDef } from '@tanstack/react-table';

interface Person {
  name: string;
  age: number;
  email: string;
}

const columns: ColumnDef<Person>[] = [
  { id: 'name', accessorKey: 'name', header: '姓名' },
  { id: 'age', accessorKey: 'age', header: '年龄' },
  { id: 'email', accessorKey: 'email', header: '邮箱' },
];

const data: Person[] = [
  { name: '张三', age: 28, email: 'zhangsan@example.com' },
  { name: '李四', age: 32, email: 'lisi@example.com' },
];

function App() {
  const [tableData, setTableData] = useState(data);

  // 工具栏自定义按钮
  const toolbarButtons = [
    {
      key: 'add',
      label: '新增',
      icon: <PlusIcon />,
      onClick: () => {
        // 添加新记录
        const newRecord = { /* ... */ };
        setTableData([...tableData, newRecord]);
      },
    },
    {
      key: 'delete',
      label: '删除',
      icon: <TrashIcon />,
      onClick: () => {
        // 删除选中的记录
      },
      disabled: true, // 可以根据选择状态动态设置
    },
  ];

  return (
    <AdvancedTable
      data={tableData}
      columns={columns}
      toolbarButtons={toolbarButtons}
      enableEditing={true}
      enablePaste={true}
      enableFiltering={true}
      enableExport={true}
    />
  );
}
\`\`\`

## 📚 示例列表

浏览下方的示例了解各种功能的使用方法。每个示例都包含详细的说明和可交互的演示。

1. **Basic** - 基础表格
2. **Edit Mode** - 单击编辑模式
3. **Double Click Edit** - 双击编辑模式
4. **Excel Paste** - Excel 粘贴功能
5. **Filtering** - 列过滤功能
6. **Pagination** - 分页功能
7. **Column Management** - 列管理功能
8. **Custom Styling** - 自定义样式
9. **Full Featured** - 完整功能示例
10. **Large Dataset** - 大数据集示例
11. **Toolbar Buttons** ⭐ - 工具栏自定义按钮（新）

## 🎯 最佳实践

- **性能优化**：大数据集（>1000 行）建议启用分页
- **数据管理**：使用 \`onDataChange\` 回调同步数据到后端
- **用户体验**：根据场景选择合适的编辑模式（单击 vs 双击）
- **工具栏扩展**：使用 \`toolbarButtons\` 添加业务相关的操作按钮
        `}}},tags:["autodocs"],argTypes:{data:{description:"表格数据数组",control:!1},columns:{description:"列定义数组，遵循 @tanstack/react-table 的 ColumnDef 格式",control:!1},onDataChange:{description:"数据变更回调函数，包含详细的变更信息（类型、变更单元格、受影响行等）",control:!1},onFilterChange:{description:"过滤条件变更回调函数，可用于实现服务端过滤",control:!1},onSelectionChange:{description:"单元格选择变更回调函数",control:!1},enableEditing:{description:"是否启用单元格编辑功能",control:"boolean",table:{type:{summary:"boolean"},defaultValue:{summary:"true"}}},editTriggerMode:{description:"编辑触发模式：click（单击）或 doubleClick（双击）",control:"radio",options:["click","doubleClick"],table:{type:{summary:"'click' | 'doubleClick'"},defaultValue:{summary:"'doubleClick'"}}},autoSave:{description:"是否在失焦时自动保存（不显示确认/取消按钮）",control:"boolean",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},enablePaste:{description:"是否启用 Excel 粘贴功能",control:"boolean",table:{type:{summary:"boolean"},defaultValue:{summary:"true"}}},enableFiltering:{description:"是否启用列过滤功能",control:"boolean",table:{type:{summary:"boolean"},defaultValue:{summary:"true"}}},enableExport:{description:"是否启用 Excel 导出功能",control:"boolean",table:{type:{summary:"boolean"},defaultValue:{summary:"true"}}},enableColumnReorder:{description:"是否启用列拖拽排序功能",control:"boolean",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},enablePagination:{description:"是否启用分页功能",control:"boolean",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},enableZebraStripes:{description:"是否启用斑马纹（交替行背景色）",control:"boolean",table:{type:{summary:"boolean"},defaultValue:{summary:"true"}}},enableCrossHighlight:{description:"是否启用交叉高亮（鼠标悬停时高亮行和列）",control:"boolean",table:{type:{summary:"boolean"},defaultValue:{summary:"true"}}},zebraStripeColor:{description:"斑马纹背景色",control:"color",table:{type:{summary:"string"},defaultValue:{summary:"'#fafafa'"}}},crossHighlightColor:{description:"交叉高亮背景色",control:"color",table:{type:{summary:"string"},defaultValue:{summary:"'#e6f7ff'"}}},selectedBorderColor:{description:"选中单元格的边框颜色",control:"color",table:{type:{summary:"string"},defaultValue:{summary:"'#1890ff'"}}},exportFilename:{description:"导出文件名（不含扩展名）",control:"text",table:{type:{summary:"string"},defaultValue:{summary:"'表格数据'"}}},toolbarButtons:{description:"工具栏左侧的自定义按钮数组。每个按钮包含 key、label、onClick、icon、disabled、title 属性",control:!1,table:{type:{summary:"ToolbarButton[]"},defaultValue:{summary:"[]"}}},pagination:{description:"分页配置对象（pageIndex、pageSize、totalCount）",control:!1,table:{type:{summary:"PaginationConfig"}}},pageSizeOptions:{description:"每页条数选项数组",control:!1,table:{type:{summary:"number[]"},defaultValue:{summary:"[10, 20, 50, 100]"}}},allData:{description:"全部数据（用于分页时导出全部数据）",control:!1,table:{type:{summary:"T[]"}}}}},m={parameters:{docs:{description:{story:`
### 基础表格

最简单的表格用法，仅用于数据展示，禁用了所有交互功能。

**特点：**
- ✅ 数据展示
- ❌ 编辑功能
- ❌ 过滤功能
- ❌ 粘贴功能
- ❌ 导出功能
- ❌ 列管理

**适用场景：** 纯数据展示，不需要任何交互。
        `}}},render:()=>{const[a,n]=o.useState(c(5));return e.jsxs("div",{style:{padding:"20px"},children:[e.jsx("h2",{children:"基础表格"}),e.jsx("p",{children:"最简单的用法，仅显示数据，禁用所有交互功能。"}),e.jsx(u,{data:a,columns:g,enableEditing:!1,enableFiltering:!1,enablePaste:!1,enableExport:!1,enableColumnReorder:!1})]})}},b={parameters:{docs:{description:{story:`
### 单击编辑模式

单击单元格即可直接进入编辑状态，失焦时自动保存，提供最流畅的编辑体验。

**配置：**
- \`editTriggerMode="click"\` - 单击触发编辑
- \`autoSave={true}\` - 失焦自动保存
- 邮箱列设置 \`meta.editable = false\` 禁用编辑

**操作方式：**
1. 单击任意可编辑单元格
2. 输入新内容
3. 点击其他位置或按 Tab 键自动保存
4. 按 Esc 键取消编辑

**适用场景：** 需要快速编辑大量数据的场景，如数据录入、批量修改等。
        `}}},render:()=>{const[a,n]=o.useState(c(5)),t=(s,r)=>{n(s),r&&console.log("数据变更:",r)},l=[...g.slice(0,-2),{id:"email",accessorKey:"email",header:"邮箱 (不可编辑)",size:200,meta:{editable:!1}},...g.slice(-2)];return e.jsxs("div",{style:{padding:"20px"},children:[e.jsx("h2",{children:"编辑模式"}),e.jsxs("p",{children:[e.jsx("strong",{children:"单击模式："}),"单击单元格直接进入编辑，失焦自动保存。"]}),e.jsxs("p",{children:[e.jsx("strong",{children:"提示："}),"邮箱列设置为不可编辑。"]}),e.jsx(u,{data:a,columns:l,onDataChange:t,enableEditing:!0,editTriggerMode:"click",autoSave:!0,enableFiltering:!1,enablePaste:!0,enableExport:!1,enableColumnReorder:!1})]})}},x={parameters:{docs:{description:{story:`
### 双击编辑模式

双击单元格进入编辑状态，显示确认和取消按钮，适合需要谨慎确认的编辑场景。

**配置：**
- \`editTriggerMode="doubleClick"\` - 双击触发编辑
- \`autoSave={false}\` - 显示确认/取消按钮

**操作方式：**
1. 双击单元格进入编辑
2. 输入新内容
3. 点击 ✓ 按钮或按 Enter 保存
4. 点击 ✕ 按钮或按 Esc 取消

**适用场景：** 重要数据修改，需要用户明确确认的场景。
        `}}},render:()=>{const[a,n]=o.useState(c(5)),t=(l,s)=>{n(l),s&&console.log("数据变更:",s)};return e.jsxs("div",{style:{padding:"20px"},children:[e.jsx("h2",{children:"双击编辑模式"}),e.jsxs("p",{children:[e.jsx("strong",{children:"双击模式："}),"双击单元格进入编辑，显示确认/取消按钮。"]}),e.jsxs("p",{children:[e.jsx("strong",{children:"快捷键："}),"Enter 保存，Esc 取消。"]}),e.jsx(u,{data:a,columns:g,onDataChange:t,enableEditing:!0,editTriggerMode:"doubleClick",autoSave:!1,enableFiltering:!1,enablePaste:!0,enableExport:!1,enableColumnReorder:!1})]})}},f={parameters:{docs:{description:{story:`
### Excel 粘贴功能

支持从 Excel、Google Sheets 等工具直接粘贴多行多列数据，极大提升数据录入效率。

**功能特点：**
- 支持多行多列同时粘贴
- 按所见即所得顺序填充（先横向后纵向）
- 自动创建新行（当粘贴数据超出现有行数）
- 提供详细的变更信息回调

**使用步骤：**
1. 在 Excel 或 Google Sheets 中选择并复制数据（Ctrl+C / Cmd+C）
2. 在表格中单击起始单元格
3. 粘贴数据（Ctrl+V / Cmd+V）
4. 数据会自动填充到对应位置

**变更回调：**
\`onDataChange\` 回调会提供详细信息：
- \`type: 'paste'\` - 变更类型
- \`changes\` - 所有变更的单元格列表
- \`affectedRows\` - 受影响的行数据
- \`affectedRowIndices\` - 受影响的行索引

**适用场景：** 从其他系统导入数据、批量数据录入等。
        `}}},render:()=>{const[a,n]=o.useState(c(3)),t=(l,s)=>{n(l),s&&s.type==="paste"&&(console.log("粘贴了数据:",s),alert(`成功粘贴 ${s.changes.length} 个单元格的数据！`))};return e.jsxs("div",{style:{padding:"20px"},children:[e.jsx("h2",{children:"Excel 粘贴功能"}),e.jsxs("div",{style:{background:"#f0f7ff",padding:"15px",borderRadius:"8px",marginBottom:"20px",border:"1px solid #91caff"},children:[e.jsx("h3",{style:{marginTop:0},children:"使用方法："}),e.jsxs("ol",{style:{marginBottom:0},children:[e.jsx("li",{children:"从 Excel 或 Google Sheets 复制数据（支持多行多列）"}),e.jsx("li",{children:"单击表格中的某个单元格"}),e.jsxs("li",{children:["按 ",e.jsx("kbd",{children:"Ctrl+V"})," (Mac: ",e.jsx("kbd",{children:"Cmd+V"}),") 粘贴"]}),e.jsx("li",{children:"数据会按所见即所得的顺序填充（先横向后纵向）"}),e.jsx("li",{children:"如果超出行数，会自动创建新行"})]})]}),e.jsx(u,{data:a,columns:g,onDataChange:t,enableEditing:!0,editTriggerMode:"click",autoSave:!0,enablePaste:!0,enableFiltering:!1,enableExport:!1,enableColumnReorder:!1})]})}},C={render:()=>{const[a]=o.useState(c(20)),n=async(t,l,s)=>{console.log("过滤条件变化:",{columnId:t,filters:l,allFilters:s})};return e.jsxs("div",{style:{padding:"20px"},children:[e.jsx("h2",{children:"列过滤功能"}),e.jsx("p",{children:"点击列头右侧的过滤图标，支持多种过滤操作符。"}),e.jsxs("div",{style:{background:"#fff7e6",padding:"15px",borderRadius:"8px",marginBottom:"20px",border:"1px solid #ffd591"},children:[e.jsx("h3",{style:{marginTop:0},children:"支持的操作符："}),e.jsxs("ul",{style:{marginBottom:0,display:"grid",gridTemplateColumns:"repeat(3, 1fr)",gap:"10px"},children:[e.jsx("li",{children:"等于 / 不等于"}),e.jsx("li",{children:"大于 / 小于"}),e.jsx("li",{children:"大于等于 / 小于等于"}),e.jsx("li",{children:"包含 / 不包含"}),e.jsx("li",{children:"开头是 / 结尾是"}),e.jsx("li",{children:"为空 / 非空"})]})]}),e.jsx(u,{data:a,columns:g,onFilterChange:n,enableFiltering:!0,enableEditing:!1,enablePaste:!1,enableExport:!0,enableColumnReorder:!1})]})}},y={render:()=>{const[a]=o.useState(c(50)),[n,t]=o.useState(0),[l,s]=o.useState(10),r=d=>{t(d),console.log("页码变化:",d+1)},i=d=>{s(d),t(0),console.log("每页条数变化:",d)};return e.jsxs("div",{style:{padding:"20px"},children:[e.jsx("h2",{children:"分页功能"}),e.jsx("p",{children:"支持页码导航、每页条数选择、快速跳转。"}),e.jsx(u,{data:a,columns:g,enableEditing:!1,enableFiltering:!1,enablePaste:!1,enableExport:!0,enableColumnReorder:!1,enablePagination:!0,pagination:{pageIndex:n,pageSize:l,totalCount:a.length},onPageChange:r,onPageSizeChange:i,pageSizeOptions:[5,10,20,50]})]})}},S={render:()=>{const[a,n]=o.useState(c(5));return e.jsxs("div",{style:{padding:"20px"},children:[e.jsx("h2",{children:"列管理功能"}),e.jsxs("div",{style:{background:"#f6ffed",padding:"15px",borderRadius:"8px",marginBottom:"20px",border:"1px solid #b7eb8f"},children:[e.jsx("h3",{style:{marginTop:0},children:"功能说明："}),e.jsxs("ul",{style:{marginBottom:0},children:[e.jsxs("li",{children:[e.jsx("strong",{children:"列拖拽排序："}),"拖动列头左侧的 ⋮⋮ 图标调整列顺序"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"调整列宽："}),"拖动列头右侧的边界线"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"显示/隐藏列："}),'点击右上角"列设置"按钮']})]})]}),e.jsx(u,{data:a,columns:g,onDataChange:n,enableEditing:!1,enableFiltering:!1,enablePaste:!1,enableExport:!1,enableColumnReorder:!0})]})}},v={render:()=>{const[a,n]=o.useState(c(10));return e.jsxs("div",{style:{padding:"20px"},children:[e.jsx("h2",{children:"自定义样式"}),e.jsx("p",{children:"自定义斑马纹、交叉高亮、选中边框等颜色。"}),e.jsx(u,{data:a,columns:g,onDataChange:n,enableEditing:!0,editTriggerMode:"click",autoSave:!0,enableFiltering:!1,enablePaste:!0,enableExport:!1,enableColumnReorder:!1,enableZebraStripes:!0,enableCrossHighlight:!0,zebraStripeColor:"#fff7e6",crossHighlightColor:"#e6fffb",selectedBorderColor:"#52c41a"})]})}},j={render:()=>{const[a,n]=o.useState(c(30)),[t,l]=o.useState(0),[s,r]=o.useState(10),i=(p,h)=>{n(p),h&&console.log("数据变更详情:",{type:h.type,changes:h.changes,affectedRows:h.affectedRows})},d=async(p,h,re)=>{console.log("过滤条件变化:",{columnId:p,filters:h,allFilters:re})};return e.jsxs("div",{style:{padding:"20px"},children:[e.jsx("h2",{children:"完整功能示例"}),e.jsxs("div",{style:{background:"#fff0f6",padding:"15px",borderRadius:"8px",marginBottom:"20px",border:"1px solid #ffadd2"},children:[e.jsx("h3",{style:{marginTop:0},children:"启用的功能："}),e.jsxs("ul",{style:{marginBottom:0,display:"grid",gridTemplateColumns:"repeat(2, 1fr)",gap:"10px"},children:[e.jsx("li",{children:"✅ 单元格编辑（单击模式）"}),e.jsx("li",{children:"✅ Excel 粘贴"}),e.jsx("li",{children:"✅ 列过滤"}),e.jsx("li",{children:"✅ 导出 Excel"}),e.jsx("li",{children:"✅ 列拖拽排序"}),e.jsx("li",{children:"✅ 列显示/隐藏"}),e.jsx("li",{children:"✅ 调整列宽"}),e.jsx("li",{children:"✅ 分页功能"}),e.jsx("li",{children:"✅ 斑马纹和交叉高亮"}),e.jsx("li",{children:"✅ 多选单元格"})]})]}),e.jsx(u,{data:a,columns:g,onDataChange:i,onFilterChange:d,enableEditing:!0,editTriggerMode:"click",autoSave:!0,enablePaste:!0,enableFiltering:!0,enableExport:!0,exportFilename:"员工数据表",enableColumnReorder:!0,enableZebraStripes:!0,enableCrossHighlight:!0,enablePagination:!0,pagination:{pageIndex:t,pageSize:s,totalCount:a.length},onPageChange:l,onPageSizeChange:p=>{r(p),l(0)},pageSizeOptions:[5,10,20,50],allData:a})]})}},D={render:()=>{const[a]=o.useState(c(200)),[n,t]=o.useState(0),[l,s]=o.useState(20);return e.jsxs("div",{style:{padding:"20px"},children:[e.jsx("h2",{children:"大数据集示例"}),e.jsx("p",{children:"200 条数据，每页显示 20 条。"}),e.jsx(u,{data:a,columns:g,enableEditing:!0,editTriggerMode:"click",autoSave:!0,enablePaste:!0,enableFiltering:!0,enableExport:!0,enableColumnReorder:!0,enablePagination:!0,pagination:{pageIndex:n,pageSize:l,totalCount:a.length},onPageChange:t,onPageSizeChange:r=>{s(r),t(0)},pageSizeOptions:[10,20,50,100],allData:a})]})}},P={parameters:{docs:{description:{story:`
### 工具栏自定义按钮

通过 \`toolbarButtons\` 参数在工具栏左侧添加自定义按钮。

**功能特点：**
- 支持添加多个自定义按钮
- 按钮可以包含图标和文本
- 支持禁用状态
- 支持自定义点击事件
- 按钮显示在工具栏左侧，导出和列设置在右侧

**使用场景：**
- 批量操作（删除、导入等）
- 刷新数据
- 添加新记录
- 自定义业务操作
        `}}},render:()=>{const[a,n]=o.useState(c(10)),[t,l]=o.useState([]),s=[{key:"add",label:"新增",icon:e.jsx("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"currentColor",children:e.jsx("path",{d:"M8 2v12M2 8h12",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"})}),onClick:()=>{const i={id:`${a.length+1}`,name:"新员工",age:25,email:`new${a.length+1}@example.com`,department:"技术部",salary:15e3,status:"在职",joinDate:new Date().toISOString().split("T")[0]};n([...a,i]),alert("已添加新员工")},title:"添加新记录"},{key:"refresh",label:"刷新",icon:e.jsx("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"currentColor",children:e.jsx("path",{d:"M13.65 2.35A7.5 7.5 0 1 0 15.5 8h-2a5.5 5.5 0 1 1-1.65-3.95L10 6h5V1l-1.35 1.35z"})}),onClick:()=>{n(c(10)),alert("数据已刷新")},title:"刷新数据"},{key:"delete",label:`删除 (${t.length})`,icon:e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"currentColor",children:[e.jsx("path",{d:"M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"}),e.jsx("path",{fillRule:"evenodd",d:"M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"})]}),onClick:()=>{if(t.length===0){alert("请先选择要删除的行");return}if(confirm(`确定要删除选中的 ${t.length} 条记录吗？`)){const i=a.filter((d,p)=>!t.includes(p));n(i),l([]),alert(`已删除 ${t.length} 条记录`)}},disabled:t.length===0,title:"删除选中的记录"},{key:"import",label:"导入",icon:e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"currentColor",children:[e.jsx("path",{d:"M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z"}),e.jsx("path",{d:"M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"})]}),onClick:()=>{alert(`导入功能待实现
可以打开文件选择对话框，导入 Excel 或 CSV 文件`)},title:"导入数据"}],r=(i,d)=>{n(i),console.log("数据变更:",d)};return e.jsxs("div",{style:{padding:"20px"},children:[e.jsx("h2",{children:"工具栏自定义按钮"}),e.jsxs("div",{style:{background:"#fff7e6",padding:"15px",borderRadius:"8px",marginBottom:"20px",border:"1px solid #ffd591"},children:[e.jsx("h3",{style:{marginTop:0},children:"工具栏布局："}),e.jsxs("p",{style:{marginBottom:"10px"},children:[e.jsx("strong",{children:"左侧："}),"自定义按钮（通过 ",e.jsx("code",{children:"toolbarButtons"})," 参数配置）"]}),e.jsxs("p",{style:{marginBottom:"10px"},children:[e.jsx("strong",{children:"右侧："}),"系统按钮（导出、列设置）"]}),e.jsx("h4",{children:"示例功能："}),e.jsxs("ul",{style:{marginBottom:0},children:[e.jsxs("li",{children:[e.jsx("strong",{children:"新增："}),"添加一条新记录"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"刷新："}),"重新生成数据"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"删除："}),"删除选中的记录（需要先选中行）"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"导入："}),"导入外部数据"]})]})]}),e.jsxs("div",{style:{background:"#f0f7ff",padding:"15px",borderRadius:"8px",marginBottom:"20px",border:"1px solid #91caff"},children:[e.jsx("h4",{style:{marginTop:0},children:"提示："}),e.jsxs("p",{style:{margin:0},children:['拖拽选择多行，然后点击"删除"按钮查看批量删除效果。 当前选中：',e.jsx("strong",{children:t.length})," 行"]})]}),e.jsx(u,{data:a,columns:g,onDataChange:r,onSelectionChange:i=>{if(i){const d=new Set(i.cells.map(p=>p.rowIndex));l(Array.from(d).sort((p,h)=>p-h))}else l([])},toolbarButtons:s,enableEditing:!0,editTriggerMode:"click",autoSave:!0,enablePaste:!0,enableFiltering:!0,enableExport:!0,enableColumnReorder:!0})]})}};var E,k,z;m.parameters={...m.parameters,docs:{...(E=m.parameters)==null?void 0:E.docs,source:{originalSource:`{
  parameters: {
    docs: {
      description: {
        story: \`
### 基础表格

最简单的表格用法，仅用于数据展示，禁用了所有交互功能。

**特点：**
- ✅ 数据展示
- ❌ 编辑功能
- ❌ 过滤功能
- ❌ 粘贴功能
- ❌ 导出功能
- ❌ 列管理

**适用场景：** 纯数据展示，不需要任何交互。
        \`
      }
    }
  },
  render: () => {
    const [data, setData] = useState<Person[]>(generateData(5));
    return <div style={{
      padding: '20px'
    }}>
        <h2>基础表格</h2>
        <p>最简单的用法，仅显示数据，禁用所有交互功能。</p>
        <AdvancedTable data={data} columns={baseColumns} enableEditing={false} enableFiltering={false} enablePaste={false} enableExport={false} enableColumnReorder={false} />
      </div>;
  }
}`,...(z=(k=m.parameters)==null?void 0:k.docs)==null?void 0:z.source}}};var w,T,R;b.parameters={...b.parameters,docs:{...(w=b.parameters)==null?void 0:w.docs,source:{originalSource:`{
  parameters: {
    docs: {
      description: {
        story: \`
### 单击编辑模式

单击单元格即可直接进入编辑状态，失焦时自动保存，提供最流畅的编辑体验。

**配置：**
- \\\`editTriggerMode="click"\\\` - 单击触发编辑
- \\\`autoSave={true}\\\` - 失焦自动保存
- 邮箱列设置 \\\`meta.editable = false\\\` 禁用编辑

**操作方式：**
1. 单击任意可编辑单元格
2. 输入新内容
3. 点击其他位置或按 Tab 键自动保存
4. 按 Esc 键取消编辑

**适用场景：** 需要快速编辑大量数据的场景，如数据录入、批量修改等。
        \`
      }
    }
  },
  render: () => {
    const [data, setData] = useState<Person[]>(generateData(5));
    const handleDataChange = (newData: Person[], changeInfo?: DataChangeInfo<Person>) => {
      setData(newData);
      if (changeInfo) {
        console.log('数据变更:', changeInfo);
      }
    };

    // 列定义：部分列不可编辑
    const editColumns: ColumnDef<Person>[] = [...baseColumns.slice(0, -2), {
      id: 'email',
      accessorKey: 'email',
      header: '邮箱 (不可编辑)',
      size: 200,
      meta: {
        editable: false // 禁用编辑
      }
    }, ...baseColumns.slice(-2)];
    return <div style={{
      padding: '20px'
    }}>
        <h2>编辑模式</h2>
        <p><strong>单击模式：</strong>单击单元格直接进入编辑，失焦自动保存。</p>
        <p><strong>提示：</strong>邮箱列设置为不可编辑。</p>
        <AdvancedTable data={data} columns={editColumns} onDataChange={handleDataChange} enableEditing={true} editTriggerMode="click" autoSave={true} enableFiltering={false} enablePaste={true} enableExport={false} enableColumnReorder={false} />
      </div>;
  }
}`,...(R=(T=b.parameters)==null?void 0:T.docs)==null?void 0:R.source}}};var B,I,F;x.parameters={...x.parameters,docs:{...(B=x.parameters)==null?void 0:B.docs,source:{originalSource:`{
  parameters: {
    docs: {
      description: {
        story: \`
### 双击编辑模式

双击单元格进入编辑状态，显示确认和取消按钮，适合需要谨慎确认的编辑场景。

**配置：**
- \\\`editTriggerMode="doubleClick"\\\` - 双击触发编辑
- \\\`autoSave={false}\\\` - 显示确认/取消按钮

**操作方式：**
1. 双击单元格进入编辑
2. 输入新内容
3. 点击 ✓ 按钮或按 Enter 保存
4. 点击 ✕ 按钮或按 Esc 取消

**适用场景：** 重要数据修改，需要用户明确确认的场景。
        \`
      }
    }
  },
  render: () => {
    const [data, setData] = useState<Person[]>(generateData(5));
    const handleDataChange = (newData: Person[], changeInfo?: DataChangeInfo<Person>) => {
      setData(newData);
      if (changeInfo) {
        console.log('数据变更:', changeInfo);
      }
    };
    return <div style={{
      padding: '20px'
    }}>
        <h2>双击编辑模式</h2>
        <p><strong>双击模式：</strong>双击单元格进入编辑，显示确认/取消按钮。</p>
        <p><strong>快捷键：</strong>Enter 保存，Esc 取消。</p>
        <AdvancedTable data={data} columns={baseColumns} onDataChange={handleDataChange} enableEditing={true} editTriggerMode="doubleClick" autoSave={false} enableFiltering={false} enablePaste={true} enableExport={false} enableColumnReorder={false} />
      </div>;
  }
}`,...(F=(I=x.parameters)==null?void 0:I.docs)==null?void 0:F.source}}};var M,V,A;f.parameters={...f.parameters,docs:{...(M=f.parameters)==null?void 0:M.docs,source:{originalSource:`{
  parameters: {
    docs: {
      description: {
        story: \`
### Excel 粘贴功能

支持从 Excel、Google Sheets 等工具直接粘贴多行多列数据，极大提升数据录入效率。

**功能特点：**
- 支持多行多列同时粘贴
- 按所见即所得顺序填充（先横向后纵向）
- 自动创建新行（当粘贴数据超出现有行数）
- 提供详细的变更信息回调

**使用步骤：**
1. 在 Excel 或 Google Sheets 中选择并复制数据（Ctrl+C / Cmd+C）
2. 在表格中单击起始单元格
3. 粘贴数据（Ctrl+V / Cmd+V）
4. 数据会自动填充到对应位置

**变更回调：**
\\\`onDataChange\\\` 回调会提供详细信息：
- \\\`type: 'paste'\\\` - 变更类型
- \\\`changes\\\` - 所有变更的单元格列表
- \\\`affectedRows\\\` - 受影响的行数据
- \\\`affectedRowIndices\\\` - 受影响的行索引

**适用场景：** 从其他系统导入数据、批量数据录入等。
        \`
      }
    }
  },
  render: () => {
    const [data, setData] = useState<Person[]>(generateData(3));
    const handleDataChange = (newData: Person[], changeInfo?: DataChangeInfo<Person>) => {
      setData(newData);
      if (changeInfo && changeInfo.type === 'paste') {
        console.log('粘贴了数据:', changeInfo);
        alert(\`成功粘贴 \${changeInfo.changes.length} 个单元格的数据！\`);
      }
    };
    return <div style={{
      padding: '20px'
    }}>
        <h2>Excel 粘贴功能</h2>
        <div style={{
        background: '#f0f7ff',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '20px',
        border: '1px solid #91caff'
      }}>
          <h3 style={{
          marginTop: 0
        }}>使用方法：</h3>
          <ol style={{
          marginBottom: 0
        }}>
            <li>从 Excel 或 Google Sheets 复制数据（支持多行多列）</li>
            <li>单击表格中的某个单元格</li>
            <li>按 <kbd>Ctrl+V</kbd> (Mac: <kbd>Cmd+V</kbd>) 粘贴</li>
            <li>数据会按所见即所得的顺序填充（先横向后纵向）</li>
            <li>如果超出行数，会自动创建新行</li>
          </ol>
        </div>
        <AdvancedTable data={data} columns={baseColumns} onDataChange={handleDataChange} enableEditing={true} editTriggerMode="click" autoSave={true} enablePaste={true} enableFiltering={false} enableExport={false} enableColumnReorder={false} />
      </div>;
  }
}`,...(A=(V=f.parameters)==null?void 0:V.docs)==null?void 0:A.source}}};var H,$,K;C.parameters={...C.parameters,docs:{...(H=C.parameters)==null?void 0:H.docs,source:{originalSource:`{
  render: () => {
    const [data] = useState<Person[]>(generateData(20));
    const handleFilterChange: OnFilterChange = async (columnId, filters, allFilters) => {
      console.log('过滤条件变化:', {
        columnId,
        filters,
        allFilters
      });
    };
    return <div style={{
      padding: '20px'
    }}>
        <h2>列过滤功能</h2>
        <p>点击列头右侧的过滤图标，支持多种过滤操作符。</p>
        <div style={{
        background: '#fff7e6',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '20px',
        border: '1px solid #ffd591'
      }}>
          <h3 style={{
          marginTop: 0
        }}>支持的操作符：</h3>
          <ul style={{
          marginBottom: 0,
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '10px'
        }}>
            <li>等于 / 不等于</li>
            <li>大于 / 小于</li>
            <li>大于等于 / 小于等于</li>
            <li>包含 / 不包含</li>
            <li>开头是 / 结尾是</li>
            <li>为空 / 非空</li>
          </ul>
        </div>
        <AdvancedTable data={data} columns={baseColumns} onFilterChange={handleFilterChange} enableFiltering={true} enableEditing={false} enablePaste={false} enableExport={true} enableColumnReorder={false} />
      </div>;
  }
}`,...(K=($=C.parameters)==null?void 0:$.docs)==null?void 0:K.source}}};var L,O,G;y.parameters={...y.parameters,docs:{...(L=y.parameters)==null?void 0:L.docs,source:{originalSource:`{
  render: () => {
    const [data] = useState<Person[]>(generateData(50));
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const handlePageChange = (newPageIndex: number) => {
      setPageIndex(newPageIndex);
      console.log('页码变化:', newPageIndex + 1);
    };
    const handlePageSizeChange = (newPageSize: number) => {
      setPageSize(newPageSize);
      setPageIndex(0);
      console.log('每页条数变化:', newPageSize);
    };
    return <div style={{
      padding: '20px'
    }}>
        <h2>分页功能</h2>
        <p>支持页码导航、每页条数选择、快速跳转。</p>
        <AdvancedTable data={data} columns={baseColumns} enableEditing={false} enableFiltering={false} enablePaste={false} enableExport={true} enableColumnReorder={false} enablePagination={true} pagination={{
        pageIndex,
        pageSize,
        totalCount: data.length
      }} onPageChange={handlePageChange} onPageSizeChange={handlePageSizeChange} pageSizeOptions={[5, 10, 20, 50]} />
      </div>;
  }
}`,...(G=(O=y.parameters)==null?void 0:O.docs)==null?void 0:G.source}}};var Z,_,W;S.parameters={...S.parameters,docs:{...(Z=S.parameters)==null?void 0:Z.docs,source:{originalSource:`{
  render: () => {
    const [data, setData] = useState<Person[]>(generateData(5));
    return <div style={{
      padding: '20px'
    }}>
        <h2>列管理功能</h2>
        <div style={{
        background: '#f6ffed',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '20px',
        border: '1px solid #b7eb8f'
      }}>
          <h3 style={{
          marginTop: 0
        }}>功能说明：</h3>
          <ul style={{
          marginBottom: 0
        }}>
            <li><strong>列拖拽排序：</strong>拖动列头左侧的 ⋮⋮ 图标调整列顺序</li>
            <li><strong>调整列宽：</strong>拖动列头右侧的边界线</li>
            <li><strong>显示/隐藏列：</strong>点击右上角"列设置"按钮</li>
          </ul>
        </div>
        <AdvancedTable data={data} columns={baseColumns} onDataChange={setData} enableEditing={false} enableFiltering={false} enablePaste={false} enableExport={false} enableColumnReorder={true} />
      </div>;
  }
}`,...(W=(_=S.parameters)==null?void 0:_.docs)==null?void 0:W.source}}};var q,J,N;v.parameters={...v.parameters,docs:{...(q=v.parameters)==null?void 0:q.docs,source:{originalSource:`{
  render: () => {
    const [data, setData] = useState<Person[]>(generateData(10));
    return <div style={{
      padding: '20px'
    }}>
        <h2>自定义样式</h2>
        <p>自定义斑马纹、交叉高亮、选中边框等颜色。</p>
        <AdvancedTable data={data} columns={baseColumns} onDataChange={setData} enableEditing={true} editTriggerMode="click" autoSave={true} enableFiltering={false} enablePaste={true} enableExport={false} enableColumnReorder={false} enableZebraStripes={true} enableCrossHighlight={true} zebraStripeColor="#fff7e6" crossHighlightColor="#e6fffb" selectedBorderColor="#52c41a" />
      </div>;
  }
}`,...(N=(J=v.parameters)==null?void 0:J.docs)==null?void 0:N.source}}};var Q,U,X;j.parameters={...j.parameters,docs:{...(Q=j.parameters)==null?void 0:Q.docs,source:{originalSource:`{
  render: () => {
    const [data, setData] = useState<Person[]>(generateData(30));
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const handleDataChange = (newData: Person[], changeInfo?: DataChangeInfo<Person>) => {
      setData(newData);
      if (changeInfo) {
        console.log('数据变更详情:', {
          type: changeInfo.type,
          changes: changeInfo.changes,
          affectedRows: changeInfo.affectedRows
        });
      }
    };
    const handleFilterChange: OnFilterChange = async (columnId, filters, allFilters) => {
      console.log('过滤条件变化:', {
        columnId,
        filters,
        allFilters
      });
    };
    return <div style={{
      padding: '20px'
    }}>
        <h2>完整功能示例</h2>
        <div style={{
        background: '#fff0f6',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '20px',
        border: '1px solid #ffadd2'
      }}>
          <h3 style={{
          marginTop: 0
        }}>启用的功能：</h3>
          <ul style={{
          marginBottom: 0,
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '10px'
        }}>
            <li>✅ 单元格编辑（单击模式）</li>
            <li>✅ Excel 粘贴</li>
            <li>✅ 列过滤</li>
            <li>✅ 导出 Excel</li>
            <li>✅ 列拖拽排序</li>
            <li>✅ 列显示/隐藏</li>
            <li>✅ 调整列宽</li>
            <li>✅ 分页功能</li>
            <li>✅ 斑马纹和交叉高亮</li>
            <li>✅ 多选单元格</li>
          </ul>
        </div>
        <AdvancedTable data={data} columns={baseColumns} onDataChange={handleDataChange} onFilterChange={handleFilterChange} enableEditing={true} editTriggerMode="click" autoSave={true} enablePaste={true} enableFiltering={true} enableExport={true} exportFilename="员工数据表" enableColumnReorder={true} enableZebraStripes={true} enableCrossHighlight={true} enablePagination={true} pagination={{
        pageIndex,
        pageSize,
        totalCount: data.length
      }} onPageChange={setPageIndex} onPageSizeChange={size => {
        setPageSize(size);
        setPageIndex(0);
      }} pageSizeOptions={[5, 10, 20, 50]} allData={data} />
      </div>;
  }
}`,...(X=(U=j.parameters)==null?void 0:U.docs)==null?void 0:X.source}}};var Y,ee,ae;D.parameters={...D.parameters,docs:{...(Y=D.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  render: () => {
    const [data] = useState<Person[]>(generateData(200));
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(20);
    return <div style={{
      padding: '20px'
    }}>
        <h2>大数据集示例</h2>
        <p>200 条数据，每页显示 20 条。</p>
        <AdvancedTable data={data} columns={baseColumns} enableEditing={true} editTriggerMode="click" autoSave={true} enablePaste={true} enableFiltering={true} enableExport={true} enableColumnReorder={true} enablePagination={true} pagination={{
        pageIndex,
        pageSize,
        totalCount: data.length
      }} onPageChange={setPageIndex} onPageSizeChange={size => {
        setPageSize(size);
        setPageIndex(0);
      }} pageSizeOptions={[10, 20, 50, 100]} allData={data} />
      </div>;
  }
}`,...(ae=(ee=D.parameters)==null?void 0:ee.docs)==null?void 0:ae.source}}};var ne,te,le;P.parameters={...P.parameters,docs:{...(ne=P.parameters)==null?void 0:ne.docs,source:{originalSource:`{
  parameters: {
    docs: {
      description: {
        story: \`
### 工具栏自定义按钮

通过 \\\`toolbarButtons\\\` 参数在工具栏左侧添加自定义按钮。

**功能特点：**
- 支持添加多个自定义按钮
- 按钮可以包含图标和文本
- 支持禁用状态
- 支持自定义点击事件
- 按钮显示在工具栏左侧，导出和列设置在右侧

**使用场景：**
- 批量操作（删除、导入等）
- 刷新数据
- 添加新记录
- 自定义业务操作
        \`
      }
    }
  },
  render: () => {
    const [data, setData] = useState<Person[]>(generateData(10));
    const [selectedRows, setSelectedRows] = useState<number[]>([]);

    // 工具栏自定义按钮
    const toolbarButtons = [{
      key: 'add',
      label: '新增',
      icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>,
      onClick: () => {
        const newPerson: Person = {
          id: \`\${data.length + 1}\`,
          name: '新员工',
          age: 25,
          email: \`new\${data.length + 1}@example.com\`,
          department: '技术部',
          salary: 15000,
          status: '在职',
          joinDate: new Date().toISOString().split('T')[0]
        };
        setData([...data, newPerson]);
        alert('已添加新员工');
      },
      title: '添加新记录'
    }, {
      key: 'refresh',
      label: '刷新',
      icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M13.65 2.35A7.5 7.5 0 1 0 15.5 8h-2a5.5 5.5 0 1 1-1.65-3.95L10 6h5V1l-1.35 1.35z" />
          </svg>,
      onClick: () => {
        setData(generateData(10));
        alert('数据已刷新');
      },
      title: '刷新数据'
    }, {
      key: 'delete',
      label: \`删除 (\${selectedRows.length})\`,
      icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
            <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
          </svg>,
      onClick: () => {
        if (selectedRows.length === 0) {
          alert('请先选择要删除的行');
          return;
        }
        if (confirm(\`确定要删除选中的 \${selectedRows.length} 条记录吗？\`)) {
          const newData = data.filter((_, index) => !selectedRows.includes(index));
          setData(newData);
          setSelectedRows([]);
          alert(\`已删除 \${selectedRows.length} 条记录\`);
        }
      },
      disabled: selectedRows.length === 0,
      title: '删除选中的记录'
    }, {
      key: 'import',
      label: '导入',
      icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z" />
            <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
          </svg>,
      onClick: () => {
        alert('导入功能待实现\\n可以打开文件选择对话框，导入 Excel 或 CSV 文件');
      },
      title: '导入数据'
    }];
    const handleDataChange = (newData: Person[], changeInfo?: DataChangeInfo<Person>) => {
      setData(newData);
      console.log('数据变更:', changeInfo);
    };
    return <div style={{
      padding: '20px'
    }}>
        <h2>工具栏自定义按钮</h2>
        <div style={{
        background: '#fff7e6',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '20px',
        border: '1px solid #ffd591'
      }}>
          <h3 style={{
          marginTop: 0
        }}>工具栏布局：</h3>
          <p style={{
          marginBottom: '10px'
        }}>
            <strong>左侧：</strong>自定义按钮（通过 <code>toolbarButtons</code> 参数配置）
          </p>
          <p style={{
          marginBottom: '10px'
        }}>
            <strong>右侧：</strong>系统按钮（导出、列设置）
          </p>
          <h4>示例功能：</h4>
          <ul style={{
          marginBottom: 0
        }}>
            <li><strong>新增：</strong>添加一条新记录</li>
            <li><strong>刷新：</strong>重新生成数据</li>
            <li><strong>删除：</strong>删除选中的记录（需要先选中行）</li>
            <li><strong>导入：</strong>导入外部数据</li>
          </ul>
        </div>
        
        <div style={{
        background: '#f0f7ff',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '20px',
        border: '1px solid #91caff'
      }}>
          <h4 style={{
          marginTop: 0
        }}>提示：</h4>
          <p style={{
          margin: 0
        }}>
            拖拽选择多行，然后点击"删除"按钮查看批量删除效果。
            当前选中：<strong>{selectedRows.length}</strong> 行
          </p>
        </div>

        <AdvancedTable data={data} columns={baseColumns} onDataChange={handleDataChange} onSelectionChange={selection => {
        if (selection) {
          const rowIndices = new Set(selection.cells.map(cell => cell.rowIndex));
          setSelectedRows(Array.from(rowIndices).sort((a, b) => a - b));
        } else {
          setSelectedRows([]);
        }
      }} toolbarButtons={toolbarButtons} enableEditing={true} editTriggerMode="click" autoSave={true} enablePaste={true} enableFiltering={true} enableExport={true} enableColumnReorder={true} />
      </div>;
  }
}`,...(le=(te=P.parameters)==null?void 0:te.docs)==null?void 0:le.source}}};const ue=["Basic","EditMode","DoubleClickEdit","ExcelPaste","Filtering","Pagination","ColumnManagement","CustomStyling","FullFeatured","LargeDataset","ToolbarButtons"];export{m as Basic,S as ColumnManagement,v as CustomStyling,x as DoubleClickEdit,b as EditMode,f as ExcelPaste,C as Filtering,j as FullFeatured,D as LargeDataset,y as Pagination,P as ToolbarButtons,ue as __namedExportsOrder,ge as default};

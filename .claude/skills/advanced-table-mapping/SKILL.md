---
name: advanced-table-mapping
description: Provides semantic mapping and guidance for the AdvancedTable component. Maps Chinese term "表格" (table) to the AdvancedTable component implementation. Use when the user mentions "表格", "数据表", "表", or needs table functionality with Excel-like editing, filtering, pagination, and export capabilities.
allowed-tools: Read, Grep, Glob, Edit, Write
---

# AdvancedTable Component Mapping

## Purpose

This skill maps Chinese terminology and component references to the AdvancedTable component in the QWS-UI project. It helps Claude understand when users are asking about tables and provides context about AdvancedTable's capabilities.

## Semantic Mappings

### Chinese Terms
- **表格** (table) → AdvancedTable
- **数据表** (data table) → AdvancedTable
- **表** (table/spreadsheet) → AdvancedTable
- **数据管理** (data management) → AdvancedTable with filtering/editing
- **列表** (list) → Consider AdvancedTable for data lists with editing needs

### Component Location
- **File**: `src/components/AdvancedTable.tsx` (~2300 lines)
- **CSS**: `src/components/AdvancedTable.css`
- **Tests**: `src/components/AdvancedTable.test.tsx`
- **Stories**: `src/stories/AdvancedTable.stories.tsx`
- **Registry**: `advanced-table` (available as shadcn-style component)

## AdvancedTable Capabilities

### Core Features
1. **Excel-like Editing**: Single-click or double-click cell editing
2. **Multi-cell Selection**: Drag selection with change tracking
3. **Excel Paste**: Paste clipboard data to create/populate rows
4. **Filtering**: Client-side filtering with 12 operators
   - equals, notEquals
   - contains, notContains
   - startsWith, endsWith
   - greaterThan, lessThan, greaterThanOrEqual, lessThanOrEqual
   - isEmpty, isNotEmpty
5. **Pagination**: Customizable page sizes
6. **Column Management**:
   - Drag-and-drop reordering
   - Column visibility toggling
   - Column width adjustment
7. **Export**: Excel export via ExcelJS

### Props Interface
```typescript
interface AdvancedTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  onDataChange?: (newData: T[], changeInfo: ChangeInfo) => void;
  onFilterChange?: (filters: FilterState[]) => void;
  editMode?: 'click' | 'doubleClick';
  enableExcelPaste?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];
  enableColumnReordering?: boolean;
  className?: string;
}

interface ChangeInfo {
  type: 'edit' | 'paste';
  changes: Array<{
    rowIndex: number;
    columnId: string;
    oldValue: any;
    newValue: any;
  }>;
}
```

### Tech Stack
- `@tanstack/react-table` v8: Table state management
- `@dnd-kit/core`: Drag-and-drop functionality
- `exceljs`: Excel export
- TypeScript with strict mode
- Tailwind CSS with shadcn/ui components (Button, Input, Select, Dialog, DropdownMenu)

## Usage Instructions

When a user mentions:
1. **"表格"** or table-related functionality → Suggest AdvancedTable component
2. **Data editing/filtering** → Reference Excel-like editing and filtering capabilities
3. **Data export** → Explain Excel export functionality
4. **Component implementation** → Direct to `src/components/AdvancedTable.tsx`
5. **Testing** → Run `npm run storybook` to view examples at http://localhost:6006

## Key Implementation Details

### Cell Editing Logic
- Located in `handleCellEdit` function
- Uses column `meta.editable` property to control editability
- Tracks changes and notifies via `onDataChange` callback

### Excel Paste Logic
- Located in `handlePaste` function (src/components/AdvancedTable.tsx:~1800)
- Parses tab/newline delimited clipboard data
- Creates new rows automatically if pasting beyond existing rows
- Tracks all changes with changeInfo

### Filtering Logic
- Located in `filterRows` function
- Client-side filtering with 12 operators
- Supports server-side via `onFilterChange` callback
- Filter state stored per column

### Column Reordering
- Uses `@dnd-kit/sortable` with `horizontalListSortingStrategy`
- Enabled via `enableColumnReordering` prop
- Persists order in component state

## Examples

### Example 1: Basic Table
```typescript
import { AdvancedTable } from '@/components/AdvancedTable';

const MyTablePage = () => {
  const columns: ColumnDef<DataType>[] = [
    { accessorKey: 'id', header: 'ID', meta: { editable: false } },
    { accessorKey: 'name', header: '名称', meta: { editable: true } },
    { accessorKey: 'price', header: '价格', meta: { editable: true } }
  ];

  const [data, setData] = useState(initialData);

  return (
    <AdvancedTable
      data={data}
      columns={columns}
      editMode="doubleClick"
      onDataChange={(newData) => setData(newData)}
    />
  );
};
```

### Example 2: With Excel Paste
```typescript
<AdvancedTable
  data={tableData}
  columns={columnDefs}
  editMode="click"
  enableExcelPaste={true}
  onDataChange={(newData, changeInfo) => {
    if (changeInfo.type === 'paste') {
      console.log('Pasted changes:', changeInfo.changes);
    }
    setTableData(newData);
  }}
/>
```

### Example 3: Server-side Filtering
```typescript
<AdvancedTable
  data={tableData}
  columns={columnDefs}
  onFilterChange={(filters) => {
    // Send to server for server-side filtering
    fetchFilteredData(filters).then(setTableData);
  }}
/>
```

## Common Tasks

### Adding a New Column
1. Add to column definitions with appropriate `accessorKey`
2. Set `meta.editable` to control editing
3. Optionally add custom `cell` renderer

### Customizing Cell Rendering
```typescript
{
  accessorKey: 'status',
  header: '状态',
  cell: ({ getValue }) => {
    const status = getValue();
    return <Badge variant={status === 'active' ? 'success' : 'default'}>{status}</Badge>;
  }
}
```

### Handling Data Changes
```typescript
const handleDataChange = (newData: DataType[], changeInfo: ChangeInfo) => {
  // Update local state
  setData(newData);

  // Send to server
  if (changeInfo.type === 'edit') {
    updateRowOnServer(changeInfo.changes[0]);
  } else if (changeInfo.type === 'paste') {
    batchUpdateServer(changeInfo.changes);
  }
};
```

## Important Notes

- **Performance**: ~2300 lines with extensive optimization (useMemo, useCallback)
- **Testing**: Comprehensive test suite in `AdvancedTable.test.tsx`
- **Storybook**: 14+ stories demonstrating all features
- **Documentation**: Full architecture in `CLAUDE.md`
- **Path Alias**: Use `@/` which maps to `./src/`
- **Type Safety**: Fully typed with TypeScript generics

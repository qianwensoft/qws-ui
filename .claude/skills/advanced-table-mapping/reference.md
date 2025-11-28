# AdvancedTable Reference

## File Paths
- **Component**: `src/components/AdvancedTable.tsx` (2324 lines)
- **Styles**: `src/components/AdvancedTable.css`
- **Tests**: `src/components/AdvancedTable.test.tsx`
- **Stories**: `src/stories/AdvancedTable.stories.tsx`
- **Test Documentation**: `src/components/AdvancedTable.test.md`

## Key Functions

### handlePaste() [Line ~1800]
Parses tab/newline delimited clipboard data and creates rows as needed.

**Features:**
- Automatically detects clipboard format
- Creates new rows if pasting beyond existing data
- Tracks changes with detailed changeInfo
- Handles multi-cell paste operations

### filterRows() [Line ~800]
Client-side filtering with support for 12 operators.

**Operators:**
- `equals`, `notEquals`
- `contains`, `notContains`
- `startsWith`, `endsWith`
- `greaterThan`, `lessThan`
- `greaterThanOrEqual`, `lessThanOrEqual`
- `isEmpty`, `isNotEmpty`

**Server-side Mode:**
When `onFilterChange` prop is provided, filtering is delegated to server.

### handleCellEdit() [Line ~1200]
Manages cell editing with support for different edit modes.

**Edit Modes:**
- `click`: Single click to edit
- `doubleClick`: Double click to edit

**Features:**
- Auto-save on blur
- Escape to cancel
- Enter to save and move to next row
- Respects `meta.editable` column property

### Column Reordering [Line ~1500]
Uses `@dnd-kit/sortable` with `horizontalListSortingStrategy`.

**Implementation:**
- `useSensors` hook for drag detection
- `arrayMove` for reordering logic
- Persists order in component state
- Visual feedback during drag

### Excel Export [Line ~2000]
Exports table data to Excel using ExcelJS.

**Features:**
- Respects current filters and sort
- Includes column headers
- Auto-sizes columns
- Handles formatting

## Props Interface

```typescript
interface AdvancedTableProps<T> {
  // Required
  data: T[];
  columns: ColumnDef<T>[];

  // Callbacks
  onDataChange?: (newData: T[], changeInfo: ChangeInfo) => void;
  onFilterChange?: (filters: FilterState[]) => void;
  onSelectionChange?: (selection: SelectionInfo) => void;

  // Features
  editMode?: 'click' | 'doubleClick';
  enableExcelPaste?: boolean;
  enableColumnReordering?: boolean;
  enableRowSelection?: boolean;

  // Pagination
  pageSize?: number;
  pageSizeOptions?: number[];

  // Styling
  className?: string;
}
```

## Column Definition

```typescript
interface ColumnDef<T> {
  accessorKey: string;
  header: string;
  cell?: (info: CellContext<T>) => React.ReactNode;
  meta?: {
    editable?: boolean;
    filterOperator?: FilterOperator;
    className?: string;
  };
  size?: number;
  minSize?: number;
  maxSize?: number;
}
```

## Change Info Structure

```typescript
interface ChangeInfo {
  type: 'edit' | 'paste';
  changes: Array<{
    rowIndex: number;
    columnId: string;
    oldValue: any;
    newValue: any;
  }>;
  timestamp?: number;
}
```

## Selection Info Structure

```typescript
interface SelectionInfo {
  startRow: number;
  endRow: number;
  startCol: number;
  endCol: number;
  selectedCells: Array<{
    rowIndex: number;
    columnId: string;
    value: any;
  }>;
}
```

## Related Components

### AdvancedForm
- **Location**: `src/components/AdvancedForm.tsx`
- **Use Case**: Form component with TanStack Form
- **Integration**: Can be used alongside AdvancedTable for data entry

### PrintDesigner
- **Location**: `src/components/PrintDesigner.tsx`
- **Use Case**: Canvas-based template designer
- **Integration**: Supports table binding with AdvancedTable component

## Dependencies

### Core Dependencies
- `@tanstack/react-table` (^8.10.7): Table state management
- `@dnd-kit/core` (^6.1.0): Drag-and-drop
- `@dnd-kit/sortable` (^7.0.2): Sortable lists
- `@dnd-kit/utilities` (^3.2.1): Drag utilities
- `exceljs` (^4.4.0): Excel export

### UI Dependencies
- `@radix-ui/react-dialog`: Modal dialogs
- `@radix-ui/react-dropdown-menu`: Dropdown menus
- `@radix-ui/react-select`: Select components
- `lucide-react`: Icons

## Testing

### Running Tests
```bash
# Run all tests
npm test

# Run with UI
npm test:ui

# Run with coverage
npm test:coverage
```

### Test Coverage
- Cell editing scenarios
- Excel paste functionality
- Filtering operations
- Column reordering
- Pagination
- Selection handling

## Storybook Examples

```bash
npm run storybook
```

**Available Stories:**
1. Default - Basic table setup
2. WithEditing - Cell editing demonstration
3. WithFiltering - Filter functionality
4. WithPagination - Pagination examples
5. WithExcelPaste - Paste from Excel
6. WithColumnReordering - Drag-and-drop columns
7. WithServerSideData - Server-side operations
8. WithCustomCells - Custom cell rendering
9. ComplexExample - All features combined

## Common Patterns

### Read-only Table
```typescript
const columns = [
  { accessorKey: 'id', header: 'ID', meta: { editable: false } },
  { accessorKey: 'name', header: '名称', meta: { editable: false } }
];
```

### Editable with Change Tracking
```typescript
<AdvancedTable
  data={data}
  columns={columns}
  onDataChange={(newData, changeInfo) => {
    logChanges(changeInfo);
    setData(newData);
  }}
/>
```

### Server-side Operations
```typescript
<AdvancedTable
  data={data}
  columns={columns}
  onFilterChange={(filters) => fetchData({ filters })}
/>
```

## Performance Tips

1. **Memoize Columns**: Use `useMemo` for column definitions
2. **Optimize Callbacks**: Use `useCallback` for event handlers
3. **Virtualization**: Consider react-window for large datasets (>1000 rows)
4. **Debounce Filters**: Debounce filter changes for server-side filtering

## Troubleshooting

### Issue: Edits Not Saving
- Check `meta.editable` is set to `true` on columns
- Verify `onDataChange` callback is provided
- Ensure `editMode` prop is set

### Issue: Filters Not Working
- Verify filter operators are supported
- Check data types match filter operations
- For server-side, ensure `onFilterChange` is implemented

### Issue: Excel Paste Not Working
- Set `enableExcelPaste={true}`
- Ensure clipboard permissions are granted
- Check console for parsing errors

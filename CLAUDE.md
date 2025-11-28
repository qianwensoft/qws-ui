# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

QWS-UI is an enterprise-level data management platform built with React + TypeScript, featuring two main components:
- **AdvancedTable**: A feature-rich table component with Excel-like editing, filtering, and export capabilities
- **PrintDesigner**: A visual print template designer based on fabric.js

## Development Commands

### Running the Application
```bash
# Development server (Vite)
npm run dev

# Preview production build
npm run preview
```

### Storybook (Recommended for Component Development)
```bash
# Development mode
npm run storybook
# Opens at http://localhost:6006

# Build static version
npm run build-storybook
# Then serve with: npx serve storybook-static
```

### Testing
```bash
# Run all tests
npm test

# Run tests with UI
npm test:ui

# Run tests with coverage
npm test:coverage
```

### Building
```bash
# Build for production
npm run build
```

## Architecture Overview

### Component Structure
- `src/components/` - Main components
  - `AdvancedTable.tsx` (~2300 lines) - Complex table with editing, filtering, pagination, Excel paste
  - `PrintDesigner.tsx` (~4200 lines) - Canvas-based print template designer
  - `AdvancedForm.tsx` - Form component with TanStack Form
  - `ui/` - shadcn/ui components (Button, Input, Select, Dialog, etc.)
- `src/stories/` - Storybook stories for each component
- `src/lib/utils.ts` - Utility function `cn()` for className merging

### Key Technologies & Patterns

**AdvancedTable Architecture:**
- Built on `@tanstack/react-table` for table state management
- Uses `@dnd-kit` for drag-and-drop column reordering
- ExcelJS for Excel export functionality
- Client-side filtering with support for 12 operators (equals, contains, greaterThan, etc.)
- Multi-cell selection with drag selection
- Excel paste: parses clipboard data, creates new rows as needed, tracks changes
- Edit modes: single-click or double-click to edit cells
- Column visibility and reordering via drag-and-drop
- Pagination with customizable page sizes

**PrintDesigner Architecture:**
- Built on fabric.js Canvas API for rendering and manipulation
- Supports text, images, barcodes, QR codes, lines, rectangles, and tables
- Data binding syntax: `{{fieldName}}` with support for expressions like `{{qty}}*100+"元"`
- Paper sizes: A4, A5, B5, Letter, plus custom dimensions
- Portrait/Landscape orientation support
- Header/footer support with independent toggle controls for printing
- Ruler system for precise positioning
- Zoom controls for design canvas
- DraggableModal component for table configuration dialogs

### UI Framework
- Uses **shadcn/ui** components with Tailwind CSS
- Components installed via: `npx shadcn@latest add <component-name>`
- Utility function `cn()` from `src/lib/utils.ts` merges Tailwind classes using `clsx` and `tailwind-merge`

### Type System
- TypeScript strict mode enabled
- Path alias: `@/*` maps to `./src/*`
- Column metadata extension via module augmentation for `@tanstack/react-table`
- Generic types used extensively in AdvancedTable for type-safe data handling

### Testing Strategy
- Vitest for unit tests
- `@testing-library/react` for component testing
- jsdom environment for DOM testing
- Storybook integration with `@storybook/addon-vitest`
- Test setup in `src/test/setup.ts`
- Coverage excludes: test files, stories, config files, type definitions

## Important Implementation Details

### AdvancedTable
- **Excel Paste Logic**: Located in the `handlePaste` function - parses tab/newline delimited clipboard data, creates rows if needed
- **Filtering**: Client-side filtering in `filterRows` function with 12 operators; supports server-side via `onFilterChange` callback
- **Column Reordering**: Uses @dnd-kit's SortableContext with horizontalListSortingStrategy
- **Cell Editing**: Two modes (click/doubleClick) with auto-save option; column-level editable control via `meta.editable`
- **Data Change Tracking**: `onDataChange` callback includes `changeInfo` with type ('edit' | 'paste') and specific changes
- **Selection**: Multi-cell selection with drag, stored as `{ startRow, endRow, startCol, endCol }`

### PrintDesigner
- **Canvas Management**: fabric.Canvas instance created in `useEffect`, cleaned up on unmount
- **Data Binding Evaluation**: Uses `new Function()` to evaluate binding expressions like `{{price}}*100`
- **Element Rendering**: Each element type (text, image, barcode, etc.) has specific rendering logic
- **Print Output**: Generates SVG via `canvas.toSVG()` for high-quality printing
- **Table Support**: Integrates AdvancedTable component within canvas for loop tables
- **Ruler System**: Custom implementation with smart label placement based on zoom level

### Styling Conventions
- Component-specific CSS files: `AdvancedTable.css`, `PrintDesigner.css`
- Tailwind utility classes for shadcn/ui components
- CSS custom properties for theme colors (defined in `src/index.css`)
- Grid layout for PrintDesigner main container
- Flexbox for toolbars and controls

## Common Development Tasks

### Adding a New shadcn/ui Component
```bash
npx shadcn@latest add <component-name>
# Example: npx shadcn@latest add dropdown-menu
```

### Working with AdvancedTable
- When adding features, consider both client-side and server-side scenarios
- Use `onDataChange` callback for tracking all data modifications
- Column definitions use `@tanstack/react-table` ColumnDef interface
- Meta properties on columns control behavior (e.g., `meta.editable`)

### Working with PrintDesigner
- fabric.js objects are managed in canvas, not React state
- Use `canvas.renderAll()` to trigger re-renders after changes
- Data binding expressions are evaluated in `evaluateBinding()` function
- Template structure stored as `PrintTemplate` interface with elements array

### Testing Components
- Stories provide comprehensive examples - reference them when adding features
- Test files use `.test.tsx` extension
- Run `npm run storybook` to see all component variations
- Each story demonstrates specific functionality (filtering, pagination, editing, etc.)

## Code Quality Notes

- Strict TypeScript configuration with `noUnusedLocals` and `noUnusedParameters`
- ESM modules throughout (type: "module" in package.json)
- React 18+ with modern hooks patterns
- Functional components with TypeScript interfaces for props
- Extensive use of useMemo and useCallback for performance optimization

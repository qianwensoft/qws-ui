# QWS-UI Component Registry

This directory contains the shadcn-style component registry for QWS-UI. The registry allows you to install QWS-UI components in any project using the shadcn CLI.

## 📦 Available Components

### 1. Advanced Table
Feature-rich table component with Excel-like editing, filtering, and export capabilities.

**Features:**
- 📝 Single/double-click edit modes with auto-save
- 📋 Excel paste with automatic row creation
- 🔍 12 filter operators with multi-condition support
- 📊 Export to Excel with styling
- 🎯 Column drag-and-drop, resize, show/hide
- 📄 Pagination with custom page sizes
- 🎨 Zebra stripes, cross-highlighting, multi-cell selection

### 2. Print Designer
Visual print template designer based on fabric.js.

**Features:**
- 🖼️ Drag-and-drop design interface
- 📐 Rulers, grid, alignment guides
- 🔤 Text, images, barcodes, QR codes, lines, rectangles, tables
- 📊 Loop tables with dynamic data
- 📄 Independent header/footer controls
- 📏 Multiple paper sizes + custom dimensions
- 🔄 Data binding with expressions: `{{fieldName}}`

### 3. Advanced Form
Advanced form component built with TanStack Form.

**Features:**
- Field validation
- Dynamic fields
- Complex form handling

## 🚀 Usage

### Installing from This Registry

#### 1. Configure the Registry

Add the QWS-UI registry to your `components.json`:

```json
{
  "registries": {
    "qws": "http://localhost:5173/r"
  }
}
```

Or if you're using a hosted version:

```json
{
  "registries": {
    "qws": "https://yourdomain.com/r"
  }
}
```

#### 2. Install Components

Install components using the shadcn CLI with the registry namespace:

```bash
# Install Advanced Table
npx shadcn@latest add @qws/advanced-table

# Install Print Designer
npx shadcn@latest add @qws/print-designer

# Install Advanced Form
npx shadcn@latest add @qws/advanced-form
```

The CLI will automatically:
- Download component files to your project
- Install all required dependencies
- Install registry dependencies (shadcn/ui components)

### Using Components in Your Project

After installation, import and use the components:

```tsx
import { AdvancedTable } from '@/components/advanced-table';
import type { ColumnDef } from '@tanstack/react-table';

interface Product {
  id: string;
  name: string;
  price: number;
}

const columns: ColumnDef<Product>[] = [
  { id: 'name', accessorKey: 'name', header: '产品名称' },
  { id: 'price', accessorKey: 'price', header: '价格' },
];

export function MyTable() {
  const [data, setData] = useState<Product[]>([]);

  return (
    <AdvancedTable
      data={data}
      columns={columns}
      onDataChange={setData}
      enableEditing={true}
      enablePaste={true}
    />
  );
}
```

## 📂 Directory Structure

```
registry/
├── registry.json              # Main registry configuration
├── default/                   # Default style
│   ├── advanced-table/
│   │   ├── advanced-table.tsx
│   │   └── advanced-table.css
│   ├── print-designer/
│   │   ├── print-designer.tsx
│   │   └── print-designer.css
│   └── advanced-form/
│       ├── advanced-form.tsx
│       └── advanced-form.css
└── README.md                  # This file
```

## 🔧 Building the Registry

To rebuild the registry files:

```bash
npm run build:registry
```

This script:
1. Copies component files from `src/components` to `registry/default`
2. Generates JSON configuration files in `public/r/`
3. Creates the main registry index at `public/r/index.json`

## 🌐 Hosting Your Registry

### Local Development

For local development, serve the `public` directory:

```bash
npm run dev
# Registry available at http://localhost:5173/r
```

### Production Deployment

Deploy the `public/r` directory to any static hosting service:

- **Vercel/Netlify**: Automatically serves the `public` directory
- **GitHub Pages**: Configure to serve from the `public` directory
- **Custom Server**: Serve `public/r` at your domain's `/r` path

Example nginx configuration:

```nginx
location /r {
    alias /path/to/qws-ui/public/r;
    try_files $uri $uri/ =404;
    add_header Access-Control-Allow-Origin *;
}
```

## 📖 Component Documentation

For detailed component documentation and examples, see:
- [Storybook](../storybook-static/index.html) - Interactive component demos
- [Main README](../README.md) - Project overview and quick start
- [History README](../README_HISTORY.md) - Detailed API documentation

## 🔗 References

- [shadcn/ui Registry Documentation](https://ui.shadcn.com/docs/registry)
- [shadcn/ui CLI](https://ui.shadcn.com/docs/cli)
- [Creating Custom Registries](https://ui.shadcn.com/docs/registry/getting-started)

---

Built with ❤️ using the shadcn/ui registry system

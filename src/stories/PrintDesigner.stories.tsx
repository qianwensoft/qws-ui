import type { Meta, StoryObj } from '@storybook/react';
import { useState, Suspense, lazy } from 'react';
import type { PrintTemplate } from '../components/PrintDesigner';

// 动态导入 PrintDesigner 避免 fabric.js 加载问题
const PrintDesignerLazy = lazy(() => 
  import('../components/PrintDesigner').then(module => ({ default: module.PrintDesigner }))
);

// Loading 组件
const Loading = () => (
  <div style={{ 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    height: '100vh',
    fontSize: '16px',
    color: '#595959',
  }}>
    加载打印设计器...
  </div>
);

// Story 元数据
const meta: Meta = {
  title: 'Components/PrintDesigner',
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

// 示例数据 - 产品信息
const productData = {
  productName: '苹果 iPhone 15 Pro',
  productCode: 'IP15PRO-256-BLK',
  price: 7999,
  originalPrice: 8999,
  unit: '台',
  qty: 150,
  warehouse: '北京仓',
  category: '数码产品',
  brand: 'Apple',
  supplier: '苹果授权经销商',
  date: '2024-11-26',
  barcode: '1234567890123',
};

// 示例数据 - 订单信息
const orderData = {
  orderNo: 'ORD20241126001',
  customerName: '张三',
  phone: '13800138000',
  address: '北京市朝阳区xx街道xx号',
  totalAmount: 15998,
  discount: 500,
  finalAmount: 15498,
  orderDate: '2024-11-26',
  deliveryDate: '2024-11-28',
  items: 2,
  paymentMethod: '微信支付',
};

// 基础模板
const basicTemplate: PrintTemplate = {
  name: '产品标签',
  paper: { size: 'A4', orientation: 'portrait' },
  elements: [
    {
      id: 'title',
      type: 'text',
      left: 20,
      top: 20,
      binding: '{{productName}}',
      fontSize: 24,
      fontWeight: 'bold',
      fill: '#000000',
    },
    {
      id: 'code',
      type: 'text',
      left: 20,
      top: 55,
      binding: '"商品编码: "+{{productCode}}',
      fontSize: 14,
      fill: '#595959',
    },
    {
      id: 'price',
      type: 'text',
      left: 20,
      top: 85,
      binding: '"￥"+{{price}}',
      fontSize: 32,
      fontWeight: 'bold',
      fill: '#ff4d4f',
    },
    {
      id: 'qty',
      type: 'text',
      left: 20,
      top: 130,
      binding: '"库存: "+{{qty}}+"件"',
      fontSize: 16,
      fill: '#000000',
    },
  ],
};

// 复杂模板（带计算）
const advancedTemplate: PrintTemplate = {
  name: '价格标签',
  paper: { size: 'A5', orientation: 'portrait' },
  elements: [
    {
      id: 'product',
      type: 'text',
      left: 15,
      top: 15,
      binding: '{{productName}}',
      fontSize: 20,
      fontWeight: 'bold',
    },
    {
      id: 'original',
      type: 'text',
      left: 15,
      top: 50,
      binding: '"原价: ￥"+{{originalPrice}}',
      fontSize: 14,
      fill: '#8c8c8c',
    },
    {
      id: 'current',
      type: 'text',
      left: 15,
      top: 75,
      binding: '"现价: ￥"+{{price}}',
      fontSize: 20,
      fontWeight: 'bold',
      fill: '#ff4d4f',
    },
    {
      id: 'discount',
      type: 'text',
      left: 15,
      top: 110,
      binding: '"立省 ￥"+({{originalPrice}}-{{price}})',
      fontSize: 16,
      fill: '#52c41a',
    },
    {
      id: 'unit',
      type: 'text',
      left: 15,
      top: 140,
      binding: '"单位: "+{{unit}}',
      fontSize: 12,
      fill: '#595959',
    },
  ],
};

// 订单模板
const orderTemplate: PrintTemplate = {
  name: '订单详情',
  paper: { size: 'A4', orientation: 'portrait' },
  elements: [
    {
      id: 'header',
      type: 'text',
      left: 80,
      top: 20,
      binding: '"订单详情"',
      fontSize: 28,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    {
      id: 'orderNo',
      type: 'text',
      left: 20,
      top: 70,
      binding: '"订单编号: "+{{orderNo}}',
      fontSize: 14,
    },
    {
      id: 'customer',
      type: 'text',
      left: 20,
      top: 95,
      binding: '"客户姓名: "+{{customerName}}',
      fontSize: 14,
    },
    {
      id: 'phone',
      type: 'text',
      left: 20,
      top: 120,
      binding: '"联系电话: "+{{phone}}',
      fontSize: 14,
    },
    {
      id: 'address',
      type: 'text',
      left: 20,
      top: 145,
      binding: '"收货地址: "+{{address}}',
      fontSize: 14,
      width: 170,
    },
    {
      id: 'total',
      type: 'text',
      left: 20,
      top: 185,
      binding: '"总金额: ￥"+{{totalAmount}}',
      fontSize: 16,
      fontWeight: 'bold',
    },
    {
      id: 'final',
      type: 'text',
      left: 20,
      top: 215,
      binding: '"实付金额: ￥"+{{finalAmount}}',
      fontSize: 18,
      fontWeight: 'bold',
      fill: '#ff4d4f',
    },
  ],
};

// Story 1: 基础示例
export const Basic: Story = {
  render: () => {
    const [template, setTemplate] = useState<PrintTemplate>(basicTemplate);

    return (
      <Suspense fallback={<Loading />}>
        <PrintDesignerLazy
          template={template}
          data={productData}
          onTemplateChange={(newTemplate) => {
            setTemplate(newTemplate);
            console.log('模板已更新:', newTemplate);
          }}
          readOnly={false}
          showToolbar={true}
        />
      </Suspense>
    );
  },
};

// Story 2: A5 横向
export const A5Landscape: Story = {
  render: () => {
    const [template, setTemplate] = useState<PrintTemplate>({
      ...basicTemplate,
      paper: { size: 'A5', orientation: 'landscape' },
    });

    return (
      <Suspense fallback={<Loading />}>
        <PrintDesignerLazy
        template={template}
        data={productData}
        onTemplateChange={setTemplate}
      />
      </Suspense>
    );
  },
};

// Story 3: 复杂计算公式
export const AdvancedFormula: Story = {
  render: () => {
    const [template, setTemplate] = useState<PrintTemplate>(advancedTemplate);

    return (
      <Suspense fallback={<Loading />}>
        <PrintDesignerLazy
        template={template}
        data={productData}
        onTemplateChange={setTemplate}
      />
      </Suspense>
    );
  },
};

// Story 4: 订单打印
export const OrderPrint: Story = {
  render: () => {
    const [template, setTemplate] = useState<PrintTemplate>(orderTemplate);

    return (
      <Suspense fallback={<Loading />}>
        <PrintDesignerLazy
        template={template}
        data={orderData}
        onTemplateChange={setTemplate}
      />
      </Suspense>
    );
  },
};

// Story 5: 只读模式（预览）
export const ReadOnly: Story = {
  render: () => {
    return (
      <Suspense fallback={<Loading />}>
        <PrintDesignerLazy
        template={basicTemplate}
        data={productData}
        readOnly={true}
        showToolbar={false}
      />
      </Suspense>
    );
  },
};

// Story 6: B5 纸张
export const B5Paper: Story = {
  render: () => {
    const [template, setTemplate] = useState<PrintTemplate>({
      ...basicTemplate,
      paper: { size: 'B5', orientation: 'portrait' },
    });

    return (
      <Suspense fallback={<Loading />}>
        <PrintDesignerLazy
        template={template}
        data={productData}
        onTemplateChange={setTemplate}
      />
      </Suspense>
    );
  },
};

// Story 7: 空模板（从零开始设计）
export const EmptyTemplate: Story = {
  render: () => {
    const [template, setTemplate] = useState<PrintTemplate>({
      name: '新模板',
      paper: { size: 'A4', orientation: 'portrait' },
      elements: [],
    });

    return (
      <Suspense fallback={<Loading />}>
        <PrintDesignerLazy
        template={template}
        data={productData}
        onTemplateChange={setTemplate}
      />
      </Suspense>
    );
  },
};

// Story 8: 多种数据源
export const MultipleDataSources: Story = {
  render: () => {
    const [template, setTemplate] = useState<PrintTemplate>({
      name: '综合信息',
      paper: { size: 'A4', orientation: 'portrait' },
      elements: [
        {
          id: 'header',
          type: 'text',
          left: 20,
          top: 20,
          binding: '"商品信息卡"',
          fontSize: 24,
          fontWeight: 'bold',
        },
        {
          id: 'product',
          type: 'text',
          left: 20,
          top: 60,
          binding: '"产品: "+{{productName}}',
          fontSize: 16,
        },
        {
          id: 'brand',
          type: 'text',
          left: 20,
          top: 85,
          binding: '"品牌: "+{{brand}}',
          fontSize: 14,
        },
        {
          id: 'category',
          type: 'text',
          left: 20,
          top: 110,
          binding: '"类别: "+{{category}}',
          fontSize: 14,
        },
        {
          id: 'calculation',
          type: 'text',
          left: 20,
          top: 140,
          binding: '"总价值: ￥"+({{price}}*{{qty}})',
          fontSize: 18,
          fontWeight: 'bold',
          fill: '#1890ff',
        },
        {
          id: 'supplier',
          type: 'text',
          left: 20,
          top: 175,
          binding: '"供应商: "+{{supplier}}',
          fontSize: 12,
          fill: '#8c8c8c',
        },
      ],
    });

    return (
      <Suspense fallback={<Loading />}>
        <PrintDesignerLazy
        template={template}
        data={productData}
        onTemplateChange={setTemplate}
      />
      </Suspense>
    );
  },
};


// 循环表格示例数据（增加数据量以展示分页效果）
const tableData = {
  customerName: '张三',
  orderNo: 'ORD202411260001',
  orderDate: '2024-11-26',
  items: [
    { name: 'iPhone 15 Pro 256GB 深空黑色', qty: 2, price: 7999, amount: 15998 },
    { name: 'MacBook Pro 14英寸 M3 Pro芯片', qty: 1, price: 14999, amount: 14999 },
    { name: 'AirPods Pro 2代 主动降噪', qty: 3, price: 1899, amount: 5697 },
    { name: 'Apple Watch Series 9 GPS 45mm', qty: 1, price: 2999, amount: 2999 },
    { name: 'iPad Air 第五代 256GB WLAN', qty: 2, price: 4799, amount: 9598 },
    { name: 'Magic Keyboard 妙控键盘', qty: 2, price: 1099, amount: 2198 },
    { name: 'Magic Mouse 妙控鼠标', qty: 2, price: 799, amount: 1598 },
    { name: 'AirTag 4件装 防丢追踪器', qty: 1, price: 799, amount: 799 },
    { name: 'Apple Pencil 第二代 手写笔', qty: 2, price: 969, amount: 1938 },
    { name: 'iPhone 15 硅胶保护壳', qty: 3, price: 399, amount: 1197 },
    { name: 'MagSafe 双项充电器', qty: 2, price: 1049, amount: 2098 },
    { name: 'USB-C 转 Lightning 连接线', qty: 5, price: 145, amount: 725 },
    { name: '20W USB-C 电源适配器', qty: 3, price: 149, amount: 447 },
    { name: 'HomePod mini 智能音箱 白色', qty: 2, price: 749, amount: 1498 },
    { name: 'AirTag 皮革钥匙扣', qty: 2, price: 279, amount: 558 },
    { name: 'iPhone 15 Pro 透明保护壳', qty: 2, price: 399, amount: 798 },
    { name: 'Apple TV 4K 128GB', qty: 1, price: 1499, amount: 1499 },
    { name: 'iPad Pro 11英寸 M2 512GB', qty: 1, price: 7999, amount: 7999 },
    { name: 'MacBook Air 13英寸 M2 512GB', qty: 1, price: 9499, amount: 9499 },
    { name: 'Mac mini M2 芯片 256GB', qty: 1, price: 4299, amount: 4299 },
    { name: 'Studio Display 27英寸 5K', qty: 1, price: 11499, amount: 11499 },
    { name: 'iPhone 14 Pro Max 1TB 暗紫色', qty: 1, price: 10999, amount: 10999 },
    { name: 'Magic Trackpad 妙控板 黑色', qty: 1, price: 1099, amount: 1099 },
    { name: 'Beats Studio Pro 头戴式耳机', qty: 2, price: 2699, amount: 5398 },
    { name: 'Apple Care+ 服务计划 iPhone', qty: 2, price: 1398, amount: 2796 },
    { name: 'Thunderbolt 4 Pro 连接线 1.8米', qty: 2, price: 1169, amount: 2338 },
    { name: 'MagSafe 充电宝 5000mAh', qty: 3, price: 749, amount: 2247 },
    { name: 'iPhone 15 Pro MagSafe 皮革钱包', qty: 2, price: 469, amount: 938 },
    { name: 'AirPods Max 头戴式耳机 银色', qty: 1, price: 4399, amount: 4399 },
    { name: 'Apple Polishing Cloth 清洁布', qty: 5, price: 145, amount: 725 },
  ],
  totalAmount: 138940,
};

// Story 9: 循环表格打印（多页展示）
export const LoopTable: Story = {
  render: () => {
    const [template, setTemplate] = useState<PrintTemplate>({
      name: '订单明细表',
      paper: { size: 'A4', orientation: 'portrait', headerHeight: 30, footerHeight: 30 },
      elements: [
        {
          id: 'title',
          type: 'text',
          left: 75,
          top: 10,
          binding: '"订单明细表"',
          fontSize: 20,
          fontWeight: 'bold',
          textAlign: 'center',
        },
        {
          id: 'orderInfo',
          type: 'text',
          left: 20,
          top: 40,
          binding: '"订单号: "+{{orderNo}}+"  客户: "+{{customerName}}+"  日期: "+{{orderDate}}',
          fontSize: 12,
        },
        {
          id: 'itemsTable',
          type: 'table',
          left: 20,
          top: 60,
          width: 170,
          height: 260,  // 增加高度以容纳更多数据（30行 * 8mm + 表头10mm = 250mm）
          isLoopTable: true,
          tableConfig: {
            dataSource: 'items',
            columns: [
              { field: 'name', title: '商品名称', width: 70, align: 'left' },
              { field: 'qty', title: '数量', width: 30, align: 'center' },
              { field: 'price', title: '单价', width: 35, align: 'right', formatter: '￥{{value}}' },
              { field: 'price*qty', title: '金额', width: 35, align: 'right', formatter: '￥{{value}}' },
            ],
            rowHeight: 8,
            headerHeight: 10,
            showHeader: true,
            headerRepeat: true,
            borderWidth: 1,
            borderColor: '#000000',
            headerBgColor: '#e6f7ff',
            headerTextColor: '#000000',
            evenRowBgColor: '#fafafa',
          },
        },
        {
          id: 'total',
          type: 'text',
          left: 150,
          top: 330,  // 调整到表格之后
          binding: '"合计: ￥"+{{totalAmount}}',
          fontSize: 16,
          fontWeight: 'bold',
          fill: '#ff4d4f',
          textAlign: 'right',
        },
      ],
    });

    return (
      <Suspense fallback={<Loading />}>
        <PrintDesignerLazy
          template={template}
          data={tableData}
          onTemplateChange={setTemplate}
        />
      </Suspense>
    );
  },
};

const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./PrintDesigner-DAzCgc0q.js","./jsx-runtime-DpLjie1_.js","./iframe-BaxaaamU.js","./preload-helper-C1FmrZbK.js","./AdvancedTable-CMrVWdg7.js","./index-BwdWuC4-.js","./AdvancedTable-D-YSN5Sp.css","./PrintDesigner-ByXkXHnf.css"])))=>i.map(i=>d[i]);
import{_ as F}from"./preload-helper-C1FmrZbK.js";import{j as e}from"./jsx-runtime-DpLjie1_.js";import{r as t}from"./iframe-BaxaaamU.js";const r=t.lazy(()=>F(()=>import("./PrintDesigner-DAzCgc0q.js"),__vite__mapDeps([0,1,2,3,4,5,6,7]),import.meta.url).then(a=>({default:a.PrintDesigner}))),o=()=>e.jsx("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",fontSize:"16px",color:"#595959"},children:"加载打印设计器..."}),$={title:"Components/PrintDesigner",parameters:{layout:"fullscreen"},tags:["autodocs"]},i={productName:"苹果 iPhone 15 Pro",productCode:"IP15PRO-256-BLK",price:7999,originalPrice:8999,unit:"台",qty:150,warehouse:"北京仓",category:"数码产品",brand:"Apple",supplier:"苹果授权经销商",date:"2024-11-26",barcode:"1234567890123"},U={orderNo:"ORD20241126001",customerName:"张三",phone:"13800138000",address:"北京市朝阳区xx街道xx号",totalAmount:15998,discount:500,finalAmount:15498,orderDate:"2024-11-26",deliveryDate:"2024-11-28",items:2,paymentMethod:"微信支付"},h={name:"产品标签",paper:{size:"A4",orientation:"portrait"},elements:[{id:"title",type:"text",left:20,top:20,binding:"{{productName}}",fontSize:24,fontWeight:"bold",fill:"#000000"},{id:"code",type:"text",left:20,top:55,binding:'"商品编码: "+{{productCode}}',fontSize:14,fill:"#595959"},{id:"price",type:"text",left:20,top:85,binding:'"￥"+{{price}}',fontSize:32,fontWeight:"bold",fill:"#ff4d4f"},{id:"qty",type:"text",left:20,top:130,binding:'"库存: "+{{qty}}+"件"',fontSize:16,fill:"#000000"}]},V={name:"价格标签",paper:{size:"A5",orientation:"portrait"},elements:[{id:"product",type:"text",left:15,top:15,binding:"{{productName}}",fontSize:20,fontWeight:"bold"},{id:"original",type:"text",left:15,top:50,binding:'"原价: ￥"+{{originalPrice}}',fontSize:14,fill:"#8c8c8c"},{id:"current",type:"text",left:15,top:75,binding:'"现价: ￥"+{{price}}',fontSize:20,fontWeight:"bold",fill:"#ff4d4f"},{id:"discount",type:"text",left:15,top:110,binding:'"立省 ￥"+({{originalPrice}}-{{price}})',fontSize:16,fill:"#52c41a"},{id:"unit",type:"text",left:15,top:140,binding:'"单位: "+{{unit}}',fontSize:12,fill:"#595959"}]},J={name:"订单详情",paper:{size:"A4",orientation:"portrait"},elements:[{id:"header",type:"text",left:80,top:20,binding:'"订单详情"',fontSize:28,fontWeight:"bold",textAlign:"center"},{id:"orderNo",type:"text",left:20,top:70,binding:'"订单编号: "+{{orderNo}}',fontSize:14},{id:"customer",type:"text",left:20,top:95,binding:'"客户姓名: "+{{customerName}}',fontSize:14},{id:"phone",type:"text",left:20,top:120,binding:'"联系电话: "+{{phone}}',fontSize:14},{id:"address",type:"text",left:20,top:145,binding:'"收货地址: "+{{address}}',fontSize:14,width:170},{id:"total",type:"text",left:20,top:185,binding:'"总金额: ￥"+{{totalAmount}}',fontSize:16,fontWeight:"bold"},{id:"final",type:"text",left:20,top:215,binding:'"实付金额: ￥"+{{finalAmount}}',fontSize:18,fontWeight:"bold",fill:"#ff4d4f"}]},p={render:()=>{const[a,n]=t.useState(h);return e.jsx(t.Suspense,{fallback:e.jsx(o,{}),children:e.jsx(r,{template:a,data:i,onTemplateChange:y=>{n(y),console.log("模板已更新:",y)},readOnly:!1,showToolbar:!0})})}},l={render:()=>{const[a,n]=t.useState({...h,paper:{size:"A5",orientation:"landscape"}});return e.jsx(t.Suspense,{fallback:e.jsx(o,{}),children:e.jsx(r,{template:a,data:i,onTemplateChange:n})})}},s={render:()=>{const[a,n]=t.useState(V);return e.jsx(t.Suspense,{fallback:e.jsx(o,{}),children:e.jsx(r,{template:a,data:i,onTemplateChange:n})})}},d={render:()=>{const[a,n]=t.useState(J);return e.jsx(t.Suspense,{fallback:e.jsx(o,{}),children:e.jsx(r,{template:a,data:U,onTemplateChange:n})})}},m={render:()=>e.jsx(t.Suspense,{fallback:e.jsx(o,{}),children:e.jsx(r,{template:h,data:i,readOnly:!0,showToolbar:!1})})},c={render:()=>{const[a,n]=t.useState({...h,paper:{size:"B5",orientation:"portrait"}});return e.jsx(t.Suspense,{fallback:e.jsx(o,{}),children:e.jsx(r,{template:a,data:i,onTemplateChange:n})})}},u={render:()=>{const[a,n]=t.useState({name:"新模板",paper:{size:"A4",orientation:"portrait"},elements:[]});return e.jsx(t.Suspense,{fallback:e.jsx(o,{}),children:e.jsx(r,{template:a,data:i,onTemplateChange:n})})}},f={render:()=>{const[a,n]=t.useState({name:"综合信息",paper:{size:"A4",orientation:"portrait"},elements:[{id:"header",type:"text",left:20,top:20,binding:'"商品信息卡"',fontSize:24,fontWeight:"bold"},{id:"product",type:"text",left:20,top:60,binding:'"产品: "+{{productName}}',fontSize:16},{id:"brand",type:"text",left:20,top:85,binding:'"品牌: "+{{brand}}',fontSize:14},{id:"category",type:"text",left:20,top:110,binding:'"类别: "+{{category}}',fontSize:14},{id:"calculation",type:"text",left:20,top:140,binding:'"总价值: ￥"+({{price}}*{{qty}})',fontSize:18,fontWeight:"bold",fill:"#1890ff"},{id:"supplier",type:"text",left:20,top:175,binding:'"供应商: "+{{supplier}}',fontSize:12,fill:"#8c8c8c"}]});return e.jsx(t.Suspense,{fallback:e.jsx(o,{}),children:e.jsx(r,{template:a,data:i,onTemplateChange:n})})}},Q={customerName:"张三",orderNo:"ORD202411260001",orderDate:"2024-11-26",items:[{name:"iPhone 15 Pro 256GB 深空黑色",qty:2,price:7999,amount:15998},{name:"MacBook Pro 14英寸 M3 Pro芯片",qty:1,price:14999,amount:14999},{name:"AirPods Pro 2代 主动降噪",qty:3,price:1899,amount:5697},{name:"Apple Watch Series 9 GPS 45mm",qty:1,price:2999,amount:2999},{name:"iPad Air 第五代 256GB WLAN",qty:2,price:4799,amount:9598},{name:"Magic Keyboard 妙控键盘",qty:2,price:1099,amount:2198},{name:"Magic Mouse 妙控鼠标",qty:2,price:799,amount:1598},{name:"AirTag 4件装 防丢追踪器",qty:1,price:799,amount:799},{name:"Apple Pencil 第二代 手写笔",qty:2,price:969,amount:1938},{name:"iPhone 15 硅胶保护壳",qty:3,price:399,amount:1197},{name:"MagSafe 双项充电器",qty:2,price:1049,amount:2098},{name:"USB-C 转 Lightning 连接线",qty:5,price:145,amount:725},{name:"20W USB-C 电源适配器",qty:3,price:149,amount:447},{name:"HomePod mini 智能音箱 白色",qty:2,price:749,amount:1498},{name:"AirTag 皮革钥匙扣",qty:2,price:279,amount:558},{name:"iPhone 15 Pro 透明保护壳",qty:2,price:399,amount:798},{name:"Apple TV 4K 128GB",qty:1,price:1499,amount:1499},{name:"iPad Pro 11英寸 M2 512GB",qty:1,price:7999,amount:7999},{name:"MacBook Air 13英寸 M2 512GB",qty:1,price:9499,amount:9499},{name:"Mac mini M2 芯片 256GB",qty:1,price:4299,amount:4299},{name:"Studio Display 27英寸 5K",qty:1,price:11499,amount:11499},{name:"iPhone 14 Pro Max 1TB 暗紫色",qty:1,price:10999,amount:10999},{name:"Magic Trackpad 妙控板 黑色",qty:1,price:1099,amount:1099},{name:"Beats Studio Pro 头戴式耳机",qty:2,price:2699,amount:5398},{name:"Apple Care+ 服务计划 iPhone",qty:2,price:1398,amount:2796},{name:"Thunderbolt 4 Pro 连接线 1.8米",qty:2,price:1169,amount:2338},{name:"MagSafe 充电宝 5000mAh",qty:3,price:749,amount:2247},{name:"iPhone 15 Pro MagSafe 皮革钱包",qty:2,price:469,amount:938},{name:"AirPods Max 头戴式耳机 银色",qty:1,price:4399,amount:4399},{name:"Apple Polishing Cloth 清洁布",qty:5,price:145,amount:725}],totalAmount:138940},g={render:()=>{const[a,n]=t.useState({name:"订单明细表",paper:{size:"A4",orientation:"portrait",headerHeight:30,footerHeight:30},elements:[{id:"title",type:"text",left:75,top:10,binding:'"订单明细表"',fontSize:20,fontWeight:"bold",textAlign:"center"},{id:"orderInfo",type:"text",left:20,top:40,binding:'"订单号: "+{{orderNo}}+"  客户: "+{{customerName}}+"  日期: "+{{orderDate}}',fontSize:12},{id:"itemsTable",type:"table",left:20,top:60,width:170,height:260,isLoopTable:!0,tableConfig:{dataSource:"items",columns:[{field:"name",title:"商品名称",width:70,align:"left"},{field:"qty",title:"数量",width:30,align:"center"},{field:"price",title:"单价",width:35,align:"right",formatter:"￥{{value}}"},{field:"price*qty",title:"金额",width:35,align:"right",formatter:"￥{{value}}"}],rowHeight:8,headerHeight:10,showHeader:!0,headerRepeat:!0,borderWidth:1,borderColor:"#000000",headerBgColor:"#e6f7ff",headerTextColor:"#000000",evenRowBgColor:"#fafafa"}},{id:"total",type:"text",left:150,top:330,binding:'"合计: ￥"+{{totalAmount}}',fontSize:16,fontWeight:"bold",fill:"#ff4d4f",textAlign:"right"}]});return e.jsx(t.Suspense,{fallback:e.jsx(o,{}),children:e.jsx(r,{template:a,data:Q,onTemplateChange:n})})}};var b,S,x;p.parameters={...p.parameters,docs:{...(b=p.parameters)==null?void 0:b.docs,source:{originalSource:`{
  render: () => {
    const [template, setTemplate] = useState<PrintTemplate>(basicTemplate);
    return <Suspense fallback={<Loading />}>
        <PrintDesignerLazy template={template} data={productData} onTemplateChange={newTemplate => {
        setTemplate(newTemplate);
        console.log('模板已更新:', newTemplate);
      }} readOnly={false} showToolbar={true} />
      </Suspense>;
  }
}`,...(x=(S=p.parameters)==null?void 0:S.docs)==null?void 0:x.source}}};var T,z,P;l.parameters={...l.parameters,docs:{...(T=l.parameters)==null?void 0:T.docs,source:{originalSource:`{
  render: () => {
    const [template, setTemplate] = useState<PrintTemplate>({
      ...basicTemplate,
      paper: {
        size: 'A5',
        orientation: 'landscape'
      }
    });
    return <Suspense fallback={<Loading />}>
        <PrintDesignerLazy template={template} data={productData} onTemplateChange={setTemplate} />
      </Suspense>;
  }
}`,...(P=(z=l.parameters)==null?void 0:z.docs)==null?void 0:P.source}}};var A,q,D;s.parameters={...s.parameters,docs:{...(A=s.parameters)==null?void 0:A.docs,source:{originalSource:`{
  render: () => {
    const [template, setTemplate] = useState<PrintTemplate>(advancedTemplate);
    return <Suspense fallback={<Loading />}>
        <PrintDesignerLazy template={template} data={productData} onTemplateChange={setTemplate} />
      </Suspense>;
  }
}`,...(D=(q=s.parameters)==null?void 0:q.docs)==null?void 0:D.source}}};var C,j,L;d.parameters={...d.parameters,docs:{...(C=d.parameters)==null?void 0:C.docs,source:{originalSource:`{
  render: () => {
    const [template, setTemplate] = useState<PrintTemplate>(orderTemplate);
    return <Suspense fallback={<Loading />}>
        <PrintDesignerLazy template={template} data={orderData} onTemplateChange={setTemplate} />
      </Suspense>;
  }
}`,...(L=(j=d.parameters)==null?void 0:j.docs)==null?void 0:L.source}}};var w,B,k;m.parameters={...m.parameters,docs:{...(w=m.parameters)==null?void 0:w.docs,source:{originalSource:`{
  render: () => {
    return <Suspense fallback={<Loading />}>
        <PrintDesignerLazy template={basicTemplate} data={productData} readOnly={true} showToolbar={false} />
      </Suspense>;
  }
}`,...(k=(B=m.parameters)==null?void 0:B.docs)==null?void 0:k.source}}};var W,M,N;c.parameters={...c.parameters,docs:{...(W=c.parameters)==null?void 0:W.docs,source:{originalSource:`{
  render: () => {
    const [template, setTemplate] = useState<PrintTemplate>({
      ...basicTemplate,
      paper: {
        size: 'B5',
        orientation: 'portrait'
      }
    });
    return <Suspense fallback={<Loading />}>
        <PrintDesignerLazy template={template} data={productData} onTemplateChange={setTemplate} />
      </Suspense>;
  }
}`,...(N=(M=c.parameters)==null?void 0:M.docs)==null?void 0:N.source}}};var v,O,H;u.parameters={...u.parameters,docs:{...(v=u.parameters)==null?void 0:v.docs,source:{originalSource:`{
  render: () => {
    const [template, setTemplate] = useState<PrintTemplate>({
      name: '新模板',
      paper: {
        size: 'A4',
        orientation: 'portrait'
      },
      elements: []
    });
    return <Suspense fallback={<Loading />}>
        <PrintDesignerLazy template={template} data={productData} onTemplateChange={setTemplate} />
      </Suspense>;
  }
}`,...(H=(O=u.parameters)==null?void 0:O.docs)==null?void 0:H.source}}};var R,_,E;f.parameters={...f.parameters,docs:{...(R=f.parameters)==null?void 0:R.docs,source:{originalSource:`{
  render: () => {
    const [template, setTemplate] = useState<PrintTemplate>({
      name: '综合信息',
      paper: {
        size: 'A4',
        orientation: 'portrait'
      },
      elements: [{
        id: 'header',
        type: 'text',
        left: 20,
        top: 20,
        binding: '"商品信息卡"',
        fontSize: 24,
        fontWeight: 'bold'
      }, {
        id: 'product',
        type: 'text',
        left: 20,
        top: 60,
        binding: '"产品: "+{{productName}}',
        fontSize: 16
      }, {
        id: 'brand',
        type: 'text',
        left: 20,
        top: 85,
        binding: '"品牌: "+{{brand}}',
        fontSize: 14
      }, {
        id: 'category',
        type: 'text',
        left: 20,
        top: 110,
        binding: '"类别: "+{{category}}',
        fontSize: 14
      }, {
        id: 'calculation',
        type: 'text',
        left: 20,
        top: 140,
        binding: '"总价值: ￥"+({{price}}*{{qty}})',
        fontSize: 18,
        fontWeight: 'bold',
        fill: '#1890ff'
      }, {
        id: 'supplier',
        type: 'text',
        left: 20,
        top: 175,
        binding: '"供应商: "+{{supplier}}',
        fontSize: 12,
        fill: '#8c8c8c'
      }]
    });
    return <Suspense fallback={<Loading />}>
        <PrintDesignerLazy template={template} data={productData} onTemplateChange={setTemplate} />
      </Suspense>;
  }
}`,...(E=(_=f.parameters)==null?void 0:_.docs)==null?void 0:E.source}}};var G,I,K;g.parameters={...g.parameters,docs:{...(G=g.parameters)==null?void 0:G.docs,source:{originalSource:`{
  render: () => {
    const [template, setTemplate] = useState<PrintTemplate>({
      name: '订单明细表',
      paper: {
        size: 'A4',
        orientation: 'portrait',
        headerHeight: 30,
        footerHeight: 30
      },
      elements: [{
        id: 'title',
        type: 'text',
        left: 75,
        top: 10,
        binding: '"订单明细表"',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center'
      }, {
        id: 'orderInfo',
        type: 'text',
        left: 20,
        top: 40,
        binding: '"订单号: "+{{orderNo}}+"  客户: "+{{customerName}}+"  日期: "+{{orderDate}}',
        fontSize: 12
      }, {
        id: 'itemsTable',
        type: 'table',
        left: 20,
        top: 60,
        width: 170,
        height: 260,
        isLoopTable: true,
        tableConfig: {
          dataSource: 'items',
          columns: [{
            field: 'name',
            title: '商品名称',
            width: 70,
            align: 'left'
          }, {
            field: 'qty',
            title: '数量',
            width: 30,
            align: 'center'
          }, {
            field: 'price',
            title: '单价',
            width: 35,
            align: 'right',
            formatter: '￥{{value}}'
          }, {
            field: 'price*qty',
            title: '金额',
            width: 35,
            align: 'right',
            formatter: '￥{{value}}'
          }],
          rowHeight: 8,
          headerHeight: 10,
          showHeader: true,
          headerRepeat: true,
          borderWidth: 1,
          borderColor: '#000000',
          headerBgColor: '#e6f7ff',
          headerTextColor: '#000000',
          evenRowBgColor: '#fafafa'
        }
      }, {
        id: 'total',
        type: 'text',
        left: 150,
        top: 330,
        binding: '"合计: ￥"+{{totalAmount}}',
        fontSize: 16,
        fontWeight: 'bold',
        fill: '#ff4d4f',
        textAlign: 'right'
      }]
    });
    return <Suspense fallback={<Loading />}>
        <PrintDesignerLazy template={template} data={tableData} onTemplateChange={setTemplate} />
      </Suspense>;
  }
}`,...(K=(I=g.parameters)==null?void 0:I.docs)==null?void 0:K.source}}};const ee=["Basic","A5Landscape","AdvancedFormula","OrderPrint","ReadOnly","B5Paper","EmptyTemplate","MultipleDataSources","LoopTable"];export{l as A5Landscape,s as AdvancedFormula,c as B5Paper,p as Basic,u as EmptyTemplate,g as LoopTable,f as MultipleDataSources,d as OrderPrint,m as ReadOnly,ee as __namedExportsOrder,$ as default};

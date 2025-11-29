import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { AdvancedForm, validators, type FieldConfig, type FormSubmitResult } from '../components/AdvancedForm';
import '../components/advanced-form.css';

// 用户注册表单数据类型
interface UserRegisterForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  age: number;
  gender: string;
  bio: string;
  agreeTerms: boolean;
}

// 联系表单数据类型
interface ContactForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  contactMethod: string;
}

// 产品表单数据类型
interface ProductForm {
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
  featured: boolean;
  status: string;
}

const meta: Meta<typeof AdvancedForm> = {
  title: 'Components/AdvancedForm',
  component: AdvancedForm,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
# 高级表单组件 (AdvancedForm)

基于 \`@tanstack/react-form\` 构建的功能强大的表单组件，提供丰富的验证、布局和交互功能。

## ✨ 核心特性

### 📝 表单验证
- **内置验证器**：required、email、phone、url、min、max、pattern 等
- **自定义验证**：支持自定义验证函数
- **验证时机**：onChange、onBlur 可配置
- **实时反馈**：即时显示验证错误

### 🎨 多种布局
- **垂直布局**：标签在上，控件在下（默认）
- **水平布局**：标签在左，控件在右
- **行内布局**：字段横向排列

### 🔧 丰富的字段类型
支持 12 种字段类型：
- **文本类**：text、email、password、tel、url
- **数字类**：number、date
- **多行文本**：textarea
- **选择类**：select、radio、checkbox

### 🚀 强大的功能
- **TanStack Form 集成**：利用强大的表单状态管理
- **TypeScript 支持**：完整的类型推断和检查
- **响应式设计**：适配各种屏幕尺寸
- **提交状态管理**：自动处理 loading、error 状态
- **表单重置**：支持提交后自动重置

## 🎯 快速开始

\`\`\`tsx
import { AdvancedForm, validators } from './components/AdvancedForm';

interface MyForm {
  name: string;
  email: string;
}

const fields = [
  {
    name: 'name',
    label: '姓名',
    required: true,
    validate: validators.required('请输入姓名'),
  },
  {
    name: 'email',
    label: '邮箱',
    type: 'email',
    validate: validators.compose(
      validators.required(),
      validators.email()
    ),
  },
];

function App() {
  const handleSubmit = async (data: MyForm) => {
    // 处理表单提交
    return { success: true, data };
  };

  return (
    <AdvancedForm
      fields={fields}
      onSubmit={handleSubmit}
      layout="vertical"
    />
  );
}
\`\`\`

## 📚 示例列表

浏览下方的示例了解各种功能的使用方法。
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// 1. 基础表单
export const Basic: Story = {
  parameters: {
    docs: {
      description: {
        story: `
### 基础表单

最简单的表单示例，包含基本的文本输入和验证。

**特点：**
- 垂直布局
- 基础字段类型
- 简单验证
        `,
      },
    },
  },
  render: () => {
    const fields: FieldConfig<ContactForm>[] = [
      {
        name: 'name',
        label: '姓名',
        type: 'text',
        placeholder: '请输入您的姓名',
        required: true,
        validate: validators.required('姓名不能为空'),
      },
      {
        name: 'email',
        label: '邮箱',
        type: 'email',
        placeholder: 'example@email.com',
        required: true,
        validate: validators.compose(
          validators.required('邮箱不能为空'),
          validators.email()
        ),
      },
      {
        name: 'message',
        label: '留言',
        type: 'textarea',
        placeholder: '请输入您的留言',
        rows: 4,
        validate: validators.minLength(10, '留言至少需要 10 个字符'),
      },
    ];

    const handleSubmit = async (data: ContactForm): Promise<FormSubmitResult<ContactForm>> => {
      console.log('表单提交:', data);
      // 模拟 API 调用
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert(`提交成功！\n姓名: ${data.name}\n邮箱: ${data.email}`);
      return { success: true, data };
    };

    return (
      <div style={{ padding: '20px', maxWidth: '600px' }}>
        <h2>联系我们</h2>
        <p>请填写以下信息，我们会尽快回复您。</p>
        <AdvancedForm
          fields={fields}
          onSubmit={handleSubmit}
          showCancelButton={false}
        />
      </div>
    );
  },
};

// 2. 用户注册表单
export const UserRegistration: Story = {
  parameters: {
    docs: {
      description: {
        story: `
### 用户注册表单

完整的用户注册表单，包含密码确认、年龄验证、协议同意等。

**特点：**
- 多种字段类型
- 复杂验证规则
- 密码确认验证
- 复选框协议
        `,
      },
    },
  },
  render: () => {
    const fields: FieldConfig<UserRegisterForm>[] = [
      {
        name: 'username',
        label: '用户名',
        type: 'text',
        placeholder: '请输入用户名',
        required: true,
        validate: validators.compose(
          validators.required('用户名不能为空'),
          validators.minLength(3, '用户名至少 3 个字符'),
          validators.maxLength(20, '用户名最多 20 个字符'),
          validators.pattern(/^[a-zA-Z0-9_]+$/, '用户名只能包含字母、数字和下划线')
        ),
        helperText: '3-20个字符，只能包含字母、数字和下划线',
      },
      {
        name: 'email',
        label: '邮箱',
        type: 'email',
        placeholder: 'your@email.com',
        required: true,
        validate: validators.compose(
          validators.required('邮箱不能为空'),
          validators.email()
        ),
      },
      {
        name: 'password',
        label: '密码',
        type: 'password',
        placeholder: '请输入密码',
        required: true,
        validate: validators.compose(
          validators.required('密码不能为空'),
          validators.minLength(6, '密码至少 6 个字符')
        ),
        helperText: '至少 6 个字符',
      },
      {
        name: 'confirmPassword',
        label: '确认密码',
        type: 'password',
        placeholder: '请再次输入密码',
        required: true,
        validate: (value: string) => {
          // 注意：这里无法直接访问其他字段，需要在表单级别验证
          if (!value) return '请确认密码';
          return undefined;
        },
      },
      {
        name: 'age',
        label: '年龄',
        type: 'number',
        placeholder: '请输入年龄',
        required: true,
        min: 18,
        max: 100,
        validate: validators.compose(
          validators.required('年龄不能为空'),
          validators.min(18, '必须年满 18 岁'),
          validators.max(100, '年龄不能超过 100 岁')
        ),
      },
      {
        name: 'gender',
        label: '性别',
        type: 'select',
        required: true,
        options: [
          { label: '男', value: 'male' },
          { label: '女', value: 'female' },
          { label: '其他', value: 'other' },
        ],
        validate: validators.required('请选择性别'),
      },
      {
        name: 'bio',
        label: '个人简介',
        type: 'textarea',
        placeholder: '介绍一下自己...',
        rows: 4,
        validate: validators.maxLength(200, '个人简介最多 200 个字符'),
        helperText: '最多 200 个字符',
      },
      {
        name: 'agreeTerms',
        label: '我已阅读并同意服务条款和隐私政策',
        type: 'checkbox',
        required: true,
        validate: (value: boolean) => {
          return value ? undefined : '请同意服务条款';
        },
      },
    ];

    const handleSubmit = async (data: UserRegisterForm): Promise<FormSubmitResult<UserRegisterForm>> => {
      console.log('注册数据:', data);

      // 验证密码确认
      if (data.password !== data.confirmPassword) {
        return {
          success: false,
          errors: {
            confirmPassword: '两次输入的密码不一致',
          },
        };
      }

      // 模拟 API 调用
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      alert(`注册成功！\n用户名: ${data.username}\n邮箱: ${data.email}`);
      return { success: true, data };
    };

    return (
      <div style={{ padding: '20px', maxWidth: '600px' }}>
        <h2>用户注册</h2>
        <AdvancedForm
          fields={fields}
          onSubmit={handleSubmit}
          submitText="注册"
          showCancelButton={false}
          resetOnSubmit={true}
        />
      </div>
    );
  },
};

// 3. 水平布局
export const HorizontalLayout: Story = {
  parameters: {
    docs: {
      description: {
        story: `
### 水平布局

标签在左，控件在右的水平布局方式。

**适用场景：** 表单字段较少，屏幕空间充足时使用。
        `,
      },
    },
  },
  render: () => {
    const fields: FieldConfig<ProductForm>[] = [
      {
        name: 'name',
        label: '产品名称',
        type: 'text',
        placeholder: '请输入产品名称',
        required: true,
        validate: validators.required('产品名称不能为空'),
      },
      {
        name: 'category',
        label: '产品分类',
        type: 'select',
        required: true,
        options: [
          { label: '电子产品', value: 'electronics' },
          { label: '服装', value: 'clothing' },
          { label: '食品', value: 'food' },
          { label: '图书', value: 'books' },
        ],
        validate: validators.required('请选择分类'),
      },
      {
        name: 'price',
        label: '价格',
        type: 'number',
        placeholder: '0.00',
        required: true,
        min: 0,
        step: 0.01,
        validate: validators.compose(
          validators.required('价格不能为空'),
          validators.min(0, '价格不能为负数')
        ),
      },
      {
        name: 'stock',
        label: '库存',
        type: 'number',
        placeholder: '0',
        required: true,
        min: 0,
        validate: validators.compose(
          validators.required('库存不能为空'),
          validators.min(0, '库存不能为负数')
        ),
      },
      {
        name: 'description',
        label: '产品描述',
        type: 'textarea',
        placeholder: '请输入产品描述',
        rows: 3,
      },
      {
        name: 'featured',
        label: '是否推荐',
        type: 'checkbox',
      },
    ];

    const handleSubmit = async (data: ProductForm): Promise<FormSubmitResult<ProductForm>> => {
      console.log('产品数据:', data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert(`产品添加成功！\n名称: ${data.name}\n价格: ¥${data.price}`);
      return { success: true, data };
    };

    return (
      <div style={{ padding: '20px', maxWidth: '800px' }}>
        <h2>添加产品</h2>
        <AdvancedForm
          fields={fields}
          onSubmit={handleSubmit}
          layout="horizontal"
          submitText="添加产品"
          cancelText="重置"
          showCancelButton={true}
          onCancel={() => alert('取消操作')}
        />
      </div>
    );
  },
};

// 4. 行内布局
export const InlineLayout: Story = {
  parameters: {
    docs: {
      description: {
        story: `
### 行内布局

字段横向排列的紧凑布局方式。

**适用场景：** 搜索表单、筛选表单等字段较少的场景。
        `,
      },
    },
  },
  render: () => {
    interface SearchForm {
      keyword: string;
      category: string;
      dateFrom: string;
      dateTo: string;
    }

    const fields: FieldConfig<SearchForm>[] = [
      {
        name: 'keyword',
        label: '关键词',
        type: 'text',
        placeholder: '搜索...',
      },
      {
        name: 'category',
        label: '分类',
        type: 'select',
        options: [
          { label: '全部', value: '' },
          { label: '文章', value: 'article' },
          { label: '视频', value: 'video' },
          { label: '图片', value: 'image' },
        ],
      },
      {
        name: 'dateFrom',
        label: '开始日期',
        type: 'date',
      },
      {
        name: 'dateTo',
        label: '结束日期',
        type: 'date',
      },
    ];

    const handleSubmit = async (data: SearchForm): Promise<FormSubmitResult<SearchForm>> => {
      console.log('搜索条件:', data);
      alert(`搜索中...\n关键词: ${data.keyword || '(无)'}\n分类: ${data.category || '全部'}`);
      return { success: true, data };
    };

    return (
      <div style={{ padding: '20px' }}>
        <h2>搜索筛选</h2>
        <AdvancedForm
          fields={fields}
          onSubmit={handleSubmit}
          layout="inline"
          submitText="搜索"
          cancelText="重置"
          showCancelButton={true}
          onCancel={() => console.log('重置搜索')}
        />
      </div>
    );
  },
};

// 5. 单选按钮
export const RadioButtons: Story = {
  parameters: {
    docs: {
      description: {
        story: `
### 单选按钮

使用单选按钮进行单项选择。

**适用场景：** 选项较少（2-5个），需要明确展示所有选项的场景。
        `,
      },
    },
  },
  render: () => {
    interface SurveyForm {
      satisfaction: string;
      recommend: string;
      feedback: string;
    }

    const fields: FieldConfig<SurveyForm>[] = [
      {
        name: 'satisfaction',
        label: '您对我们的服务满意吗？',
        type: 'radio',
        required: true,
        options: [
          { label: '非常满意', value: '5' },
          { label: '满意', value: '4' },
          { label: '一般', value: '3' },
          { label: '不满意', value: '2' },
          { label: '非常不满意', value: '1' },
        ],
        validate: validators.required('请选择满意度'),
      },
      {
        name: 'recommend',
        label: '您是否会推荐给朋友？',
        type: 'radio',
        required: true,
        options: [
          { label: '会', value: 'yes' },
          { label: '不会', value: 'no' },
          { label: '不确定', value: 'maybe' },
        ],
        validate: validators.required('请选择'),
      },
      {
        name: 'feedback',
        label: '其他意见或建议',
        type: 'textarea',
        placeholder: '请输入您的意见或建议',
        rows: 4,
      },
    ];

    const handleSubmit = async (data: SurveyForm): Promise<FormSubmitResult<SurveyForm>> => {
      console.log('调查问卷:', data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert('感谢您的反馈！');
      return { success: true, data };
    };

    return (
      <div style={{ padding: '20px', maxWidth: '600px' }}>
        <h2>满意度调查</h2>
        <AdvancedForm
          fields={fields}
          onSubmit={handleSubmit}
          submitText="提交问卷"
          showCancelButton={false}
        />
      </div>
    );
  },
};

// 6. 验证器组合
export const ValidatorComposition: Story = {
  parameters: {
    docs: {
      description: {
        story: `
### 验证器组合

展示如何使用内置验证器和自定义验证器。

**内置验证器：**
- \`validators.required()\` - 必填
- \`validators.email()\` - 邮箱格式
- \`validators.phone()\` - 手机号格式
- \`validators.url()\` - URL 格式
- \`validators.minLength()\` - 最小长度
- \`validators.maxLength()\` - 最大长度
- \`validators.min()\` - 最小值
- \`validators.max()\` - 最大值
- \`validators.pattern()\` - 正则匹配
- \`validators.compose()\` - 组合多个验证器
        `,
      },
    },
  },
  render: () => {
    interface ValidationForm {
      email: string;
      phone: string;
      website: string;
      username: string;
      age: number;
    }

    const fields: FieldConfig<ValidationForm>[] = [
      {
        name: 'email',
        label: '邮箱地址',
        type: 'email',
        placeholder: 'example@email.com',
        required: true,
        validate: validators.compose(
          validators.required('邮箱不能为空'),
          validators.email('请输入有效的邮箱地址')
        ),
      },
      {
        name: 'phone',
        label: '手机号码',
        type: 'tel',
        placeholder: '13800138000',
        required: true,
        validate: validators.compose(
          validators.required('手机号不能为空'),
          validators.phone('请输入有效的手机号码')
        ),
      },
      {
        name: 'website',
        label: '个人网站',
        type: 'url',
        placeholder: 'https://example.com',
        validate: validators.url('请输入有效的 URL'),
        helperText: '必须以 http:// 或 https:// 开头',
      },
      {
        name: 'username',
        label: '用户名',
        type: 'text',
        placeholder: '请输入用户名',
        required: true,
        validate: validators.compose(
          validators.required('用户名不能为空'),
          validators.minLength(3, '用户名至少 3 个字符'),
          validators.maxLength(15, '用户名最多 15 个字符'),
          validators.pattern(/^[a-z][a-z0-9_]*$/, '用户名必须以小写字母开头，只能包含小写字母、数字和下划线')
        ),
        helperText: '3-15个字符，以小写字母开头',
      },
      {
        name: 'age',
        label: '年龄',
        type: 'number',
        placeholder: '请输入年龄',
        required: true,
        validate: validators.compose(
          validators.required('年龄不能为空'),
          validators.min(1, '年龄必须大于 0'),
          validators.max(150, '年龄不能超过 150')
        ),
      },
    ];

    const handleSubmit = async (data: ValidationForm): Promise<FormSubmitResult<ValidationForm>> => {
      console.log('验证通过，提交数据:', data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert('所有字段验证通过！');
      return { success: true, data };
    };

    return (
      <div style={{ padding: '20px', maxWidth: '600px' }}>
        <h2>验证器示例</h2>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          尝试输入不同的值，查看各种验证规则的效果。
        </p>
        <AdvancedForm
          fields={fields}
          onSubmit={handleSubmit}
          validateOnChange={true}
          validateOnBlur={true}
          showCancelButton={false}
        />
      </div>
    );
  },
};

// 7. 禁用状态
export const DisabledState: Story = {
  parameters: {
    docs: {
      description: {
        story: `
### 禁用状态

展示表单的禁用状态，可以禁用整个表单或单个字段。
        `,
      },
    },
  },
  render: () => {
    const [isDisabled, setIsDisabled] = useState(true);

    interface ProfileForm {
      name: string;
      email: string;
      phone: string;
      address: string;
    }

    const fields: FieldConfig<ProfileForm>[] = [
      {
        name: 'name',
        label: '姓名',
        type: 'text',
        defaultValue: '张三',
      },
      {
        name: 'email',
        label: '邮箱',
        type: 'email',
        defaultValue: 'zhangsan@example.com',
        disabled: true, // 单个字段禁用
      },
      {
        name: 'phone',
        label: '手机',
        type: 'tel',
        defaultValue: '13800138000',
      },
      {
        name: 'address',
        label: '地址',
        type: 'textarea',
        defaultValue: '北京市朝阳区',
        rows: 2,
      },
    ];

    const handleSubmit = async (data: ProfileForm): Promise<FormSubmitResult<ProfileForm>> => {
      console.log('更新资料:', data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert('资料更新成功！');
      setIsDisabled(true);
      return { success: true, data };
    };

    return (
      <div style={{ padding: '20px', maxWidth: '600px' }}>
        <h2>个人资料</h2>
        <div style={{ marginBottom: '20px' }}>
          <button
            onClick={() => setIsDisabled(!isDisabled)}
            style={{
              padding: '8px 16px',
              background: '#1890ff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {isDisabled ? '编辑资料' : '取消编辑'}
          </button>
        </div>
        <AdvancedForm
          fields={fields}
          onSubmit={handleSubmit}
          disabled={isDisabled}
          initialValues={{
            name: '张三',
            email: 'zhangsan@example.com',
            phone: '13800138000',
            address: '北京市朝阳区',
          }}
          submitText="保存"
          cancelText="取消"
          showCancelButton={true}
          onCancel={() => setIsDisabled(true)}
        />
      </div>
    );
  },
};

// 8. 动态表单
export const DynamicForm: Story = {
  parameters: {
    docs: {
      description: {
        story: `
### 动态表单

根据用户选择动态显示不同的字段。
        `,
      },
    },
  },
  render: () => {
    const [userType, setUserType] = useState<string>('individual');

    interface DynamicFormData {
      userType: string;
      name: string;
      email: string;
      companyName?: string;
      taxId?: string;
      studentId?: string;
      school?: string;
    }

    const getFields = (): FieldConfig<DynamicFormData>[] => {
      const baseFields: FieldConfig<DynamicFormData>[] = [
        {
          name: 'userType',
          label: '用户类型',
          type: 'select',
          required: true,
          options: [
            { label: '个人用户', value: 'individual' },
            { label: '企业用户', value: 'company' },
            { label: '学生用户', value: 'student' },
          ],
          defaultValue: userType,
        },
        {
          name: 'name',
          label: '姓名',
          type: 'text',
          placeholder: '请输入姓名',
          required: true,
          validate: validators.required('姓名不能为空'),
        },
        {
          name: 'email',
          label: '邮箱',
          type: 'email',
          placeholder: 'your@email.com',
          required: true,
          validate: validators.compose(
            validators.required('邮箱不能为空'),
            validators.email()
          ),
        },
      ];

      if (userType === 'company') {
        baseFields.push(
          {
            name: 'companyName',
            label: '公司名称',
            type: 'text',
            placeholder: '请输入公司名称',
            required: true,
            validate: validators.required('公司名称不能为空'),
          },
          {
            name: 'taxId',
            label: '税号',
            type: 'text',
            placeholder: '请输入税号',
            required: true,
            validate: validators.required('税号不能为空'),
          }
        );
      } else if (userType === 'student') {
        baseFields.push(
          {
            name: 'school',
            label: '学校',
            type: 'text',
            placeholder: '请输入学校名称',
            required: true,
            validate: validators.required('学校不能为空'),
          },
          {
            name: 'studentId',
            label: '学号',
            type: 'text',
            placeholder: '请输入学号',
            required: true,
            validate: validators.required('学号不能为空'),
          }
        );
      }

      return baseFields;
    };

    const handleSubmit = async (data: DynamicFormData): Promise<FormSubmitResult<DynamicFormData>> => {
      setUserType(data.userType);
      console.log('提交数据:', data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert(`注册成功！\n用户类型: ${data.userType === 'individual' ? '个人' : data.userType === 'company' ? '企业' : '学生'}\n姓名: ${data.name}`);
      return { success: true, data };
    };

    return (
      <div style={{ padding: '20px', maxWidth: '600px' }}>
        <h2>动态表单示例</h2>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          根据用户类型显示不同的字段
        </p>
        <AdvancedForm
          key={userType} // 重新渲染表单
          fields={getFields()}
          onSubmit={handleSubmit}
          initialValues={{ userType }}
          showCancelButton={false}
        />
      </div>
    );
  },
};


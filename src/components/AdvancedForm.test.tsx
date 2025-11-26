import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AdvancedForm, validators, type FieldConfig, type FormSubmitResult } from './AdvancedForm';

// 测试数据类型
interface TestForm {
  name: string;
  email: string;
  age: number;
  gender: string;
  bio: string;
  agreeTerms: boolean;
}

describe('AdvancedForm 组件测试', () => {
  describe('基础渲染', () => {
    it('应该正确渲染表单', () => {
      const fields: FieldConfig<TestForm>[] = [
        { name: 'name', label: '姓名', type: 'text' },
        { name: 'email', label: '邮箱', type: 'email' },
      ];

      const handleSubmit = vi.fn();

      render(<AdvancedForm fields={fields} onSubmit={handleSubmit} />);

      expect(screen.getByLabelText('姓名')).toBeInTheDocument();
      expect(screen.getByLabelText('邮箱')).toBeInTheDocument();
      expect(screen.getByText('提交')).toBeInTheDocument();
    });

    it('应该渲染所有字段类型', () => {
      const fields: FieldConfig<any>[] = [
        { name: 'text', label: '文本', type: 'text' },
        { name: 'email', label: '邮箱', type: 'email' },
        { name: 'password', label: '密码', type: 'password' },
        { name: 'number', label: '数字', type: 'number' },
        { name: 'textarea', label: '文本域', type: 'textarea' },
        { name: 'select', label: '选择', type: 'select', options: [{ label: '选项1', value: '1' }] },
        { name: 'checkbox', label: '复选框', type: 'checkbox' },
        { name: 'radio', label: '单选', type: 'radio', options: [{ label: '选项1', value: '1' }] },
      ];

      const handleSubmit = vi.fn();

      render(<AdvancedForm fields={fields} onSubmit={handleSubmit} />);

      expect(screen.getByLabelText('文本')).toBeInTheDocument();
      expect(screen.getByLabelText('邮箱')).toBeInTheDocument();
      expect(screen.getByLabelText('密码')).toBeInTheDocument();
      expect(screen.getByLabelText('数字')).toBeInTheDocument();
      expect(screen.getByLabelText('文本域')).toBeInTheDocument();
      expect(screen.getByLabelText('选择')).toBeInTheDocument();
      expect(screen.getByLabelText('复选框')).toBeInTheDocument();
    });

    it('应该显示必填标记', () => {
      const fields: FieldConfig<TestForm>[] = [
        { name: 'name', label: '姓名', type: 'text', required: true },
      ];

      const handleSubmit = vi.fn();

      render(<AdvancedForm fields={fields} onSubmit={handleSubmit} />);

      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('应该显示占位符', () => {
      const fields: FieldConfig<TestForm>[] = [
        { name: 'name', label: '姓名', type: 'text', placeholder: '请输入姓名' },
      ];

      const handleSubmit = vi.fn();

      render(<AdvancedForm fields={fields} onSubmit={handleSubmit} />);

      const input = screen.getByPlaceholderText('请输入姓名');
      expect(input).toBeInTheDocument();
    });

    it('应该显示帮助文本', () => {
      const fields: FieldConfig<TestForm>[] = [
        { name: 'name', label: '姓名', type: 'text', helperText: '这是帮助文本' },
      ];

      const handleSubmit = vi.fn();

      render(<AdvancedForm fields={fields} onSubmit={handleSubmit} />);

      expect(screen.getByText('这是帮助文本')).toBeInTheDocument();
    });
  });

  describe('表单布局', () => {
    it('应该使用垂直布局', () => {
      const fields: FieldConfig<TestForm>[] = [
        { name: 'name', label: '姓名', type: 'text' },
      ];

      const handleSubmit = vi.fn();

      const { container } = render(
        <AdvancedForm fields={fields} onSubmit={handleSubmit} layout="vertical" />
      );

      expect(container.querySelector('.advanced-form-vertical')).toBeInTheDocument();
    });

    it('应该使用水平布局', () => {
      const fields: FieldConfig<TestForm>[] = [
        { name: 'name', label: '姓名', type: 'text' },
      ];

      const handleSubmit = vi.fn();

      const { container } = render(
        <AdvancedForm fields={fields} onSubmit={handleSubmit} layout="horizontal" />
      );

      expect(container.querySelector('.advanced-form-horizontal')).toBeInTheDocument();
    });

    it('应该使用行内布局', () => {
      const fields: FieldConfig<TestForm>[] = [
        { name: 'name', label: '姓名', type: 'text' },
      ];

      const handleSubmit = vi.fn();

      const { container } = render(
        <AdvancedForm fields={fields} onSubmit={handleSubmit} layout="inline" />
      );

      expect(container.querySelector('.advanced-form-inline')).toBeInTheDocument();
    });
  });

  describe('表单值输入', () => {
    it('应该正确处理文本输入', async () => {
      const user = userEvent.setup();
      const fields: FieldConfig<TestForm>[] = [
        { name: 'name', label: '姓名', type: 'text' },
      ];

      const handleSubmit = vi.fn().mockResolvedValue({ success: true });

      render(<AdvancedForm fields={fields} onSubmit={handleSubmit} />);

      const input = screen.getByLabelText('姓名');
      await user.type(input, '张三');

      expect(input).toHaveValue('张三');
    });

    it('应该正确处理数字输入', async () => {
      const user = userEvent.setup();
      const fields: FieldConfig<TestForm>[] = [
        { name: 'age', label: '年龄', type: 'number' },
      ];

      const handleSubmit = vi.fn().mockResolvedValue({ success: true });

      render(<AdvancedForm fields={fields} onSubmit={handleSubmit} />);

      const input = screen.getByLabelText('年龄');
      await user.type(input, '25');

      expect(input).toHaveValue(25);
    });

    it('应该正确处理文本域输入', async () => {
      const user = userEvent.setup();
      const fields: FieldConfig<TestForm>[] = [
        { name: 'bio', label: '简介', type: 'textarea' },
      ];

      const handleSubmit = vi.fn().mockResolvedValue({ success: true });

      render(<AdvancedForm fields={fields} onSubmit={handleSubmit} />);

      const textarea = screen.getByLabelText('简介');
      await user.type(textarea, '这是简介');

      expect(textarea).toHaveValue('这是简介');
    });

    it('应该正确处理选择框', async () => {
      const user = userEvent.setup();
      const fields: FieldConfig<TestForm>[] = [
        {
          name: 'gender',
          label: '性别',
          type: 'select',
          options: [
            { label: '男', value: 'male' },
            { label: '女', value: 'female' },
          ],
        },
      ];

      const handleSubmit = vi.fn().mockResolvedValue({ success: true });

      render(<AdvancedForm fields={fields} onSubmit={handleSubmit} />);

      const select = screen.getByLabelText('性别');
      await user.selectOptions(select, 'male');

      expect(select).toHaveValue('male');
    });

    it('应该正确处理复选框', async () => {
      const user = userEvent.setup();
      const fields: FieldConfig<TestForm>[] = [
        { name: 'agreeTerms', label: '同意条款', type: 'checkbox' },
      ];

      const handleSubmit = vi.fn().mockResolvedValue({ success: true });

      render(<AdvancedForm fields={fields} onSubmit={handleSubmit} />);

      const checkbox = screen.getByLabelText('同意条款');
      await user.click(checkbox);

      expect(checkbox).toBeChecked();
    });

    it('应该正确处理单选按钮', async () => {
      const user = userEvent.setup();
      const fields: FieldConfig<TestForm>[] = [
        {
          name: 'gender',
          label: '性别',
          type: 'radio',
          options: [
            { label: '男', value: 'male' },
            { label: '女', value: 'female' },
          ],
        },
      ];

      const handleSubmit = vi.fn().mockResolvedValue({ success: true });

      render(<AdvancedForm fields={fields} onSubmit={handleSubmit} />);

      const maleRadio = screen.getByLabelText('男');
      await user.click(maleRadio);

      expect(maleRadio).toBeChecked();
    });
  });

  describe('表单验证', () => {
    it('应该显示验证错误', async () => {
      const user = userEvent.setup();
      const fields: FieldConfig<TestForm>[] = [
        {
          name: 'name',
          label: '姓名',
          type: 'text',
          required: true,
          validate: validators.required('姓名不能为空'),
        },
      ];

      const handleSubmit = vi.fn().mockResolvedValue({ success: true });

      render(<AdvancedForm fields={fields} onSubmit={handleSubmit} validateOnBlur={true} />);

      // 使用 id 而不是 label 来查找（因为 label 包含了 * 标记）
      const input = screen.getByRole('textbox', { name: /姓名/ });
      await user.click(input);
      await user.tab(); // 触发 blur

      await waitFor(() => {
        expect(screen.getByText('姓名不能为空')).toBeInTheDocument();
      });
    });

    it('应该验证邮箱格式', async () => {
      const user = userEvent.setup();
      const fields: FieldConfig<TestForm>[] = [
        {
          name: 'email',
          label: '邮箱',
          type: 'email',
          validate: validators.email('邮箱格式不正确'),
        },
      ];

      const handleSubmit = vi.fn().mockResolvedValue({ success: true });

      render(<AdvancedForm fields={fields} onSubmit={handleSubmit} validateOnChange={true} />);

      const input = screen.getByLabelText('邮箱');
      await user.type(input, 'invalid-email');

      await waitFor(() => {
        expect(screen.getByText('邮箱格式不正确')).toBeInTheDocument();
      });
    });

    it('应该验证最小长度', async () => {
      const user = userEvent.setup();
      const fields: FieldConfig<TestForm>[] = [
        {
          name: 'name',
          label: '姓名',
          type: 'text',
          validate: validators.minLength(3, '至少需要 3 个字符'),
        },
      ];

      const handleSubmit = vi.fn().mockResolvedValue({ success: true });

      render(<AdvancedForm fields={fields} onSubmit={handleSubmit} validateOnChange={true} />);

      const input = screen.getByLabelText('姓名');
      await user.type(input, 'ab');

      await waitFor(() => {
        expect(screen.getByText('至少需要 3 个字符')).toBeInTheDocument();
      });
    });

    it('应该组合多个验证器', async () => {
      const user = userEvent.setup();
      const fields: FieldConfig<TestForm>[] = [
        {
          name: 'email',
          label: '邮箱',
          type: 'email',
          validate: validators.compose(
            validators.required('邮箱不能为空'),
            validators.email('邮箱格式不正确')
          ),
        },
      ];

      const handleSubmit = vi.fn().mockResolvedValue({ success: true });

      render(<AdvancedForm fields={fields} onSubmit={handleSubmit} validateOnBlur={true} />);

      const input = screen.getByLabelText('邮箱');
      
      // 测试必填验证
      await user.click(input);
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText('邮箱不能为空')).toBeInTheDocument();
      });

      // 测试格式验证
      await user.type(input, 'invalid');
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText('邮箱格式不正确')).toBeInTheDocument();
      });
    });
  });

  describe('表单提交', () => {
    it('应该在提交时调用 onSubmit', async () => {
      const user = userEvent.setup();
      const handleSubmit = vi.fn().mockResolvedValue({ success: true });

      const fields: FieldConfig<TestForm>[] = [
        { name: 'name', label: '姓名', type: 'text' },
      ];

      render(<AdvancedForm fields={fields} onSubmit={handleSubmit} />);

      const input = screen.getByLabelText('姓名');
      await user.type(input, '张三');

      const submitButton = screen.getByText('提交');
      await user.click(submitButton);

      await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            name: '张三',
          })
        );
      });
    });

    it('应该在提交时显示加载状态', async () => {
      const user = userEvent.setup();
      const handleSubmit = vi.fn().mockImplementation(() => {
        return new Promise((resolve) => {
          setTimeout(() => resolve({ success: true }), 100);
        });
      });

      const fields: FieldConfig<TestForm>[] = [
        { name: 'name', label: '姓名', type: 'text' },
      ];

      render(<AdvancedForm fields={fields} onSubmit={handleSubmit} />);

      const input = screen.getByLabelText('姓名');
      await user.type(input, '张三');

      const submitButton = screen.getByText('提交');
      await user.click(submitButton);

      expect(screen.getByText('提交中...')).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByText('提交')).toBeInTheDocument();
      });
    });

    it('应该处理提交错误', async () => {
      const user = userEvent.setup();
      const handleSubmit = vi.fn().mockResolvedValue({
        success: false,
        errors: {
          email: '邮箱已被使用',
        },
      });

      const fields: FieldConfig<TestForm>[] = [
        { name: 'email', label: '邮箱', type: 'email' },
      ];

      render(<AdvancedForm fields={fields} onSubmit={handleSubmit} />);

      const input = screen.getByLabelText('邮箱');
      await user.type(input, 'test@example.com');

      const submitButton = screen.getByText('提交');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('提交失败，请检查表单')).toBeInTheDocument();
      });
    });

    it('提交成功后应该重置表单（如果配置）', async () => {
      const user = userEvent.setup();
      const handleSubmit = vi.fn().mockResolvedValue({ success: true });

      const fields: FieldConfig<TestForm>[] = [
        { name: 'name', label: '姓名', type: 'text' },
      ];

      render(<AdvancedForm fields={fields} onSubmit={handleSubmit} resetOnSubmit={true} />);

      const input = screen.getByLabelText('姓名');
      await user.type(input, '张三');

      const submitButton = screen.getByText('提交');
      await user.click(submitButton);

      await waitFor(() => {
        expect(input).toHaveValue('');
      });
    });
  });

  describe('初始值', () => {
    it('应该使用初始值', () => {
      const fields: FieldConfig<TestForm>[] = [
        { name: 'name', label: '姓名', type: 'text' },
        { name: 'email', label: '邮箱', type: 'email' },
      ];

      const handleSubmit = vi.fn();

      render(
        <AdvancedForm
          fields={fields}
          onSubmit={handleSubmit}
          initialValues={{
            name: '张三',
            email: 'zhangsan@example.com',
          }}
        />
      );

      const nameInput = screen.getByLabelText('姓名');
      const emailInput = screen.getByLabelText('邮箱');

      expect(nameInput).toHaveValue('张三');
      expect(emailInput).toHaveValue('zhangsan@example.com');
    });
  });

  describe('禁用状态', () => {
    it('应该禁用整个表单', () => {
      const fields: FieldConfig<TestForm>[] = [
        { name: 'name', label: '姓名', type: 'text' },
        { name: 'email', label: '邮箱', type: 'email' },
      ];

      const handleSubmit = vi.fn();

      render(<AdvancedForm fields={fields} onSubmit={handleSubmit} disabled={true} />);

      const nameInput = screen.getByLabelText('姓名');
      const emailInput = screen.getByLabelText('邮箱');
      const submitButton = screen.getByText('提交');

      expect(nameInput).toBeDisabled();
      expect(emailInput).toBeDisabled();
      expect(submitButton).toBeDisabled();
    });

    it('应该禁用单个字段', () => {
      const fields: FieldConfig<TestForm>[] = [
        { name: 'name', label: '姓名', type: 'text', disabled: true },
        { name: 'email', label: '邮箱', type: 'email' },
      ];

      const handleSubmit = vi.fn();

      render(<AdvancedForm fields={fields} onSubmit={handleSubmit} />);

      const nameInput = screen.getByLabelText('姓名');
      const emailInput = screen.getByLabelText('邮箱');

      expect(nameInput).toBeDisabled();
      expect(emailInput).not.toBeDisabled();
    });
  });

  describe('取消按钮', () => {
    it('应该显示取消按钮', () => {
      const fields: FieldConfig<TestForm>[] = [
        { name: 'name', label: '姓名', type: 'text' },
      ];

      const handleSubmit = vi.fn();
      const handleCancel = vi.fn();

      render(
        <AdvancedForm
          fields={fields}
          onSubmit={handleSubmit}
          showCancelButton={true}
          onCancel={handleCancel}
        />
      );

      expect(screen.getByText('取消')).toBeInTheDocument();
    });

    it('应该隐藏取消按钮', () => {
      const fields: FieldConfig<TestForm>[] = [
        { name: 'name', label: '姓名', type: 'text' },
      ];

      const handleSubmit = vi.fn();

      render(<AdvancedForm fields={fields} onSubmit={handleSubmit} showCancelButton={false} />);

      expect(screen.queryByText('取消')).not.toBeInTheDocument();
    });

    it('点击取消按钮应该调用 onCancel', async () => {
      const user = userEvent.setup();
      const fields: FieldConfig<TestForm>[] = [
        { name: 'name', label: '姓名', type: 'text' },
      ];

      const handleSubmit = vi.fn();
      const handleCancel = vi.fn();

      render(
        <AdvancedForm
          fields={fields}
          onSubmit={handleSubmit}
          showCancelButton={true}
          onCancel={handleCancel}
        />
      );

      const cancelButton = screen.getByText('取消');
      await user.click(cancelButton);

      expect(handleCancel).toHaveBeenCalled();
    });
  });

  describe('自定义文本', () => {
    it('应该使用自定义提交文本', () => {
      const fields: FieldConfig<TestForm>[] = [
        { name: 'name', label: '姓名', type: 'text' },
      ];

      const handleSubmit = vi.fn();

      render(<AdvancedForm fields={fields} onSubmit={handleSubmit} submitText="保存" />);

      expect(screen.getByText('保存')).toBeInTheDocument();
    });

    it('应该使用自定义取消文本', () => {
      const fields: FieldConfig<TestForm>[] = [
        { name: 'name', label: '姓名', type: 'text' },
      ];

      const handleSubmit = vi.fn();
      const handleCancel = vi.fn();

      render(
        <AdvancedForm
          fields={fields}
          onSubmit={handleSubmit}
          cancelText="重置"
          showCancelButton={true}
          onCancel={handleCancel}
        />
      );

      expect(screen.getByText('重置')).toBeInTheDocument();
    });
  });

  describe('边界情况', () => {
    it('应该处理空字段数组', () => {
      const handleSubmit = vi.fn();

      const { container } = render(<AdvancedForm fields={[]} onSubmit={handleSubmit} />);

      const fields = container.querySelectorAll('.form-field');
      expect(fields).toHaveLength(0);
    });

    it('应该处理没有选项的选择框', () => {
      const fields: FieldConfig<TestForm>[] = [
        { name: 'gender', label: '性别', type: 'select', options: [] },
      ];

      const handleSubmit = vi.fn();

      render(<AdvancedForm fields={fields} onSubmit={handleSubmit} />);

      const select = screen.getByLabelText('性别');
      expect(select).toBeInTheDocument();
      // 只有"请选择"选项
      expect(select.children).toHaveLength(1);
    });
  });

  describe('验证器', () => {
    it('validators.required 应该验证必填', () => {
      const validate = validators.required('此字段必填');
      expect(validate('')).toBe('此字段必填');
      expect(validate(null)).toBe('此字段必填');
      expect(validate(undefined)).toBe('此字段必填');
      expect(validate('value')).toBeUndefined();
    });

    it('validators.email 应该验证邮箱格式', () => {
      const validate = validators.email();
      expect(validate('invalid')).toBe('请输入有效的邮箱地址');
      expect(validate('test@example.com')).toBeUndefined();
      expect(validate('')).toBeUndefined(); // 空值不验证
    });

    it('validators.phone 应该验证手机号', () => {
      const validate = validators.phone();
      expect(validate('12345')).toBe('请输入有效的手机号码');
      expect(validate('13800138000')).toBeUndefined();
      expect(validate('')).toBeUndefined();
    });

    it('validators.url 应该验证 URL', () => {
      const validate = validators.url();
      expect(validate('invalid')).toBe('请输入有效的 URL');
      expect(validate('https://example.com')).toBeUndefined();
      expect(validate('')).toBeUndefined();
    });

    it('validators.minLength 应该验证最小长度', () => {
      const validate = validators.minLength(5);
      expect(validate('abc')).toBe('最少需要 5 个字符');
      expect(validate('abcdef')).toBeUndefined();
      expect(validate('')).toBeUndefined();
    });

    it('validators.maxLength 应该验证最大长度', () => {
      const validate = validators.maxLength(5);
      expect(validate('abcdef')).toBe('最多允许 5 个字符');
      expect(validate('abc')).toBeUndefined();
      expect(validate('')).toBeUndefined();
    });

    it('validators.min 应该验证最小值', () => {
      const validate = validators.min(10);
      expect(validate(5)).toBe('最小值为 10');
      expect(validate(15)).toBeUndefined();
    });

    it('validators.max 应该验证最大值', () => {
      const validate = validators.max(10);
      expect(validate(15)).toBe('最大值为 10');
      expect(validate(5)).toBeUndefined();
    });

    it('validators.pattern 应该验证正则', () => {
      const validate = validators.pattern(/^\d+$/, '只能输入数字');
      expect(validate('abc')).toBe('只能输入数字');
      expect(validate('123')).toBeUndefined();
      expect(validate('')).toBeUndefined();
    });

    it('validators.compose 应该组合验证器', () => {
      const validate = validators.compose(
        validators.required('不能为空'),
        validators.minLength(3, '至少3个字符')
      );
      
      expect(validate('')).toBe('不能为空');
      expect(validate('ab')).toBe('至少3个字符');
      expect(validate('abc')).toBeUndefined();
    });
  });
});


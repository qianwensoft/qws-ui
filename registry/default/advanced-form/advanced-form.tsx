import React from 'react';
import type {DeepKeys, FieldApi} from '@tanstack/react-form';
import {useForm} from '@tanstack/react-form';
import './AdvancedForm.css';

// 字段配置类型
export interface FieldConfig<TFormData> {
    name: DeepKeys<TFormData>;
    label: string;
    type?: 'text' | 'number' | 'email' | 'password' | 'tel' | 'url' | 'date' | 'textarea' | 'select' | 'checkbox' | 'radio';
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    options?: Array<{ label: string; value: string | number }>;
    validate?: (value: any) => string | undefined;
    defaultValue?: any;
    rows?: number; // for textarea
    min?: number | string;
    max?: number | string;
    pattern?: string;
    step?: number | string;
    helperText?: string;
    className?: string;
}

// 表单布局配置
export type FormLayout = 'vertical' | 'horizontal' | 'inline';

// 表单提交结果
export interface FormSubmitResult<TFormData> {
    success: boolean;
    data?: TFormData;
    errors?: Record<string, string>;
}

// 表单组件 Props
export interface AdvancedFormProps<TFormData extends Record<string, any>> {
    fields: FieldConfig<TFormData>[];
    onSubmit: (data: TFormData) => Promise<FormSubmitResult<TFormData>> | FormSubmitResult<TFormData>;
    onCancel?: () => void;
    initialValues?: Partial<TFormData>;
    layout?: FormLayout;
    submitText?: string;
    cancelText?: string;
    showCancelButton?: boolean;
    className?: string;
    disabled?: boolean;
    validateOnChange?: boolean;
    validateOnBlur?: boolean;
    resetOnSubmit?: boolean;
}

// 字段错误提示组件
function FieldError({error}: { error?: string }) {
    if (!error) return null;
    return <div className="field-error">{error}</div>;
}

// 字段帮助文本组件
function FieldHelper({text}: { text?: string }) {
    if (!text) return null;
    return <div className="field-helper">{text}</div>;
}

// 渲染字段
function renderField<TFormData>(field: FieldConfig<TFormData>, fieldApi: FieldApi<TFormData, any>, disabled?: boolean) {
    const {name, type = 'text', placeholder, options, rows, min, max, pattern, step} = field;
    const value = fieldApi.state.value;
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const newValue = type === 'number' ? Number(e.target.value) : type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
        fieldApi.handleChange(newValue);
    };

    const isDisabled = disabled || field.disabled;

    switch (type) {
        case 'textarea':
            return (<textarea
                    id={String(name)}
                    name={String(name)}
                    value={value || ''}
                    onChange={handleChange}
                    onBlur={fieldApi.handleBlur}
                    placeholder={placeholder}
                    disabled={isDisabled}
                    rows={rows || 3}
                    className="form-textarea"
                />);

        case 'select':
            return (<select
                    id={String(name)}
                    name={String(name)}
                    value={value || ''}
                    onChange={handleChange}
                    onBlur={fieldApi.handleBlur}
                    disabled={isDisabled}
                    className="form-select"
                >
                    <option value="">请选择</option>
                    {options?.map((opt) => (<option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>))}
                </select>);

        case 'checkbox':
            return (<label className="form-checkbox-wrapper">
                    <input
                        type="checkbox"
                        id={String(name)}
                        name={String(name)}
                        checked={!!value}
                        onChange={handleChange}
                        onBlur={fieldApi.handleBlur}
                        disabled={isDisabled}
                        className="form-checkbox"
                    />
                    <span className="checkbox-label">{field.label}</span>
                </label>);

        case 'radio':
            return (<div className="form-radio-group">
                    {options?.map((opt) => (<label key={opt.value} className="form-radio-wrapper">
                            <input
                                type="radio"
                                name={String(name)}
                                value={opt.value}
                                checked={value === opt.value}
                                onChange={handleChange}
                                onBlur={fieldApi.handleBlur}
                                disabled={isDisabled}
                                className="form-radio"
                            />
                            <span className="radio-label">{opt.label}</span>
                        </label>))}
                </div>);

        default:
            return (<input
                    type={type}
                    id={String(name)}
                    name={String(name)}
                    value={value || ''}
                    onChange={handleChange}
                    onBlur={fieldApi.handleBlur}
                    placeholder={placeholder}
                    disabled={isDisabled}
                    min={min}
                    max={max}
                    pattern={pattern}
                    step={step}
                    className="form-input"
                />);
    }
}

// 主表单组件
export function AdvancedForm<TFormData extends Record<string, any>>({
                                                                        fields,
                                                                        onSubmit,
                                                                        onCancel,
                                                                        initialValues = {} as Partial<TFormData>,
                                                                        layout = 'vertical',
                                                                        submitText = '提交',
                                                                        cancelText = '取消',
                                                                        showCancelButton = true,
                                                                        className = '',
                                                                        disabled = false,
                                                                        validateOnChange = true,
                                                                        validateOnBlur = true,
                                                                        resetOnSubmit = false,
                                                                    }: AdvancedFormProps<TFormData>) {
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [submitError, setSubmitError] = React.useState<string | undefined>();

    const form = useForm<TFormData>({
        defaultValues: initialValues as TFormData, onSubmit: async ({value}) => {
            setIsSubmitting(true);
            setSubmitError(undefined);

            try {
                const result = await onSubmit(value);

                if (result.success) {
                    if (resetOnSubmit) {
                        form.reset();
                    }
                } else {
                    setSubmitError('提交失败，请检查表单');
                    // 设置字段错误
                    if (result.errors) {
                        Object.entries(result.errors).forEach(([fieldName, error]) => {
                            const field = form.getFieldMeta(fieldName as any);
                            if (field) {
                                form.setFieldMeta(fieldName as any, {
                                    ...field, errors: [error],
                                });
                            }
                        });
                    }
                }
            } catch (error) {
                setSubmitError(error instanceof Error ? error.message : '提交失败');
            } finally {
                setIsSubmitting(false);
            }
        },
    });

    return (<div className={`advanced-form advanced-form-${layout} ${className}`}>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit();
                }}
                className="form-container"
            >
                <div className="form-fields">
                    {fields.map((fieldConfig) => {
                        // 对于 checkbox 类型，使用特殊布局
                        if (fieldConfig.type === 'checkbox') {
                            return (<form.Field
                                    key={String(fieldConfig.name)}
                                    name={fieldConfig.name}
                                    validators={{
                                        onChange: validateOnChange && fieldConfig.validate ? ({value}: {
                                            value: any
                                        }) => fieldConfig.validate!(value) : undefined,
                                        onBlur: validateOnBlur && fieldConfig.validate ? ({value}: {
                                            value: any
                                        }) => fieldConfig.validate!(value) : undefined,
                                    }}
                                >
                                    {(field) => (<div
                                            className={`form-field form-field-checkbox ${fieldConfig.className || ''}`}>
                                            {renderField(fieldConfig, field, disabled)}
                                            <FieldError error={field.state.meta.errors?.[0]}/>
                                            <FieldHelper text={fieldConfig.helperText}/>
                                        </div>)}
                                </form.Field>);
                        }

                        return (<form.Field
                                key={String(fieldConfig.name)}
                                name={fieldConfig.name}
                                validators={{
                                    onChange: validateOnChange && fieldConfig.validate ? ({value}: {
                                        value: any
                                    }) => fieldConfig.validate!(value) : undefined,
                                    onBlur: validateOnBlur && fieldConfig.validate ? ({value}: {
                                        value: any
                                    }) => fieldConfig.validate!(value) : undefined,
                                }}
                            >
                                {(field) => (<div className={`form-field ${fieldConfig.className || ''}`}>
                                        <label htmlFor={String(fieldConfig.name)} className="form-label">
                                            {fieldConfig.label}
                                            {fieldConfig.required && <span className="required-mark">*</span>}
                                        </label>
                                        <div className="form-control">
                                            {renderField(fieldConfig, field, disabled)}
                                            <FieldError error={field.state.meta.errors?.[0]}/>
                                            <FieldHelper text={fieldConfig.helperText}/>
                                        </div>
                                    </div>)}
                            </form.Field>);
                    })}
                </div>

                {submitError && (<div className="form-submit-error">
                        {submitError}
                    </div>)}

                <div className="form-actions">
                    <button
                        type="submit"
                        disabled={disabled || isSubmitting || !form.state.canSubmit}
                        className="form-button form-button-submit"
                    >
                        {isSubmitting ? '提交中...' : submitText}
                    </button>
                    {showCancelButton && onCancel && (<button
                            type="button"
                            onClick={onCancel}
                            disabled={isSubmitting}
                            className="form-button form-button-cancel"
                        >
                            {cancelText}
                        </button>)}
                </div>
            </form>
        </div>);
}

// 导出常用验证器
export const validators = {
    required: (message = '此字段为必填项') => (value: any) => {
        if (value === undefined || value === null || value === '') {
            return message;
        }
        return undefined;
    },

    email: (message = '请输入有效的邮箱地址') => (value: string) => {
        if (!value) return undefined;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value) ? undefined : message;
    },

    minLength: (min: number, message?: string) => (value: string) => {
        if (!value) return undefined;
        return value.length >= min ? undefined : message || `最少需要 ${min} 个字符`;
    },

    maxLength: (max: number, message?: string) => (value: string) => {
        if (!value) return undefined;
        return value.length <= max ? undefined : message || `最多允许 ${max} 个字符`;
    },

    min: (min: number, message?: string) => (value: number) => {
        if (value === undefined || value === null) return undefined;
        return value >= min ? undefined : message || `最小值为 ${min}`;
    },

    max: (max: number, message?: string) => (value: number) => {
        if (value === undefined || value === null) return undefined;
        return value <= max ? undefined : message || `最大值为 ${max}`;
    },

    pattern: (regex: RegExp, message = '格式不正确') => (value: string) => {
        if (!value) return undefined;
        return regex.test(value) ? undefined : message;
    },

    phone: (message = '请输入有效的手机号码') => (value: string) => {
        if (!value) return undefined;
        const phoneRegex = /^1[3-9]\d{9}$/;
        return phoneRegex.test(value) ? undefined : message;
    },

    url: (message = '请输入有效的 URL') => (value: string) => {
        if (!value) return undefined;
        try {
            new URL(value);
            return undefined;
        } catch {
            return message;
        }
    },

    compose: (...validators: Array<(value: any) => string | undefined>) => (value: any) => {
        for (const validator of validators) {
            const error = validator(value);
            if (error) return error;
        }
        return undefined;
    },
};


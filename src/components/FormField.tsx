import type { ChangeEvent } from 'react';

interface FormFieldProps {
    id: string;
    name: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    hint?: string;
    type?: 'text' | 'email';
    placeholder?: string;
    autoComplete?: string;
    required?: boolean;
    multiline?: boolean;
    rows?: number;
}

export function FormField({
    id,
    name,
    label,
    value,
    onChange,
    error,
    hint,
    type = 'text',
    placeholder,
    autoComplete,
    required = false,
    multiline = false,
    rows = 6,
}: FormFieldProps) {
    const hintId = hint === undefined ? undefined : `${id}-hint`;
    const errorId = error === undefined ? undefined : `${id}-error`;
    const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;
    const shared = {
        id,
        name,
        value,
        required,
        placeholder,
        'aria-invalid': error === undefined ? undefined : true,
        'aria-describedby': describedBy,
        className: 'form-control',
        onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
            onChange(event.target.value),
    };

    return (
        <div className={`form-field${error === undefined ? '' : ' form-field-invalid'}`}>
            <label className="form-label" htmlFor={id}>
                {label}
                {required && <span className="required-mark" aria-hidden="true"> *</span>}
            </label>

            {multiline ? (
                <textarea {...shared} rows={rows} />
            ) : (
                <input {...shared} type={type} autoComplete={autoComplete} />
            )}

            {hint !== undefined && (
                <p className="form-hint" id={hintId}>
                    {hint}
                </p>
            )}

            {error !== undefined && (
                <p className="form-error" id={errorId}>
                    {error}
                </p>
            )}
        </div>
    );
}

import type { ReactNode } from 'react';

type AlertVariant = 'success' | 'error' | 'info';

interface AlertProps {
    variant?: AlertVariant;
    title?: string;
    children: ReactNode;
}

export function Alert({ variant = 'info', title, children }: AlertProps) {
    return (
        <div className={`alert alert-${variant}`} role={variant === 'error' ? 'alert' : 'status'}>
            {title !== undefined && <strong className="alert-title">{title}</strong>}
            <div>{children}</div>
        </div>
    );
}

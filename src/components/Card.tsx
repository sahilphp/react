import type { ReactNode } from 'react';

interface CardProps {
    title?: ReactNode;
    eyebrow?: string;
    className?: string;
    children: ReactNode;
}

export function Card({ title, eyebrow, className, children }: CardProps) {
    const classes = ['card', className].filter(Boolean).join(' ');

    return (
        <section className={classes}>
            {(eyebrow !== undefined || title !== undefined) && (
                <header className="card-head">
                    {eyebrow !== undefined && <p className="eyebrow">{eyebrow}</p>}
                    {title !== undefined && <h2 className="card-title">{title}</h2>}
                </header>
            )}
            {children}
        </section>
    );
}

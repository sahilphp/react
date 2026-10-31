import { useEffect, useState } from 'react';

const links = [
    { href: '/', label: 'Home' },
    { href: '/example', label: 'PHP data' },
    { href: '/form', label: 'Form' },
] as const;

export function Nav() {
    const [path, setPath] = useState('/');

    useEffect(() => {
        setPath(window.location.pathname);
    }, []);

    return (
        <nav className="app-nav" aria-label="Primary navigation">
            {links.map((link) => {
                const current = path === link.href;

                return (
                    <a
                        key={link.href}
                        href={link.href}
                        aria-current={current ? 'page' : undefined}
                    >
                        {link.label}
                    </a>
                );
            })}
        </nav>
    );
}

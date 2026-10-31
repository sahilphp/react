import type { ReactNode } from 'react';
import { Nav } from '../components/Nav';

interface AppLayoutProps {
    appName?: string;
    phpVersion?: string;
    children: ReactNode;
}

export function AppLayout({ appName = 'SahilPHP', phpVersion, children }: AppLayoutProps) {
    return (
        <div className="app-shell">
            <a className="skip-link" href="#main-content">
                Skip to content
            </a>

            <header className="app-header">
                <div className="app-header-inner">
                    <a className="app-brand" href="/" aria-label={`${appName} home`}>
                        <span className="app-brand-mark" aria-hidden="true">
                            S
                        </span>
                        <span className="app-brand-copy">
                            <strong>{appName}</strong>
                            <small>React starter-kit</small>
                        </span>
                    </a>

                    <Nav />

                    <span className="app-runtime" title="Server runtime">
                        PHP {phpVersion ?? '8.2+'}
                    </span>
                </div>
            </header>

            <main className="app-main" id="main-content">
                {children}
            </main>

            <footer className="app-footer">
                <p>
                    Built with SahilPHP, React 19, TypeScript and Vite. Controllers call{' '}
                    <code>React::render()</code>.
                </p>
            </footer>
        </div>
    );
}

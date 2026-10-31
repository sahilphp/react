import { AppLayout } from '../layouts/AppLayout';

interface NotFoundProps {
    app_name?: string;
    php_version?: string;
    path?: string;
    title?: string;
}

export default function NotFound({
    app_name = 'SahilPHP',
    php_version = '8.2+',
    path = '/',
}: NotFoundProps) {
    return (
        <AppLayout appName={app_name} phpVersion={php_version}>
            <section className="not-found">
                <p className="eyebrow">404</p>
                <h1>That page does not exist.</h1>
                <p>
                    PHP matched the catch-all route, rendered the React not-found page and returned
                    a real 404 status. The requested path was <code>{path}</code>.
                </p>
                <div className="hero-actions">
                    <a className="button" href="/">
                        Back home
                    </a>
                    <a className="button button-secondary" href="/example">
                        Inspect PHP props
                    </a>
                </div>
            </section>
        </AppLayout>
    );
}

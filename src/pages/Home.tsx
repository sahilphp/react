import { Card } from '../components/Card';
import { AppLayout } from '../layouts/AppLayout';

interface Feature {
    title: string;
    description: string;
}

interface HomeProps {
    app_name?: string;
    php_version?: string;
    environment?: string;
    framework_version?: string;
    frontend?: string;
    asset_mode?: string;
    rendered_at?: string;
    features?: Feature[];
}

const defaultFeatures: Feature[] = [
    {
        title: 'Controller data as props',
        description: 'PHP arrays become JSON props for the mounted React component.',
    },
    {
        title: 'Predictable pages',
        description: 'pages.home resolves Pages/Home.tsx without a client-side router.',
    },
    {
        title: 'Vite in both modes',
        description: 'The same entry uses the dev server locally and the manifest in production.',
    },
];

export default function Home({
    app_name = 'SahilPHP',
    php_version = '8.2+',
    environment = 'development',
    framework_version = 'SahilPHP',
    frontend = 'React 19 + TypeScript + Vite',
    asset_mode = 'Vite dev server',
    rendered_at,
    features = defaultFeatures,
}: HomeProps) {
    return (
        <AppLayout appName={app_name} phpVersion={php_version}>
            <section className="hero">
                <div className="hero-copy">
                    <p className="eyebrow">SahilPHP + React</p>
                    <h1>A small PHP application with a real React frontend.</h1>
                    <p className="hero-lede">
                        Controllers prepare data, <code>React::render()</code> returns an ordinary
                        HTTP response, and React mounts the matching page component. TypeScript and
                        Vite keep the client fast without hiding the server.
                    </p>

                    <div className="hero-actions">
                        <a className="button" href="/example">
                            See PHP props
                        </a>
                        <a className="button button-secondary" href="/form">
                            Try validation
                        </a>
                    </div>
                </div>

                <aside className="hero-panel" aria-label="Runtime information">
                    <div className="status-row">
                        <span className="status-dot" aria-hidden="true" />
                        <span>{asset_mode}</span>
                    </div>

                    <dl className="runtime-list">
                        <div>
                            <dt>Framework</dt>
                            <dd>{framework_version}</dd>
                        </div>
                        <div>
                            <dt>Frontend</dt>
                            <dd>{frontend}</dd>
                        </div>
                        <div>
                            <dt>Environment</dt>
                            <dd>{environment}</dd>
                        </div>
                        <div>
                            <dt>PHP</dt>
                            <dd>{php_version}</dd>
                        </div>
                    </dl>

                    {rendered_at !== undefined && (
                        <p className="runtime-time">
                            Rendered by PHP at <time dateTime={rendered_at}>{rendered_at}</time>
                        </p>
                    )}
                </aside>
            </section>

            <section className="section" aria-labelledby="features-heading">
                <div className="section-heading">
                    <p className="eyebrow">Integration</p>
                    <h2 id="features-heading">What this starter-kit demonstrates</h2>
                </div>

                <div className="feature-grid">
                    {features.map((feature) => (
                        <Card key={feature.title} title={feature.title}>
                            <p>{feature.description}</p>
                        </Card>
                    ))}
                </div>
            </section>

            <section className="section split-grid" aria-labelledby="code-heading">
                <div>
                    <p className="eyebrow">Controller</p>
                    <h2 id="code-heading">One small rendering API</h2>
                    <p>
                        The PHP side knows nothing about component internals. It resolves a page,
                        serializes the props safely and returns a normal response.
                    </p>
                    <ul className="check-list">
                        <li>Nested page names map to nested component folders.</li>
                        <li>Missing pages fail with the expected filesystem path.</li>
                        <li>Headers and status codes stay in the HTTP layer.</li>
                    </ul>
                </div>

                <pre className="code-block" aria-label="PHP rendering example">
                    <code>{`return React::render('pages.home', [
    'app_name' => $appName,
    'php_version' => PHP_VERSION,
    'features' => $features,
]);`}</code>
                </pre>
            </section>
        </AppLayout>
    );
}

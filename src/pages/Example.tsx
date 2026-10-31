import { Card } from '../components/Card';
import { AppLayout } from '../layouts/AppLayout';

interface Profile {
    name: string;
    role: string;
    location: string;
    summary: string;
    skills: string[];
}

interface Stat {
    label: string;
    value: string;
}

interface RequestData {
    method: string;
    path: string;
    query: Record<string, unknown>;
    server_time: string;
}

interface ExampleProps {
    app_name?: string;
    php_version?: string;
    profile?: Profile;
    stats?: Stat[];
    request?: RequestData;
}

const fallbackProfile: Profile = {
    name: 'Ada Lovelace',
    role: 'Senior software engineer',
    location: 'Remote',
    summary: 'A small profile object rendered by React from data prepared in a PHP controller.',
    skills: ['PHP 8', 'React 19', 'TypeScript', 'Vite', 'HTTP'],
};

const fallbackRequest: RequestData = {
    method: 'GET',
    path: '/example',
    query: {},
    server_time: new Date(0).toISOString(),
};

export default function Example({
    app_name = 'SahilPHP',
    php_version = '8.2+',
    profile = fallbackProfile,
    stats = [],
    request = fallbackRequest,
}: ExampleProps) {
    return (
        <AppLayout appName={app_name} phpVersion={php_version}>
            <section className="page-heading">
                <p className="eyebrow">PHP to React</p>
                <h1>Structured props from the controller.</h1>
                <p>
                    Nested objects, lists and request metadata cross the boundary as JSON. React
                    receives ordinary props and owns all of the markup for this page.
                </p>
            </section>

            <div className="split-grid section">
                <Card eyebrow="Profile" title={profile.name} className="profile-card">
                    <p className="profile-role">{profile.role}</p>
                    <p>{profile.summary}</p>
                    <p className="profile-location">{profile.location}</p>

                    <ul className="tag-list" aria-label="Skills">
                        {profile.skills.map((skill) => (
                            <li className="tag" key={skill}>
                                {skill}
                            </li>
                        ))}
                    </ul>
                </Card>

                <Card eyebrow="Request" title="Prepared by PHP">
                    <dl className="detail-list">
                        <div>
                            <dt>Method</dt>
                            <dd>{request.method}</dd>
                        </div>
                        <div>
                            <dt>Path</dt>
                            <dd>{request.path}</dd>
                        </div>
                        <div>
                            <dt>Server time</dt>
                            <dd>{request.server_time}</dd>
                        </div>
                    </dl>

                    <p className="detail-label">Query string as JSON</p>
                    <pre className="code-block compact">
                        <code>{JSON.stringify(request.query, null, 2)}</code>
                    </pre>
                </Card>
            </div>

            {stats.length > 0 && (
                <section className="section" aria-labelledby="stats-heading">
                    <h2 id="stats-heading" className="sr-only">
                        Profile statistics
                    </h2>
                    <div className="stat-grid">
                        {stats.map((stat) => (
                            <div className="stat" key={stat.label}>
                                <span className="stat-value">{stat.value}</span>
                                <span className="stat-label">{stat.label}</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </AppLayout>
    );
}

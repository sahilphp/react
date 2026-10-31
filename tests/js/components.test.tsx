import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import Form, { validateContactForm } from '../../src/pages/Form';
import Home from '../../src/pages/Home';
import NotFound from '../../src/pages/NotFound';

describe('Home page', () => {
    it('renders runtime props supplied by PHP', () => {
        const html = renderToStaticMarkup(
            <Home
                app_name="Demo App"
                php_version="8.3.4"
                environment="production"
                framework_version="SahilPHP 1.0.4"
                frontend="React 19"
                asset_mode="Production build"
                rendered_at="2026-01-02T03:04:05+00:00"
            />,
        );

        expect(html).toContain('Demo App');
        expect(html).toContain('8.3.4');
        expect(html).toContain('Production build');
        expect(html).toContain('Controller data as props');
        expect(html).toContain('React starter-kit');
    });

    it('escapes prop text instead of treating it as markup', () => {
        const html = renderToStaticMarkup(<Home app_name="<script>alert(1)</script>" />);

        expect(html).not.toContain('<script>alert(1)</script>');
        expect(html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;');
    });
});

describe('Form page', () => {
    it('renders preserved values, server errors and the 422 status', () => {
        const html = renderToStaticMarkup(
            <Form
                app_name="Demo"
                values={{ name: 'A', email: 'not-an-email', message: 'short' }}
                errors={{
                    name: 'Enter a name between 2 and 80 characters.',
                    email: 'Enter a valid email address.',
                    message: 'Enter a message between 10 and 2000 characters.',
                }}
                status={422}
            />,
        );

        expect(html).toContain('action="/form"');
        expect(html).toContain('value="A"');
        expect(html).toContain('value="not-an-email"');
        expect(html).toContain('Enter a valid email address.');
        expect(html).toContain('Last response status: 422');
        expect(html).toContain('aria-invalid="true"');
    });

    it('renders a success alert when PHP accepts the submission', () => {
        const html = renderToStaticMarkup(
            <Form
                values={{
                    name: 'Ada Lovelace',
                    email: 'ada@example.com',
                    message: 'Hello from the React starter kit.',
                }}
                success="Thanks — your message passed validation."
            />,
        );

        expect(html).toContain('Message accepted');
        expect(html).toContain('Thanks — your message passed validation.');
        expect(html).toContain('Last response status: 200');
    });
});

describe('validateContactForm', () => {
    it('accepts a complete form', () => {
        expect(
            validateContactForm({
                name: 'Ada Lovelace',
                email: 'ada@example.com',
                message: 'A message long enough to pass.',
            }),
        ).toEqual({});
    });

    it('reports every invalid field with the server messages', () => {
        expect(
            validateContactForm({ name: 'A', email: 'not-an-email', message: 'short' }),
        ).toEqual({
            name: 'Enter a name between 2 and 80 characters.',
            email: 'Enter a valid email address.',
            message: 'Enter a message between 10 and 2000 characters.',
        });
    });

    it('ignores surrounding whitespace for length checks', () => {
        const errors = validateContactForm({
            name: ' A ',
            email: 'ada@example.com',
            message: '   short   ',
        });

        expect(errors.name).toBeDefined();
        expect(errors.message).toBeDefined();
        expect(errors.email).toBeUndefined();
    });
});

describe('NotFound page', () => {
    it('renders the requested path safely', () => {
        const html = renderToStaticMarkup(<NotFound path="/missing/<script>" app_name="Demo" />);

        expect(html).toContain('That page does not exist.');
        expect(html).toContain('/missing/&lt;script&gt;');
        expect(html).not.toContain('/missing/<script>');
    });
});

import { useState, type FormEvent } from 'react';
import { Alert } from '../components/Alert';
import { FormField } from '../components/FormField';
import { AppLayout } from '../layouts/AppLayout';

export interface ContactFormValues {
    name: string;
    email: string;
    message: string;
}

export type ContactFormErrors = Partial<Record<keyof ContactFormValues, string>>;

interface FormProps {
    app_name?: string;
    php_version?: string;
    values?: Partial<ContactFormValues>;
    errors?: ContactFormErrors;
    success?: string | null;
    status?: number;
}

export function validateContactForm(values: ContactFormValues): ContactFormErrors {
    const errors: ContactFormErrors = {};
    const name = values.name.trim();
    const email = values.email.trim();
    const message = values.message.trim();

    if (name.length < 2 || name.length > 80) {
        errors.name = 'Enter a name between 2 and 80 characters.';
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = 'Enter a valid email address.';
    }

    if (message.length < 10 || message.length > 2000) {
        errors.message = 'Enter a message between 10 and 2000 characters.';
    }

    return errors;
}

export default function Form({
    app_name = 'SahilPHP',
    php_version = '8.2+',
    values: initialValues = {},
    errors: serverErrors = {},
    success = null,
    status = 200,
}: FormProps) {
    const [values, setValues] = useState<ContactFormValues>({
        name: initialValues.name ?? '',
        email: initialValues.email ?? '',
        message: initialValues.message ?? '',
    });
    const [clientErrors, setClientErrors] = useState<ContactFormErrors>({});

    const errors: ContactFormErrors = { ...serverErrors, ...clientErrors };
    const hasErrors = Object.keys(errors).length > 0;

    const updateField =
        (field: keyof ContactFormValues) =>
        (value: string): void => {
            setValues((current) => ({ ...current, [field]: value }));
            setClientErrors((current) => {
                if (current[field] === undefined) {
                    return current;
                }

                const next = { ...current };
                delete next[field];

                return next;
            });
        };

    const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
        const validation = validateContactForm(values);
        setClientErrors(validation);

        if (Object.keys(validation).length > 0) {
            event.preventDefault();
        }
    };

    return (
        <AppLayout appName={app_name} phpVersion={php_version}>
            <section className="page-heading">
                <p className="eyebrow">Validation</p>
                <h1>Client feedback, server truth.</h1>
                <p>
                    The form validates in React for immediate feedback, then posts normally to
                    PHP. The server revalidates and returns the same page with preserved values,
                    field errors or a success state.
                </p>
            </section>

            <div className="split-grid section">
                <div className="form-panel">
                    {success !== null && (
                        <Alert variant="success" title="Message accepted">
                            {success}
                        </Alert>
                    )}

                    {hasErrors && (
                        <Alert variant="error" title="Check the highlighted fields">
                            Nothing was sent because the form still has validation errors.
                        </Alert>
                    )}

                    <form action="/form" method="post" noValidate onSubmit={handleSubmit}>
                        <FormField
                            id="name"
                            name="name"
                            label="Name"
                            value={values.name}
                            onChange={updateField('name')}
                            error={errors.name}
                            hint="Between 2 and 80 characters."
                            autoComplete="name"
                            required
                        />

                        <FormField
                            id="email"
                            name="email"
                            label="Email"
                            type="email"
                            value={values.email}
                            onChange={updateField('email')}
                            error={errors.email}
                            hint="Used only to demonstrate server-side validation."
                            autoComplete="email"
                            required
                        />

                        <FormField
                            id="message"
                            name="message"
                            label="Message"
                            value={values.message}
                            onChange={updateField('message')}
                            error={errors.message}
                            hint="Between 10 and 2000 characters."
                            multiline
                            rows={6}
                            required
                        />

                        <div className="form-actions">
                            <button className="button" type="submit">
                                Validate and submit
                            </button>
                            <span className="form-status">Last response status: {status}</span>
                        </div>
                    </form>
                </div>

                <aside className="side-note">
                    <p className="eyebrow">How it works</p>
                    <h2>The browser is never trusted</h2>
                    <ol className="step-list">
                        <li>React prevents submission only when its local checks fail.</li>
                        <li>A normal HTML POST carries the values to the PHP controller.</li>
                        <li>PHP validates again and returns 422 or 200 with new props.</li>
                        <li>The same React page mounts with errors or a success message.</li>
                    </ol>
                </aside>
            </div>
        </AppLayout>
    );
}

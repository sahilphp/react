export type PageProps = Record<string, unknown>;

const COMPONENT_PATTERN = /^Pages\/([A-Za-z0-9_-]+(?:\/[A-Za-z0-9_-]+)*)\.tsx$/;

export function isRecord(value: unknown): value is PageProps {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Parse the JSON payload emitted by ReactDocument. The payload is an object
 * by contract, so arrays and scalar JSON values are rejected rather than
 * silently mounted as component props.
 */
export function parsePayload(raw: string | null | undefined): PageProps {
    if (raw === null || raw === undefined || raw.trim() === '') {
        return {};
    }

    let decoded: unknown;

    try {
        decoded = JSON.parse(raw);
    } catch {
        throw new Error('The React props payload is not valid JSON.');
    }

    if (!isRecord(decoded)) {
        throw new Error('The React props payload must be a JSON object.');
    }

    return decoded;
}

/**
 * Turn the component identifier from the mount element into the key used by
 * Vite's import.meta.glob map.
 *
 * Pages/Home.tsx          -> ./pages/Home.tsx
 * Pages/Dashboard/Index.tsx -> ./pages/Dashboard/Index.tsx
 */
export function componentModuleKey(component: string | null | undefined): string {
    const value = component?.trim();

    if (!value) {
        throw new Error('The mount element is missing its data-component attribute.');
    }

    const match = COMPONENT_PATTERN.exec(value);

    if (match === null) {
        throw new Error(
            `Unsupported React component identifier [${value}]. Expected a registered Pages/*.tsx component.`,
        );
    }

    return `./pages/${match[1]}.tsx`;
}

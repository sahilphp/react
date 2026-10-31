import { StrictMode, type ComponentType } from 'react';
import { createRoot } from 'react-dom/client';
import { componentModuleKey, parsePayload, type PageProps } from './lib/payload';
import './styles/global.css';

type PageModule = {
    default: ComponentType<PageProps>;
};

const pages = import.meta.glob<PageModule>('./pages/**/*.tsx');

function errorMessage(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
}

function renderFatal(parent: HTMLElement, error: unknown): void {
    const panel = document.createElement('div');
    panel.className = 'react-fatal';
    panel.setAttribute('role', 'alert');

    const heading = document.createElement('strong');
    heading.textContent = 'The React application could not start.';

    const detail = document.createElement('p');
    detail.textContent = errorMessage(error);

    panel.append(heading, detail);

    if (parent === document.body) {
        parent.append(panel);
    } else {
        parent.replaceChildren(panel);
    }

    console.error('[SahilPHP React]', error);
}

async function bootstrap(): Promise<void> {
    const mountId = document.body.dataset.mountId ?? 'app';
    const target = document.getElementById(mountId);

    if (target === null) {
        renderFatal(document.body, new Error(`Mount element [#${mountId}] was not found.`));
        return;
    }

    try {
        const payload = document.getElementById(`${mountId}-props`);
        const props = parsePayload(payload?.textContent);
        const moduleKey = componentModuleKey(target.dataset.component);
        const loadPage = pages[moduleKey];

        if (loadPage === undefined) {
            throw new Error(`No React page module is registered for [${moduleKey}].`);
        }

        const module = await loadPage();
        const Page = module.default;

        createRoot(target).render(
            <StrictMode>
                <Page {...props} />
            </StrictMode>,
        );
    } catch (error) {
        renderFatal(target, error);
    }
}

void bootstrap();

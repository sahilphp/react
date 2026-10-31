# SahilPHP React starter-kit

A complete, independently installable SahilPHP application with a React 19 +
TypeScript + Vite frontend. PHP controllers render React pages with ordinary
PHP data; Vite handles development HMR and production builds.

## Requirements

- PHP 8.2+
- Composer 2
- Node.js 20.19+
- npm 10+

## Create or install

```bash
composer create-project sahilphp/starter-kit-react my-app
cd my-app
npm install
```

For a checkout that already exists:

```bash
composer install
cp .env.example .env
php bin/sahil key:generate
npm install
```

## Development

Run PHP and Vite in separate terminals:

```bash
npm run dev          # Vite on http://127.0.0.1:5173
php sahil start      # PHP on http://127.0.0.1:8000
```

Open `http://127.0.0.1:8000`. The PHP-rendered document loads `@vite/client`
and `src/main.tsx` from the dev server, so React components hot reload. If
Vite chooses another port, `public/hot` overrides `frontend.dev_server`.

## Production build

```bash
npm run build
```

`npm run build` type-checks the application, then Vite writes `public/build/`
and `public/build/.vite/manifest.json`. Point the web server document root at
`public/`. In production (`APP_ENV=production`) the PHP renderer reads the
manifest, recursively collects imported CSS, verifies every referenced file
and emits immutable script/style tags. No Vite server is needed at runtime.

## Rendering from PHP

```php
use App\Frontend\React;

final class HomeController
{
    public function response(): \Sahil\Http\Response
    {
        $data = [
            'app_name' => (string) $this->application->config()->get('app.name', 'SahilPHP'),
            'php_version' => PHP_VERSION,
        ];

        return React::render('pages.home', $data);
    }
}
```

Page names map predictably:

| PHP page name | React component sent to the browser | File |
| --- | --- | --- |
| `pages.home` | `Pages/Home.tsx` | `src/pages/Home.tsx` |
| `pages.notFound` | `Pages/NotFound.tsx` | `src/pages/NotFound.tsx` |
| `pages.dashboard.index` | `Pages/Dashboard/Index.tsx` | `src/pages/Dashboard/Index.tsx` |

The leading `pages` segment is optional. Every other segment is PascalCased.
A missing component fails with an exception naming the expected path.

`React::render()` returns a normal `Sahil\Http\Response`; use `withStatus()`
or `withHeader()` for additional HTTP behaviour. The example 404 route does
exactly that.

### Data safety

- Data is JSON encoded with `JSON_HEX_TAG`, `JSON_HEX_AMP`, `JSON_HEX_APOS`
  and `JSON_HEX_QUOT`, so values such as `</script>` cannot escape the payload
  element.
- The payload lives in `<script type="application/json">`, not executable
  JavaScript.
- The component name, mount id, title, language and asset URLs are validated
  and HTML-escaped.
- Only JSON-serializable data can be passed; encoding failures throw a clear
  `ReactRenderException`.
- React escapes prop text when rendering; no page uses
  `dangerouslySetInnerHTML`.

### Client bootstrapping

The PHP document contains an empty mount element with `data-component`, plus a
JSON payload. `src/main.tsx` reads those values, resolves the component through
Vite's `import.meta.glob` map and renders it with `createRoot`. This is a
page-per-request integration: there is no client-side router competing with
PHP routing.

## Project structure

```
app/
  Frontend/            React page resolution, payload, Vite assets, renderer
  Http/                Controllers and middleware
  Providers/           Frontend and route/kernel wiring
bootstrap/             Application and provider manifests
config/                app.php, frontend.php
public/                Front controller, .htaccess, public assets
routes/web.php         Route table
src/
  components/          Reusable React components (Nav, Card, Alert, FormField)
  layouts/             Shared AppLayout
  lib/payload.ts       Payload and component-name helpers
  pages/               React pages
  styles/global.css    Application styles
  main.tsx             Client entry point (mount + fatal error UI)
tests/
  Feature/             HTTP integration and container/provider wiring
  Frontend/            Page resolution, payload rendering and Vite assets
  Support/             Isolated filesystem fixtures
  js/                  Vitest tests for helpers and server-rendered components
```

## Example application

- `/` — home page with PHP runtime data, features and a controller example.
- `/example` — nested objects, lists and request metadata passed to React.
- `/form` — form with React-side and PHP-side validation feedback.
- `/health` — JSON health endpoint.
- Any unknown path — React not-found page with a real 404 status.

## Tests and checks

```bash
composer test       # PHPUnit: rendering, assets, routing, form validation
npm test            # Vitest: payload helpers and React server rendering
npm run check       # TypeScript strict check
npm run build       # type check + production asset build
```

## Configuration

`config/frontend.php` controls the mount id, payload title key, language,
development mode, dev server URL, build directory/public path, manifest
location, entry point, asset verification and pages directory. Defaults are
safe for local development and production builds.

## Framework boundary

The framework core provides ordinary HTTP, container, configuration and routing
services. Everything React-specific — page resolution, document generation,
payload serialization, Vite asset resolution and the `React` facade — lives in
this starter-kit. The Composer dependency is the published
`sahilphp/framework` package, never a local filesystem repository.
# starter-kit-react

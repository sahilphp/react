<?php

declare(strict_types=1);

namespace App\Http;

use App\Frontend\React;
use Sahil\Contracts\Foundation\ApplicationContract;
use Sahil\Http\Request;
use Sahil\Http\Response;

/**
 * Renders the React not-found page with a real 404 status.
 */
final class NotFoundController
{
    public function __construct(private readonly ApplicationContract $application)
    {
    }

    public function response(Request $request): Response
    {
        return React::render('pages.notFound', [
            'title' => 'Page not found',
            'app_name' => (string) $this->application->config()->get('app.name', 'SahilPHP'),
            'php_version' => PHP_VERSION,
            'path' => $request->path(),
        ], 404);
    }
}

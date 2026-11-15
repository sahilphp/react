<?php

declare(strict_types=1);

namespace App\Frontend;

use Sahil\Contracts\Rendering\RenderAdapterContract;
use Sahil\Http\Response;

/**
 * React render environment for the unified rendering API — delegates to
 * the kit's {@see ReactRenderer}; core owns routing of page + data.
 */
final class ReactAdapter implements RenderAdapterContract
{
    public function __construct(
        private readonly ReactRenderer $renderer,
    ) {
    }

    public function environment(): string
    {
        return 'react';
    }

    public function render(string $page, array $data, int $status): Response
    {
        return $this->renderer->render($page, $data, $status);
    }
}

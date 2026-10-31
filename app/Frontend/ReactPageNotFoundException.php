<?php

declare(strict_types=1);

namespace App\Frontend;

/**
 * A page name did not resolve to a React component on disk.
 */
final class ReactPageNotFoundException extends ReactException
{
    public static function forPage(string $page, string $expectedPath): self
    {
        return new self(sprintf(
            'React page [%s] could not be found. Expected component [%s]. '
            .'Create that file or pass the dotted page name that matches it (for example pages.home).',
            $page,
            $expectedPath,
        ));
    }

    public static function invalidName(string $page): self
    {
        return new self(sprintf(
            'Invalid React page name [%s]. Use dot- or slash-separated segments containing '
            .'letters, digits, underscores or dashes (for example pages.home or pages.dashboard.index).',
            $page,
        ));
    }
}

<?php

declare(strict_types=1);

namespace App\Frontend;

/**
 * The page data could not be serialized for the browser.
 */
final class ReactRenderException extends ReactException
{
    public static function unserializablePayload(string $reason): self
    {
        return new self(sprintf(
            'The React page props could not be encoded as JSON: %s. '
            .'Pass only JSON-serializable values (scalars, arrays, stdClass objects) to React::render().',
            $reason,
        ));
    }
}

<?php

declare(strict_types=1);

namespace Tests\Feature;

use PHPUnit\Framework\TestCase;
use RecursiveCallbackFilterIterator;
use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;
use SplFileInfo;

/**
 * Guards the distributable tree against accidental duplicate files whose
 * names contain control characters (for example "composer.json\n").
 */
final class PackageFilenamesTest extends TestCase
{
    public function test_package_paths_have_no_control_characters(): void
    {
        $root = dirname(__DIR__, 2);
        $skip = ['.git', '.phpunit.cache', 'node_modules', 'vendor'];
        $directory = new RecursiveDirectoryIterator($root, RecursiveDirectoryIterator::SKIP_DOTS);
        $filter = new RecursiveCallbackFilterIterator(
            $directory,
            static function (SplFileInfo $file) use ($skip): bool {
                return !in_array($file->getFilename(), $skip, true);
            },
        );

        foreach (new RecursiveIteratorIterator($filter) as $file) {
            if (!$file instanceof SplFileInfo || !$file->isFile()) {
                continue;
            }

            $relative = substr($file->getPathname(), strlen($root) + 1);

            self::assertDoesNotMatchRegularExpression(
                '/[\x00-\x1F\x7F]/',
                $relative,
                'Package paths must not contain control characters.',
            );
        }
    }
}

<?php

declare(strict_types=1);

namespace App\Providers;

use App\Frontend\ReactAssets;
use App\Frontend\ReactConfiguration;
use App\Frontend\ReactRenderer;
use Sahil\Container\Container;
use Sahil\Contracts\Foundation\ApplicationContract;
use Sahil\Foundation\ServiceProvider;

/**
 * Wires the starter-kit-owned React frontend integration.
 *
 * Everything React-specific lives in this starter-kit: the page resolver,
 * payload serializer, Vite asset resolver and renderer. The framework core
 * remains responsible for ordinary HTTP/container concerns.
 */
final class FrontendServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $container = $this->app()->container();

        $container->singleton(ReactConfiguration::class, static function (Container $container): ReactConfiguration {
            $application = $container->make(ApplicationContract::class);

            /** @var array<string, mixed> $configuration */
            $configuration = (array) $application->config()->get('frontend', []);

            return ReactConfiguration::fromArray($configuration);
        });

        $container->singleton(ReactAssets::class, static function (Container $container): ReactAssets {
            $application = $container->make(ApplicationContract::class);

            return new ReactAssets(
                $container->make(ReactConfiguration::class),
                $application->basePath(),
            );
        });

        $container->singleton(ReactRenderer::class, static function (Container $container): ReactRenderer {
            $application = $container->make(ApplicationContract::class);

            return new ReactRenderer(
                $container->make(ReactConfiguration::class),
                $container->make(ReactAssets::class),
                $application->basePath(),
            );
        });

        $container->alias('react', ReactRenderer::class);
    }
}

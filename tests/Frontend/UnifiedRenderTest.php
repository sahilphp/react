<?php

declare(strict_types=1);

namespace Tests\Frontend;

use App\Frontend\ReactAdapter;
use PHPUnit\Framework\TestCase;
use Sahil\Contracts\Rendering\RenderAdapterContract;
use Sahil\Rendering\Render;
use Sahil\Rendering\RenderManager;
use Tests\Support\TempProject;

/** The kit's `react` adapter plugs the real kit renderer into core orchestration. */
final class UnifiedRenderTest extends TestCase
{
    private string $base;

    protected function setUp(): void
    {
        $this->base = TempProject::create();
    }

    protected function tearDown(): void
    {
        Render::flushState();
        TempProject::remove($this->base);
    }

    public function test_react_environment_renders_real_page_through_manager(): void
    {
        $adapter = new ReactAdapter(TempProject::renderer($this->base));

        self::assertInstanceOf(RenderAdapterContract::class, $adapter);
        self::assertSame('react', $adapter->environment());

        Render::swap(new RenderManager([$adapter]));

        $response = Render::react('home', ['message' => 'Hello'], 201);

        self::assertSame(201, $response->status());
        self::assertStringContainsString('text/html', (string) $response->header('Content-Type'));
        self::assertStringContainsString('Hello', $response->body());
    }
}

<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use App\Http\Middleware\EnsureUserHasRole;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    // In app.php
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->alias([
            'has.role' => \App\Http\Middleware\EnsureUserHasRole::class,
            'role' => \App\Http\Middleware\EnsureUserHasRole::class,
            'superadmin' => \App\Http\Middleware\SuperAdminOnly::class,
            'isSuperAdmin' => \App\Http\Middleware\SuperAdminOnly::class,
        ]);
    })

    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->render(function (\Symfony\Component\HttpKernel\Exception\HttpExceptionInterface $e, $request) {
            $status = $e->getStatusCode();

            if (in_array($status, [403, 404, 500])) {
                return \Inertia\Inertia::render("errors/{$status}", [
                    'status' => $status,
                    'message' => $e->getMessage(),
                ])->toResponse($request)->setStatusCode($status);
            }
        });
    })->create();

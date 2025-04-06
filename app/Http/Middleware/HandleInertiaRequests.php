<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Inertia\Inertia;
use Throwable;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
        ];
    }

    /**
     * Render custom Inertia error pages from lowercase path.
     */
    public function render($request, Throwable $e)
    {
        if ($e instanceof HttpExceptionInterface) {
            $status = $e->getStatusCode();

            if (in_array($status, [403, 404, 500])) {
                return Inertia::render("pages/errors/{$status}", [
                    'status' => $status,
                    'message' => $e->getMessage(),
                ])->toResponse($request)->setStatusCode($status);
            }
        }

        return parent::render($request, $e);
    }
}

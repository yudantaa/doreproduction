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
        $user = $request->user();

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'can' => [
                        'viewBrokenItems' => in_array($user->role, ['ADMIN', 'SUPER ADMIN']),
                        'requestRepairs' => $user->role === 'ADMIN',
                        'approveRepairs' => $user->role === 'SUPER ADMIN',
                        'manageItems' => in_array($user->role, ['ADMIN', 'SUPER ADMIN']),
                        'manageCategories' => $user->role === 'SUPER ADMIN',
                    ],
                ] : null,
            ],
            'flash' => [
                'success' => fn() => $request->session()->get('success'),
                'error' => fn() => $request->session()->get('error'),
                'warning' => fn() => $request->session()->get('warning'),
                'info' => fn() => $request->session()->get('info'),
            ],
            'app' => [
                'name' => config('app.name'),
                'env' => config('app.env'),
                'url' => config('app.url'),
            ],
        ];
    }

    public function render($request, Throwable $e)
    {
        if ($e instanceof HttpExceptionInterface) {
            $status = $e->getStatusCode();

            if (in_array($status, [403, 404, 500, 503])) {
                return Inertia::render("Errors/{$status}", [
                    'status' => $status,
                    'message' => $e->getMessage(),
                    'description' => $this->getErrorDescription($status),
                ])->toResponse($request)->setStatusCode($status);
            }
        }

        return parent::render($request, $e);
    }

    protected function getErrorDescription(int $status): string
    {
        return match ($status) {
            403 => 'Anda tidak memiliki izin untuk mengakses halaman ini.',
            404 => 'Halaman yang Anda cari tidak ditemukan.',
            500 => 'Terjadi kesalahan server. Silakan coba lagi nanti.',
            503 => 'Layanan sedang tidak tersedia. Silakan coba lagi nanti.',
            default => 'Terjadi kesalahan.',
        };
    }
}

<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasRole
{
    public function handle(Request $request, Closure $next, ...$roles)
    {
        $user = auth()->user();

        // If no user or user has no role
        if (!$user || empty($user->role)) {
            abort(Response::HTTP_FORBIDDEN);
        }

        // If called as 'has.role' middleware without parameters
        if (empty($roles)) {
            return $next($request);
        }

        // If specific roles are provided, check if user has one of them
        if (!in_array($user->role, $roles)) {
            abort(Response::HTTP_FORBIDDEN);
        }

        return $next($request);
    }
}

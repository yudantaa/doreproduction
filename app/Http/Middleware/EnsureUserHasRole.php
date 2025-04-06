<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpKernel\Exception\HttpException;

class EnsureUserHasRole
{
    public function handle(Request $request, Closure $next)
    {
        $user = Auth::user();

        if ($user && empty($user->role)) {
            throw new HttpException(403);
        }


        return $next($request);
    }
}

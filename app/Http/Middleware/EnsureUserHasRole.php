<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EnsureUserHasRole
{
    public function handle(Request $request, Closure $next)
    {
        $user = Auth::user();

        if ($request->user() && empty($request->user()->role)) {
            abort(403, 'Anda tidak punya akses.');
        }
        return $next($request);
    }
}
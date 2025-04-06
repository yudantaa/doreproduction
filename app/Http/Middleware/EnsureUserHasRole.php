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

        if (!$user || empty($user->role)) {
            return redirect()->route('login')->withErrors([
                'role' => 'Anda tidak punya akses.',
            ]);
        }

        return $next($request);
    }
}
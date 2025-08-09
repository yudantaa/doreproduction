<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class UtilityController extends Controller
{
    protected function redirectHome()
    {
        return redirect()->route('home')->with('success', 'Operation completed successfully');
    }

    // Clear application cache
    public function clearCache()
    {
        Artisan::call('cache:clear');
        return $this->redirectHome();
    }

    // Clear configuration cache
    public function clearConfig()
    {
        Artisan::call('config:clear');
        Artisan::call('config:cache');
        return $this->redirectHome();
    }

    // Clear route cache
    public function clearRoutes()
    {
        Artisan::call('route:clear');
        return $this->redirectHome();
    }

    // Clear view cache
    public function clearViews()
    {
        Artisan::call('view:clear');
        return $this->redirectHome();
    }

    // Clear all caches
    public function clearAllCaches()
    {
        Artisan::call('optimize:clear');
        return $this->redirectHome();
    }

    // Run database migrations
    public function migrate()
    {
        Artisan::call('migrate', ['--force' => true]);
        return $this->redirectHome();
    }

    // Run database migrations with seed
    public function migrateFreshSeed()
    {
        Artisan::call('migrate:fresh', ['--seed' => true, '--force' => true]);
        return $this->redirectHome();
    }

    // Run database seeder
    public function runSeeder()
    {
        Artisan::call('db:seed', ['--force' => true]);
        return $this->redirectHome();
    }

    // Clear application logs
    public function clearLogs()
    {
        file_put_contents(storage_path('logs/laravel.log'), '');
        return $this->redirectHome();
    }

    // Clear storage temp files
    public function clearTempFiles()
    {
        Storage::deleteDirectory('temp');
        return $this->redirectHome();
    }

    // Show application version
    public function appVersion()
    {
        return $this->redirectHome()->with('version', app()->version());
    }

    // Show PHP info
    public function phpInfo()
    {
        return $this->redirectHome()->with('phpinfo', phpversion());
    }

    // Show server info
    public function serverInfo()
    {
        return $this->redirectHome()->with('server', $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown');
    }

    // Toggle maintenance mode
    public function toggleMaintenance()
    {
        if (app()->isDownForMaintenance()) {
            Artisan::call('up');
            return $this->redirectHome()->with('maintenance', 'Application is now LIVE');
        } else {
            Artisan::call('down');
            return $this->redirectHome()->with('maintenance', 'Application is in MAINTENANCE mode');
        }
    }

    // Generate application key
    public function generateKey()
    {
        Artisan::call('key:generate');
        return $this->redirectHome();
    }

    // Link storage
    public function linkStorage()
    {
        Artisan::call('storage:link');
        return $this->redirectHome();
    }

    // Check URL
    public function checkUrl()
    {
        return $this->redirectHome()->with('url', config('app.url'));
    }
}

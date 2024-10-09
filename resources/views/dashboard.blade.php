<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            {{ __('Dashboard') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900 dark:text-gray-100">
                    <h3 class="text-lg font-semibold">Welcome, {{ Auth::user()->name }}!</h3>
                    <p>Your role: <strong>{{ Auth::user()->role }}</strong></p>

                    <div class="mt-4">
                        <h4 class="text-md font-semibold">Actions</h4>
                        <ul class="mt-2">
                            <li>
                                <a href="#" class="text-indigo-600 hover:underline">Some Feature</a>
                            </li>

                            <!-- Admin Specific Links -->
                            @if (Auth::user()->role === 'admin')
                                <li>
                                    <a href="#" class="text-indigo-600 hover:underline">Manage Users</a>
                                </li>
                                <li>
                                    <a href="#" class="text-indigo-600 hover:underline">Admin Feature</a>
                                </li>
                                <li>
                                    <a href="#" class="text-indigo-600 hover:underline">View Reports</a>
                                </li>
                            @endif

                            <!-- Employee Specific Links -->
                            @if (Auth::user()->role === 'employee')
                                <li>
                                    <span class="text-gray-400 cursor-not-allowed">Manage Users (disabled)</span>
                                </li>
                                <li>
                                    <span class="text-gray-400 cursor-not-allowed">Admin Feature (disabled)</span>
                                </li>
                                <li>
                                    <a href="#" class="text-indigo-600 hover:underline">Employee Feature</a>
                                </li>
                            @endif
                        </ul>
                    </div>

                    <div class="mt-4">
                        <h4 class="text-md font-semibold">General Information</h4>
                        <p>This section can include metrics, announcements, or any other relevant information.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>

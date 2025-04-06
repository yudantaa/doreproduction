import { Link } from "@inertiajs/react";
import { LogOut } from "lucide-react";

export default function Error403() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center p-8">
            <h1 className="text-4xl font-bold text-red-600 mb-4">
                403 - Forbidden
            </h1>
            <p className="text-gray-700 mb-6">
                Anda tidak memiliki akses ke halaman ini.
            </p>

            <Link
                href={route("logout")}
                method="post"
                as="button"
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
                <LogOut className="w-4 h-4" />
                Log out
            </Link>
        </div>
    );
}

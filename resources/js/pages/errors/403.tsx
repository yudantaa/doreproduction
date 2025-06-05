import { Link } from "@inertiajs/react";
import { LogOut } from "lucide-react";

export default function Error403({ status }: { status: number }) {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-3xl font-bold mb-4">
                403 - Anda tidak punya akses
            </h1>
            <p className="mb-4">
                Silakan logout dan login dengan akun yang memiliki akses.
            </p>
            <div className="underline">
                Tolong hubungi admin untuk pembuatan akun.
            </div>

            <Link
                href={route("logout")}
                method="post"
                as="button"
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded"
            >
                <LogOut className="mr-2" />
                Logout
            </Link>
        </div>
    );
}

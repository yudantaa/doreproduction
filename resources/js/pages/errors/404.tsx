import { Link } from "@inertiajs/react";

export default function Error404({ status }: { status: number }) {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-3xl font-bold mb-4">
                404 - Konten tidak ditemukan.
            </h1>
            <p className="mb-4">Pastikan url sudah benar.</p>
            <div className="underline">
                Tolong hubungi admin jika halaman ini seharusnya memiliki
                konten.
            </div>
        </div>
    );
}

import GuestLayout from "@/layouts/guest-layout";
import { Head, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft, Shield, Mail, UserCheck } from "lucide-react";

export default function RegistrationDisabled() {
    return (
        <GuestLayout>
            <Head title="Pendaftaran Dinonaktifkan" />

            <div className="min-h-screen flex items-center justify-center px-4 py-10">
                <div className="w-full max-w-6xl rounded-lg border bg-card text-card-foreground shadow-md p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Section */}
                    <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-6 col-span-1">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[hsl(var(--muted))]">
                            <AlertCircle className="h-8 w-8 text-[hsl(var(--destructive))]" />
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                            Pendaftaran Publik Tidak Tersedia
                        </h1>
                        <p className="text-muted-foreground text-sm md:text-base max-w-sm">
                            Pendaftaran mandiri dinonaktifkan. Akun admin hanya
                            dibuat oleh personel yang berwenang.
                        </p>
                    </div>

                    {/* Right Section */}
                    <div className="space-y-6 col-span-2">
                        {/* Info Boxes */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="rounded-lg border bg-muted p-5">
                                <div className="flex items-start gap-3">
                                    <Shield className="h-5 w-5 text-primary mt-0.5" />
                                    <div>
                                        <h3 className="text-sm font-semibold text-foreground">
                                            Sistem Akses Terkendali
                                        </h3>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            Akun admin baru hanya dibuat oleh
                                            Super Administrator untuk menjaga
                                            keamanan sistem.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="rounded-lg border bg-muted p-5">
                                <div className="flex items-start gap-3">
                                    <UserCheck className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                                    <div>
                                        <h3 className="text-sm font-semibold text-foreground">
                                            Sudah Punya Akun?
                                        </h3>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            Jika sudah memiliki kredensial
                                            admin, silakan masuk melalui halaman
                                            login.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Request Steps */}
                        <div className="space-y-2">
                            <h4 className="text-sm font-semibold text-foreground">
                                Untuk meminta akun admin baru:
                            </h4>
                            <ul className="space-y-1 text-sm text-muted-foreground pl-1">
                                <li className="flex items-start">
                                    <span className="mr-2 text-primary">•</span>
                                    Hubungi Super Administrator.
                                </li>
                            </ul>
                        </div>

                        {/* Help Box */}
                        <div className="rounded-lg border bg-muted p-5">
                            <div className="flex items-center gap-2">
                                <Mail className="h-5 w-5 text-muted-foreground" />
                                <span className="text-sm font-semibold text-muted-foreground">
                                    Butuh Bantuan?
                                </span>
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Hubungi administrator sistem organisasi Anda
                                untuk masalah akses akun.
                            </p>
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col md:flex-row gap-4">
                            <Link href="/login" className="w-full md:w-1/2">
                                <Button className="w-full">
                                    Pergi ke Halaman Login
                                </Button>
                            </Link>
                            <Link href="/" className="w-full md:w-1/2">
                                <Button variant="outline" className="w-full">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Kembali ke Beranda
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}

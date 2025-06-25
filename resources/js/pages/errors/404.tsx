import GuestLayout from "@/layouts/guest-layout";
import { Head, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { AlertCircle, ArrowLeft } from "lucide-react";

export default function Error404({ status }: { status: number }) {
    return (
        <GuestLayout>
            <Head title="404 - Konten Tidak Ditemukan" />

            <Card className="mx-auto max-w-md">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[hsl(var(--muted))]">
                        <AlertCircle className="h-8 w-8 text-[hsl(var(--destructive))]" />
                    </div>
                    <CardTitle className="text-xl text-foreground">
                        404 - Konten Tidak Ditemukan
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Konten yang diminta tidak ditemukan. Pastikan URL yang
                        Anda masukkan sudah benar.
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    <div className="rounded-lg bg-[hsl(var(--muted))] p-4">
                        <div className="flex items-start space-x-3">
                            <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                            <div>
                                <h3 className="text-sm font-medium text-foreground">
                                    Kemungkinan yang Terjadi:
                                </h3>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Halaman ini mungkin telah dipindahkan,
                                    dihapus, atau Anda salah mengetik alamat.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h4 className="text-sm font-medium text-foreground">
                            Yang Bisa Anda Lakukan:
                        </h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li className="flex items-start">
                                <span className="mr-2 text-primary">•</span>
                                Periksa kembali URL Anda
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2 text-primary">•</span>
                                Kembali ke beranda dan navigasi ulang
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2 text-primary">•</span>
                                Hubungi dukungan jika halaman ini seharusnya ada
                            </li>
                        </ul>
                    </div>

                    <div>
                        <Link href="/">
                            <Button className="w-full">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Kembali ke Beranda
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </GuestLayout>
    );
}

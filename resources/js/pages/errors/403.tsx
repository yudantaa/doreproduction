import { Link } from "@inertiajs/react";
import { LogOut, AlertOctagon } from "lucide-react";
import { Button } from "@/components/ui/button";
import GuestLayout from "@/layouts/guest-layout";
import { Head } from "@inertiajs/react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function Error403({ status }: { status: number }) {
    return (
        <GuestLayout>
            <Head title="403 - Tidak Diizinkan" />

            <Card className="mx-auto max-w-md">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[hsl(var(--muted))]">
                        <AlertOctagon className="h-8 w-8 text-[hsl(var(--destructive))]" />
                    </div>
                    <CardTitle className="text-xl text-foreground">
                        403 - Anda Tidak Punya Akses
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Anda tidak memiliki izin untuk mengakses halaman ini.
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    <div className="rounded-lg bg-[hsl(var(--muted))] p-4">
                        <div className="flex items-start space-x-3">
                            <AlertOctagon className="h-5 w-5 text-[hsl(var(--destructive))] mt-0.5" />
                            <div>
                                <h3 className="text-sm font-medium text-foreground">
                                    Akses Ditolak
                                </h3>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Silakan logout dan login dengan akun yang
                                    memiliki akses yang sesuai atau hubungi
                                    admin.
                                </p>
                            </div>
                        </div>
                    </div>

                    <form
                        method="post"
                        action={route("logout")}
                        className="space-y-2"
                    >
                        <Button type="submit" className="w-full">
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </GuestLayout>
    );
}

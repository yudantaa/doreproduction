import AuthenticatedLayout from "@/layouts/authenticated-layout";
import DeleteUserForm from "@/pages/profile/partials/delete-user-form";
import UpdatePasswordForm from "@/pages/profile/partials/update-password-form";
import UpdateProfileInformationForm from "@/pages/profile/partials/update-profile-information-form";
import { Head, usePage } from "@inertiajs/react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { PageProps } from "@/types";

export default function Edit({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage<PageProps>().props;
    const userRole = auth.user?.role;

    return (
        <AuthenticatedLayout header={"Edit Profil"}>
            <Head title="Profil" />

            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Profil</CardTitle>
                        <CardDescription>
                            Perbarui informasi profil dan alamat email akun
                            Anda.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Perbarui Kata Sandi</CardTitle>
                        <CardDescription>
                            Pastikan akun Anda menggunakan kata sandi yang
                            panjang dan acak untuk menjaga keamanan.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <UpdatePasswordForm className="max-w-xl" />
                    </CardContent>
                </Card>

                {userRole === "SUPER ADMIN" && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Hapus Akun</CardTitle>
                            <CardDescription>
                                Setelah akun Anda dihapus, semua data dan sumber
                                daya yang terkait akan terhapus secara permanen.
                                Sebelum menghapus akun, harap unduh data atau
                                informasi yang ingin Anda simpan.
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <DeleteUserForm className="max-w-xl" />
                        </CardContent>
                    </Card>
                )}
            </div>
        </AuthenticatedLayout>
    );
}

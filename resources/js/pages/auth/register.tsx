import { FormEventHandler, useEffect } from "react";
import GuestLayout from "@/layouts/guest-layout";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputError } from "@/components/ui/input-error";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function Register({
    mode = "register",
    onSuccessfulRegistration,
    isModal = false,
}: {
    mode?: "register" | "add-employee";
    onSuccessfulRegistration?: () => void;
    isModal?: boolean;
}) {
    const { auth } = usePage().props as any;
    const isAuthenticated = !!auth?.user;

    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        role: mode === "add-employee" ? "ADMIN" : "ADMIN", // Default to ADMIN
    });

    useEffect(() => {
        return () => {
            reset("password", "password_confirmation");
        };
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        // Dynamically choose the route based on the mode
        const registrationRoute =
            mode === "register"
                ? route("register") // Admin registration route
                : route("users.store"); // Admin adding a user route

        post(registrationRoute, {
            onSuccess: () => {
                reset();
                onSuccessfulRegistration?.();
            },
            onError: (errors) => {
                console.error("Registration Errors:", errors);
            },
        });
    };

    const FormContent = () => (
        <Card
            className={`mx-auto ${
                isModal
                    ? "max-w-xl w-full border-none shadow-none bg-transparent" // Wider when in modal
                    : "max-w-md" // Original width for standalone page
            }`}
        >
            <CardHeader>
                <CardTitle className="text-xl">
                    {mode === "register"
                        ? "Create New Admin Account"
                        : "Tambah Pegawai Baru"}
                </CardTitle>
                <CardDescription>
                    {mode === "register"
                        ? "Add a new administrator to the system"
                        : "Masukkan informasi pegawai baru"}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={submit} className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">
                            {mode === "register" ? "Full Name" : "Nama Pegawai"}
                        </Label>
                        <Input
                            id="name"
                            placeholder={
                                mode === "register"
                                    ? "Enter full name"
                                    : "Contoh Nama"
                            }
                            onChange={(e) => setData("name", e.target.value)}
                            value={data.name}
                            required
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder={
                                mode === "register"
                                    ? "admin@example.com"
                                    : "contoh@email.com"
                            }
                            onChange={(e) => setData("email", e.target.value)}
                            value={data.email}
                            required
                        />
                        <InputError message={errors.email} />
                    </div>

                    {/* Role Selection - only show for standalone registration */}
                    {mode === "register" && !isModal && (
                        <div className="grid gap-2">
                            <Label htmlFor="role">Admin Role</Label>
                            <Select
                                value={data.role}
                                onValueChange={(value) =>
                                    setData("role", value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select admin role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ADMIN">Admin</SelectItem>
                                    <SelectItem value="SUPER_ADMIN">
                                        Super Admin
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.role} />
                        </div>
                    )}

                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            value={data.password}
                            required
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation">
                            {mode === "register"
                                ? "Confirm Password"
                                : "Masukan Ulang Password"}
                        </Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            onChange={(e) =>
                                setData("password_confirmation", e.target.value)
                            }
                            value={data.password_confirmation}
                            required
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={processing}
                    >
                        {processing
                            ? mode === "register"
                                ? "Creating Account..."
                                : "Menambahkan..."
                            : mode === "register"
                            ? "Create Admin Account"
                            : "Tambah Pegawai"}
                    </Button>
                </form>

                {mode === "register" && !isModal && (
                    <div className="mt-4 text-center text-sm">
                        <Link
                            href="/dashboard"
                            className="text-blue-600 hover:underline"
                        >
                            ← Back to Dashboard
                        </Link>
                    </div>
                )}
            </CardContent>
        </Card>
    );

    // If it's a modal, don't wrap with any layout
    if (isModal) {
        return <FormContent />;
    }

    // If authenticated (admin), use authenticated layout
    if (isAuthenticated) {
        return (
            <AuthenticatedLayout header="Create New Admin">
                <Head title="Create Admin" />
                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <FormContent />
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    // If not authenticated, use guest layout (though this shouldn't happen with the controller logic)
    return (
        <GuestLayout>
            <Head title="Create Account" />
            <FormContent />
        </GuestLayout>
    );
}

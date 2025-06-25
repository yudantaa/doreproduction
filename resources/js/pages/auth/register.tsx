import { FormEventHandler, useEffect } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
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

export default function Register({
    mode = "register",
    onSuccessfulRegistration,
    isModal = false,
}: {
    mode?: "register" | "add-employee";
    onSuccessfulRegistration?: () => void;
    isModal?: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        role: mode === "add-employee" ? "ADMIN" : "", // Default role for employee mode
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
                ? route("register") // Default registration route
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

    return (
        <form onSubmit={submit}>
            <Card
                className={`mx-auto ${
                    isModal
                        ? "max-w-xl w-full" // Wider when in modal
                        : "max-w-sm" // Original width
                }`}
            >
                <CardHeader>
                    <CardTitle className="text-xl">
                        {mode === "register"
                            ? "Sign Up"
                            : "Tambah Pegawai Baru"}
                    </CardTitle>
                    <CardDescription>
                        {mode === "register"
                            ? "Enter your information to create an account"
                            : "Masukkan informasi pegawai baru"}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nama Pegawai</Label>
                            <Input
                                id="name"
                                placeholder="Contoh Nama"
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
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
                                placeholder="contoh@email.com"
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                value={data.email}
                                required
                            />
                            <InputError message={errors.email} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                                value={data.password}
                            />
                            <InputError message={errors.password} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation">
                                Masukan Ulang Password
                            </Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                onChange={(e) =>
                                    setData(
                                        "password_confirmation",
                                        e.target.value
                                    )
                                }
                                value={data.password_confirmation}
                            />
                            <InputError
                                message={errors.password_confirmation}
                            />
                        </div>
                        <Button type="submit" className="w-full">
                            {mode === "register"
                                ? "Create an account"
                                : "Tambah Pegawai"}
                        </Button>
                    </div>

                    {mode === "register" && (
                        <div className="mt-4 text-center text-sm">
                            Already have an account?{" "}
                            <Link href="/login" className="underline">
                                Sign in
                            </Link>
                        </div>
                    )}
                </CardContent>
            </Card>
        </form>
    );
}

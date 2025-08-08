import { FormEventHandler, useEffect } from "react";
import GuestLayout from "@/layouts/guest-layout";
import { Head, Link, useForm } from "@inertiajs/react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { InputError } from "@/components/ui/input-error";
import { Phone, Mail, MapPin, Instagram, Facebook } from "lucide-react";
import AppearanceDropdown from "@/components/appearance-dropdown";

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset("password");
        };
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("login"));
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col">
            <Head title="Login - Dore Production" />

            {/* Header - Same as Homepage */}
            <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <Link href="/">
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-gray-900 dark:bg-gray-100 rounded-full flex items-center justify-center mr-2">
                                <img
                                    src="/logo.jpg"
                                    alt="Dore Production Logo"
                                    className="h-full w-full object-contain rounded-lg"
                                />
                            </div>
                            <h3 className="text-lg font-bold text-black dark:text-white">
                                Dore{" "}
                                <span className="text-red-700 dark:text-red-600">
                                    Production
                                </span>
                            </h3>
                        </div>
                    </Link>

                    <div className="flex items-center gap-3">
                        <AppearanceDropdown />
                        <a
                            href="https://wa.me/089522734461"
                            className="hidden md:flex"
                        >
                            <Button
                                variant="default"
                                size="sm"
                                className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200"
                            >
                                <Phone className="w-4 h-4 mr-1" /> Hubungi Kami
                            </Button>
                        </a>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center py-12">
                <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-center gap-8">
                    {/* Logo for desktop view */}
                    <div className="hidden md:block flex-1 max-w-md">
                        <img
                            src="/logo.jpg"
                            alt="Dore Production Logo"
                            className="w-full h-auto object-contain rounded-lg"
                        />
                    </div>

                    {/* Login Form */}
                    <div className="w-full md:flex-1 max-w-sm">
                        <form onSubmit={submit}>
                            <Card className="w-full">
                                <CardHeader>
                                    <CardTitle className="text-2xl">
                                        Login
                                    </CardTitle>
                                    <CardDescription>
                                        Tolong masukan email dan password anda
                                        untuk login ke akun anda.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {status && (
                                        <div className="mb-4 font-medium text-sm text-green-600">
                                            {status}
                                        </div>
                                    )}

                                    <div className="grid gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="Masukan email anda disini"
                                                value={data.email}
                                                onChange={(e) =>
                                                    setData(
                                                        "email",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />
                                            <InputError
                                                message={errors.email}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <div className="flex items-center">
                                                <Label htmlFor="password">
                                                    Password
                                                </Label>
                                            </div>
                                            <Input
                                                id="password"
                                                type="password"
                                                value={data.password}
                                                placeholder="Masukan password anda disini"
                                                onChange={(e) =>
                                                    setData(
                                                        "password",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />
                                            <InputError
                                                message={errors.password}
                                            />
                                        </div>
                                        <Button
                                            type="submit"
                                            className="w-full"
                                            disabled={processing}
                                        >
                                            {processing
                                                ? "Memproses..."
                                                : "Login"}
                                        </Button>
                                    </div>
                                    <div className="mt-4 text-center text-sm">
                                        Ada kendala? <br />
                                        <div className="underline">
                                            Tolong hubungi admin untuk pembuatan
                                            akun dan perubahan password.
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}

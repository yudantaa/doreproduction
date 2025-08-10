import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { useToast } from "@/components/hooks/use-toast";
import { router } from "@inertiajs/react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { usePage } from "@inertiajs/react";

export type User = {
    id: string;
    name: string;
    email: string;
    role: string;
    password?: string;
    created_at: Date;
};

export const columns: ColumnDef<User>[] = [
    {
        header: "Nomor",
        cell: ({ row }) => {
            return <div className=" font-bold">{row.index + 1}</div>;
        },
    },
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Nama
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
    {
        accessorKey: "email",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Email
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
    {
        accessorKey: "role",
        header: "Hak Akses",
    },
    {
        accessorKey: "created_at",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Waktu Ditambahkan
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const date = new Date(row.original.created_at);
            return `${date.toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "long",
                year: "numeric",
            })} ${date.toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            })}`;
        },
        sortingFn: (rowA, rowB) => {
            const dateA = new Date(rowA.original.created_at);
            const dateB = new Date(rowB.original.created_at);
            return dateA.getTime() - dateB.getTime();
        },
    },
    {
        accessorKey: "action",
        header: "Atur",
        id: "actions",
        cell: ({ row }) => {
            const user = row.original;
            const [formData, setFormData] = useState<User | null>(null);
            const { toast } = useToast();
            const roles = ["ADMIN", "SUPER ADMIN"];
            const [showPassword, setShowPassword] = useState(false);
            const { auth } = usePage().props as any;
            const isCurrentUser = auth.user.id === user.id;
            const isSuperAdmin = auth.user.role === "SUPER ADMIN";

            const openDialog = () => setFormData({ ...user });
            const closeDialog = () => setFormData(null);

            const handleUpdate = () => {
                if (formData) {
                    router.put(`users/${formData.id}`, formData, {
                        onSuccess: () => {
                            closeDialog();
                            toast({
                                description: "Data berhasil diubah.",
                            });
                        },
                        onError: (errors) => {
                            toast({
                                title: "Gagal Mengubah Data",
                                description:
                                    "Silakan periksa kembali input Anda.",
                                variant: "destructive",
                            });
                        },
                    });
                }
            };

            return (
                <AlertDialog>
                    <Dialog>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Atur</DropdownMenuLabel>
                                <DropdownMenuSeparator />

                                <DialogTrigger>
                                    <DropdownMenuItem onClick={openDialog}>
                                        Ubah Data
                                    </DropdownMenuItem>
                                </DialogTrigger>

                                <DropdownMenuSeparator></DropdownMenuSeparator>

                                <AlertDialogTrigger>
                                    <DropdownMenuItem
                                        className="text-red-600"
                                        disabled={isCurrentUser && isSuperAdmin}
                                    >
                                        Hapus Data
                                    </DropdownMenuItem>
                                </AlertDialogTrigger>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Delete Confirmation Dialog */}
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Apakah Anda Yakin?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    Tindakan ini tidak dapat dibatalkan. Ini
                                    akan menghapus akun ini secara permanen dan
                                    menghapus data ini dari server kami.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction
                                    className="bg-red-600"
                                    onClick={() => {
                                        if (isCurrentUser && isSuperAdmin) {
                                            toast({
                                                title: "Tidak dapat menghapus akun sendiri",
                                                description:
                                                    "Super Admin tidak dapat menghapus akun sendiri",
                                                variant: "destructive",
                                            });
                                            return;
                                        }
                                        router.delete(`users/${user.id}`, {
                                            onSuccess: () => {
                                                toast({
                                                    description:
                                                        "Data berhasil dihapus.",
                                                });
                                            },
                                            onError: () => {
                                                toast({
                                                    description:
                                                        "Gagal menghapus data.",
                                                    variant: "destructive",
                                                });
                                            },
                                        });
                                    }}
                                >
                                    Lanjut Hapus
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>

                        {/* Update User Dialog */}
                        {formData && (
                            <Dialog
                                open={!!formData}
                                onOpenChange={closeDialog}
                            >
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>
                                            Ubah data pegawai Ini
                                        </DialogTitle>
                                        <DialogDescription>
                                            Setelah selesai silahkan klik tombol
                                            ubah.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label
                                                htmlFor="name"
                                                className="text-right"
                                            >
                                                Name
                                            </Label>
                                            <Input
                                                id="name"
                                                value={formData.name}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        name: e.target.value,
                                                    })
                                                }
                                                className="col-span-3"
                                            />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label
                                                htmlFor="email"
                                                className="text-right"
                                            >
                                                Email
                                            </Label>
                                            <Input
                                                id="email"
                                                value={formData.email}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        email: e.target.value,
                                                    })
                                                }
                                                className="col-span-3"
                                            />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label
                                                htmlFor="role"
                                                className="text-right"
                                            >
                                                Role
                                            </Label>
                                            <Select
                                                onValueChange={(value) =>
                                                    setFormData({
                                                        ...formData,
                                                        role: value,
                                                    })
                                                }
                                                defaultValue={formData.role}
                                            >
                                                <SelectTrigger className="w-[180px]">
                                                    <SelectValue placeholder="Select Role" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {roles.map((role) => (
                                                        <SelectItem
                                                            key={role}
                                                            value={role}
                                                        >
                                                            {role}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label
                                                htmlFor="password"
                                                className="text-right"
                                            >
                                                Password
                                            </Label>
                                            <div className="relative col-span-3">
                                                <Input
                                                    id="password"
                                                    type={
                                                        showPassword
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    value={
                                                        formData.password || ""
                                                    }
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            password:
                                                                e.target.value,
                                                        })
                                                    }
                                                />
                                                <button
                                                    type="button"
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-muted-foreground"
                                                    onClick={() =>
                                                        setShowPassword(
                                                            (prev) => !prev
                                                        )
                                                    }
                                                >
                                                    {showPassword
                                                        ? "Hide"
                                                        : "Show"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button
                                            type="submit"
                                            onClick={handleUpdate}
                                        >
                                            Ubah
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        )}
                    </Dialog>
                </AlertDialog>
            );
        },
    },
];

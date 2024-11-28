import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react"
import { useToast } from "@/components/hooks/use-toast";
import { router } from '@inertiajs/react';
import Register from "../auth/register";
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

export type User = {
    id: string;
    name: string;
    email: string;
    role: string;
    created_at: Date;
};

export const columns: ColumnDef<User>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Nama
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "email",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Email
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "role",
        header: "Kuasa",
    },
    {
        accessorKey: "created_at",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Tanggal Didaftarkan
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const date = new Date(row.original.created_at);
            return date.toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "long",
                year: "numeric",
            });
        },
        sortFn: (rowA, rowB) => {
            const dateA = new Date(rowA.original.created_at);
            const dateB = new Date(rowB.original.created_at);
            return dateA - dateB;
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

            const openDialog = () => setFormData({...user}); // Create a copy of user data
            const closeDialog = () => setFormData(null);

            const handleUpdate = () => {
                if (formData) {
                    router.put(`/users/${formData.id}`, formData, {
                        onSuccess: () => {
                            closeDialog();
                            toast({
                                description: "Data berhasil diubah.",
                            });
                        },
                        onError: (errors) => {
                            toast({
                                title: "Gagal Mengubah Data",
                                description: "Silakan periksa kembali input Anda.",
                                variant: "destructive"
                            });
                        }
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
                                    <DropdownMenuItem className="text-red-600">
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
                                        router.delete(`/users/${user.id}`, {
                                            onSuccess: () => {
                                                toast({
                                                    description: "Data berhasil dihapus.",
                                                });
                                            },
                                            onError: () => {
                                                toast({
                                                    description: "Gagal menghapus data.",
                                                    variant: "destructive"
                                                });
                                            }
                                        });
                                    }}
                                >
                                    Lanjut Hapus
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>

                        {/* Update User Dialog */}
                        {formData && (
                            <DialogContent className="sm:max-w-[625px]">
                                <DialogHeader>
                                    <DialogTitle>Ubah Data Pegawai</DialogTitle>
                                    <DialogDescription>
                                        Ubah data dari pegawai ini, setelah
                                        selesai, silakan menekan tombol ubah.
                                    </DialogDescription>
                                </DialogHeader>

                                <Register
                                    mode="add-employee"
                                    isModal={true}
                                    onSuccessfulRegistration={() => {
                                        closeDialog();
                                        toast({
                                            description: "Pegawai berhasil diperbarui.",
                                        });
                                    }}
                                />
                            </DialogContent>
                        )}
                    </Dialog>
                </AlertDialog>
            );
        },
    },
];

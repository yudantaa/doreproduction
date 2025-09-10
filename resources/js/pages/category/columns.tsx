import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { useToast } from "@/components/hooks/use-toast";
import { router } from "@inertiajs/react";
import type { Page } from "@inertiajs/core";
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
import { useState } from "react";

export type Category = {
    id: string;
    nama_kategori: string;
    created_at: Date;
};

export const columns: ColumnDef<Category>[] = [
    {
        header: "Nomor",
        cell: ({ row }) => {
            return <div className=" font-bold">{row.index + 1}</div>;
        },
    },
    {
        accessorKey: "nama_kategori",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Nama Kategori
                </Button>
            );
        },
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
            const category = row.original;
            const [formData, setFormData] = useState<Category | null>(null);
            const { toast } = useToast();

            const openDialog = () => setFormData({ ...category });
            const closeDialog = () => setFormData(null);

            const handleUpdate = () => {
                if (formData) {
                    router.put(`categories/${formData.id}`, formData, {
                        onSuccess: (
                            page: Page<{
                                flash?: { success?: string; error?: string };
                            }>
                        ) => {
                            const flash = page.props?.flash || {};
                            closeDialog();

                            if (flash.error) {
                                toast({
                                    title: "Gagal Mengubah Kategori",
                                    description: flash.error,
                                    variant: "destructive",
                                });
                            } else if (flash.success) {
                                toast({ description: flash.success });
                            } else {
                                toast({ description: "Data berhasil diubah." });
                            }
                        },
                        onError: () => {
                            toast({
                                title: "Gagal Mengubah Data",
                                description:
                                    "Terjadi kesalahan saat mengubah data.",
                                variant: "destructive",
                            });
                        },
                    });
                }
            };

            const handleDelete = () => {
                router.delete(`categories/${category.id}`, {
                    onSuccess: (
                        page: Page<{
                            flash?: { success?: string; error?: string };
                        }>
                    ) => {
                        const flash = page.props?.flash || {};

                        if (flash.error) {
                            toast({
                                title: "Gagal Menghapus Kategori",
                                description: flash.error,
                                variant: "destructive",
                            });
                        } else if (flash.success) {
                            toast({ description: flash.success });
                        } else {
                            toast({ description: "Data berhasil dihapus." });
                        }
                    },
                    onError: () => {
                        toast({
                            title: "Gagal Menghapus Data",
                            description:
                                "Terjadi kesalahan saat menghapus data.",
                            variant: "destructive",
                        });
                    },
                });
            };

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                        <DropdownMenuItem onClick={openDialog}>
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                    className="text-red-600"
                                    onSelect={(e) => e.preventDefault()}
                                >
                                    Hapus
                                </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Apakah kamu yakin ingin menghapus
                                        kategori ini?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Data yang sudah dihapus tidak bisa
                                        dikembalikan.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Batal</AlertDialogCancel>
                                    <AlertDialogAction
                                        className="bg-red-600"
                                        onClick={handleDelete}
                                    >
                                        Lanjut Hapus
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

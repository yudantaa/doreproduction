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
import { useState } from "react";



export type Category = {
    id: string;
    nama_kategori: string;
    created_at: Date;
};

export const columns: ColumnDef<Category>[] = [

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
                    <ArrowUpDown className="ml-2 h-4 w-4" />
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
        sortFn: (rowA, rowB) => {
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
                    router.put(`/categories/${formData.id}`, formData, {
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
                                    "Data ini sudah ada, silakan periksa kembali input Anda.",
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
                                    akan menghapus kategori ini secara permanen
                                    dari server kami.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction
                                    className="bg-red-600"
                                    onClick={() => {
                                        router.delete(`/categories/${category.id}`, {
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

                        {/* Update Category Dialog */}
                        {formData && (
                            <Dialog open={!!formData} onOpenChange={closeDialog}>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Ubah Data Kategori</DialogTitle>
                                        <DialogDescription>
                                            Setelah selesai silahkan klik tombol ubah.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 categories-center gap-4">
                                            <Label htmlFor="nama_kategori" className="text-right">
                                                Nama Kategori
                                            </Label>
                                            <Input
                                                id="nama_kategori"
                                                value={formData.nama_kategori}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        nama_kategori: e.target.value,
                                                    })
                                                }
                                                className="col-span-3"
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit" onClick={handleUpdate}>
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

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

// Updated type definition to match the expected Item structure
export type Item = {
    id: string;
    nama_barang: string;
    status: string;
    deskripsi: string;
    id_kategori: string;
    jumlah: number;
    created_at: Date;
};

export const columns: ColumnDef<Item>[] = [
    {
        accessorKey: "nama_barang",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Nama Barang
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
    {
        accessorKey: "status",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
    {
        accessorKey: "deskripsi",
        header: "Deskripsi",
    },
    {
        accessorKey: "jumlah",
        header: "Stok",
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
            return dateA.getTime() - dateB.getTime();
        },
    },
    {
        accessorKey: "action",
        header: "Atur",
        id: "actions",
        cell: ({ row }) => {
            const item = row.original;
            const [formData, setFormData] = useState<Item | null>(null);
            const { toast } = useToast();
            const status = ["Tersedia", "Tidak Tersedia", "Segera Datang"];

            const openDialog = () => setFormData({ ...item });
            const closeDialog = () => setFormData(null);

            const handleUpdate = () => {
                if (formData) {
                    router.put(`/items/${formData.id}`, formData, {
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
                                    akan menghapus barang ini secara permanen
                                    dari server kami.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction
                                    className="bg-red-600"
                                    onClick={() => {
                                        router.delete(`/items/${item.id}`, {
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

                        {/* Update Item Dialog */}
                        {formData && (
                            <Dialog open={!!formData} onOpenChange={closeDialog}>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Ubah Data Barang</DialogTitle>
                                        <DialogDescription>
                                            Setelah selesai silahkan klik tombol ubah.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="nama_barang" className="text-right">
                                                Nama Barang
                                            </Label>
                                            <Input
                                                id="nama_barang"
                                                value={formData.nama_barang}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        nama_barang: e.target.value,
                                                    })
                                                }
                                                className="col-span-3"
                                            />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="jumlah" className="text-right">
                                                Stok
                                            </Label>
                                            <Input
                                                id="jumlah"
                                                type="number"
                                                value={formData.jumlah}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        jumlah: parseInt(e.target.value),
                                                    })
                                                }
                                                className="col-span-3"
                                            />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="status" className="text-right">
                                                Status
                                            </Label>
                                            <Select
                                                onValueChange={(value) =>
                                                    setFormData({
                                                        ...formData,
                                                        status: value,
                                                    })
                                                }
                                                defaultValue={formData.status}
                                            >
                                                <SelectTrigger className="w-[180px]">
                                                    <SelectValue placeholder="Pilih Status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {status.map((stat) => (
                                                        <SelectItem key={stat} value={stat}>
                                                            {stat}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="deskripsi" className="text-right">
                                                Deskripsi
                                            </Label>
                                            <Input
                                                id="deskripsi"
                                                value={formData.deskripsi}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        deskripsi: e.target.value,
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
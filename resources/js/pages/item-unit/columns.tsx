import React, { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { useToast } from "@/components/hooks/use-toast";
import { router } from "@inertiajs/react";
import { useFormState } from "@/utilities/form-utilities";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ItemUnit } from "@/types/item-unit";

export const columns = (items: any[]): ColumnDef<ItemUnit>[] => [
    {
        header: "No",
        cell: ({ row }) => {
            return <div className="font-bold">{row.index + 1}</div>;
        },
    },
    {
        accessorKey: "kode_unit",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Kode Unit
                </Button>
            );
        },
    },
    {
        accessorKey: "item.nama_barang",
        header: "Nama Barang",
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.original.status;
            const statusColors = {
                Tersedia: "bg-green-100 text-green-800",
                Rusak: "bg-red-100 text-red-800",
                "Dalam Perbaikan": "bg-yellow-100 text-yellow-800",
                Disewa: "bg-blue-100 text-blue-800",
                "Tidak Tersedia": "bg-gray-100 text-gray-800",
            };
            return (
                <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}
                >
                    {status}
                </span>
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
            })}`;
        },
    },
    {
        id: "actions",
        header: "Aksi",
        cell: ({ row }) => {
            const unit = row.original;
            const { toast } = useToast();
            const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

            const {
                formData,
                handleInputChange,
                handleSelectChange,
                openModal,
                closeModal,
            } = useFormState<ItemUnit>(null);

            const handleUpdate = async (e: React.FormEvent) => {
                e.preventDefault();
                if (!formData) return;

                router.put(`item-units/${unit.id}`, formData, {
                    onSuccess: () => {
                        toast({
                            description: "Unit berhasil diperbarui.",
                        });
                        closeModal();
                    },
                    onError: (errors) => {
                        toast({
                            title: "Gagal Memperbarui Unit",
                            description: "Silakan periksa kembali input Anda.",
                            variant: "destructive",
                        });
                    },
                });
            };

            return (
                <>
                    <AlertDialog
                        open={isDeleteDialogOpen}
                        onOpenChange={setIsDeleteDialogOpen}
                    >
                        <Dialog>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="h-8 w-8 p-0"
                                    >
                                        <span className="sr-only">
                                            Open menu
                                        </span>
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DialogTrigger>
                                        <DropdownMenuItem
                                            onClick={() => openModal(unit)}
                                        >
                                            Ubah Data
                                        </DropdownMenuItem>
                                    </DialogTrigger>
                                    <DropdownMenuSeparator />
                                    <AlertDialogTrigger>
                                        <DropdownMenuItem className="text-red-600">
                                            Hapus Data
                                        </DropdownMenuItem>
                                    </AlertDialogTrigger>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Apakah Anda Yakin?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Tindakan ini tidak dapat dibatalkan. Ini
                                        akan menghapus unit ini secara permanen
                                        dari server kami.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Batal</AlertDialogCancel>
                                    <AlertDialogAction
                                        className="bg-red-600"
                                        onClick={() => {
                                            router.delete(
                                                `item-units/${unit.id}`,
                                                {
                                                    onSuccess: () => {
                                                        toast({
                                                            description:
                                                                "Unit berhasil dihapus.",
                                                        });
                                                    },
                                                    onError: () => {
                                                        toast({
                                                            description:
                                                                "Gagal menghapus unit.",
                                                            variant:
                                                                "destructive",
                                                        });
                                                    },
                                                }
                                            );
                                        }}
                                    >
                                        Lanjut Hapus
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>

                            {formData && (
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>
                                            Ubah Data Unit
                                        </DialogTitle>
                                        <DialogDescription>
                                            Setelah selesai silahkan klik tombol
                                            ubah.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <form
                                        onSubmit={handleUpdate}
                                        className="space-y-4"
                                    >
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label
                                                htmlFor="kode_unit"
                                                className="text-right"
                                            >
                                                Kode Unit
                                            </Label>
                                            <Input
                                                id="kode_unit"
                                                name="kode_unit"
                                                value={formData.kode_unit}
                                                onChange={handleInputChange}
                                                className="col-span-3"
                                            />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label
                                                htmlFor="id_barang"
                                                className="text-right"
                                            >
                                                Barang
                                            </Label>
                                            <Select
                                                value={formData.id_barang}
                                                onValueChange={(value) =>
                                                    handleSelectChange(
                                                        "id_barang",
                                                        value
                                                    )
                                                }
                                            >
                                                <SelectTrigger className="col-span-3">
                                                    <SelectValue placeholder="Pilih Barang" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {items.map((item) => (
                                                        <SelectItem
                                                            key={item.id}
                                                            value={item.id}
                                                        >
                                                            {item.nama_barang}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label
                                                htmlFor="status"
                                                className="text-right"
                                            >
                                                Status
                                            </Label>
                                            <Select
                                                value={formData.status}
                                                onValueChange={(value) =>
                                                    handleSelectChange(
                                                        "status",
                                                        value
                                                    )
                                                }
                                            >
                                                <SelectTrigger className="col-span-3">
                                                    <SelectValue placeholder="Pilih Status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Tersedia">
                                                        Tersedia
                                                    </SelectItem>
                                                    <SelectItem value="Rusak">
                                                        Rusak
                                                    </SelectItem>
                                                    <SelectItem value="Dalam Perbaikan">
                                                        Dalam Perbaikan
                                                    </SelectItem>
                                                    <SelectItem value="Disewa">
                                                        Disewa
                                                    </SelectItem>
                                                    <SelectItem value="Tidak Tersedia">
                                                        Tidak Tersedia
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <DialogFooter>
                                            <Button type="submit">Ubah</Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            )}
                        </Dialog>
                    </AlertDialog>
                </>
            );
        },
    },
];

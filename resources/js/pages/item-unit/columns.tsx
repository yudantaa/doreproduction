import { useToast } from "@/components/hooks/use-toast";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ItemUnit } from "@/types/item-unit";
import { useFormState } from "@/utilities/form-utilities";
import { router } from "@inertiajs/react";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import React, { useState } from "react";

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
                "Sedang Ditahan": "bg-yellow-100 text-yellow-800",
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
            const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
            const [unitNumber, setUnitNumber] = useState("");

            const {
                formData,
                handleInputChange,
                handleSelectChange,
                openModal,
                closeModal,
            } = useFormState<ItemUnit>(null);

            // Extract unit number from kode_unit when modal opens
            React.useEffect(() => {
                if (formData && formData.kode_unit) {
                    const parts = formData.kode_unit.split("-");
                    if (parts.length > 1) {
                        setUnitNumber(parts[parts.length - 1]);
                    }
                }
            }, [formData]);

            // Find selected item for display
            const selectedItem = formData
                ? items.find((item) => item.id === formData.id_barang)
                : null;

            const handleUpdate = async (e: React.FormEvent) => {
                e.preventDefault();
                if (!formData || !selectedItem || !unitNumber.trim()) return;

                // Construct the final kode_unit
                const finalFormData = {
                    ...formData,
                    kode_unit: `${selectedItem.base_code}-${unitNumber}`,
                };

                router.put(
                    `item-units/${unit.id}`,
                    finalFormData as unknown as Record<string, any>,
                    {
                        onSuccess: () => {
                            toast({
                                description: "Unit berhasil diperbarui.",
                            });
                            setIsEditDialogOpen(false);
                            closeModal();
                        },
                        onError: (errors) => {
                            console.log("Update errors:", errors);
                            toast({
                                title: "Gagal Memperbarui Unit",
                                description:
                                    "Silakan periksa kembali input Anda. Mungkin kode unit sudah ada.",
                                variant: "destructive",
                            });
                        },
                    }
                );
            };

            const handleDelete = () => {
                router.delete(`item-units/${unit.id}`, {
                    onFinish: () => {
                        setIsDeleteDialogOpen(false);
                    },
                    onSuccess: (page: any) => {
                        const flashMessages = page.props.flash || {};

                        if (flashMessages.error) {
                            toast({
                                title: "Gagal Menghapus Unit",
                                description: flashMessages.error,
                                variant: "destructive",
                            });
                        } else if (flashMessages.success) {
                            toast({
                                description: flashMessages.success,
                            });
                        } else {
                            toast({
                                description: "Unit berhasil dihapus.",
                            });
                        }
                    },
                    onError: (errors) => {
                        console.log("Delete errors:", errors);
                        toast({
                            title: "Gagal Menghapus Unit",
                            description:
                                "Terjadi kesalahan saat menghapus unit.",
                            variant: "destructive",
                        });
                    },
                });
            };

            const handleItemChange = (value: string) => {
                handleSelectChange("id_barang", value);
            };

            const handleUnitNumberChange = (
                e: React.ChangeEvent<HTMLInputElement>
            ) => {
                setUnitNumber(e.target.value);
            };

            const openEditModal = () => {
                openModal(unit);
                setIsEditDialogOpen(true);
            };

            const closeEditModal = () => {
                setIsEditDialogOpen(false);
                closeModal();
            };

            return (
                <>
                    {/* Edit Dialog */}
                    <Dialog
                        open={isEditDialogOpen}
                        onOpenChange={setIsEditDialogOpen}
                    >
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Ubah Data Unit</DialogTitle>
                                <DialogDescription>
                                    Setelah selesai silahkan klik tombol ubah.
                                </DialogDescription>
                            </DialogHeader>
                            {formData && (
                                <form
                                    onSubmit={handleUpdate}
                                    className="space-y-4"
                                >
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label
                                            htmlFor="id_barang"
                                            className="text-right"
                                        >
                                            Barang
                                        </Label>
                                        <Select
                                            value={formData.id_barang}
                                            onValueChange={handleItemChange}
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
                                                        {item.nama_barang} (
                                                        {item.base_code})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label
                                            htmlFor="unit_number"
                                            className="text-right"
                                        >
                                            Nomor Unit
                                        </Label>
                                        <div className="col-span-3">
                                            <div className="flex items-center space-x-2">
                                                <span className="text-sm font-medium text-muted-foreground min-w-fit">
                                                    {selectedItem
                                                        ? `${selectedItem.base_code}-`
                                                        : "Pilih barang dulu"}
                                                </span>
                                                <Input
                                                    id="unit_number"
                                                    value={unitNumber}
                                                    onChange={
                                                        handleUnitNumberChange
                                                    }
                                                    placeholder="contoh: 001 atau 102"
                                                    disabled={!selectedItem}
                                                    className="flex-1"
                                                />
                                            </div>
                                            {selectedItem && unitNumber && (
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    Kode unit:{" "}
                                                    <span className="font-medium">
                                                        {selectedItem.base_code}
                                                        -{unitNumber}
                                                    </span>
                                                </p>
                                            )}
                                        </div>
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
                                                <SelectItem value="Sedang Ditahan">
                                                    Sedang Ditahan
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <DialogFooter>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={closeEditModal}
                                        >
                                            Batal
                                        </Button>
                                        <Button type="submit">Ubah</Button>
                                    </DialogFooter>
                                </form>
                            )}
                        </DialogContent>
                    </Dialog>

                    {/* Delete Confirmation Dialog */}
                    <AlertDialog
                        open={isDeleteDialogOpen}
                        onOpenChange={setIsDeleteDialogOpen}
                    >
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Apakah Anda Yakin?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    Tindakan ini tidak dapat dibatalkan. Ini
                                    akan menghapus unit{" "}
                                    <strong>{unit.kode_unit}</strong> secara
                                    permanen dari server kami.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction
                                    className="bg-red-600 hover:bg-red-700"
                                    onClick={handleDelete}
                                >
                                    Lanjut Hapus
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    {/* Dropdown Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={openEditModal}>
                                Ubah Data
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => setIsDeleteDialogOpen(true)}
                            >
                                Hapus Data
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </>
            );
        },
    },
];

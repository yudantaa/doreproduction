import React, { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
    ArrowUpDown,
    MoreHorizontal,
    Edit,
    Check,
    X,
    Trash2,
    Calendar,
    Clock,
    Phone,
    User,
    Package,
    AlertTriangle,
} from "lucide-react";
import { useFormState } from "@/utilities/form-utilities";
import { useToast } from "@/components/hooks/use-toast";
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
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { router } from "@inertiajs/react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Label } from "@/components/ui/label";

export type Loan = {
    id: string;
    nama_penyewa: string;
    no_tlp_penyewa: string;
    tanggal_sewa: string;
    tanggal_kembali: string | null;
    deadline_pengembalian: string;
    status: string;
    kode_unit: string;
    nama_barang: string;
    id_item_unit: string;
};

type Item = {
    id: string;
    nama_barang: string;
    available_units: number;
};

const formatDate = (date: string) => {
    return format(new Date(date), "d MMM yyyy", { locale: id });
};

const formatDateTime = (date: string) => {
    return format(new Date(date), "d MMM yyyy, HH:mm", { locale: id });
};

export const columns = (
    items: Item[],
    isSuperAdmin: boolean
): ColumnDef<Loan>[] => [
    {
        header: "No",
        cell: ({ row }) => (
            <div className="w-8 text-center text-sm font-medium text-muted-foreground">
                {row.index + 1}
            </div>
        ),
    },
    {
        accessorKey: "nama_penyewa",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
                className="h-auto p-0 font-medium"
            >
                <User className="mr-2 h-4 w-4" />
                Penyewa
            </Button>
        ),
        cell: ({ row }) => (
            <div className="min-w-[120px]">
                <div className="font-medium text-foreground">
                    {row.original.nama_penyewa}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                    <Phone className="mr-1 h-3 w-3" />
                    <a
                        href={`https://wa.me/${row.original.no_tlp_penyewa}`}
                        className="hover:text-primary transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {row.original.no_tlp_penyewa}
                    </a>
                </div>
            </div>
        ),
    },
    {
        accessorKey: "nama_barang",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
                className="h-auto p-0 font-medium"
            >
                <Package className="mr-2 h-4 w-4" />
                Barang
            </Button>
        ),
        cell: ({ row }) => (
            <div className="min-w-[100px]">
                <div className="font-medium text-foreground">
                    {row.original.nama_barang}
                </div>
                <div className="text-xs text-muted-foreground">
                    Unit: {row.original.kode_unit}
                </div>
            </div>
        ),
    },
    {
        accessorKey: "tanggal_sewa",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
                className="h-auto p-0 font-medium"
            >
                <Calendar className="mr-2 h-4 w-4" />
                Tanggal Sewa
            </Button>
        ),
        cell: ({ row }) => (
            <div className="min-w-[100px] text-sm text-muted-foreground">
                {formatDate(row.original.tanggal_sewa)}
            </div>
        ),
    },
    {
        accessorKey: "deadline_pengembalian",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
                className="h-auto p-0 font-medium"
            >
                <Clock className="mr-2 h-4 w-4" />
                Deadline
            </Button>
        ),
        cell: ({ row }) => {
            const deadline = new Date(row.original.deadline_pengembalian);
            const today = new Date();
            const isOverdue =
                row.original.status === "Disewa" && deadline < today;

            return (
                <div className="min-w-[100px]">
                    <div
                        className={`text-sm ${
                            isOverdue
                                ? "text-destructive font-medium"
                                : "text-muted-foreground"
                        }`}
                    >
                        {formatDate(row.original.deadline_pengembalian)}
                    </div>
                    {isOverdue && (
                        <div className="flex items-center text-xs text-destructive">
                            <AlertTriangle className="mr-1 h-3 w-3" />
                            Terlambat
                        </div>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: "tanggal_kembali",
        header: "Dikembalikan",
        cell: ({ row }) => {
            const tanggalKembali = row.original.tanggal_kembali;
            return (
                <div className="min-w-[120px] text-sm text-muted-foreground">
                    {tanggalKembali ? formatDateTime(tanggalKembali) : "-"}
                </div>
            );
        },
    },
    {
        accessorKey: "status",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
                className="h-auto p-0 font-medium"
            >
                Status
            </Button>
        ),
        cell: ({ getValue }) => {
            const status = getValue() as Loan["status"];
            const variants = {
                Disewa: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800",
                Dikembalikan:
                    "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800",
                Dibatalkan:
                    "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800",
            };

            return (
                <div
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                        variants[status as keyof typeof variants]
                    }`}
                >
                    {status}
                </div>
            );
        },
    },
    {
        id: "actions",
        header: "Aksi",
        cell: ({ row }) => {
            const loan = row.original;
            const { toast } = useToast();
            const [isConfirmDialogOpen, setIsConfirmDialogOpen] =
                useState(false);
            const [isReturnDialogOpen, setIsReturnDialogOpen] = useState(false);
            const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
            const [confirmAction, setConfirmAction] = useState<
                "return" | "cancel" | "delete" | null
            >(null);
            const [returnTime, setReturnTime] = useState(
                new Date().toISOString().slice(0, 16)
            );
            const [isProcessing, setIsProcessing] = useState(false);

            const {
                isModalOpen,
                formData,
                handleInputChange,
                handleSelectChange,
                openModal,
                closeModal,
                handleUpdate,
            } = useFormState({
                nama_penyewa: loan.nama_penyewa,
                no_tlp_penyewa: loan.no_tlp_penyewa,
                id_barang:
                    items.find((item) => item.nama_barang === loan.nama_barang)
                        ?.id || "",
                tanggal_sewa: format(new Date(loan.tanggal_sewa), "yyyy-MM-dd"),
                deadline_pengembalian: format(
                    new Date(loan.deadline_pengembalian),
                    "yyyy-MM-dd"
                ),
            });

            const handleReturn = async () => {
                setIsProcessing(true);
                try {
                    const selectedDate = new Date(returnTime);
                    const sewaDate = new Date(loan.tanggal_sewa);

                    if (selectedDate < sewaDate) {
                        toast({
                            title: "Error",
                            description:
                                "Waktu pengembalian tidak boleh sebelum tanggal sewa",
                            variant: "destructive",
                        });
                        return;
                    }

                    await router.post(
                        `loans/${loan.id}/return`,
                        {
                            return_time: returnTime,
                        },
                        {
                            onSuccess: () => {
                                toast({
                                    title: "Berhasil",
                                    description: "Barang berhasil dikembalikan",
                                });
                                setIsReturnDialogOpen(false);
                            },
                            onError: (errors) => {
                                const errorMessage =
                                    errors?.message ||
                                    errors?.id_barang ||
                                    "Gagal mengembalikan barang";
                                toast({
                                    title: "Error",
                                    description: errorMessage,
                                    variant: "destructive",
                                });
                            },
                        }
                    );
                } finally {
                    setIsProcessing(false);
                }
            };

            const handleConfirmAction = async () => {
                if (!confirmAction) return;
                setIsProcessing(true);

                try {
                    const url =
                        confirmAction === "return"
                            ? `loans/${loan.id}/return`
                            : confirmAction === "cancel"
                            ? `loans/${loan.id}/cancel`
                            : `loans/${loan.id}`;

                    const successMessages = {
                        return: "Barang berhasil dikembalikan",
                        cancel: "Peminjaman berhasil dibatalkan",
                        delete: "Peminjaman berhasil dihapus",
                    };

                    const errorMessages = {
                        return: "Gagal mengembalikan barang",
                        cancel: "Gagal membatalkan peminjaman",
                        delete: "Gagal menghapus peminjaman",
                    };

                    const onSuccess = () => {
                        toast({
                            title: "Berhasil",
                            description: successMessages[confirmAction],
                        });
                        setIsConfirmDialogOpen(false);
                        setIsDeleteDialogOpen(false);
                    };

                    const onError = () => {
                        toast({
                            title: "Error",
                            description: errorMessages[confirmAction],
                            variant: "destructive",
                        });
                    };

                    if (confirmAction === "delete") {
                        router.delete(url, { onSuccess, onError });
                    } else {
                        router.post(url, {}, { onSuccess, onError });
                    }
                } finally {
                    setIsProcessing(false);
                }
            };

            return (
                <>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Buka menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                            <DropdownMenuSeparator />

                            {loan.status === "Disewa" && (
                                <>
                                    <DropdownMenuItem
                                        onClick={() =>
                                            openModal({
                                                nama_penyewa: loan.nama_penyewa,
                                                no_tlp_penyewa:
                                                    loan.no_tlp_penyewa,
                                                id_barang:
                                                    items.find(
                                                        (item) =>
                                                            item.nama_barang ===
                                                            loan.nama_barang
                                                    )?.id || "",
                                                tanggal_sewa: format(
                                                    new Date(loan.tanggal_sewa),
                                                    "yyyy-MM-dd"
                                                ),
                                                deadline_pengembalian: format(
                                                    new Date(
                                                        loan.deadline_pengembalian
                                                    ),
                                                    "yyyy-MM-dd"
                                                ),
                                            })
                                        }
                                        className="cursor-pointer"
                                    >
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit Peminjaman
                                    </DropdownMenuItem>

                                    <DropdownMenuItem
                                        onClick={() =>
                                            setIsReturnDialogOpen(true)
                                        }
                                        className="cursor-pointer text-green-700 dark:text-green-400"
                                    >
                                        <Check className="mr-2 h-4 w-4" />
                                        Kembalikan Barang
                                    </DropdownMenuItem>

                                    <DropdownMenuItem
                                        onClick={() => {
                                            setConfirmAction("cancel");
                                            setIsConfirmDialogOpen(true);
                                        }}
                                        className="cursor-pointer text-orange-700 dark:text-orange-400"
                                    >
                                        <X className="mr-2 h-4 w-4" />
                                        Batalkan Peminjaman
                                    </DropdownMenuItem>
                                </>
                            )}

                            {isSuperAdmin && (
                                <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={() => {
                                            setConfirmAction("delete");
                                            setIsDeleteDialogOpen(true);
                                        }}
                                        className="cursor-pointer text-destructive"
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Hapus Peminjaman
                                    </DropdownMenuItem>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Edit Dialog */}
                    <Dialog open={isModalOpen} onOpenChange={closeModal}>
                        <DialogContent className="w-[95vw] max-w-2xl sm:w-full">
                            <DialogHeader>
                                <DialogTitle>Edit Peminjaman</DialogTitle>
                                <DialogDescription>
                                    Ubah informasi peminjaman. Pastikan semua
                                    data terisi dengan benar.
                                </DialogDescription>
                            </DialogHeader>

                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    if (formData) {
                                        handleUpdate(
                                            "loans",
                                            loan.id,
                                            formData,
                                            false
                                        );
                                    }
                                }}
                                className="space-y-4"
                            >
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="nama_penyewa">
                                            Nama Penyewa
                                        </Label>
                                        <Input
                                            id="nama_penyewa"
                                            name="nama_penyewa"
                                            value={formData?.nama_penyewa || ""}
                                            onChange={handleInputChange}
                                            placeholder="Masukkan nama penyewa"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="no_tlp_penyewa">
                                            Nomor Telepon
                                        </Label>
                                        <Input
                                            id="no_tlp_penyewa"
                                            name="no_tlp_penyewa"
                                            value={
                                                formData?.no_tlp_penyewa || ""
                                            }
                                            onChange={handleInputChange}
                                            placeholder="Masukkan nomor telepon"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2 sm:col-span-2">
                                        <Label htmlFor="id_barang">
                                            Barang
                                        </Label>
                                        <Select
                                            name="id_barang"
                                            value={formData?.id_barang || ""}
                                            onValueChange={(value) =>
                                                handleSelectChange(
                                                    "id_barang",
                                                    value
                                                )
                                            }
                                            required
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih Barang" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {items.map((item) => (
                                                    <SelectItem
                                                        key={item.id.toString()}
                                                        value={item.id.toString()}
                                                        disabled={
                                                            item.available_units <=
                                                            0
                                                        }
                                                    >
                                                        <div className="flex w-full justify-between">
                                                            <span>
                                                                {
                                                                    item.nama_barang
                                                                }
                                                            </span>
                                                            <span className="text-muted-foreground">
                                                                Tersedia:{" "}
                                                                {
                                                                    item.available_units
                                                                }
                                                            </span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="tanggal_sewa">
                                            Tanggal Sewa
                                        </Label>
                                        <Input
                                            type="date"
                                            id="tanggal_sewa"
                                            name="tanggal_sewa"
                                            value={formData?.tanggal_sewa || ""}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="deadline_pengembalian">
                                            Deadline Pengembalian
                                        </Label>
                                        <Input
                                            type="date"
                                            id="deadline_pengembalian"
                                            name="deadline_pengembalian"
                                            value={
                                                formData?.deadline_pengembalian ||
                                                ""
                                            }
                                            onChange={handleInputChange}
                                            min={formData?.tanggal_sewa}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col-reverse gap-2 pt-4 sm:flex-row sm:justify-end">
                                    <Button
                                        variant="outline"
                                        type="button"
                                        onClick={closeModal}
                                    >
                                        Batal
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isProcessing}
                                    >
                                        {isProcessing
                                            ? "Menyimpan..."
                                            : "Simpan Perubahan"}
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>

                    {/* Return Dialog */}
                    <Dialog
                        open={isReturnDialogOpen}
                        onOpenChange={setIsReturnDialogOpen}
                    >
                        <DialogContent className="w-[95vw] max-w-md sm:w-full">
                            <DialogHeader>
                                <DialogTitle>
                                    Konfirmasi Pengembalian
                                </DialogTitle>
                                <DialogDescription>
                                    Pilih waktu pengembalian barang
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="return-time">
                                        Waktu Pengembalian
                                    </Label>
                                    <Input
                                        id="return-time"
                                        type="datetime-local"
                                        value={returnTime}
                                        onChange={(e) =>
                                            setReturnTime(e.target.value)
                                        }
                                        min={format(
                                            new Date(loan.tanggal_sewa),
                                            "yyyy-MM-dd'T'HH:mm"
                                        )}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Minimal:{" "}
                                        {formatDateTime(loan.tanggal_sewa)}
                                    </p>
                                </div>

                                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setReturnTime(
                                                new Date()
                                                    .toISOString()
                                                    .slice(0, 16)
                                            );
                                            handleReturn();
                                        }}
                                        disabled={isProcessing}
                                    >
                                        <Clock className="mr-2 h-4 w-4" />
                                        Waktu Sekarang
                                    </Button>
                                    <Button
                                        onClick={handleReturn}
                                        disabled={isProcessing}
                                    >
                                        {isProcessing
                                            ? "Memproses..."
                                            : "Konfirmasi"}
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>

                    {/* Confirmation Dialog */}
                    <Dialog
                        open={isConfirmDialogOpen}
                        onOpenChange={setIsConfirmDialogOpen}
                    >
                        <DialogContent className="w-[95vw] max-w-md sm:w-full">
                            <DialogHeader>
                                <DialogTitle>
                                    {confirmAction === "return"
                                        ? "Konfirmasi Pengembalian"
                                        : "Konfirmasi Pembatalan"}
                                </DialogTitle>
                                <DialogDescription>
                                    {confirmAction === "return"
                                        ? "Apakah Anda yakin ingin menandai barang ini sebagai dikembalikan? Tindakan ini akan memperbarui stok barang."
                                        : "Apakah Anda yakin ingin membatalkan peminjaman ini? Tindakan ini akan memperbarui stok barang."}
                                </DialogDescription>
                            </DialogHeader>

                            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                                <Button
                                    variant="outline"
                                    onClick={() =>
                                        setIsConfirmDialogOpen(false)
                                    }
                                    disabled={isProcessing}
                                >
                                    Batal
                                </Button>
                                <Button
                                    variant={
                                        confirmAction === "return"
                                            ? "default"
                                            : "destructive"
                                    }
                                    onClick={handleConfirmAction}
                                    disabled={isProcessing}
                                >
                                    {isProcessing
                                        ? "Memproses..."
                                        : confirmAction === "return"
                                        ? "Kembalikan"
                                        : "Batalkan"}
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>

                    {/* Delete Dialog */}
                    <Dialog
                        open={isDeleteDialogOpen}
                        onOpenChange={setIsDeleteDialogOpen}
                    >
                        <DialogContent className="w-[95vw] max-w-md sm:w-full">
                            <DialogHeader>
                                <DialogTitle>
                                    Konfirmasi Penghapusan
                                </DialogTitle>
                                <DialogDescription>
                                    Apakah Anda yakin ingin menghapus data
                                    peminjaman ini? Tindakan ini tidak dapat
                                    dibatalkan.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                                <Button
                                    variant="outline"
                                    onClick={() => setIsDeleteDialogOpen(false)}
                                    disabled={isProcessing}
                                >
                                    Batal
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={handleConfirmAction}
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? "Menghapus..." : "Hapus"}
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </>
            );
        },
    },
];

import React, { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
    ArrowUpDown,
    MoreHorizontal,
    EditIcon,
    CheckCheckIcon,
    UserIcon,
    PackageIcon,
    ContactIcon,
    CalendarIcon,
    ClockIcon,
    CircleHelpIcon,
    XIcon,
    TrashIcon,
    Calendar,
    Clock,
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
    tanggal_sewa: Date;
    tanggal_kembali: Date | null;
    deadline_pengembalian: Date;
    status: string;
    nama_barang: string;
    id_barang: string;
};

type Item = {
    id: string;
    nama_barang: string;
    jumlah: number;
};

const formatDate = (date: Date) => {
    return format(new Date(date), "d MMMM yyyy", { locale: id });
};

export const columns = (
    items: Item[],
    isSuperAdmin: boolean
): ColumnDef<Loan>[] => [
    {
        header: "Nomor",
        cell: ({ row }) => {
            return <div className="font-medium">{row.index + 1}</div>;
        },
    },
    {
        accessorKey: "nama_penyewa",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    <UserIcon className="mr-2 h-4 w-4" /> Nama Penyewa
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
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
                    <PackageIcon className="mr-2 h-4 w-4" /> Barang
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
    {
        accessorKey: "no_tlp_penyewa",
        header: () => {
            return (
                <div className="flex items-center">
                    <ContactIcon className="mr-2 h-4 w-4" />
                    Kontak
                </div>
            );
        },
        cell: ({ row }) => (
            <a
                href={`https://wa.me/${row.original.no_tlp_penyewa}`}
                className="text-blue-600 hover:underline"
            >
                {row.original.no_tlp_penyewa}
            </a>
        ),
    },
    {
        accessorKey: "tanggal_sewa",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    <CalendarIcon className="mr-2 h-4 w-4" /> Tanggal Sewa
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => formatDate(row.original.tanggal_sewa),
    },
    {
        accessorKey: "deadline_pengembalian",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Deadline
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const deadline = new Date(row.original.deadline_pengembalian);
            const today = new Date();
            const isOverdue =
                row.original.status === "Disewa" && deadline < today;

            return (
                <span className={isOverdue ? "text-red-600 font-medium" : ""}>
                    {formatDate(deadline)}
                </span>
            );
        },
    },
    {
        accessorKey: "tanggal_kembali",
        header: "Waktu Pengembalian",
        cell: ({ row }) => {
            const tanggalKembali = row.original.tanggal_kembali;
            return tanggalKembali
                ? format(new Date(tanggalKembali), "d MMMM yyyy HH:mm", {
                      locale: id,
                  })
                : "-";
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
                    <CircleHelpIcon className="mr-2 h-4 w-4" /> Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ getValue }) => {
            const status = getValue() as Loan["status"];
            const styles: Record<Loan["status"], string> = {
                Disewa: "bg-yellow-100 text-yellow-800 border-yellow-300",
                Dikembalikan: "bg-green-100 text-green-800 border-green-300",
                Dibatalkan: "bg-red-100 text-red-800 border-red-300",
            };

            return (
                <div
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}
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
                id_barang: loan.id_barang,
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
                            id_barang: loan.id_barang,
                        },
                        {
                            onSuccess: () => {
                                toast({
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

                    const onSuccess = () => {
                        toast({
                            description:
                                confirmAction === "return"
                                    ? "Barang berhasil dikembalikan"
                                    : confirmAction === "cancel"
                                    ? "Peminjaman berhasil dibatalkan"
                                    : "Peminjaman berhasil dihapus",
                        });
                        setIsConfirmDialogOpen(false);
                        setIsDeleteDialogOpen(false);
                    };

                    const onError = () => {
                        toast({
                            description:
                                confirmAction === "return"
                                    ? "Gagal mengembalikan barang"
                                    : confirmAction === "cancel"
                                    ? "Gagal membatalkan peminjaman"
                                    : "Gagal menghapus peminjaman",
                            variant: "destructive",
                        });
                    };

                    if (confirmAction === "delete") {
                        router.delete(url, {
                            onSuccess,
                            onError,
                        });
                    } else {
                        router.post(
                            url,
                            {},
                            {
                                onSuccess,
                                onError,
                            }
                        );
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
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
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
                                                id_barang: loan.id_barang,
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
                                    >
                                        <EditIcon className="mr-2 h-4 w-4" />
                                        Edit Peminjaman
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => {
                                            setIsReturnDialogOpen(true);
                                        }}
                                        className="text-green-900"
                                    >
                                        <CheckCheckIcon className="mr-2 h-4 w-4" />
                                        Barang Dikembalikan
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => {
                                            setConfirmAction("cancel");
                                            setIsConfirmDialogOpen(true);
                                        }}
                                        className="text-orange-600"
                                    >
                                        <XIcon className="mr-2 h-4 w-4" />
                                        Batalkan Peminjaman
                                    </DropdownMenuItem>
                                </>
                            )}
                            {isSuperAdmin && (
                                <DropdownMenuItem
                                    onClick={() => {
                                        setConfirmAction("delete");
                                        setIsDeleteDialogOpen(true);
                                    }}
                                    className="text-red-600"
                                >
                                    <TrashIcon className="mr-2 h-4 w-4" />
                                    Hapus Peminjaman
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Edit Dialog */}
                    <Dialog open={isModalOpen} onOpenChange={closeModal}>
                        <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                                <DialogTitle className="text-lg font-semibold">
                                    Edit Peminjaman
                                </DialogTitle>
                                <DialogDescription className="text-muted-foreground">
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
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="nama_penyewa">
                                            Nama Penyewa
                                        </Label>
                                        <Input
                                            type="text"
                                            id="nama_penyewa"
                                            name="nama_penyewa"
                                            value={formData?.nama_penyewa || ""}
                                            onChange={handleInputChange}
                                            placeholder="Masukkan nama penyewa"
                                            className="bg-background"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="no_tlp_penyewa">
                                            Nomor Telepon
                                        </Label>
                                        <Input
                                            type="string"
                                            id="no_tlp_penyewa"
                                            name="no_tlp_penyewa"
                                            value={
                                                formData?.no_tlp_penyewa || ""
                                            }
                                            onChange={handleInputChange}
                                            placeholder="Masukkan nomor telepon"
                                            className="bg-background"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
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
                                            <SelectTrigger className="bg-background">
                                                <SelectValue placeholder="Pilih Barang">
                                                    {
                                                        items.find(
                                                            (i) =>
                                                                i.id.toString() ===
                                                                formData?.id_barang?.toString()
                                                        )?.nama_barang
                                                    }
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent className="bg-background">
                                                {items.map((item) => (
                                                    <SelectItem
                                                        key={item.id.toString()}
                                                        value={item.id.toString()}
                                                        disabled={
                                                            item.jumlah <= 0
                                                        }
                                                    >
                                                        <div className="flex justify-between w-full">
                                                            <span>
                                                                {
                                                                    item.nama_barang
                                                                }
                                                            </span>
                                                            <span className="text-muted-foreground">
                                                                Tersedia:{" "}
                                                                {item.jumlah}
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
                                            className="bg-background"
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
                                            className="bg-background"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-2 pt-4">
                                    <Button
                                        variant="outline"
                                        type="button"
                                        onClick={closeModal}
                                    >
                                        Batal
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="bg-primary hover:bg-primary/90"
                                    >
                                        Simpan Perubahan
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
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>
                                    Konfirmasi Pengembalian
                                </DialogTitle>
                                <DialogDescription>
                                    Pilih waktu pengembalian atau gunakan waktu
                                    sekarang
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        <Label>Waktu Pengembalian</Label>
                                    </div>
                                    <Input
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
                                    <p className="text-sm text-muted-foreground">
                                        Minimal:{" "}
                                        {format(
                                            new Date(loan.tanggal_sewa),
                                            "d MMMM yyyy HH:mm",
                                            {
                                                locale: id,
                                            }
                                        )}
                                    </p>
                                </div>

                                <div className="flex justify-end gap-2">
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
                                        Gunakan Waktu Sekarang
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
                        <DialogContent>
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
                            <div className="flex justify-end space-x-2">
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
                        <DialogContent>
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
                            <div className="flex justify-end space-x-2">
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
                                    {isProcessing ? "Memproses..." : "Hapus"}
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </>
            );
        },
    },
];

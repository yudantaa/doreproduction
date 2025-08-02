import React from "react";
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

export const columns = (items: Item[]): ColumnDef<Loan>[] => [
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
                    <ClockIcon className="mr-2 h-4 w-4" /> Deadline
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
        cell: ({ row }) => {
            const loan = row.original;
            const { toast } = useToast();
            const [isConfirmDialogOpen, setIsConfirmDialogOpen] =
                React.useState(false);
            const [confirmAction, setConfirmAction] = React.useState<
                "return" | "cancel" | null
            >(null);

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

            const handleConfirmAction = () => {
                if (!confirmAction) return;

                const url =
                    confirmAction === "return"
                        ? `loans/${loan.id}/return`
                        : `loans/${loan.id}/cancel`;

                const successMessage =
                    confirmAction === "return"
                        ? "Barang berhasil dikembalikan"
                        : "Peminjaman berhasil dibatalkan";

                const errorMessage =
                    confirmAction === "return"
                        ? "Gagal mengembalikan barang"
                        : "Gagal membatalkan peminjaman";

                router.post(
                    url,
                    {},
                    {
                        onSuccess: () => {
                            toast({ description: successMessage });
                            setIsConfirmDialogOpen(false);
                        },
                        onError: () => {
                            toast({
                                description: errorMessage,
                                variant: "destructive",
                            });
                            setIsConfirmDialogOpen(false);
                        },
                    }
                );
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
                                            setConfirmAction("return");
                                            setIsConfirmDialogOpen(true);
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
                                        className="text-red-600"
                                    >
                                        <XIcon className="mr-2 h-4 w-4" />
                                        Batalkan Peminjaman
                                    </DropdownMenuItem>
                                </>
                            )}
                            {loan.status != "Disewa" && (
                                <>
                                    <DropdownMenuItem className="text-gray-600 ">
                                        <CheckCheckIcon className="mr-2 h-4 w-4" />
                                        Peminjaman Berakhir
                                    </DropdownMenuItem>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Edit Dialog */}
                    <Dialog open={isModalOpen} onOpenChange={closeModal}>
                        <DialogContent>
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
                                <div className="space-y-2">
                                    <label htmlFor="nama_penyewa">
                                        Nama Penyewa
                                    </label>
                                    <Input
                                        id="nama_penyewa"
                                        name="nama_penyewa"
                                        value={formData?.nama_penyewa}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="no_tlp_penyewa">
                                        Nomor Telepon
                                    </label>
                                    <Input
                                        type="number"
                                        id="no_tlp_penyewa"
                                        name="no_tlp_penyewa"
                                        value={formData?.no_tlp_penyewa}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="id_barang">Barang</label>
                                    <Select
                                        name="id_barang"
                                        value={formData?.id_barang}
                                        onValueChange={(value) =>
                                            handleSelectChange(
                                                "id_barang",
                                                value
                                            )
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Barang">
                                                {
                                                    items.filter(
                                                        (i: any) =>
                                                            i.id ===
                                                            Number(
                                                                formData?.id_barang
                                                            )
                                                    )[0]?.nama_barang
                                                }
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {items.map((item) => (
                                                <SelectItem
                                                    key={item.id}
                                                    value={item.id}
                                                    disabled={
                                                        item.jumlah <= 0 &&
                                                        item.id !==
                                                            loan.id_barang
                                                    }
                                                >
                                                    {item.nama_barang}{" "}
                                                    (Tersedia: {item.jumlah})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="tanggal_sewa">
                                        Tanggal Sewa
                                    </label>
                                    <Input
                                        type="date"
                                        id="tanggal_sewa"
                                        name="tanggal_sewa"
                                        value={formData?.tanggal_sewa}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="deadline_pengembalian">
                                        Deadline Pengembalian
                                    </label>
                                    <Input
                                        type="date"
                                        id="deadline_pengembalian"
                                        name="deadline_pengembalian"
                                        value={formData?.deadline_pengembalian}
                                        onChange={handleInputChange}
                                        min={formData?.tanggal_sewa}
                                        required
                                    />
                                </div>

                                <Button type="submit" className="w-full">
                                    Simpan Perubahan
                                </Button>
                            </form>
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
                                >
                                    {confirmAction === "return"
                                        ? "Kembalikan"
                                        : "Batalkan"}
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </>
            );
        },
    },
];

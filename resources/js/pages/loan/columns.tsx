import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
    ArrowUpDown,
    MoreHorizontal,
    EditIcon,
    TrashIcon,
    EyeIcon,
    CheckCheckIcon,
    UserIcon,
    Package2Icon,
    PackageIcon,
    ContactIcon,
    CalendarIcon,
    ClockIcon,
    CircleHelpIcon,
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

export const columns = (
    items: Array<{ id: string; nama_barang: string; jumlah: number }>
): ColumnDef<Loan>[] => [
    {
        header: "Nomor",
        cell: ({ row }) => {
            return <div className="font-bold">{row.index + 1}</div>;
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
                <Button variant="ghost">
                    <PackageIcon className="mr-2 h-4 w-4" />
                    Barang
                </Button>
            );
        },
    },
    {
        accessorKey: "no_tlp_penyewa",
        header: ({ column }) => {
            return (
                <Button variant="ghost">
                    <ContactIcon className="mr-2 h-4 w-4" />
                    Kontak
                </Button>
            );
        },
    },
    {
        accessorKey: "tanggal_sewa",
        header: ({ column }) => {
            return (
                <Button variant="ghost">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    Tanggal Sewa
                </Button>
            );
        },
        cell: ({ row }) => {
            return new Date(row.original.tanggal_sewa).toLocaleDateString(
                "id-ID"
            );
        },
    },
    {
        accessorKey: "deadline_pengembalian",
        header: ({ column }) => {
            return (
                <Button variant="ghost">
                    <ClockIcon className="mr-2 h-4 w-4" />
                    Deadline
                </Button>
            );
        },
        cell: ({ row }) => {
            return new Date(
                row.original.deadline_pengembalian
            ).toLocaleDateString("id-ID");
        },
    },
    {
        accessorKey: "status",
        header: ({ column }) => {
            return (
                <Button variant="ghost">
                    <CircleHelpIcon className="mr-2 h-4 w-4" />
                    Status
                </Button>
            );
        },
        cell: ({ getValue }) => {
            const status = getValue() as string;
            const bgColor =
                status === "Disewa"
                    ? "bg-yellow-200 text-yellow-800"
                    : status === "Dikembalikan"
                    ? "bg-green-200 text-green-800"
                    : "bg-red-200 text-red-800";

            return (
                <div
                    className={`text-center inline-block rounded-full px-3 py-1 text-xs font-semibold ${bgColor}`}
                >
                    {status}
                </div>
            );
        },
    },
    {
        accessorKey: "actions",
        header: "Atur",
        cell: ({ row }) => {
            const loan = row.original;
            const { toast } = useToast();
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
                tanggal_sewa: new Date(loan.tanggal_sewa)
                    .toISOString()
                    .split("T")[0],
                deadline_pengembalian: new Date(loan.deadline_pengembalian)
                    .toISOString()
                    .split("T")[0],
            });

            const handleReturn = () => {
                router.post(
                    `/loans/${loan.id}/return`,
                    {},
                    {
                        onSuccess: () => {
                            toast({
                                description: "Barang berhasil dikembalikan",
                            });
                        },
                        onError: () => {
                            toast({
                                description: "Gagal mengembalikan barang",
                                variant: "destructive",
                            });
                        },
                    }
                );
            };

            const handleCancel = () => {
                router.post(
                    `/loans/${loan.id}/cancel`,
                    {},
                    {
                        onSuccess: () => {
                            toast({
                                description: "Peminjaman berhasil dibatalkan",
                            });
                        },
                        onError: () => {
                            toast({
                                description: "Gagal membatalkan peminjaman",
                                variant: "destructive",
                            });
                        },
                    }
                );
            };

            return (
                <div className="flex items-center space-x-2">
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
                            {loan.status === "Disewa" && (
                                <>
                                    <DropdownMenuItem>
                                        <EyeIcon className="mr-2 h-4 w-4" />
                                        Lihat Detail
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onSelect={() => openModal(loan)}
                                        className="cursor-pointer"
                                    >
                                        <EditIcon className="mr-2 h-4 w-4" />
                                        Edit Peminjaman
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onSelect={handleReturn}>
                                        <CheckCheckIcon className="mr-2 h-4 w-4" />
                                        Barang Dikembalikan
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onSelect={handleCancel}
                                        className="text-red-600"
                                    >
                                        <TrashIcon className="mr-2 h-4 w-4" />
                                        Batalkan Peminjaman
                                    </DropdownMenuItem>
                                </>
                            )}
                            {(loan.status === "Dikembalikan" ||
                                loan.status === "Dibatalkan") && (
                                <DropdownMenuItem>
                                    <EyeIcon className="mr-2 h-4 w-4" />
                                    Lihat Detail
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Dialog open={isModalOpen} onOpenChange={closeModal}>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Edit Peminjaman</DialogTitle>
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
                                className="space-y-4 p-4"
                            >
                                <div>
                                    <label
                                        htmlFor="nama_penyewa"
                                        className="block mb-2"
                                    >
                                        Nama Penyewa
                                    </label>
                                    <Input
                                        type="text"
                                        id="nama_penyewa"
                                        name="nama_penyewa"
                                        value={formData?.nama_penyewa}
                                        onChange={handleInputChange}
                                        placeholder="Masukkan nama penyewa"
                                        required
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="no_tlp_penyewa"
                                        className="block mb-2"
                                    >
                                        Nomor Telepon
                                    </label>
                                    <Input
                                        type="tel"
                                        id="no_tlp_penyewa"
                                        name="no_tlp_penyewa"
                                        value={formData?.no_tlp_penyewa}
                                        onChange={handleInputChange}
                                        placeholder="Masukkan nomor telepon"
                                        required
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="id_barang"
                                        className="block mb-2"
                                    >
                                        Barang
                                    </label>
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
                                            <SelectValue placeholder="Pilih Barang" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {items?.length > 0 ? (
                                                items.map((item) => {
                                                    const isDisabled =
                                                        item.jumlah <= 0 &&
                                                        item.id !==
                                                            loan.id_barang;
                                                    return (
                                                        <SelectItem
                                                            key={item.id}
                                                            value={item.id}
                                                            disabled={
                                                                isDisabled
                                                            }
                                                            aria-disabled={
                                                                isDisabled
                                                            }
                                                        >
                                                            {item.nama_barang}{" "}
                                                            (Tersedia:{" "}
                                                            {item.jumlah})
                                                        </SelectItem>
                                                    );
                                                })
                                            ) : (
                                                <div className="p-2 text-gray-500">
                                                    Tidak ada barang tersedia
                                                </div>
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <label
                                        htmlFor="tanggal_sewa"
                                        className="block mb-2"
                                    >
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
                                <div>
                                    <label
                                        htmlFor="deadline_pengembalian"
                                        className="block mb-2"
                                    >
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
                                    Perbarui Peminjaman
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            );
        },
    },
];

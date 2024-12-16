import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { router } from "@inertiajs/react";
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

export const columns = (): ColumnDef<Loan>[] => [
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
                    Nama Penyewa
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
    {
        accessorKey: "nama_barang",
        header: "Barang",
    },
    {
        accessorKey: "no_tlp_penyewa",
        header: "Kontak",
    },
    {
        accessorKey: "tanggal_sewa",
        header: "Tanggal Sewa",
        cell: ({ row }) => {
            return new Date(row.original.tanggal_sewa).toLocaleDateString("id-ID");
        },
    },
    {
        accessorKey: "deadline_pengembalian",
        header: "Deadline",
        cell: ({ row }) => {
            return new Date(row.original.deadline_pengembalian).toLocaleDateString("id-ID");
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ getValue }) => {
            const status = getValue() as string;
            const bgColor =
                status === "Disewa"
                    ? "bg-yellow-200 text-yellow-800"
                    : status === "Dikembalikan"
                    ? "bg-green-200 text-green-800"
                    : "bg-red-200 text-red-800";

            return (
                <div className={`text-center inline-block rounded-full px-3 py-1 text-xs font-semibold ${bgColor}`}>
                    {status}
                </div>
            );
        },
    },
    {
        accessorKey: "actions",
        header: "Atur",
        cell: ({ row }) => {
            const { toast } = useToast();
            const loan = row.original;

            const handleReturn = () => {
                router.post(`/loans/${loan.id}/return`, {}, {
                    onSuccess: () => {
                        toast({ description: "Barang berhasil dikembalikan" });
                    },
                    onError: () => {
                        toast({
                            description: "Gagal mengembalikan barang",
                            variant: "destructive"
                        });
                    }
                });
            };

            const handleCancel = () => {
                router.post(`/loans/${loan.id}/cancel`, {}, {
                    onSuccess: () => {
                        toast({ description: "Peminjaman berhasil dibatalkan" });
                    },
                    onError: () => {
                        toast({
                            description: "Gagal membatalkan peminjaman",
                            variant: "destructive"
                        });
                    }
                });
            };

            return (
                <AlertDialog>
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
                                    <DropdownMenuItem onSelect={handleReturn}>
                                        Kembalikan Barang
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onSelect={handleCancel} className="text-red-600">
                                        Batalkan Peminjaman
                                    </DropdownMenuItem>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </AlertDialog>
            );
        },
    },
];

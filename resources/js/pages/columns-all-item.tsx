import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { PackageIcon, CheckCircle } from "lucide-react";
import { Link } from "@inertiajs/react";

export type Item = {
    id: string;
    nama_barang: string;
    deskripsi?: string;
    jumlah: number;
    status: string;
    image?: string;
    id_kategori: number;
    actions?: React.ReactNode;
};

export const columns: ColumnDef<Item>[] = [
    {
        header: "No",
        cell: ({ row }) => {
            return <div className="font-medium">{row.index + 1}</div>;
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
                    <PackageIcon className="mr-2 h-4 w-4" />
                    Nama Barang
                </Button>
            );
        },
        cell: ({ row }) => (
            <div className="line-clamp-2 max-w-[200px]">
                {row.original.nama_barang}
            </div>
        ),
    },
    {
        accessorKey: "deskripsi",
        header: "Deskripsi",
        cell: ({ row }) => (
            <div className="line-clamp-2 max-w-[300px]">
                {row.original.deskripsi || "-"}
            </div>
        ),
    },
    {
        accessorKey: "jumlah",
        header: "Stok",
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.original.status;
            const statusClass =
                status === "Tersedia"
                    ? "bg-green-100 text-green-800 border-green-300"
                    : "bg-red-100 text-red-800 border-red-300";

            return (
                <div
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusClass}`}
                >
                    <CheckCircle className="w-3 h-3 mr-1" />
                    {status}
                </div>
            );
        },
    },
    {
        accessorKey: "actions",
        header: "Aksi",
        cell: ({ row }) => row.original.actions,
    },
];

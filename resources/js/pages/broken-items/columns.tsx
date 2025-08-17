import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "@inertiajs/react";
import { BrokenItemReport } from "@/types/broken-item";

export const columns = (
    canRequestRepair: boolean
): ColumnDef<BrokenItemReport>[] => [
    {
        header: "No",
        cell: ({ row }) => {
            return <div className="font-bold">{row.index + 1}</div>;
        },
    },
    {
        accessorKey: "item.nama_barang",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Nama Barang
                </Button>
            );
        },
    },
    {
        accessorKey: "description",
        header: "Deskripsi Kerusakan",
        cell: ({ getValue }) => {
            const description = (getValue() as string) || "";
            return (
                <div className="max-w-xs truncate" title={description}>
                    {description || "Tidak ada deskripsi"}
                </div>
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
                </Button>
            );
        },
        cell: ({ getValue }) => {
            const status = getValue() as string;
            const statusMap: Record<string, string> = {
                reported: "Dilaporkan",
                repair_requested: "Perbaikan Diminta",
                in_repair: "Dalam Perbaikan",
                repaired: "Sudah Diperbaiki",
                rejected: "Ditolak",
            };

            const colorMap: Record<string, string> = {
                reported:
                    "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
                repair_requested:
                    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
                in_repair:
                    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
                repaired:
                    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
                rejected:
                    "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
            };

            return (
                <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                        colorMap[status] || "bg-gray-100 text-gray-800"
                    }`}
                >
                    {statusMap[status] || status}
                </span>
            );
        },
    },
    {
        accessorKey: "reporter.name",
        header: "Pelapor",
    },
    {
        accessorKey: "created_at",
        header: "Tanggal Laporan",
        cell: ({ getValue }) => {
            const date = new Date(getValue() as string);
            return date.toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            });
        },
    },
    {
        id: "actions",
        header: "Aksi",
        cell: ({ row }) => {
            const report = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                            <Link
                                href={route(
                                    "dashboard.broken-items.show",
                                    report.id
                                )}
                            >
                                Lihat Detail
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

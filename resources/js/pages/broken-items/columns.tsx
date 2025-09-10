import React, { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, router } from "@inertiajs/react";
import { BrokenItemReport } from "@/types/broken-item";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/hooks/use-toast";
import type { Page } from "@inertiajs/core";

export const getColumns = (
    canRequestRepair: boolean
): ColumnDef<BrokenItemReport>[] => [
    {
        header: "No",
        cell: ({ row }) => {
            return <div className="font-bold">{row.index + 1}</div>;
        },
    },
    {
        accessorKey: "itemUnit.item.nama_barang",
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
        cell: ({ row }) => {
            const report = row.original;
            return (
                <div>
                    <div className="font-medium">
                        {report.itemUnit?.item?.nama_barang || "N/A"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                        Unit: {report.itemUnit?.kode_unit || "N/A"}
                    </div>
                </div>
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
                in_repair: "Dalam Perbaikan",
                repaired: "Sudah Diperbaiki",
                rejected: "Ditolak",
            };

            const colorMap: Record<string, string> = {
                reported:
                    "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
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
            const { toast } = useToast();
            const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

            const handleDelete = () => {
                router.delete(
                    route("dashboard.broken-items.destroy", report.id),
                    {
                        onFinish: () => setIsDeleteDialogOpen(false),
                        onSuccess: (
                            page: Page<{
                                flash?: { success?: string; error?: string };
                            }>
                        ) => {
                            const flash = page.props?.flash || {};
                            if (flash.error) {
                                toast({
                                    title: "Gagal Menghapus",
                                    description: flash.error,
                                    variant: "destructive",
                                });
                            } else {
                                toast({
                                    description:
                                        flash.success ||
                                        "Laporan berhasil dihapus.",
                                });
                            }
                        },
                        onError: () => {
                            toast({
                                title: "Gagal Menghapus",
                                description:
                                    "Terjadi kesalahan saat menghapus laporan.",
                                variant: "destructive",
                            });
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
                            {canRequestRepair &&
                                report.status === "reported" && (
                                    <DropdownMenuItem asChild>
                                        <Link
                                            href={route(
                                                "dashboard.broken-items.request-repair",
                                                report.id
                                            )}
                                            method="post"
                                            as="button"
                                        >
                                            Minta Perbaikan
                                        </Link>
                                    </DropdownMenuItem>
                                )}
                            <DropdownMenuItem
                                className="text-red-600"
                                onSelect={(e) => {
                                    e.preventDefault();
                                    setIsDeleteDialogOpen(true);
                                }}
                            >
                                Hapus
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <AlertDialog
                        open={isDeleteDialogOpen}
                        onOpenChange={setIsDeleteDialogOpen}
                    >
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Hapus Laporan?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    Tindakan ini tidak bisa dibatalkan. Laporan
                                    akan dihapus secara permanen.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction
                                    className="bg-red-600"
                                    onClick={handleDelete}
                                >
                                    Hapus
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </>
            );
        },
    },
];

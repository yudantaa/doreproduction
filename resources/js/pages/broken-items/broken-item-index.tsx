import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Head, Link, usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { getColumns } from "./columns";
import { BrokenItemReport } from "@/types/broken-item";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Plus, Search } from "lucide-react";
import { PageProps } from "@/types";

interface BrokenItemIndexProps {
    reports: BrokenItemReport[];
    canRequestRepair: boolean;
}

export default function BrokenItemIndex({
    reports: initialReports,
    canRequestRepair,
}: BrokenItemIndexProps) {
    const { auth } = usePage<PageProps>().props;
    const [statusFilter, setStatusFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [reports, setReports] = useState<BrokenItemReport[]>(initialReports);

    const statusOptions = [
        { value: "all", label: "Semua Status" },
        { value: "reported", label: "Dilaporkan" },
        { value: "in_repair", label: "Dalam Perbaikan" },
        { value: "repaired", label: "Sudah Diperbaiki" },
        { value: "rejected", label: "Ditolak" },
    ];

    // Filter reports based on current filters
    const filteredReports = React.useMemo(() => {
        return reports.filter((report) => {
            const matchesSearch =
                searchTerm === "" ||
                report.item.nama_barang
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());

            const matchesStatus =
                statusFilter === "all" || report.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [reports, searchTerm, statusFilter]);

    return (
        <AuthenticatedLayout header={"Manajemen Barang Rusak"}>
            <Head title="Manajemen Barang Rusak" />

            <div className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">
                <div className="mx-auto w-full max-w-7xl space-y-6">
                    {/* Header */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                                Manajemen Barang Rusak
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Kelola laporan dan perbaikan barang rusak dengan
                                mudah
                            </p>
                        </div>

                        {(auth.user?.role === "ADMIN" ||
                            auth.user?.role === "SUPER ADMIN") && (
                            <Button
                                asChild
                                className="w-full sm:w-auto"
                                size="default"
                            >
                                <Link
                                    href={route(
                                        "dashboard.broken-items.create"
                                    )}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Laporkan Barang Rusak
                                </Link>
                            </Button>
                        )}
                    </div>

                    {/* Filters */}
                    <div className="rounded-lg border border-border bg-card p-4">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Cari berdasarkan nama barang..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="pl-9"
                                />
                            </div>

                            <Select
                                value={statusFilter}
                                onValueChange={setStatusFilter}
                            >
                                <SelectTrigger className="w-full sm:w-48">
                                    <SelectValue placeholder="Filter Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {statusOptions.map((option) => (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Results count */}
                        <div className="mt-3 pt-3 border-t border-border">
                            <p className="text-sm text-muted-foreground">
                                Menampilkan {filteredReports.length} dari{" "}
                                {reports.length} data
                            </p>
                        </div>
                    </div>

                    {/* Data Table */}
                    <div className="rounded-lg border border-border bg-card">
                        <div className="h-[calc(100vh-20rem)] min-h-[400px]">
                            {filteredReports.length === 0 ? (
                                <div className="flex h-full items-center justify-center p-8">
                                    <div className="text-center text-muted-foreground">
                                        <p className="text-lg font-medium">
                                            Tidak ada data laporan barang rusak
                                        </p>
                                        {(statusFilter !== "all" ||
                                            searchTerm) && (
                                            <p className="mt-2 text-sm">
                                                Coba ubah filter atau kata kunci
                                                pencarian
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <DataTable
                                    columns={getColumns(canRequestRepair)}
                                    data={filteredReports}
                                    pageSize={10}
                                    pageSizeOptions={[5, 10, 20, 50]}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Head, Link, usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { BrokenItemReport } from "@/types/broken-item";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { PageProps } from "@/types";

interface BrokenItemIndexProps {
    reports: BrokenItemReport[]; // Changed from paginated response to direct array
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
        <AuthenticatedLayout>
            <Head title="Manajemen Barang Rusak" />

            <div className="container mx-auto py-6 px-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">
                        Manajemen Barang Rusak
                    </h1>
                    {(auth.user?.role === "ADMIN" ||
                        auth.user?.role === "SUPER ADMIN") && (
                        <Button asChild>
                            <Link href={route("dashboard.broken-items.create")}>
                                <Plus className="mr-2 h-4 w-4" />
                                Laporkan Barang Rusak
                            </Link>
                        </Button>
                    )}
                </div>

                <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <Input
                        placeholder="Cari berdasarkan nama barang..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-md"
                    />
                    <Select
                        value={statusFilter}
                        onValueChange={setStatusFilter}
                    >
                        <SelectTrigger className="w-[180px]">
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

                <div className="bg-card rounded-lg shadow border overflow-hidden">
                    {filteredReports.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            <p>Tidak ada data laporan barang rusak.</p>
                            {(statusFilter !== "all" || searchTerm) && (
                                <p className="text-sm mt-2">
                                    Coba ubah filter atau kata kunci pencarian.
                                </p>
                            )}
                        </div>
                    ) : (
                        <div className="relative">
                            <div className="overflow-auto">
                                <DataTable
                                    columns={columns(canRequestRepair)}
                                    data={filteredReports}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import LoanCreateForm from "./create-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search, Clock, AlertTriangle } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import AuthenticatedLayout from "@/layouts/authenticated-layout";

interface LoanIndexProps {
    loans: Array<{
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
    }>;
    items: Array<{
        id: string;
        nama_barang: string;
        available_units: number;
    }>;
    availableUnits: Array<{
        id: string;
        kode_unit: string;
        nama_barang: string;
        item_id: string;
    }>;
    totalActiveLoans: number;
    totalOverdue: number;
    isSuperAdmin: boolean;
}

export default function LoanIndex({
    loans,
    items,
    availableUnits,
    totalActiveLoans,
    totalOverdue,
    isSuperAdmin,
}: LoanIndexProps) {
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [nameFilter, setNameFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    const filteredLoans = loans.filter(
        (loan) =>
            loan.nama_penyewa
                .toLowerCase()
                .includes(nameFilter.toLowerCase()) &&
            (statusFilter === "All" || loan.status === statusFilter)
    );

    const statusOptions = [
        { value: "All", label: "Semua Status" },
        { value: "Disewa", label: "Disewa" },
        { value: "Dikembalikan", label: "Dikembalikan" },
        { value: "Dibatalkan", label: "Dibatalkan" },
    ];

    return (
        <AuthenticatedLayout header={"Manajemen Peminjaman"}>
            <Head title="Manajemen Peminjaman" />

            <div className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">
                <div className="mx-auto w-full max-w-7xl space-y-6">
                    {/* Header */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                                Manajemen Peminjaman
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Kelola data peminjaman barang dengan mudah
                            </p>
                        </div>

                        <Dialog
                            open={isRegisterModalOpen}
                            onOpenChange={setIsRegisterModalOpen}
                        >
                            <DialogTrigger asChild>
                                <Button
                                    className="w-full sm:w-auto"
                                    size="default"
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Tambah Peminjaman
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="w-[95vw] max-w-lg sm:w-full">
                                <DialogHeader>
                                    <DialogTitle className="text-left">
                                        Tambah Peminjaman Baru
                                    </DialogTitle>
                                </DialogHeader>
                                <div className="max-h-[70vh] overflow-y-auto pr-1">
                                    <LoanCreateForm
                                        items={items}
                                        availableUnits={availableUnits}
                                        onClose={() =>
                                            setIsRegisterModalOpen(false)
                                        }
                                    />
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="rounded-lg border border-border bg-card p-4">
                            <div className="flex items-center">
                                <div className="flex-1 space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Peminjaman Aktif
                                    </p>
                                    <p className="text-2xl font-bold">
                                        {totalActiveLoans}
                                    </p>
                                </div>
                                <div className="h-10 w-10 rounded-full bg-blue-100 p-2 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                                    <Clock className="h-6 w-6" />
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border border-border bg-card p-4">
                            <div className="flex items-center">
                                <div className="flex-1 space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Terlambat Dikembalikan
                                    </p>
                                    <p className="text-2xl font-bold">
                                        {totalOverdue}
                                    </p>
                                </div>
                                <div className="h-10 w-10 rounded-full bg-red-100 p-2 text-red-600 dark:bg-red-900/20 dark:text-red-400">
                                    <AlertTriangle className="h-6 w-6" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="rounded-lg border border-border bg-card p-4">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Cari berdasarkan nama penyewa..."
                                    value={nameFilter}
                                    onChange={(event) =>
                                        setNameFilter(event.target.value)
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
                                    {statusOptions.map((status) => (
                                        <SelectItem
                                            key={status.value}
                                            value={status.value}
                                        >
                                            {status.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Results count */}
                        <div className="mt-3 pt-3 border-t border-border">
                            <p className="text-sm text-muted-foreground">
                                Menampilkan {filteredLoans.length} dari{" "}
                                {loans.length} data
                            </p>
                        </div>
                    </div>

                    {/* Data Table */}
                    <div className="rounded-lg border border-border bg-card">
                        <div className="h-[calc(100vh-20rem)] min-h-[400px]">
                            <DataTable
                                columns={columns(availableUnits, isSuperAdmin)}
                                data={filteredLoans}
                                pageSize={10}
                                pageSizeOptions={[5, 10, 20, 50]}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

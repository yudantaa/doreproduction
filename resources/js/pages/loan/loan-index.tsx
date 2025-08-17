import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import LoanCreateForm from "./create-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
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
        tanggal_sewa: Date;
        tanggal_kembali: Date | null;
        deadline_pengembalian: Date;
        status: string;
        nama_barang: string;
        id_barang: string;
    }>;
    items: Array<{
        id: string;
        nama_barang: string;
        jumlah: number;
    }>;
    isSuperAdmin: boolean;
}

export default function LoanIndex({
    loans,
    items,
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
                                        onClose={() =>
                                            setIsRegisterModalOpen(false)
                                        }
                                    />
                                </div>
                            </DialogContent>
                        </Dialog>
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
                                columns={columns(items, isSuperAdmin)}
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

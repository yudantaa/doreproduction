import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import LoanCreateForm from "./create-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
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

            <div className="flex-1 rounded-xl h-full">
                <div className="mx-auto py-10 rounded-xl w-11/12 max-w-7xl">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
                        <h1 className="text-2xl font-bold">
                            Manajemen Peminjaman
                        </h1>
                        <Dialog
                            open={isRegisterModalOpen}
                            onOpenChange={setIsRegisterModalOpen}
                        >
                            <DialogTrigger asChild>
                                <Button className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base flex items-center justify-center gap-2 btn btn-primary">
                                    <PlusIcon className="h-4 w-4" />
                                    Tambah Peminjaman Baru
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-lg w-full max-h-[90vh] overflow-hidden">
                                <DialogHeader>
                                    <DialogTitle>
                                        Tambah Peminjaman Baru
                                    </DialogTitle>
                                </DialogHeader>
                                <div className="overflow-y-auto max-h-[calc(90vh-8rem)] pr-2">
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

                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 py-4">
                        <Input
                            placeholder="Filter berdasarkan nama penyewa..."
                            value={nameFilter}
                            onChange={(event) =>
                                setNameFilter(event.target.value)
                            }
                            className="w-full sm:max-w-sm"
                        />

                        <Select
                            value={statusFilter}
                            onValueChange={setStatusFilter}
                        >
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <SelectValue placeholder="Pilih Status" />
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

                    <div className="overflow-x-auto">
                        <DataTable
                            columns={columns(items, isSuperAdmin)}
                            data={filteredLoans}
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';
import LoanCreateForm from './create-form';
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
    SelectValue
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
}

export default function LoanIndex({ loans, items }: LoanIndexProps) {
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [nameFilter, setNameFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    const filteredLoans = loans.filter((loan) =>
        loan.nama_penyewa.toLowerCase().includes(nameFilter.toLowerCase()) &&
        (statusFilter === "All" || loan.status === statusFilter)
    );

    const statusOptions = [
        { value: "All", label: "Semua Status" },
        { value: "Dipinjam", label: "Dipinjam" },
        { value: "Dikembalikan", label: "Dikembalikan" },
        { value: "Dibatalkan", label: "Dibatalkan" }
    ];

    return (
        <AuthenticatedLayout header={"Manajemen Peminjaman"}>
            <Head title="Manajemen Peminjaman" />

            <div className="flex-1 rounded-xl h-full">
                <div className="mx-auto py-10 rounded-xl w-11/12">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold">Manajemen Peminjaman</h1>
                        <Dialog
                            open={isRegisterModalOpen}
                            onOpenChange={setIsRegisterModalOpen}
                        >
                            <DialogTrigger asChild>
                                <Button className="bg-zinc-600">
                                    <PlusIcon className="mr-2 h-4 w-4" /> Tambah Peminjaman Baru
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Tambah Peminjaman Baru</DialogTitle>
                                </DialogHeader>
                                <LoanCreateForm
                                    items={items}
                                    onClose={() => setIsRegisterModalOpen(false)}
                                />
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="flex items-center space-x-4 py-4">
                        <Input
                            placeholder="Filter berdasarkan nama penyewa..."
                            value={nameFilter}
                            onChange={(event) => setNameFilter(event.target.value)}
                            className="max-w-sm"
                        />

                        <Select
                            value={statusFilter}
                            onValueChange={setStatusFilter}
                        >
                            <SelectTrigger className="w-[180px]">
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

                    <DataTable
                        columns={columns()}
                        data={filteredLoans}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Item, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { Head } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Plus, Search, CheckCircle, XCircle, Clock } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { AddItemForm } from "./create-form";
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
import { Category } from "../category/columns";

interface ItemsPageProps {
    items: Item[];
    categories: Category[];
    totalAvailable: number;
    totalUnavailable: number;
    totalRented: number;
}

export default function ItemsIndex({
    items,
    categories,
    totalAvailable,
    totalUnavailable,
    totalRented,
}: ItemsPageProps) {
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [nameFilter, setNameFilter] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("All");
    const [statusFilter, setStatusFilter] = useState("All");

    const filteredItems = items.filter(
        (item) =>
            item.nama_barang.toLowerCase().includes(nameFilter.toLowerCase()) &&
            (categoryFilter === "All" || item.id_kategori === categoryFilter) &&
            (statusFilter === "All" || item.status === statusFilter)
    );

    const statusOptions = [
        { value: "All", label: "Semua Status" },
        { value: "Tersedia", label: "Tersedia" },
        { value: "Tidak Tersedia", label: "Tidak Tersedia" },
        { value: "Sedang Ditahan", label: "Sedang Ditahan" },
    ];

    return (
        <AuthenticatedLayout header={"Manajemen Barang"}>
            <Head title="Manajemen Barang" />

            <div className="flex-1 p-4 md:p-5 lg:p-6">
                <div className="mx-auto w-full max-w-7xl space-y-6">
                    {/* Header */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-foreground md:text-2xl">
                                Manajemen Barang
                            </h1>
                            <p className="text-xs text-muted-foreground">
                                Kelola data barang inventori dengan mudah
                            </p>
                        </div>

                        <Dialog
                            open={isRegisterModalOpen}
                            onOpenChange={setIsRegisterModalOpen}
                        >
                            <DialogTrigger asChild>
                                <Button
                                    className="w-full sm:w-auto text-xs h-8"
                                    size="sm"
                                >
                                    <Plus className="mr-1 h-3 w-3" />
                                    Tambah Barang Baru
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="w-[95vw] max-w-md sm:w-full">
                                <DialogHeader>
                                    <DialogTitle className="text-sm text-left">
                                        Tambah Barang Baru
                                    </DialogTitle>
                                </DialogHeader>
                                <div className="max-h-[70vh] overflow-y-auto pr-1">
                                    <AddItemForm
                                        onClose={() =>
                                            setIsRegisterModalOpen(false)
                                        }
                                        categories={categories}
                                    />
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="rounded-lg border border-border bg-card p-4">
                            <div className="flex items-center">
                                <div className="flex-1 space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Unit Tersedia
                                    </p>
                                    <p className="text-2xl font-bold">
                                        {totalAvailable}
                                    </p>
                                </div>
                                <div className="h-10 w-10 rounded-full bg-green-100 p-2 text-green-600 dark:bg-green-900/20 dark:text-green-400">
                                    <CheckCircle className="h-6 w-6" />
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border border-border bg-card p-4">
                            <div className="flex items-center">
                                <div className="flex-1 space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Unit Tidak Tersedia
                                    </p>
                                    <p className="text-2xl font-bold">
                                        {totalUnavailable}
                                    </p>
                                </div>
                                <div className="h-10 w-10 rounded-full bg-red-100 p-2 text-red-600 dark:bg-red-900/20 dark:text-red-400">
                                    <XCircle className="h-6 w-6" />
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border border-border bg-card p-4">
                            <div className="flex items-center">
                                <div className="flex-1 space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Unit Disewa
                                    </p>
                                    <p className="text-2xl font-bold">
                                        {totalRented}
                                    </p>
                                </div>
                                <div className="h-10 w-10 rounded-full bg-blue-100 p-2 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                                    <Clock className="h-6 w-6" />
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
                                    placeholder="Cari berdasarkan nama barang..."
                                    value={nameFilter}
                                    onChange={(event) =>
                                        setNameFilter(event.target.value)
                                    }
                                    className="pl-10 text-sm h-10"
                                />
                            </div>

                            <Select
                                value={categoryFilter}
                                onValueChange={setCategoryFilter}
                            >
                                <SelectTrigger className="w-full sm:w-48 text-sm h-10">
                                    <SelectValue placeholder="Filter Kategori" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All" className="text-sm">
                                        Semua Kategori
                                    </SelectItem>
                                    {categories.map((category) => (
                                        <SelectItem
                                            key={category.id}
                                            value={category.id}
                                            className="text-sm"
                                        >
                                            {category.nama_kategori}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select
                                value={statusFilter}
                                onValueChange={setStatusFilter}
                            >
                                <SelectTrigger className="w-full sm:w-48 text-sm h-10">
                                    <SelectValue placeholder="Filter Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {statusOptions.map((status) => (
                                        <SelectItem
                                            key={status.value}
                                            value={status.value}
                                            className="text-sm"
                                        >
                                            {status.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Results count */}
                        <div className="mt-4 pt-4 border-t border-border">
                            <p className="text-sm text-muted-foreground">
                                Menampilkan {filteredItems.length} dari{" "}
                                {items.length} data
                            </p>
                        </div>
                    </div>

                    {/* Data Table */}
                    <div className="rounded-lg border border-border bg-card">
                        <DataTable
                            columns={columns(categories)}
                            data={filteredItems}
                            pageSize={5}
                            pageSizeOptions={[5, 10, 20, 50]}
                            className="w-full"
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

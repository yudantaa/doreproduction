// components/item-unit/item-unit-index.tsx
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { DataTable } from "@/components/ui/data-table";
import { Head } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { AddItemUnitForm } from "./create-form";
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
import { columns } from "./columns";
import { ItemUnit } from "@/types/item-unit";

interface ItemUnitsPageProps {
    itemUnits: ItemUnit[];
    items: any[];
}

export default function ItemUnitsIndex({
    itemUnits,
    items,
}: ItemUnitsPageProps) {
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [searchFilter, setSearchFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [itemFilter, setItemFilter] = useState("All");

    const filteredItemUnits = itemUnits.filter(
        (unit) =>
            (unit.kode_unit
                .toLowerCase()
                .includes(searchFilter.toLowerCase()) ||
                unit.item?.nama_barang
                    .toLowerCase()
                    .includes(searchFilter.toLowerCase())) &&
            (statusFilter === "All" || unit.status === statusFilter) &&
            (itemFilter === "All" || unit.id_barang === itemFilter)
    );

    const statusOptions = [
        { value: "All", label: "Semua Status" },
        { value: "Tersedia", label: "Tersedia" },
        { value: "Rusak", label: "Rusak" },
        { value: "Dalam Perbaikan", label: "Dalam Perbaikan" },
        { value: "Disewa", label: "Disewa" },
        { value: "Tidak Tersedia", label: "Tidak Tersedia" },
        { value: "Sedang Ditahan", label: "Sedang Ditahan" },
    ];

    return (
        <AuthenticatedLayout header={"Manajemen Unit Barang"}>
            <Head title="Manajemen Unit Barang" />

            <div className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">
                <div className="mx-auto w-full max-w-7xl space-y-6">
                    {/* Header */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                                Manajemen Unit Barang
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Kelola data unit barang dengan mudah
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
                                    Tambah Unit Baru
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="w-[95vw] max-w-lg sm:w-full">
                                <DialogHeader>
                                    <DialogTitle className="text-left">
                                        Tambah Unit Baru
                                    </DialogTitle>
                                </DialogHeader>
                                <div className="max-h-[70vh] overflow-y-auto pr-1">
                                    <AddItemUnitForm
                                        onClose={() =>
                                            setIsRegisterModalOpen(false)
                                        }
                                        items={items}
                                        itemUnits={itemUnits}
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
                                    placeholder="Cari berdasarkan kode unit atau nama barang..."
                                    value={searchFilter}
                                    onChange={(event) =>
                                        setSearchFilter(event.target.value)
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

                            <Select
                                value={itemFilter}
                                onValueChange={setItemFilter}
                            >
                                <SelectTrigger className="w-full sm:w-48">
                                    <SelectValue placeholder="Filter Barang" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All">
                                        Semua Barang
                                    </SelectItem>
                                    {items.map((item) => (
                                        <SelectItem
                                            key={item.id}
                                            value={item.id}
                                        >
                                            {item.nama_barang}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Results count */}
                        <div className="mt-3 pt-3 border-t border-border">
                            <p className="text-sm text-muted-foreground">
                                Menampilkan {filteredItemUnits.length} dari{" "}
                                {itemUnits.length} data
                            </p>
                        </div>
                    </div>

                    {/* Data Table */}
                    <div className="rounded-lg border border-border bg-card">
                        <div className="h-[calc(100vh-20rem)] min-h-[400px]">
                            <DataTable
                                columns={columns(items)}
                                data={filteredItemUnits}
                                pageSize={5}
                                pageSizeOptions={[5, 10, 20, 50]}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Item, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { Head } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
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
import { useForm } from "@inertiajs/react";
import { useToast } from "@/components/hooks/use-toast";

interface ItemsPageProps {
    items: Item[];
    categories: Category[];
}

export default function ItemsIndex({ items, categories }: ItemsPageProps) {
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [nameFilter, setNameFilter] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("All");
    const [statusFilter, setStatusFilter] = useState("All");
    const { toast } = useToast();

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

            <div className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">
                <div className="mx-auto w-full max-w-7xl space-y-6">
                    {/* Header */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                                Manajemen Barang
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Kelola data barang inventori dengan mudah
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
                                    Tambah Barang Baru
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="w-[95vw] max-w-lg sm:w-full">
                                <DialogHeader>
                                    <DialogTitle className="text-left">
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
                                    className="pl-9"
                                />
                            </div>

                            <Select
                                value={categoryFilter}
                                onValueChange={setCategoryFilter}
                            >
                                <SelectTrigger className="w-full sm:w-48">
                                    <SelectValue placeholder="Filter Kategori" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All">
                                        Semua Kategori
                                    </SelectItem>
                                    {categories.map((category) => (
                                        <SelectItem
                                            key={category.id}
                                            value={category.id}
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
                                Menampilkan {filteredItems.length} dari{" "}
                                {items.length} data
                            </p>
                        </div>
                    </div>

                    {/* Data Table */}
                    <div className="rounded-lg border border-border bg-card">
                        <div className="h-[calc(100vh-20rem)] min-h-[400px]">
                            <DataTable
                                columns={columns(categories)}
                                data={filteredItems}
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

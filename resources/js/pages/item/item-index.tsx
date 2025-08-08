import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Item, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { Head } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
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
}

export default function ItemsIndex({ items, categories }: ItemsPageProps) {
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [nameFilter, setNameFilter] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("All");

    const filteredItems = items.filter(
        (item) =>
            item.nama_barang.toLowerCase().includes(nameFilter.toLowerCase()) &&
            (categoryFilter === "All" || item.id_kategori === categoryFilter)
    );

    return (
        <AuthenticatedLayout header={"Manajemen Barang"}>
            <Head title="Manajemen Barang" />

            <div className="flex-1 rounded-xl h-full">
                <div className="mx-auto py-10 rounded-xl w-11/12">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
                        <h1 className="text-2xl font-bold">Manajemen Barang</h1>
                        <Dialog
                            open={isRegisterModalOpen}
                            onOpenChange={setIsRegisterModalOpen}
                        >
                            <DialogTrigger asChild>
                                <Button className="btn btn-primary">
                                    <PlusIcon className="mr-2 h-4 w-4" /> Tambah
                                    Barang Baru
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-lg w-full max-h-[90vh] overflow-hidden">
                                <div className="overflow-y-auto max-h-[calc(90vh-8rem)] pr-2">
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

                    <div className="flex flex-col md:flex-row md:items-center md:space-x-4 py-4 gap-2">
                        <Input
                            placeholder="Filter berdasarkan nama..."
                            value={nameFilter}
                            onChange={(event) =>
                                setNameFilter(event.target.value)
                            }
                            className="max-w-sm"
                        />

                        <Select
                            value={categoryFilter}
                            onValueChange={setCategoryFilter}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Pilih Kategori" />
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
                    </div>

                    <DataTable
                        columns={columns(categories)}
                        data={filteredItems}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Category, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { Head } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface CategoriesPageProps {
    categories: Category[];
}

export default function CategoriesIndex({ categories }: CategoriesPageProps) {
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [nameFilter, setNameFilter] = useState("");

    return (
        <AuthenticatedLayout header={'Manajemen Kategori'}>
            <Head title="categories" />

            <div className="container mx-auto py-10 bg-muted/50 rounded-xl">
                <Head title="Manajemen Kategori" />

                <div className="flex justify-between categories-center mb-4">
                    <h1 className="text-2xl font-bold">Manajemen Kategori</h1>
                    <Dialog open={isRegisterModalOpen} onOpenChange={setIsRegisterModalOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-zinc-600">
                                <PlusIcon className="mr-2 h-4 w-4" /> Tambah Kategori Baru
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Tambah Kategori Baru</DialogTitle>
                            </DialogHeader>

                        </DialogContent>
                    </Dialog>
                </div>
                <div className="flex categories-center py-4">
                    <Input
                        placeholder="Filter berdasarkan nama..."
                        value={nameFilter}
                        onChange={(event) => setNameFilter(event.target.value)}
                        className="max-w-sm"
                    />
                </div>

                <DataTable
                    columns={columns}
                    data={categories.filter(Category =>
                        Category.nama_kategori.toLowerCase().includes(nameFilter.toLowerCase())
                    )}
                    />
            </div>
        </AuthenticatedLayout>
    )
}

import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Category, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { Head } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { CreateCategory } from "./create-form";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
} from "@/components/ui/dialog";

interface CategoriesPageProps {
    categories: Category[];
}

export default function CategoriesIndex({ categories }: CategoriesPageProps) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [nameFilter, setNameFilter] = useState("");

    return (
        <AuthenticatedLayout header={"Manajemen Kategori"}>
            <Head title="categories" />
            <div className="flex-1 rounded-xl h-full ">
                <div className=" mx-auto py-10 rounded-xl w-11/12  ">
                    <Head title="Manajemen Kategori" />

                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
                        <h1 className="text-2xl font-bold">
                            Manajemen Kategori
                        </h1>
                        <Dialog
                            open={isCreateModalOpen}
                            onOpenChange={setIsCreateModalOpen}
                        >
                            <DialogTrigger asChild>
                                <Button className="bg-zinc-600">
                                    <PlusIcon className="mr-2 h-4 w-4" /> Tambah
                                    Kategori Baru
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>
                                        Tambah Kategori Baru
                                    </DialogTitle>
                                    <DialogDescription>
                                        Setelah selesai silahkan klik tombol
                                        buat.
                                    </DialogDescription>
                                    <CreateCategory
                                        onSuccessfulCreate={() =>
                                            setIsCreateModalOpen(false)
                                        }
                                    />
                                </DialogHeader>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <div className="flex categories-center py-4">
                        <Input
                            placeholder="Filter berdasarkan nama..."
                            value={nameFilter}
                            onChange={(event) =>
                                setNameFilter(event.target.value)
                            }
                            className="max-w-sm"
                        />
                    </div>

                    <DataTable
                        columns={columns}
                        data={categories.filter((Category) =>
                            Category.nama_kategori
                                .toLowerCase()
                                .includes(nameFilter.toLowerCase())
                        )}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

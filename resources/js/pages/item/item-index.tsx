import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Item, columns } from "./columns";
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
import Register from "../auth/register";

interface ItemsPageProps {
    items: Item[];
}

export default function ItemsIndex({ items }: ItemsPageProps) {
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [nameFilter, setNameFilter] = useState("");

    return (
        <AuthenticatedLayout header={'Manajemen Barang'}>
            <Head title="items" />

            <div className="container mx-auto py-10 bg-muted/50 rounded-xl">
                <Head title="Manajemen Barang" />

                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Manajemen Barang</h1>
                    <Dialog open={isRegisterModalOpen} onOpenChange={setIsRegisterModalOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-zinc-600">
                                <PlusIcon className="mr-2 h-4 w-4" /> Tambah Barang Baru
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Tambah Barang Baru</DialogTitle>
                            </DialogHeader>

                        </DialogContent>
                    </Dialog>
                </div>
                <div className="flex items-center py-4">
                    <Input
                        placeholder="Filter berdasarkan nama..."
                        value={nameFilter}
                        onChange={(event) => setNameFilter(event.target.value)}
                        className="max-w-sm"
                    />
                </div>

                <DataTable
                    columns={columns}
                    data={items.filter(Item =>
                        Item.nama_barang.toLowerCase().includes(nameFilter.toLowerCase())
                    )}
                    />
            </div>
        </AuthenticatedLayout>
    )
}

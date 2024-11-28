import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { User, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { Head } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import Register from "../auth/register";

interface UsersPageProps {
    users: User[];
}

export default function UsersIndex({ users }: UsersPageProps) {
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

    return (
        <AuthenticatedLayout header={'Manajemen Pegawai'}>
            <Head title="Users" />

            <div className="container mx-auto py-10 bg-muted/50 rounded-xl">
                <Head title="Manajemen Pegawai" />

                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Manajemen Pegawai</h1>
                    <Dialog open={isRegisterModalOpen} onOpenChange={setIsRegisterModalOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-zinc-600">
                                <PlusIcon className="mr-2 h-4 w-4" /> Tambah Pegawai Baru
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Tambah Pegawai Baru</DialogTitle>
                            </DialogHeader>
                            <Register
                                mode="add-employee"
                                onSuccessfulRegistration={() => setIsRegisterModalOpen(false)}
                            />
                        </DialogContent>
                    </Dialog>
                </div>

                <DataTable columns={columns} data={users} />
            </div>
        </AuthenticatedLayout>
    )
}

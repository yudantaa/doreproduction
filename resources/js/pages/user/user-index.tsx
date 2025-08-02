import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { User, columns } from "./columns";
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

interface UsersPageProps {
    users: User[];
}

export default function UsersIndex({ users }: UsersPageProps) {
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [nameFilter, setNameFilter] = useState("");

    return (
        <AuthenticatedLayout header={"Manajemen Pegawai"}>
            <Head title="Users" />

            <Head title="Manajemen Pegawai" />
            <div className="flex-1 rounded-xl h-full ">
                <div className=" mx-auto py-10 rounded-xl w-11/12  ">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
                        <h1 className="text-2xl font-bold">
                            Manajemen Pegawai
                        </h1>
                        <Dialog
                            open={isRegisterModalOpen}
                            onOpenChange={setIsRegisterModalOpen}
                        >
                            <DialogTrigger asChild>
                                <Button className="btn btn-primary">
                                    <PlusIcon className="mr-2 h-4 w-4" />
                                    Tambah Pegawai Baru
                                </Button>
                            </DialogTrigger>

                            <DialogContent
                                className="w-full max-w-md bg-card rounded-xl px-6 py-8 shadow-xl"
                                style={{
                                    maxHeight: "90vh",
                                    marginTop: "auto",
                                    marginBottom: "auto",
                                }}
                            >
                                <div className="flex justify-center mb-6">
                                    <img
                                        src="/logo.jpg"
                                        alt="Logo"
                                        className="h-16"
                                    />
                                </div>

                                {/* <DialogHeader className="text-center mb-4">
                                    <DialogTitle className="text-xl font-semibold">
                                        Tambah Pegawai Baru
                                    </DialogTitle>
                                    <p className="text-sm text-muted-foreground">
                                        Masukkan informasi pegawai baru
                                    </p>
                                </DialogHeader> */}

                                <Register
                                    mode="add-employee"
                                    isModal={true}
                                    onSuccessfulRegistration={() =>
                                        setIsRegisterModalOpen(false)
                                    }
                                />
                            </DialogContent>
                        </Dialog>
                    </div>
                    <div className="flex items-center py-4">
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
                        data={users.filter((user) =>
                            user.name
                                .toLowerCase()
                                .includes(nameFilter.toLowerCase())
                        )}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

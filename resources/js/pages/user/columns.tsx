import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

import { useToast } from "@/components/hooks/use-toast";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
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
import { useState } from "react";
import { DropdownMenuArrow } from "@radix-ui/react-dropdown-menu";

export type User = {
    id: string;
    name: string;
    email: string;
    role: string;
    created_at: Date;
};

export const columns: ColumnDef<User>[] = [
    {
        accessorKey: "name",
        header: "Nama",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "role",
        header: "Kuasa",
    },
    {
        accessorKey: "created_at",
        header: "Tanggal Didaftarkan",
        cell: ({ row }) => {
            const date = new Date(row.original.created_at);
            return date.toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "long",
                year: "numeric",
            });
        },
    },
    {
        accessorKey: "action",
        header: "Atur",
        id: "actions",
        cell: ({ row }) => {
            const user = row.original;
            const [formData, setFormData] = useState<User | null>(null);
            const openDialog = () => setFormData(user); // Pass row data to dialog
            const closeDialog = () => setFormData(null);
            const { toast } = useToast();

            return (
                <AlertDialog>
                    <Dialog>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Atur</DropdownMenuLabel>
                                <DropdownMenuSeparator />

                                <DialogTrigger>
                                    <DropdownMenuItem onClick={openDialog}>
                                        Ubah Data
                                    </DropdownMenuItem>
                                </DialogTrigger>

                                <DropdownMenuSeparator></DropdownMenuSeparator>

                                <AlertDialogTrigger>
                                    <DropdownMenuItem className="text-red-600">
                                        Hapus Data
                                    </DropdownMenuItem>
                                </AlertDialogTrigger>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Apakah Anda Yakin?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    Tindakan ini tidak dapat dibatalkan. Ini
                                    akan menghapus akun ini secara permanen dan
                                    menghapus data ini dari server kami.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction className="bg-red-600">
                                    Lanjut Hapus
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                        {formData && (
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>
                                        Ubah Data
                                    </DialogTitle>
                                    <DialogDescription>
                                        Ubah data dari pegawai ini, setelah selesai, silakan menekan tombol ubah.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label
                                            htmlFor="name"
                                            className="text-right"
                                        >
                                            Name
                                        </Label>
                                        <Input
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    name: e.target.value,
                                                })
                                            }
                                            className="col-span-3"
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label
                                            htmlFor="email"
                                            className="text-right"
                                        >
                                            Email
                                        </Label>
                                        <Input
                                            id="email"
                                            value={formData.email}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    email: e.target.value,
                                                })
                                            }
                                            className="col-span-3"
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label
                                            htmlFor="role"
                                            className="text-right"
                                        >
                                            Role
                                        </Label>
                                        <Select
                                            onValueChange={(value) =>
                                                setFormData({
                                                    ...formData,
                                                    role: value,
                                                })
                                            }
                                            defaultValue={formData.role}
                                        >
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder="Select Role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="SUPER ADMIN">
                                                    SUPER ADMIN
                                                </SelectItem>
                                                <SelectItem value="ADMIN">
                                                    ADMIN
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button
                                        type="submit"
                                        onClick={() => {
                                            closeDialog();
                                            toast({
                                                description:
                                                    "Data berhasil diubah.",
                                            });
                                        }}
                                    >
                                        Ubah
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        )}
                    </Dialog>
                </AlertDialog>
            );
        },
    },
];

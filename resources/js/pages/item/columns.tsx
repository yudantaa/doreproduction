import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { useToast } from "@/components/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { router } from "@inertiajs/react";
import { Category } from "../category/columns";
import { ImageUpload } from "@/components/ui/image-upload";
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

export type Item = {
    id: string;
    nama_barang: string;
    status: string;
    deskripsi: string;
    id_kategori: string;
    jumlah: number;
    created_at: Date;
    image?: string | null;
};

export const columns = (categories: Category[]): ColumnDef<Item>[] => [
    {
        header: "Nomor",
        cell: ({ row }) => {
            return <div className=" font-bold">{row.index + 1}</div>;
        },
    },
    {
        accessorKey: "image",
        header: "Gambar",
        cell: ({ row }) => {
            const imageUrl = `/storage/${row.original.image}`;
            return (
                <img className="rounded"
                    src={imageUrl}
                    alt="Item"
                    style={{ width: "50px", height: "50px", objectFit: "cover" }}
                />
            );
        },
    },
    {
        accessorKey: "nama_barang",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Nama Barang
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
    {
        accessorKey: "status",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ getValue }) => {
            const status = getValue(); // Get the value of the 'status' column
            const bgColor =
                status === "Tersedia"
                    ? "bg-green-200 text-green-800"
                    : "bg-red-200 text-red-800";

            return (
                <div
                    className={` text-center inline-block rounded-full px-3 py-1 text-xs font-semibold ${bgColor}`}
                >
                    {status}
                </div>
            );
        },
    },
    {
        accessorKey: "deskripsi",
        header: "Deskripsi",
        cell: ({ getValue }) => {
            const deskripsi = getValue() || "";
            const truncatedDeskripsi =
                deskripsi.length > 100
                    ? `${deskripsi.slice(0, 100)}...`
                    : deskripsi;

            return deskripsi ? (
                <span title={deskripsi}>{truncatedDeskripsi}</span>
            ) : (
                "Tidak ada deskripsi."
            );
        },
    },
    {
        accessorKey: "nama_kategori",
        header: "Kategori",
    },
    {
        accessorKey: "jumlah",
        header: "Stok",
    },
    {
        accessorKey: "created_at",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Waktu Ditambahkan
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const date = new Date(row.original.created_at);
            return `${date.toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "long",
                year: "numeric",
            })} ${date.toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            })}`;
        },
        sortFn: (rowA, rowB) => {
            const dateA = new Date(rowA.original.created_at);
            const dateB = new Date(rowB.original.created_at);
            return dateA.getTime() - dateB.getTime();
        },
    },
    {
        accessorKey: "action",
        header: "Atur",
        id: "actions",
        cell: ({ row }) => {
            const item = row.original;
            const [formData, setFormData] = useState<Item | null>(null);
            const textareaRef = useRef<HTMLTextAreaElement>(null);
            const [imageFile, setImageFile] = useState<File | null>(null);
            const { toast } = useToast();
            const status = ["Tersedia", "Tidak Tersedia"];

            const openDialog = () => setFormData({ ...item });
            const closeDialog = () => {
                setFormData(null);
                setImageFile(null);
            };

            const createFormData = (data: Item, imageFile: File | null): FormData => {
                const formData = new FormData();
                formData.append("nama_barang", data.nama_barang);
                formData.append("jumlah", data.jumlah.toString());
                formData.append("status", data.status);
                formData.append("deskripsi", data.deskripsi || "");
                formData.append("id_kategori", data.id_kategori);

                // Append image if exists
                if (imageFile) {
                    formData.append("image", imageFile);
                } else {
                    console.warn("No image file provided.");
                }

                formData.append("_method", "put"); // Required for PUT simulation if needed
                return formData;
            };

            const handleDeskripsiChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
                if (formData) {
                    setFormData({ ...formData, deskripsi: e.target.value });
                }
            };

            const handleUpdate = () => {
                if (!formData) return;

                const submitData = createFormData(formData, imageFile);
                console.log("FormData being sent:", [...submitData.entries()]);
                router.post(
                    `/items/${formData.id}`,
                    submitData,
                    {
                        onSuccess: () => {
                            closeDialog();
                            toast({
                                description: "Data berhasil diubah.",
                            });
                        },
                        onError: (errors) => {
                            console.error("Update failed with errors:", errors);
                            toast({
                                title: "Gagal Mengubah Data",
                                description: "Silakan periksa kembali input Anda.",
                                variant: "destructive",
                            });
                        },
                    }
                );
            };


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

                        {/* Delete Confirmation Dialog */}
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Apakah Anda Yakin?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    Tindakan ini tidak dapat dibatalkan. Ini
                                    akan menghapus barang ini secara permanen
                                    dari server kami.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction
                                    className="bg-red-600"
                                    onClick={() => {
                                        router.delete(`/items/${item.id}`, {
                                            onSuccess: () => {
                                                toast({
                                                    description:
                                                        "Data berhasil dihapus.",
                                                });
                                            },
                                            onError: () => {
                                                toast({
                                                    description:
                                                        "Gagal menghapus data.",
                                                    variant: "destructive",
                                                });
                                            },
                                        });
                                    }}
                                >
                                    Lanjut Hapus
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>

                        {/* Update Item Dialog */}
                        {formData && (
                            <Dialog
                                open={!!formData}
                                onOpenChange={closeDialog}
                            >
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>
                                            Ubah Data Barang
                                        </DialogTitle>
                                        <DialogDescription>
                                            Setelah selesai silahkan klik tombol
                                            ubah.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label
                                                htmlFor="nama_barang"
                                                className="text-right"
                                            >
                                                Nama Barang
                                            </Label>
                                            <Input
                                                id="nama_barang"
                                                value={formData.nama_barang}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        nama_barang:
                                                            e.target.value,
                                                    })
                                                }
                                                className="col-span-3"
                                            />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label
                                                htmlFor="jumlah"
                                                className="text-right"
                                            >
                                                Stok
                                            </Label>
                                            <Input
                                                id="jumlah"
                                                type="number"
                                                value={formData.jumlah}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        jumlah: parseInt(
                                                            e.target.value
                                                        ),
                                                    })
                                                }
                                                className="col-span-3"
                                            />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label
                                                htmlFor="status"
                                                className="text-right"
                                            >
                                                Status
                                            </Label>
                                            <Select
                                                onValueChange={(value) =>
                                                    setFormData({
                                                        ...formData,
                                                        status: value,
                                                    })
                                                }
                                                defaultValue={formData.status}
                                            >
                                                <SelectTrigger className="col-span-3">
                                                    <SelectValue placeholder="Pilih Status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {status.map((stat) => (
                                                        <SelectItem
                                                            key={stat}
                                                            value={stat}
                                                        >
                                                            {stat}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label
                                                htmlFor="id_kategori"
                                                className="text-right"
                                            >
                                                Kategori
                                            </Label>
                                            <Select
                                                onValueChange={(value) =>
                                                    setFormData({
                                                        ...formData,
                                                        id_kategori: value,
                                                    })
                                                }
                                                value={formData.id_kategori}
                                            >
                                                <SelectTrigger className="col-span-3">
                                                    <SelectValue placeholder="Pilih Kategori" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {categories.map(
                                                        (category) => (
                                                            <SelectItem
                                                                key={
                                                                    category.id
                                                                }
                                                                value={
                                                                    category.id
                                                                }
                                                            >
                                                                {
                                                                    category.nama_kategori
                                                                }
                                                            </SelectItem>
                                                        )
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label
                                                htmlFor="image"
                                                className="text-right"
                                            >
                                                Gambar
                                            </Label>
                                            <div className="col-span-3">
                                                <ImageUpload
                                                    defaultImage={item.gambar}
                                                    onImageChange={setImageFile}
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label
                                                htmlFor="deskripsi"
                                                className="text-right"
                                            >
                                                Deskripsi
                                            </Label>
                                            <Textarea
                                                ref={textareaRef}
                                                id="deskripsi"
                                                value={
                                                    formData?.deskripsi || ""
                                                }
                                                onChange={handleDeskripsiChange}
                                                className="col-span-3 min-h-[100px]"
                                                rows={3}
                                                placeholder="Masukkan deskripsi barang"
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button
                                            type="submit"
                                            onClick={handleUpdate}
                                        >
                                            Ubah
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        )}
                    </Dialog>
                </AlertDialog>
            );
        },
    },
];

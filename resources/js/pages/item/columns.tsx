import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { router } from "@inertiajs/react";
import { Category } from "../category/columns";
import { ImageUpload } from "@/components/ui/image-upload";
import { useFormState } from "@/utilities/form-utilities";
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
            return <div className="font-bold">{row.index + 1}</div>;
        },
    },
    {
        accessorKey: "image",
        header: "Gambar",
        cell: ({ row }) => {
            const imageUrl = `/storage/${row.original.image}`;
            return (
                <img
                    className="rounded"
                    src={imageUrl}
                    alt="Item"
                    style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                    }}
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
            const status = getValue();
            const bgColor =
                status === "Tersedia"
                    ? "bg-green-200 text-green-800"
                    : "bg-red-200 text-red-800";

            return (
                <div
                    className={`text-center inline-block rounded-full px-3 py-1 text-xs font-semibold ${bgColor}`}
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
        sortingFn: (rowA, rowB) => {
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
            const [imageFile, setImageFile] = useState<File | null>(null);
            const [isSubmitting, setIsSubmitting] = useState(false);
            const [isImageUploadOpen, setIsImageUploadOpen] = useState(false);
            const { toast } = useToast();
            const status = ["Tersedia", "Tidak Tersedia"];

            const {
                formData,
                handleInputChange,
                handleSelectChange,
                openModal,
                closeModal,
            } = useFormState<Item>(null);

            const handleImageChange = (file: File | null) => {
                setImageFile(file);
                setIsImageUploadOpen(false);
            };

            const handleUpdate = async (e: React.FormEvent) => {
                e.preventDefault();

                // Prevent submission if already submitting or if image upload is open
                if (isSubmitting || isImageUploadOpen || !formData) return;

                try {
                    setIsSubmitting(true);

                    const submitData = new FormData();
                    submitData.append("nama_barang", formData.nama_barang);
                    submitData.append("jumlah", formData.jumlah.toString());
                    submitData.append("status", formData.status);
                    submitData.append("deskripsi", formData.deskripsi || "");
                    submitData.append("id_kategori", formData.id_kategori);

                    if (imageFile) {
                        submitData.append("image", imageFile);
                    }

                    router.post(
                        `/items/${item.id}`,
                        {
                            _method: "PUT",
                            ...Object.fromEntries(submitData),
                        },
                        {
                            onSuccess: () => {
                                toast({
                                    description: "Data berhasil diubah.",
                                });
                                closeModal();
                                setImageFile(null);
                            },
                            onError: () => {
                                toast({
                                    description: "Gagal mengubah data.",
                                    variant: "destructive",
                                });
                            },
                            onFinish: () => {
                                setIsSubmitting(false);
                            },
                        }
                    );
                } catch (error) {
                    setIsSubmitting(false);
                    toast({
                        description: "Terjadi kesalahan saat mengubah data.",
                        variant: "destructive",
                    });
                }
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
                                    <DropdownMenuItem
                                        onClick={() => openModal(item)}
                                    >
                                        Ubah Data
                                    </DropdownMenuItem>
                                </DialogTrigger>

                                <DropdownMenuSeparator />

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

                        {formData && (
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Ubah Data Barang</DialogTitle>
                                    <DialogDescription>
                                        Setelah selesai silahkan klik tombol
                                        ubah.
                                    </DialogDescription>
                                </DialogHeader>

                                <form
                                    onSubmit={handleUpdate}
                                    className="space-y-4"
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                        }
                                    }}
                                >
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label
                                            htmlFor="nama_barang"
                                            className="text-right"
                                        >
                                            Nama Barang
                                        </Label>
                                        <Input
                                            id="nama_barang"
                                            name="nama_barang"
                                            value={formData.nama_barang}
                                            onChange={handleInputChange}
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
                                            name="jumlah"
                                            type="number"
                                            value={formData.jumlah}
                                            onChange={handleInputChange}
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
                                            value={formData.status}
                                            onValueChange={(value) =>
                                                handleSelectChange(
                                                    "status",
                                                    value
                                                )
                                            }
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
                                            value={formData.id_kategori}
                                            onValueChange={(value) =>
                                                handleSelectChange(
                                                    "id_kategori",
                                                    value
                                                )
                                            }
                                        >
                                            <SelectTrigger className="col-span-3">
                                                <SelectValue placeholder="Pilih Kategori">
                                                    {
                                                        categories.filter(
                                                            (i: any) =>
                                                                i.id ===
                                                                Number(
                                                                    formData.id_kategori
                                                                )
                                                        )[0]?.nama_kategori
                                                    }
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
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
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label
                                            htmlFor="image"
                                            className="text-right"
                                        >
                                            Gambar
                                        </Label>
                                        <div className="col-span-3">
                                            <ImageUpload
                                                onImageChange={(file) => {
                                                    setIsImageUploadOpen(true);
                                                    handleImageChange(file);
                                                }}
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
                                            id="deskripsi"
                                            name="deskripsi"
                                            value={formData.deskripsi || ""}
                                            onChange={handleInputChange}
                                            className="col-span-3 min-h-[100px]"
                                            rows={3}
                                            placeholder="Masukkan deskripsi barang"
                                        />
                                    </div>
                                    <DialogFooter>
                                        <Button
                                            type="submit"
                                            disabled={
                                                isSubmitting ||
                                                isImageUploadOpen
                                            }
                                        >
                                            {isSubmitting
                                                ? "Sedang Mengubah..."
                                                : "Ubah"}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        )}
                    </Dialog>
                </AlertDialog>
            );
        },
    },
];

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ColumnDef } from "@tanstack/react-table";
import {
    MoreHorizontal,
    ArrowUpDown,
    CheckCircle,
    XCircle,
    Clock,
    AlertTriangle,
} from "lucide-react";
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
    base_code: string;
    status: string;
    deskripsi: string;
    id_kategori: string;
    nama_kategori: string;
    total_units: number;
    available_units: number;
    rented_units: number;
    broken_units: number;
    created_at: string;
    image?: string | null;
};

export const columns = (categories: Category[]): ColumnDef<Item>[] => [
    {
        header: "No",
        size: 40,
        cell: ({ row }) => {
            return <div className="font-bold text-xs">{row.index + 1}</div>;
        },
    },
    {
        accessorKey: "image",
        header: "Gambar",
        size: 60,
        cell: ({ row }) => {
            const item = row.original;
            const [imageError, setImageError] = useState(false);

            // Function to get category slug for image names
            const getCategorySlug = (categoryName: string) => {
                return categoryName
                    .toLowerCase()
                    .replace(/\s+/g, "-")
                    .replace(/[^\w\-]+/g, "");
            };

            // Use category-specific placeholder if no image or if image failed to load
            const categorySlug = getCategorySlug(item.nama_kategori);
            const imageUrl =
                item.image && !imageError
                    ? `/storage/${item.image}`
                    : `/placeholders/${categorySlug}-placeholder.jpg`;

            return (
                <img
                    className="rounded"
                    src={imageUrl}
                    alt="Item"
                    onError={() => setImageError(true)}
                    style={{
                        width: "40px",
                        height: "40px",
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
                    className="text-xs p-1 h-8"
                >
                    Nama Barang
                </Button>
            );
        },
        size: 150,
        cell: ({ row }) => {
            return (
                <div
                    className="text-xs font-medium truncate"
                    title={row.original.nama_barang}
                >
                    {row.original.nama_barang}
                </div>
            );
        },
    },
    {
        accessorKey: "base_code",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                    className="text-xs p-1 h-8"
                >
                    Kode Unit Utama
                </Button>
            );
        },
        size: 100,
        cell: ({ row }) => {
            return (
                <div
                    className="text-xs font-medium truncate"
                    title={row.original.base_code}
                >
                    {row.original.base_code}
                </div>
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
                    className="text-xs p-1 h-8"
                >
                    Status
                </Button>
            );
        },
        size: 120,
        cell: ({ getValue }) => {
            const status = getValue() as string;
            const bgColor =
                status === "Tersedia"
                    ? "bg-green-100 text-green-800"
                    : status === "Sedang Ditahan"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800";

            return (
                <div
                    className={`text-center inline-block rounded-full px-2 py-1 text-xs font-semibold ${bgColor}`}
                >
                    {status}
                </div>
            );
        },
    },
    {
        accessorKey: "nama_kategori",
        header: "Kategori",
        size: 120,
        cell: ({ row }) => {
            return (
                <div
                    className="text-xs truncate"
                    title={row.original.nama_kategori}
                >
                    {row.original.nama_kategori}
                </div>
            );
        },
    },
    {
        accessorKey: "total_units",
        header: "Total",
        size: 60,
        cell: ({ row }) => {
            const item = row.original;
            return (
                <div className="text-xs font-bold text-center">
                    {item.total_units}
                </div>
            );
        },
    },
    {
        accessorKey: "available_units",
        header: "Tersedia",
        size: 70,
        cell: ({ row }) => {
            const item = row.original;
            return (
                <div className="flex items-center justify-center text-xs">
                    <CheckCircle className="h-3 w-3 text-green-600 mr-1" />
                    {item.available_units}
                </div>
            );
        },
    },
    {
        accessorKey: "rented_units",
        header: "Disewa",
        size: 70,
        cell: ({ row }) => {
            const item = row.original;
            return (
                <div className="flex items-center justify-center text-xs">
                    <Clock className="h-3 w-3 text-blue-600 mr-1" />
                    {item.rented_units}
                </div>
            );
        },
    },
    {
        accessorKey: "broken_units",
        header: "Rusak",
        size: 70,
        cell: ({ row }) => {
            const item = row.original;
            return (
                <div className="flex items-center justify-center text-xs">
                    <AlertTriangle className="h-3 w-3 text-red-600 mr-1" />
                    {item.broken_units}
                </div>
            );
        },
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
                    className="text-xs p-1 h-8"
                >
                    Ditambahkan
                </Button>
            );
        },
        size: 120,
        cell: ({ row }) => {
            const date = new Date(row.original.created_at);
            return (
                <div className="text-xs">
                    {date.toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                    })}
                </div>
            );
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
        size: 80,
        cell: ({ row }) => {
            const item = row.original;
            const [imageFile, setImageFile] = useState<File | null>(null);
            const [isSubmitting, setIsSubmitting] = useState(false);
            const [isImageUploadOpen, setIsImageUploadOpen] = useState(false);
            const { toast } = useToast();
            const statusOptions = [
                "Tersedia",
                "Tidak Tersedia",
                "Sedang Ditahan",
            ];

            const {
                formData,
                handleInputChange,
                handleSelectChange,
                openModal,
                closeModal,
            } = useFormState<Item>(null);

            // Add state for unit management
            const [unitData, setUnitData] = useState({
                base_code: item.base_code || "",
                additional_units: 0,
            });

            const handleImageChange = (file: File | null) => {
                setImageFile(file);
                setIsImageUploadOpen(false);
            };

            const handleUpdate = async (e: React.FormEvent) => {
                e.preventDefault();
                if (isSubmitting || isImageUploadOpen || !formData) return;
                try {
                    setIsSubmitting(true);
                    const submitData = new FormData();
                    submitData.append("nama_barang", formData.nama_barang);
                    submitData.append("status", formData.status);
                    submitData.append("deskripsi", formData.deskripsi || "");
                    submitData.append("id_kategori", formData.id_kategori);
                    submitData.append("base_code", unitData.base_code);
                    submitData.append(
                        "additional_units",
                        unitData.additional_units.toString()
                    );

                    if (imageFile) {
                        submitData.append("image", imageFile);
                    }

                    router.post(
                        `items/${item.id}`,
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
                <>
                    <AlertDialog>
                        <Dialog>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="h-6 w-6 p-0"
                                    >
                                        <span className="sr-only">
                                            Open menu
                                        </span>
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    className="text-xs"
                                >
                                    <DropdownMenuLabel>Atur</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DialogTrigger>
                                        <DropdownMenuItem
                                            onClick={() => {
                                                openModal(item);
                                                setUnitData({
                                                    base_code:
                                                        item.base_code || "",
                                                    additional_units: 0,
                                                });
                                            }}
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

                            <AlertDialogContent className="max-w-[90vw] sm:max-w-md">
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="text-sm">
                                        Apakah Anda Yakin?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription className="text-xs">
                                        Tindakan ini tidak dapat dibatalkan. Ini
                                        akan menghapus barang ini secara
                                        permanen dari server kami.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel className="text-xs h-8">
                                        Batal
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        className="bg-red-600 text-xs h-8"
                                        onClick={() => {
                                            router.delete(`items/${item.id}`, {
                                                onSuccess: (page) => {
                                                    if (
                                                        page.props.flash.error
                                                    ) {
                                                        toast({
                                                            description:
                                                                page.props.flash
                                                                    .error,
                                                            variant:
                                                                "destructive",
                                                        });
                                                    } else {
                                                        toast({
                                                            description:
                                                                "Data berhasil dihapus.",
                                                        });
                                                    }
                                                },
                                                onError: (errors) => {
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
                                <DialogContent className="max-w-[95vw] sm:max-w-md">
                                    <DialogHeader>
                                        <DialogTitle className="text-sm">
                                            Ubah Data Barang
                                        </DialogTitle>
                                        <DialogDescription className="text-xs">
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
                                                className="text-right text-xs"
                                            >
                                                Nama Barang
                                            </Label>
                                            <Input
                                                id="nama_barang"
                                                name="nama_barang"
                                                value={formData.nama_barang}
                                                onChange={handleInputChange}
                                                className="col-span-3 text-xs h-8"
                                            />
                                        </div>

                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label
                                                htmlFor="base_code"
                                                className="text-right text-xs"
                                            >
                                                Kode Unit
                                            </Label>
                                            <Input
                                                id="base_code"
                                                value={unitData.base_code}
                                                onChange={(e) =>
                                                    setUnitData({
                                                        ...unitData,
                                                        base_code:
                                                            e.target.value.toUpperCase(),
                                                    })
                                                }
                                                placeholder="Kode Unit untuk unit baru"
                                                className="col-span-3 text-xs h-8"
                                            />
                                        </div>

                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label
                                                htmlFor="additional_units"
                                                className="text-right text-xs"
                                            >
                                                Tambah Unit
                                            </Label>
                                            <Input
                                                id="additional_units"
                                                type="number"
                                                min="0"
                                                value={
                                                    unitData.additional_units
                                                }
                                                onChange={(e) =>
                                                    setUnitData({
                                                        ...unitData,
                                                        additional_units:
                                                            parseInt(
                                                                e.target.value
                                                            ) || 0,
                                                    })
                                                }
                                                className="col-span-3 text-xs h-8"
                                            />
                                        </div>

                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label
                                                htmlFor="status"
                                                className="text-right text-xs"
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
                                                <SelectTrigger className="col-span-3 text-xs h-8">
                                                    <SelectValue placeholder="Pilih Status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {statusOptions.map(
                                                        (stat) => (
                                                            <SelectItem
                                                                key={stat}
                                                                value={stat}
                                                                className="text-xs"
                                                            >
                                                                {stat}
                                                            </SelectItem>
                                                        )
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label
                                                htmlFor="id_kategori"
                                                className="text-right text-xs"
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
                                                <SelectTrigger className="col-span-3 text-xs h-8">
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
                                                    {categories.map(
                                                        (category) => (
                                                            <SelectItem
                                                                key={
                                                                    category.id
                                                                }
                                                                value={
                                                                    category.id
                                                                }
                                                                className="text-xs"
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
                                                className="text-right text-xs"
                                            >
                                                Gambar
                                            </Label>
                                            <div className="col-span-3">
                                                <ImageUpload
                                                    onImageChange={(file) => {
                                                        setIsImageUploadOpen(
                                                            true
                                                        );
                                                        handleImageChange(file);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label
                                                htmlFor="deskripsi"
                                                className="text-right text-xs"
                                            >
                                                Deskripsi
                                            </Label>
                                            <Textarea
                                                id="deskripsi"
                                                name="deskripsi"
                                                value={formData.deskripsi || ""}
                                                onChange={handleInputChange}
                                                className="col-span-3 min-h-[80px] text-xs"
                                                rows={2}
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
                                                className="text-xs h-8"
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
                </>
            );
        },
    },
];

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ColumnDef } from "@tanstack/react-table";
import {
    MoreHorizontal,
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
    held_units: number;
    created_at: string;
    image?: string | null;
};

export const columns = (categories: Category[]): ColumnDef<Item>[] => [
    {
        header: "No",
        size: 30, // Reduced from 40
        cell: ({ row }) => {
            return (
                <div className="font-bold text-[10px] text-center">
                    {row.index + 1}
                </div>
            );
        },
    },
    {
        accessorKey: "image",
        header: "Gambar",
        size: 50, // Reduced from 60
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
                <div className="flex justify-center">
                    <img
                        className="rounded"
                        src={imageUrl}
                        alt="Item"
                        onError={() => setImageError(true)}
                        style={{
                            width: "32px", // Reduced from 40px
                            height: "32px", // Reduced from 40px
                            objectFit: "cover",
                        }}
                    />
                </div>
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
                    className="text-[11px] p-0 h-6" // More compact
                >
                    Nama Barang
                </Button>
            );
        },
        size: 130, // Reduced from 150
        cell: ({ row }) => {
            return (
                <div
                    className="text-[11px] font-medium truncate px-1" // Smaller text, added padding
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
                    className="text-[11px] p-0 h-6" // More compact
                >
                    Kode Unit
                </Button>
            );
        },
        size: 80, // Reduced from 100
        cell: ({ row }) => {
            return (
                <div
                    className="text-[11px] font-medium truncate px-1" // Smaller text, added padding
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
                    className="text-[11px] p-0 h-6" // More compact
                >
                    Status
                </Button>
            );
        },
        size: 100, // Reduced from 120
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
                    className={`text-center inline-block rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${bgColor}`} // Smaller padding and text
                >
                    {status}
                </div>
            );
        },
    },
    {
        accessorKey: "nama_kategori",
        header: "Kategori",
        size: 100, // Reduced from 120
        cell: ({ row }) => {
            return (
                <div
                    className="text-[11px] truncate px-1" // Smaller text, added padding
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
        size: 50, // Reduced from 60
        cell: ({ row }) => {
            const item = row.original;
            return (
                <div className="text-[11px] font-bold text-center">
                    {item.total_units}
                </div>
            );
        },
    },
    {
        accessorKey: "available_units",
        header: "Tersedia",
        size: 60, // Reduced from 70
        cell: ({ row }) => {
            const item = row.original;
            return (
                <div className="flex items-center justify-center text-[11px]">
                    <CheckCircle className="h-2.5 w-2.5 text-green-600 mr-0.5" />{" "}
                    {/* Smaller icon */}
                    {item.available_units}
                </div>
            );
        },
    },
    {
        accessorKey: "rented_units",
        header: "Disewa",
        size: 60, // Reduced from 70
        cell: ({ row }) => {
            const item = row.original;
            return (
                <div className="flex items-center justify-center text-[11px]">
                    <Clock className="h-2.5 w-2.5 text-blue-600 mr-0.5" />{" "}
                    {/* Smaller icon */}
                    {item.rented_units}
                </div>
            );
        },
    },
    {
        accessorKey: "broken_units",
        header: "Rusak",
        size: 60, // Reduced from 70
        cell: ({ row }) => {
            const item = row.original;
            return (
                <div className="flex items-center justify-center text-[11px]">
                    <AlertTriangle className="h-2.5 w-2.5 text-red-600 mr-0.5" />{" "}
                    {/* Smaller icon */}
                    {item.broken_units}
                </div>
            );
        },
    },
    {
        accessorKey: "held_units",
        header: "Ditahan",
        size: 60, // Reduced from 70
        cell: ({ row }) => {
            const item = row.original;
            return (
                <div className="flex items-center justify-center text-[11px]">
                    <Clock className="h-2.5 w-2.5 text-yellow-600 mr-0.5" />{" "}
                    {/* Smaller icon */}
                    {item.held_units}
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
                    className="text-[11px] p-0 h-6" // More compact
                >
                    Ditambahkan
                </Button>
            );
        },
        size: 100, // Reduced from 120
        cell: ({ row }) => {
            const date = new Date(row.original.created_at);
            return (
                <div className="text-[11px] px-1">
                    {" "}
                    {/* Smaller text, added padding */}
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
        size: 60, // Reduced from 80
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
                                        className="h-5 w-5 p-0" // Smaller button
                                    >
                                        <span className="sr-only">
                                            Open menu
                                        </span>
                                        <MoreHorizontal className="h-3.5 w-3.5" />{" "}
                                        {/* Smaller icon */}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    className="text-[11px]" // Smaller text
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

                            <AlertDialogContent className="max-w-[90vw] sm:max-w-md text-[13px]">
                                {" "}
                                {/* Slightly smaller text */}
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="text-[13px]">
                                        {" "}
                                        {/* Smaller text */}
                                        Apakah Anda Yakin?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription className="text-[11px]">
                                        {" "}
                                        {/* Smaller text */}
                                        Tindakan ini tidak dapat dibatalkan. Ini
                                        akan menghapus barang ini secara
                                        permanen dari server kami.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel className="text-[11px] h-7">
                                        {" "}
                                        {/* Smaller */}
                                        Batal
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        className="bg-red-600 text-[11px] h-7" // Smaller
                                        onClick={() => {
                                            router.delete(`items/${item.id}`, {
                                                onSuccess: (page: any) => {
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
                                <DialogContent className="max-w-[95vw] sm:max-w-md text-[13px]">
                                    {" "}
                                    {/* Slightly smaller text */}
                                    <DialogHeader>
                                        <DialogTitle className="text-[13px]">
                                            {" "}
                                            {/* Smaller text */}
                                            Ubah Data Barang
                                        </DialogTitle>
                                        <DialogDescription className="text-[11px]">
                                            {" "}
                                            {/* Smaller text */}
                                            Setelah selesai silahkan klik tombol
                                            ubah.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <form
                                        onSubmit={handleUpdate}
                                        className="space-y-3" // Reduced spacing
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();
                                            }
                                        }}
                                    >
                                        <div className="grid grid-cols-4 items-center gap-3">
                                            {" "}
                                            {/* Reduced gap */}
                                            <Label
                                                htmlFor="nama_barang"
                                                className="text-right text-[11px]" // Smaller text
                                            >
                                                Nama Barang
                                            </Label>
                                            <Input
                                                id="nama_barang"
                                                name="nama_barang"
                                                value={formData.nama_barang}
                                                onChange={handleInputChange}
                                                className="col-span-3 text-[11px] h-7" // Smaller
                                            />
                                        </div>

                                        <div className="grid grid-cols-4 items-center gap-3">
                                            {" "}
                                            {/* Reduced gap */}
                                            <Label
                                                htmlFor="base_code"
                                                className="text-right text-[11px]" // Smaller text
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
                                                className="col-span-3 text-[11px] h-7" // Smaller
                                            />
                                        </div>

                                        <div className="grid grid-cols-4 items-center gap-3">
                                            {" "}
                                            {/* Reduced gap */}
                                            <Label
                                                htmlFor="additional_units"
                                                className="text-right text-[11px]" // Smaller text
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
                                                className="col-span-3 text-[11px] h-7" // Smaller
                                            />
                                        </div>

                                        <div className="grid grid-cols-4 items-center gap-3">
                                            {" "}
                                            {/* Reduced gap */}
                                            <Label
                                                htmlFor="status"
                                                className="text-right text-[11px]" // Smaller text
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
                                                <SelectTrigger className="col-span-3 text-[11px] h-7">
                                                    {" "}
                                                    {/* Smaller */}
                                                    <SelectValue placeholder="Pilih Status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {statusOptions.map(
                                                        (stat) => (
                                                            <SelectItem
                                                                key={stat}
                                                                value={stat}
                                                                className="text-[11px]" // Smaller text
                                                            >
                                                                {stat}
                                                            </SelectItem>
                                                        )
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-3">
                                            {" "}
                                            {/* Reduced gap */}
                                            <Label
                                                htmlFor="id_kategori"
                                                className="text-right text-[11px]" // Smaller text
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
                                                <SelectTrigger className="col-span-3 text-[11px] h-7">
                                                    {" "}
                                                    {/* Smaller */}
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
                                                                className="text-[11px]" // Smaller text
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
                                        <div className="grid grid-cols-4 items-center gap-3">
                                            {" "}
                                            {/* Reduced gap */}
                                            <Label
                                                htmlFor="image"
                                                className="text-right text-[11px]" // Smaller text
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
                                        <div className="grid grid-cols-4 items-center gap-3">
                                            {" "}
                                            {/* Reduced gap */}
                                            <Label
                                                htmlFor="deskripsi"
                                                className="text-right text-[11px]" // Smaller text
                                            >
                                                Deskripsi
                                            </Label>
                                            <Textarea
                                                id="deskripsi"
                                                name="deskripsi"
                                                value={formData.deskripsi || ""}
                                                onChange={handleInputChange}
                                                className="col-span-3 min-h-[60px] text-[11px]" // Smaller
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
                                                className="text-[11px] h-7" // Smaller
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

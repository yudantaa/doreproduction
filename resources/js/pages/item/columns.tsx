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
            const item = row.original;
            const imageUrl = item.image
                ? `/storage/${item.image}`
                : `/placeholders/${getCategorySlug(
                      item.id_kategori,
                      categories
                  )}-placeholder.jpg`;

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
                </Button>
            );
        },
        cell: ({ getValue }) => {
            const status = getValue() as string;
            const bgColor =
                status === "Tersedia"
                    ? "bg-green-200 text-green-800"
                    : status === "Sedang Ditahan"
                    ? "bg-yellow-200 text-yellow-800"
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
            const deskripsi = (getValue() as string) || "";
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

            // States for broken item report
            const [isReportModalOpen, setIsReportModalOpen] = useState(false);
            const [reportDescription, setReportDescription] = useState("");
            const [reportImage, setReportImage] = useState<File | null>(null);

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

            const handleReportSubmit = async (e: React.FormEvent) => {
                e.preventDefault();
                try {
                    setIsSubmitting(true);
                    const formData = new FormData();
                    formData.append("item_id", item.id);
                    formData.append("description", reportDescription);
                    if (reportImage) {
                        formData.append("proof_image", reportImage);
                    }

                    router.post(
                        route("dashboard.broken-items.store"),
                        formData,
                        {
                            onSuccess: () => {
                                toast({
                                    description:
                                        "Laporan kerusakan berhasil dikirim. Stok berkurang 1.",
                                });
                                setIsReportModalOpen(false);
                                setReportDescription("");
                                setReportImage(null);
                            },
                            onError: (errors) => {
                                toast({
                                    description:
                                        errors.message ||
                                        "Gagal mengirim laporan.",
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
                        description: "Terjadi kesalahan saat mengirim laporan.",
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
                                        className="h-8 w-8 p-0"
                                    >
                                        <span className="sr-only">
                                            Open menu
                                        </span>
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
                                    <DropdownMenuItem
                                        onClick={() =>
                                            setIsReportModalOpen(true)
                                        }
                                    >
                                        Laporkan Kerusakan
                                    </DropdownMenuItem>
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
                                        akan menghapus barang ini secara
                                        permanen dari server kami.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Batal</AlertDialogCancel>
                                    <AlertDialogAction
                                        className="bg-red-600"
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

                    {/* Broken Item Report Dialog */}
                    <Dialog
                        open={isReportModalOpen}
                        onOpenChange={setIsReportModalOpen}
                    >
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Laporkan Barang Rusak</DialogTitle>
                                <DialogDescription>
                                    Jelaskan kerusakan pada {item.nama_barang}{" "}
                                    dan upload bukti foto jika ada.
                                </DialogDescription>
                            </DialogHeader>
                            <form
                                onSubmit={handleReportSubmit}
                                className="space-y-4"
                            >
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label
                                            htmlFor="reportDescription"
                                            className="text-right"
                                        >
                                            Deskripsi
                                        </Label>
                                        <Textarea
                                            id="reportDescription"
                                            value={reportDescription}
                                            onChange={(e) =>
                                                setReportDescription(
                                                    e.target.value
                                                )
                                            }
                                            className="col-span-3"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label
                                            htmlFor="proofImage"
                                            className="text-right"
                                        >
                                            Bukti Foto
                                        </Label>
                                        <Input
                                            id="proofImage"
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) =>
                                                setReportImage(
                                                    e.target.files?.[0] || null
                                                )
                                            }
                                            className="col-span-3"
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting
                                            ? "Mengirim..."
                                            : "Kirim Laporan"}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </>
            );
        },
    },
];

const getCategorySlug = (
    categoryId: string | number,
    categories: Category[]
) => {
    const category = categories.find((c) => c.id === Number(categoryId));
    if (!category) return "default";
    return category.nama_kategori
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "");
};

import React, { useState, useRef, useEffect } from "react";
import { router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ui/image-upload";
import {
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/hooks/use-toast";
import { Category } from "../category/columns";

interface AddItemFormProps {
    onClose: () => void;
    categories: Category[];
}

export const AddItemForm: React.FC<AddItemFormProps> = ({
    onClose,
    categories,
}) => {
    const { toast } = useToast();
    const status = ["Tersedia", "Tidak Tersedia"];
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);

    const [formData, setFormData] = useState({
        nama_barang: "",
        jumlah: 1,
        status: "Tersedia",
        deskripsi: "",
        id_kategori: "",
        image: "",
    });

    const handleDeskripsiChange = (
        e: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        setFormData({
            ...formData,
            deskripsi: e.target.value,
        });

        // Adjust textarea height dynamically
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    };

    const handleSubmit = () => {
        // Validate form data
        if (!formData.nama_barang.trim()) {
            toast({
                title: "Validasi Gagal",
                description: "Nama barang tidak boleh kosong.",
                variant: "destructive",
            });
            return;
        }

        if (formData.jumlah < 0) {
            toast({
                title: "Validasi Gagal",
                description: "Jumlah stok tidak valid.",
                variant: "destructive",
            });
            return;
        }
        if (!formData.id_kategori) {
            toast({
                title: "Validasi Gagal",
                description: "Kategori barang harus dipilih.",
                variant: "destructive",
            });
            return;
        }

        const submitData = new FormData();
        submitData.append("nama_barang", formData.nama_barang);
        submitData.append("jumlah", formData.jumlah.toString());
        submitData.append("status", formData.status);
        submitData.append("deskripsi", formData.deskripsi);
        submitData.append("id_kategori", formData.id_kategori);

        if (imageFile) {
            submitData.append("image", imageFile);
        }

        router.post("/items", submitData, {
            onSuccess: () => {
                toast({
                    description: "Barang baru berhasil ditambahkan.",
                });
                onClose();
            },
            onError: (errors) => {
                toast({
                    title: "Gagal Menambahkan Barang",
                    description: "Silakan periksa kembali input Anda.",
                    variant: "destructive",
                });
            },
        });
    };

    return (
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Tambah Barang Baru</DialogTitle>
                <DialogDescription>
                    Isi informasi barang yang ingin ditambahkan. Klik tambah
                    setelah selesai.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="nama_barang" className="text-right">
                        Nama Barang
                    </Label>
                    <Input
                        id="nama_barang"
                        value={formData.nama_barang}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                nama_barang: e.target.value,
                            })
                        }
                        placeholder="Masukkan nama barang"
                        className="col-span-3"
                    />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="jumlah" className="text-right">
                        Stok
                    </Label>
                    <Input
                        id="jumlah"
                        type="number"
                        value={formData.jumlah}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                jumlah: parseInt(e.target.value) || 0,
                            })
                        }
                        placeholder="Masukkan jumlah stok"
                        className="col-span-3"
                    />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="status" className="text-right">
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
                                <SelectItem key={stat} value={stat}>
                                    {stat}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="id_kategori" className="text-right">
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
                    <Label htmlFor="image" className="text-right">
                        Gambar
                    </Label>
                    <div className="col-span-3">
                        <ImageUpload onImageChange={setImageFile} />
                    </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="deskripsi" className="text-right">
                        Deskripsi
                    </Label>
                    <Textarea
                        ref={textareaRef}
                        id="deskripsi"
                        value={formData.deskripsi}
                        onChange={handleDeskripsiChange}
                        placeholder="Masukkan deskripsi barang"
                        className="col-span-3 min-h-[100px]"
                        rows={3}
                    />
                </div>
            </div>
            <DialogFooter>
                <Button type="submit" onClick={handleSubmit}>
                    Tambah Barang
                </Button>
            </DialogFooter>
        </DialogContent>
    );
};

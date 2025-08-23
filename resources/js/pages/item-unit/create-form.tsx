import React, { useState } from "react";
import { router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/hooks/use-toast";

interface AddItemUnitFormProps {
    onClose: () => void;
    items: any[];
}

export const AddItemUnitForm: React.FC<AddItemUnitFormProps> = ({
    onClose,
    items,
}) => {
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        id_barang: "",
        kode_unit: "",
        status: "Tersedia" as const,
    });

    const handleSubmit = () => {
        if (!formData.id_barang || !formData.kode_unit) {
            toast({
                title: "Validasi Gagal",
                description: "Semua field harus diisi.",
                variant: "destructive",
            });
            return;
        }

        router.post("item-units", formData, {
            onSuccess: () => {
                toast({
                    description: "Unit baru berhasil ditambahkan.",
                });
                onClose();
            },
            onError: (errors) => {
                toast({
                    title: "Gagal Menambahkan Unit",
                    description: "Silakan periksa kembali input Anda.",
                    variant: "destructive",
                });
            },
        });
    };

    return (
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Tambah Unit Baru</DialogTitle>
                <DialogDescription>
                    Isi informasi unit yang ingin ditambahkan. Klik tambah
                    setelah selesai.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="id_barang" className="text-right">
                        Barang
                    </Label>
                    <Select
                        onValueChange={(value) =>
                            setFormData({ ...formData, id_barang: value })
                        }
                        value={formData.id_barang}
                    >
                        <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Pilih Barang" />
                        </SelectTrigger>
                        <SelectContent>
                            {items.map((item) => (
                                <SelectItem key={item.id} value={item.id}>
                                    {item.nama_barang}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="kode_unit" className="text-right">
                        Kode Unit
                    </Label>
                    <Input
                        id="kode_unit"
                        value={formData.kode_unit}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                kode_unit: e.target.value,
                            })
                        }
                        placeholder="Masukkan kode unit"
                        className="col-span-3"
                    />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="status" className="text-right">
                        Status
                    </Label>
                    <Select
                        onValueChange={(value: any) =>
                            setFormData({ ...formData, status: value })
                        }
                        value={formData.status}
                    >
                        <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Pilih Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Tersedia">Tersedia</SelectItem>
                            <SelectItem value="Rusak">Rusak</SelectItem>
                            <SelectItem value="Dalam Perbaikan">
                                Dalam Perbaikan
                            </SelectItem>
                            <SelectItem value="Disewa">Disewa</SelectItem>
                            <SelectItem value="Tidak Tersedia">
                                Tidak Tersedia
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <DialogFooter>
                <Button type="submit" onClick={handleSubmit}>
                    Tambah Unit
                </Button>
            </DialogFooter>
        </DialogContent>
    );
};

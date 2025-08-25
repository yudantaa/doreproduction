import React, { useState, useEffect } from "react";
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
    const [unitNumber, setUnitNumber] = useState("");
    const [selectedItem, setSelectedItem] = useState<any>(null);

    useEffect(() => {
        if (selectedItem && unitNumber) {
            const newKodeUnit = `${selectedItem.base_code}-${unitNumber}`;
            setFormData((prev) => ({ ...prev, kode_unit: newKodeUnit }));
        } else {
            setFormData((prev) => ({ ...prev, kode_unit: "" }));
        }
    }, [selectedItem, unitNumber]);

    const handleSubmit = () => {
        if (!formData.id_barang || !unitNumber.trim()) {
            toast({
                title: "Validasi Gagal",
                description: "Barang dan nomor unit harus diisi.",
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
                console.log("Errors:", errors);
                toast({
                    title: "Gagal Menambahkan Unit",
                    description:
                        "Silakan periksa kembali input Anda. Mungkin kode unit sudah ada.",
                    variant: "destructive",
                });
            },
        });
    };

    const handleItemChange = (value: string) => {
        setFormData((prev) => ({ ...prev, id_barang: value }));
        const item = items.find((item) => item.id === value);
        setSelectedItem(item);
        setUnitNumber("");
    };

    const handleUnitNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setUnitNumber(value);
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
                        onValueChange={handleItemChange}
                        value={formData.id_barang}
                    >
                        <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Pilih Barang" />
                        </SelectTrigger>
                        <SelectContent>
                            {items.map((item) => (
                                <SelectItem key={item.id} value={item.id}>
                                    {item.nama_barang} ({item.base_code})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="unit_number" className="text-right">
                        Nomor Unit
                    </Label>
                    <div className="col-span-3">
                        <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-muted-foreground min-w-fit">
                                {selectedItem
                                    ? `${selectedItem.base_code}-`
                                    : "Pilih barang dulu"}
                            </span>
                            <Input
                                id="unit_number"
                                value={unitNumber}
                                onChange={handleUnitNumberChange}
                                placeholder="contoh: 001 atau 102"
                                disabled={!selectedItem}
                                className="flex-1"
                            />
                        </div>
                        {formData.kode_unit && (
                            <p className="text-xs text-muted-foreground mt-1">
                                Kode unit:{" "}
                                <span className="font-medium">
                                    {formData.kode_unit}
                                </span>
                            </p>
                        )}
                    </div>
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
                            <SelectItem value="Sedang Ditahan">
                                Sedang Ditahan
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

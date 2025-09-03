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
    itemUnits: any[]; // Tambahkan prop untuk itemUnits
}

export const AddItemUnitForm: React.FC<AddItemUnitFormProps> = ({
    onClose,
    items,
    itemUnits, // Terima prop itemUnits
}) => {
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        id_barang: "",
        kode_unit: "",
        status: "Tersedia" as const,
    });
    const [unitNumber, setUnitNumber] = useState("");
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [suggestedNumber, setSuggestedNumber] = useState("");

    useEffect(() => {
        if (selectedItem) {
            // Cari unit terakhir untuk item yang dipilih
            const unitsForItem = itemUnits.filter(
                (unit) => unit.id_barang == selectedItem.id
            );

            // Ekstrak angka dari kode unit dan cari yang tertinggi
            let maxNumber = 0;
            unitsForItem.forEach((unit) => {
                const parts = unit.kode_unit.split("-");
                const numberPart = parts[parts.length - 1];
                const number = parseInt(numberPart);
                if (!isNaN(number) && number > maxNumber) {
                    maxNumber = number;
                }
            });

            // Set angka saran sebagai angka tertinggi + 1
            const nextNumber = maxNumber + 1;
            setSuggestedNumber(nextNumber.toString());

            // Set unitNumber ke angka saran jika belum diisi
            if (!unitNumber) {
                setUnitNumber(nextNumber.toString());
            }
        }
    }, [selectedItem, itemUnits]);

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
        setUnitNumber(""); // Reset unit number ketika item berubah
    };

    const handleUnitNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Hanya memperbolehkan angka
        if (/^\d*$/.test(value)) {
            setUnitNumber(value);
        }
    };

    const useSuggestion = () => {
        setUnitNumber(suggestedNumber);
    };

    return (
        <DialogContent className="sm:max-w-[500px]">
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
                    <div className="col-span-3 space-y-2">
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
                                placeholder="Masukkan nomor unit"
                                disabled={!selectedItem}
                                className="flex-1"
                            />
                        </div>

                        {suggestedNumber && (
                            <div className="flex items-center text-sm text-muted-foreground">
                                <span>
                                    Saran: {selectedItem.base_code}-
                                    {suggestedNumber}
                                </span>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="ml-2 h-6 px-2"
                                    onClick={useSuggestion}
                                >
                                    Gunakan
                                </Button>
                            </div>
                        )}

                        {formData.kode_unit && (
                            <p className="text-xs text-muted-foreground">
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

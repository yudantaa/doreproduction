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
import { useToast } from "@/components/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LoanCreateFormProps {
    items: Array<{
        id: string;
        nama_barang: string;
        jumlah: number;
    }>;
    onClose?: () => void;
}

const LoanCreateForm: React.FC<LoanCreateFormProps> = ({ items, onClose }) => {
    const [formData, setFormData] = useState({
        nama_penyewa: "",
        no_tlp_penyewa: "",
        id_barang: "",
        tanggal_sewa: new Date().toISOString().split("T")[0],
        deadline_pengembalian: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const { toast } = useToast();
    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.nama_penyewa) {
            newErrors.nama_penyewa = "Nama penyewa harus diisi";
        }

        if (!formData.no_tlp_penyewa) {
            newErrors.no_tlp_penyewa = "Nomor telepon harus diisi";
        } else if (!/^[0-9]+$/.test(formData.no_tlp_penyewa)) {
            newErrors.no_tlp_penyewa = "Nomor telepon harus berupa angka";
        }

        if (!formData.id_barang) {
            newErrors.id_barang = "Barang harus dipilih";
        }

        if (
            formData.deadline_pengembalian &&
            new Date(formData.deadline_pengembalian) <=
                new Date(formData.tanggal_sewa)
        ) {
            newErrors.deadline_pengembalian =
                "Deadline harus setelah tanggal sewa";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Clear error when field changes
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        router.post("loans", formData, {
            onSuccess: () => {
                toast({ description: "Peminjaman berhasil ditambahkan" });
                setFormData({
                    nama_penyewa: "",
                    no_tlp_penyewa: "",
                    id_barang: "",
                    tanggal_sewa: new Date().toISOString().split("T")[0],
                    deadline_pengembalian: "",
                });
                if (onClose) onClose();
            },
            onError: (errors) => {
                Object.values(errors).forEach((error) => {
                    toast({
                        description: error as string,
                        variant: "destructive",
                    });
                });
            },
        });
    };

    return (
        <Card className="w-full max-w-2xl mx-auto border border-border">
            <CardHeader>
                <CardTitle className="text-xl font-semibold text-foreground">
                    Form Tambah Peminjaman
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="nama_penyewa">Nama Penyewa</Label>
                            <Input
                                type="text"
                                id="nama_penyewa"
                                name="nama_penyewa"
                                value={formData.nama_penyewa}
                                onChange={handleInputChange}
                                placeholder="Masukkan nama penyewa"
                                className="bg-background"
                                required
                            />
                            {errors.nama_penyewa && (
                                <p className="text-sm text-destructive mt-1">
                                    {errors.nama_penyewa}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="no_tlp_penyewa">
                                Nomor Telepon
                            </Label>
                            <Input
                                type="tel"
                                id="no_tlp_penyewa"
                                name="no_tlp_penyewa"
                                value={formData.no_tlp_penyewa}
                                onChange={handleInputChange}
                                placeholder="contoh: 62890000000"
                                className="bg-background"
                                required
                            />
                            {errors.no_tlp_penyewa && (
                                <p className="text-sm text-destructive mt-1">
                                    {errors.no_tlp_penyewa}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="id_barang">Barang</Label>
                            <Select
                                name="id_barang"
                                value={formData.id_barang}
                                onValueChange={(value) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        id_barang: value,
                                    }))
                                }
                                required
                            >
                                <SelectTrigger className="bg-background">
                                    <SelectValue placeholder="Pilih Barang">
                                        {items.find(
                                            (i) =>
                                                i.id.toString() ===
                                                formData.id_barang
                                        )?.nama_barang || "Pilih Barang"}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent className="bg-background">
                                    {items.map((item) => (
                                        <SelectItem
                                            key={item.id}
                                            value={item.id.toString()}
                                            disabled={item.jumlah <= 0}
                                        >
                                            <div className="flex justify-between w-full">
                                                <span>{item.nama_barang}</span>
                                                <span className="text-muted-foreground">
                                                    Tersedia: {item.jumlah}
                                                </span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.id_barang && (
                                <p className="text-sm text-destructive mt-1">
                                    {errors.id_barang}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="tanggal_sewa">Tanggal Sewa</Label>
                            <Input
                                type="date"
                                id="tanggal_sewa"
                                name="tanggal_sewa"
                                value={formData.tanggal_sewa}
                                onChange={handleInputChange}
                                className="bg-background"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="deadline_pengembalian">
                                Deadline Pengembalian
                            </Label>
                            <Input
                                type="date"
                                id="deadline_pengembalian"
                                name="deadline_pengembalian"
                                value={formData.deadline_pengembalian}
                                onChange={handleInputChange}
                                min={formData.tanggal_sewa}
                                className="bg-background"
                                required
                            />
                            {errors.deadline_pengembalian && (
                                <p className="text-sm text-destructive mt-1">
                                    {errors.deadline_pengembalian}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            variant="outline"
                            type="button"
                            onClick={() => onClose && onClose()}
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            className="bg-primary hover:bg-primary/90"
                        >
                            Tambah Peminjaman
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default LoanCreateForm;

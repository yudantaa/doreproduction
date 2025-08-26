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
import { format } from "date-fns";

interface LoanCreateFormProps {
    availableUnits: Array<{
        id: string;
        kode_unit: string;
        nama_barang: string;
        item_id: string;
    }>;
    items: Array<{
        id: string;
        nama_barang: string;
        available_units: number;
    }>;
    onClose?: () => void;
}

// Validation functions matching backend exactly
const validateName = (name: string): string | null => {
    if (!name.trim()) return "Nama penyewa harus diisi";
    if (name.length > 255) return "Nama maksimal 255 karakter";
    if (!/^[a-zA-Z\s.]+$/.test(name.trim())) {
        return "Nama hanya boleh berisi huruf, spasi, dan titik";
    }
    return null;
};

const validatePhone = (phone: string): string | null => {
    if (!phone.trim()) return "Nomor telepon harus diisi";
    if (phone.length > 20) return "Nomor telepon maksimal 20 karakter";
    if (!/^[0-9+\-\s()]+$/.test(phone)) {
        return "Nomor telepon hanya boleh berisi angka, +, -, spasi, dan kurung";
    }
    return null;
};

const validateDates = (
    tanggalSewa: string,
    deadline: string
): { tanggalSewa?: string; deadline?: string } => {
    const errors: { tanggalSewa?: string; deadline?: string } = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const sewaDate = new Date(tanggalSewa);
    const deadlineDate = new Date(deadline);
    const maxDeadline = new Date();
    maxDeadline.setMonth(maxDeadline.getMonth() + 3);

    // Rental date must be today or later for new loans
    if (sewaDate < today) {
        errors.tanggalSewa = "Tanggal sewa minimal hari ini";
    }

    if (deadlineDate <= sewaDate) {
        errors.deadline = "Deadline harus setelah tanggal sewa";
    }

    if (deadlineDate > maxDeadline) {
        errors.deadline = "Deadline maksimal 3 bulan dari sekarang";
    }

    return errors;
};

const LoanCreateForm: React.FC<LoanCreateFormProps> = ({
    availableUnits,
    items,
    onClose,
}) => {
    const [formData, setFormData] = useState({
        nama_penyewa: "",
        no_tlp_penyewa: "",
        item_id: "",
        quantity: 1,
        tanggal_sewa: new Date().toISOString().split("T")[0],
        deadline_pengembalian: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    // Filter available units based on selected item
    const filteredUnits = availableUnits.filter(
        (unit) => unit.item_id === formData.item_id
    );
    const selectedItem = items.find(
        (item) => item.id.toString() === formData.item_id
    );

    const maxQuantity = selectedItem ? selectedItem.available_units : 0;

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        // Validate name
        const nameError = validateName(formData.nama_penyewa);
        if (nameError) newErrors.nama_penyewa = nameError;

        // Validate phone
        const phoneError = validatePhone(formData.no_tlp_penyewa);
        if (phoneError) newErrors.no_tlp_penyewa = phoneError;

        // Validate item selection
        if (!formData.item_id) {
            newErrors.item_id = "Barang harus dipilih";
        }

        // Validate quantity
        if (!formData.quantity || formData.quantity < 1) {
            newErrors.quantity = "Jumlah unit harus minimal 1";
        } else if (formData.quantity > maxQuantity) {
            newErrors.quantity = `Jumlah unit tidak boleh melebihi ${maxQuantity}`;
        }

        // Validate required dates
        if (!formData.tanggal_sewa) {
            newErrors.tanggal_sewa = "Tanggal sewa harus diisi";
        }

        if (!formData.deadline_pengembalian) {
            newErrors.deadline_pengembalian =
                "Deadline pengembalian harus diisi";
        }

        // Validate date logic if both dates are provided
        if (formData.tanggal_sewa && formData.deadline_pengembalian) {
            const dateErrors = validateDates(
                formData.tanggal_sewa,
                formData.deadline_pengembalian
            );
            Object.assign(newErrors, dateErrors);
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

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
            quantity: 1, // Reset quantity when item changes
        }));

        // Clear error when field changes
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            toast({
                title: "Error Validasi",
                description: "Mohon periksa kembali data yang dimasukkan",
                variant: "destructive",
            });
            return;
        }

        setIsSubmitting(true);

        // Prepare data with trimmed name
        const submitData = {
            ...formData,
            nama_penyewa: formData.nama_penyewa.trim(),
        };

        router.post("loans", submitData, {
            onSuccess: () => {
                toast({
                    title: "Berhasil",
                    description: "Penyewaan berhasil ditambahkan.",
                });
                setFormData({
                    nama_penyewa: "",
                    no_tlp_penyewa: "",
                    item_id: "",
                    quantity: 1,
                    tanggal_sewa: new Date().toISOString().split("T")[0],
                    deadline_pengembalian: "",
                });
                setErrors({});
                if (onClose) onClose();
            },
            onError: (serverErrors) => {
                // Handle server validation errors
                const errorMessages: Record<string, string> = {};

                Object.entries(serverErrors).forEach(([key, message]) => {
                    if (Array.isArray(message)) {
                        errorMessages[key] = message[0];
                    } else {
                        errorMessages[key] = message as string;
                    }
                });

                setErrors(errorMessages);

                // Show first error as toast
                const firstError = Object.values(errorMessages)[0];
                if (firstError) {
                    toast({
                        title: "Error",
                        description: firstError,
                        variant: "destructive",
                    });
                }
            },
            onFinish: () => {
                setIsSubmitting(false);
            },
        });
    };

    // Calculate min and max dates
    const today = format(new Date(), "yyyy-MM-dd");
    const maxDeadline = format(
        new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        "yyyy-MM-dd"
    );

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
                            <Label htmlFor="nama_penyewa">Nama Penyewa *</Label>
                            <Input
                                type="text"
                                id="nama_penyewa"
                                name="nama_penyewa"
                                value={formData.nama_penyewa}
                                onChange={handleInputChange}
                                placeholder="Masukkan nama penyewa"
                                className={`bg-background ${
                                    errors.nama_penyewa
                                        ? "border-destructive"
                                        : ""
                                }`}
                                maxLength={255}
                                required
                            />
                            {errors.nama_penyewa && (
                                <p className="text-sm text-destructive mt-1">
                                    {errors.nama_penyewa}
                                </p>
                            )}
                            <p className="text-xs text-muted-foreground">
                                Hanya huruf, spasi, dan titik. Maksimal 255
                                karakter.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="no_tlp_penyewa">
                                Nomor Telepon *
                            </Label>
                            <Input
                                type="tel"
                                id="no_tlp_penyewa"
                                name="no_tlp_penyewa"
                                value={formData.no_tlp_penyewa}
                                onChange={handleInputChange}
                                placeholder="contoh: 62890000000"
                                className={`bg-background ${
                                    errors.no_tlp_penyewa
                                        ? "border-destructive"
                                        : ""
                                }`}
                                maxLength={20}
                                required
                            />
                            {errors.no_tlp_penyewa && (
                                <p className="text-sm text-destructive mt-1">
                                    {errors.no_tlp_penyewa}
                                </p>
                            )}
                            <p className="text-xs text-muted-foreground">
                                Angka, +, -, spasi, kurung. Maksimal 20
                                karakter.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="item_id">Pilih Barang *</Label>
                            <Select
                                value={formData.item_id}
                                onValueChange={(value) =>
                                    handleSelectChange("item_id", value)
                                }
                                required
                            >
                                <SelectTrigger
                                    className={`bg-background ${
                                        errors.item_id
                                            ? "border-destructive"
                                            : ""
                                    }`}
                                >
                                    <SelectValue placeholder="Pilih Barang" />
                                </SelectTrigger>
                                <SelectContent className="bg-background">
                                    {items.map((item) => (
                                        <SelectItem
                                            key={item.id}
                                            value={item.id.toString()}
                                        >
                                            <div className="flex justify-between w-full">
                                                <span>{item.nama_barang}</span>
                                                <span className="text-muted-foreground">
                                                    ({item.available_units}{" "}
                                                    tersedia)
                                                </span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.item_id && (
                                <p className="text-sm text-destructive mt-1">
                                    {errors.item_id}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="quantity">Jumlah Unit *</Label>
                            <Input
                                type="number"
                                id="quantity"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleInputChange}
                                min="1"
                                max={maxQuantity}
                                className={`bg-background ${
                                    errors.quantity ? "border-destructive" : ""
                                }`}
                                required
                                disabled={!formData.item_id}
                            />
                            {errors.quantity && (
                                <p className="text-sm text-destructive mt-1">
                                    {errors.quantity}
                                </p>
                            )}
                            <p className="text-xs text-muted-foreground">
                                Maksimal: {maxQuantity} unit
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="tanggal_sewa">Tanggal Sewa *</Label>
                            <Input
                                type="date"
                                id="tanggal_sewa"
                                name="tanggal_sewa"
                                value={formData.tanggal_sewa}
                                onChange={handleInputChange}
                                min={today}
                                className={`bg-background ${
                                    errors.tanggal_sewa
                                        ? "border-destructive"
                                        : ""
                                }`}
                                required
                            />
                            {errors.tanggal_sewa && (
                                <p className="text-sm text-destructive mt-1">
                                    {errors.tanggal_sewa}
                                </p>
                            )}
                            <p className="text-xs text-muted-foreground">
                                Minimal hari ini
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="deadline_pengembalian">
                                Deadline Pengembalian *
                            </Label>
                            <Input
                                type="date"
                                id="deadline_pengembalian"
                                name="deadline_pengembalian"
                                value={formData.deadline_pengembalian}
                                onChange={handleInputChange}
                                min={formData.tanggal_sewa || today}
                                max={maxDeadline}
                                className={`bg-background ${
                                    errors.deadline_pengembalian
                                        ? "border-destructive"
                                        : ""
                                }`}
                                required
                            />
                            {errors.deadline_pengembalian && (
                                <p className="text-sm text-destructive mt-1">
                                    {errors.deadline_pengembalian}
                                </p>
                            )}
                            <p className="text-xs text-muted-foreground">
                                Setelah tanggal sewa, maksimal 3 bulan dari
                                sekarang
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            variant="outline"
                            type="button"
                            onClick={() => onClose && onClose()}
                            disabled={isSubmitting}
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            className="bg-primary hover:bg-primary/90"
                            disabled={isSubmitting}
                        >
                            {isSubmitting
                                ? "Menyimpan..."
                                : "Tambah Peminjaman"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default LoanCreateForm;

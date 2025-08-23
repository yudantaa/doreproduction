import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Head, Link, useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface ItemWithUnits {
    id: number;
    nama_barang: string;
    image?: string;
    units: Array<{
        id: number;
        kode_unit: string;
        status: string;
    }>;
}

interface CreateBrokenItemProps {
    itemsWithUnits: ItemWithUnits[];
    selectedItemUnit?: {
        id: number;
        kode_unit: string;
        item: {
            id: number;
            nama_barang: string;
        };
    };
}

export default function CreateBrokenItem({
    itemsWithUnits,
    selectedItemUnit,
}: CreateBrokenItemProps) {
    const [selectedItemId, setSelectedItemId] = useState<string>(
        selectedItemUnit?.item.id.toString() || ""
    );
    const [availableUnits, setAvailableUnits] = useState(
        selectedItemUnit
            ? [
                  {
                      id: selectedItemUnit.id,
                      kode_unit: selectedItemUnit.kode_unit,
                      status: "Tersedia",
                  },
              ]
            : []
    );

    const { data, setData, post, processing, errors, reset } = useForm({
        id_item_unit: selectedItemUnit?.id.toString() || "",
        description: "",
        proof_image: null as File | null,
    });

    const handleItemChange = (itemId: string) => {
        setSelectedItemId(itemId);
        setData("id_item_unit", "");

        const selectedItem = itemsWithUnits.find(
            (item) => item.id.toString() === itemId
        );
        setAvailableUnits(selectedItem?.units || []);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("dashboard.broken-items.store"), {
            onSuccess: () => {
                reset();
            },
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Laporkan Barang Rusak" />
            <div className="container mx-auto py-6 px-4">
                <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
                    <h1 className="text-2xl font-bold text-foreground">
                        Laporkan Barang Rusak
                    </h1>
                    <Button asChild variant="outline">
                        <Link href={route("dashboard.broken-items.index")}>
                            Kembali
                        </Link>
                    </Button>
                </div>

                <div className="bg-card rounded-lg shadow p-6 border">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {!selectedItemUnit && (
                            <>
                                {/* Item Selection */}
                                <div className="space-y-2">
                                    <Label htmlFor="item_select">
                                        Pilih Barang
                                    </Label>
                                    <select
                                        id="item_select"
                                        value={selectedItemId}
                                        onChange={(e) =>
                                            handleItemChange(e.target.value)
                                        }
                                        className="w-full p-3 border rounded-md bg-background text-foreground"
                                        required
                                    >
                                        <option value="">Pilih Barang</option>
                                        {itemsWithUnits.map((item) => (
                                            <option
                                                key={item.id}
                                                value={item.id}
                                            >
                                                {item.nama_barang} (
                                                {item.units.length} unit
                                                tersedia)
                                            </option>
                                        ))}
                                    </select>
                                    {errors.id_item_unit &&
                                        !data.id_item_unit && (
                                            <p className="text-red-500 text-sm">
                                                Silakan pilih barang terlebih
                                                dahulu
                                            </p>
                                        )}
                                </div>

                                {/* Unit Selection */}
                                {selectedItemId &&
                                    availableUnits.length > 0 && (
                                        <div className="space-y-2">
                                            <Label htmlFor="id_item_unit">
                                                Pilih Unit
                                            </Label>
                                            <select
                                                id="id_item_unit"
                                                value={data.id_item_unit}
                                                onChange={(e) =>
                                                    setData(
                                                        "id_item_unit",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full p-3 border rounded-md bg-background text-foreground"
                                                required
                                            >
                                                <option value="">
                                                    Pilih Unit
                                                </option>
                                                {availableUnits.map((unit) => (
                                                    <option
                                                        key={unit.id}
                                                        value={unit.id}
                                                    >
                                                        {unit.kode_unit} -{" "}
                                                        {unit.status}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.id_item_unit && (
                                                <p className="text-red-500 text-sm">
                                                    {errors.id_item_unit}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                {selectedItemId &&
                                    availableUnits.length === 0 && (
                                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                                            <p className="text-yellow-800 text-sm">
                                                Tidak ada unit yang tersedia
                                                untuk barang ini.
                                            </p>
                                        </div>
                                    )}
                            </>
                        )}

                        {/* Pre-selected Unit Info */}
                        {selectedItemUnit && (
                            <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                                <h3 className="font-medium text-blue-900 mb-2">
                                    Unit yang Dipilih:
                                </h3>
                                <p className="text-blue-800">
                                    <strong>
                                        {selectedItemUnit.item.nama_barang}
                                    </strong>{" "}
                                    - Unit: {selectedItemUnit.kode_unit}
                                </p>
                                <input
                                    type="hidden"
                                    value={selectedItemUnit.id}
                                    onChange={(e) =>
                                        setData("id_item_unit", e.target.value)
                                    }
                                />
                            </div>
                        )}

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description">
                                Deskripsi Kerusakan{" "}
                                <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="description"
                                value={data.description}
                                onChange={(e) =>
                                    setData("description", e.target.value)
                                }
                                className="bg-background text-foreground min-h-[100px]"
                                placeholder="Jelaskan detail kerusakan yang ditemukan..."
                                required
                            />
                            {errors.description && (
                                <p className="text-red-500 text-sm">
                                    {errors.description}
                                </p>
                            )}
                        </div>

                        {/* Proof Image */}
                        <div className="space-y-2">
                            <Label htmlFor="proof_image">
                                Bukti Foto Kerusakan (Opsional)
                            </Label>
                            <Input
                                id="proof_image"
                                type="file"
                                accept="image/*"
                                className="bg-background text-foreground"
                                onChange={(e) =>
                                    setData(
                                        "proof_image",
                                        e.target.files?.[0] || null
                                    )
                                }
                            />
                            <p className="text-sm text-muted-foreground">
                                Format yang didukung: JPG, PNG, WebP. Maksimal
                                5MB.
                            </p>
                            {errors.proof_image && (
                                <p className="text-red-500 text-sm">
                                    {errors.proof_image}
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                disabled={
                                    processing ||
                                    (!selectedItemUnit && !data.id_item_unit)
                                }
                                className="w-full sm:w-auto"
                            >
                                {processing ? "Mengirim..." : "Kirim Laporan"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

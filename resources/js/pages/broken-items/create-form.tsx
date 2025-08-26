import React, { useState, useRef } from "react";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Head, Link, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/hooks/use-toast";

interface ItemWithUnits {
    id: number;
    nama_barang: string;
    units: Array<{
        id: number;
        kode_unit: string;
        status: string;
    }>;
}

interface CreateBrokenItemProps {
    itemsWithUnits: ItemWithUnits[];
}

export default function CreateBrokenItem({
    itemsWithUnits,
}: CreateBrokenItemProps) {
    const { toast } = useToast();
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const [formData, setFormData] = useState({
        id_item: "",
        id_item_unit: "",
        description: "",
    });

    const [proofImage, setProofImage] = useState<File | null>(null);

    const handleDescriptionChange = (
        e: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        setFormData({ ...formData, description: e.target.value });

        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // 🔹 Frontend validation
        if (!formData.id_item) {
            toast({
                title: "Validasi Gagal",
                description: "Barang harus dipilih.",
                variant: "destructive",
            });
            return;
        }
        if (!formData.id_item_unit) {
            toast({
                title: "Validasi Gagal",
                description: "Unit barang harus dipilih.",
                variant: "destructive",
            });
            return;
        }
        if (!formData.description.trim() || formData.description.length < 10) {
            toast({
                title: "Validasi Gagal",
                description: "Deskripsi minimal 10 karakter.",
                variant: "destructive",
            });
            return;
        }
        if (proofImage) {
            const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
            if (!allowedTypes.includes(proofImage.type)) {
                toast({
                    title: "Validasi Gagal",
                    description:
                        "Format gambar tidak valid (hanya JPG, PNG, WebP).",
                    variant: "destructive",
                });
                return;
            }
            if (proofImage.size > 2 * 1024 * 1024) {
                toast({
                    title: "Validasi Gagal",
                    description: "Ukuran gambar maksimal 2MB.",
                    variant: "destructive",
                });
                return;
            }
        }

        // 🔹 Kirim data
        const submitData = new FormData();
        submitData.append("id_item_unit", formData.id_item_unit);
        submitData.append("description", formData.description);
        if (proofImage) {
            submitData.append("proof_image", proofImage);
        }

        router.post(route("dashboard.broken-items.store"), submitData, {
            onSuccess: () => {
                toast({
                    description: "Laporan barang rusak berhasil dikirim.",
                });
                setFormData({ id_item: "", id_item_unit: "", description: "" });
                setProofImage(null);
            },
            onError: () => {
                toast({
                    title: "Gagal Mengirim Laporan",
                    description: "Silakan periksa kembali input Anda.",
                    variant: "destructive",
                });
            },
        });
    };

    const selectedItem = itemsWithUnits.find(
        (item) => item.id.toString() === formData.id_item
    );

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
                        {/* Pilih Barang */}
                        <div className="space-y-2">
                            <Label htmlFor="id_item">Pilih Barang</Label>
                            <select
                                id="id_item"
                                value={formData.id_item}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        id_item: e.target.value,
                                        id_item_unit: "",
                                    })
                                }
                                className="w-full p-3 border rounded-md bg-background text-foreground"
                            >
                                <option value="">Pilih Barang</option>
                                {itemsWithUnits.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.nama_barang} ({item.units.length}{" "}
                                        unit tersedia)
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Pilih Unit */}
                        <div className="space-y-2">
                            <Label htmlFor="id_item_unit">Pilih Unit</Label>
                            <select
                                id="id_item_unit"
                                value={formData.id_item_unit}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        id_item_unit: e.target.value,
                                    })
                                }
                                className="w-full p-3 border rounded-md bg-background text-foreground"
                                disabled={!formData.id_item}
                            >
                                <option value="">Pilih Unit</option>
                                {selectedItem?.units.map((unit) => (
                                    <option key={unit.id} value={unit.id}>
                                        {unit.kode_unit} - {unit.status}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Deskripsi */}
                        <div className="space-y-2">
                            <Label htmlFor="description">
                                Deskripsi Kerusakan
                            </Label>
                            <Textarea
                                ref={textareaRef}
                                id="description"
                                value={formData.description}
                                onChange={handleDescriptionChange}
                                className="bg-background text-foreground min-h-[100px]"
                                placeholder="Jelaskan detail kerusakan yang ditemukan..."
                            />
                        </div>

                        {/* Foto Bukti */}
                        <div className="space-y-2">
                            <Label htmlFor="proof_image">
                                Bukti Foto (Opsional)
                            </Label>
                            <Input
                                id="proof_image"
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    setProofImage(e.target.files?.[0] || null)
                                }
                                className="bg-background text-foreground"
                            />
                            <p className="text-sm text-muted-foreground">
                                Format didukung: JPG, PNG, WebP. Maks 2MB.
                            </p>
                        </div>

                        {/* Tombol Submit */}
                        <div className="flex justify-end">
                            <Button type="submit" className="w-full sm:w-auto">
                                Kirim Laporan
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

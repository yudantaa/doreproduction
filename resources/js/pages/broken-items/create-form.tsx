import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Head, Link, useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CreateBrokenItemProps {
    item_id?: string;
    items: Array<{
        id: string;
        nama_barang: string;
    }>;
}

export default function CreateBrokenItem({
    item_id,
    items,
}: CreateBrokenItemProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        item_id: item_id || "",
        description: "",
        proof_image: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("dashboard.broken-items.store"), {
            onSuccess: () => {
                toast({
                    title: "Laporan berhasil dibuat",
                    description: "Barang rusak berhasil dilaporkan",
                });
                reset();
            },
            onError: () => {
                toast({
                    title: "Gagal membuat laporan",
                    description: "Terjadi kesalahan saat mengirim laporan",
                    variant: "destructive",
                });
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
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!item_id && (
                            <div className="space-y-2">
                                <Label htmlFor="item_id">Barang</Label>
                                <select
                                    id="item_id"
                                    value={data.item_id}
                                    onChange={(e) =>
                                        setData("item_id", e.target.value)
                                    }
                                    className="w-full p-2 border rounded bg-background text-foreground"
                                    required
                                >
                                    <option value="">Pilih Barang</option>
                                    {items.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.nama_barang}
                                        </option>
                                    ))}
                                </select>
                                {errors.item_id && (
                                    <p className="text-red-500 text-sm">
                                        {errors.item_id}
                                    </p>
                                )}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="description">
                                Deskripsi Kerusakan
                            </Label>
                            <Textarea
                                id="description"
                                value={data.description}
                                onChange={(e) =>
                                    setData("description", e.target.value)
                                }
                                className="bg-background text-foreground"
                                required
                            />
                            {errors.description && (
                                <p className="text-red-500 text-sm">
                                    {errors.description}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="proof_image">
                                Bukti Foto (Opsional)
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
                            {errors.proof_image && (
                                <p className="text-red-500 text-sm">
                                    {errors.proof_image}
                                </p>
                            )}
                        </div>

                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                disabled={processing}
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

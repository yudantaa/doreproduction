import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { router } from "@inertiajs/react";
import { useToast } from "@/components/hooks/use-toast";

interface CreateCategoryProps {
    onSuccessfulCreate?: () => void;
    onClose?: () => void;
}

export function CreateCategory({
    onSuccessfulCreate,
    onClose,
}: CreateCategoryProps) {
    const [formData, setFormData] = useState({
        nama_kategori: "",
    });
    const { toast } = useToast();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        router.post("categories", formData, {
            onSuccess: () => {
                toast({
                    description: "Data berhasil dibuat.",
                });
                onSuccessfulCreate?.();
                onClose?.();
            },
            onError: (errors) => {
                toast({
                    title: "Gagal Menyimpan Data",
                    description:
                        "Data ini sudah ada, silakan periksa kembali input Anda.",
                    variant: "destructive",
                });
            },
        });
    };

    return (
        <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nama_kategori" className="text-right">
                    Nama Kategori
                </Label>
                <Input
                    id="nama_kategori"
                    value={formData.nama_kategori}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            nama_kategori: e.target.value,
                        })
                    }
                    className="col-span-3"
                    required
                />
            </div>
            <Button type="submit" onClick={handleSubmit}>
                Buat
            </Button>
        </div>
    );
}

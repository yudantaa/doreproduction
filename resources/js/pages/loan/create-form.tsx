import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LoanCreateFormProps {
    items: Array<{
        id: string;
        nama_barang: string;
        jumlah: number;
    }>;
}

const LoanCreateForm: React.FC<LoanCreateFormProps> = ({ items }) => {
    const [formData, setFormData] = useState({
        nama_penyewa: '',
        no_tlp_penyewa: '',
        id_barang: '',
        tanggal_sewa: new Date().toISOString().split('T')[0],
        deadline_pengembalian: ''
    });

    const { toast } = useToast();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        router.post('/loans', formData, {
            onSuccess: () => {
                toast({ description: "Peminjaman berhasil ditambahkan" });
                setFormData({
                    nama_penyewa: '',
                    no_tlp_penyewa: '',
                    id_barang: '',
                    tanggal_sewa: new Date().toISOString().split('T')[0],
                    deadline_pengembalian: ''
                });
            },
            onError: (errors) => {
                Object.values(errors).forEach(error => {
                    toast({
                        description: error as string,
                        variant: "destructive"
                    });
                });
            }
        });
    };

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Form Tambah Peminjaman</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="nama_penyewa" className="block mb-2">Nama Penyewa</label>
                        <Input
                            type="text"
                            id="nama_penyewa"
                            name="nama_penyewa"
                            value={formData.nama_penyewa}
                            onChange={handleInputChange}
                            placeholder="Masukkan nama penyewa"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="no_tlp_penyewa" className="block mb-2">Nomor Telepon</label>
                        <Input
                            type="tel"
                            id="no_tlp_penyewa"
                            name="no_tlp_penyewa"
                            value={formData.no_tlp_penyewa}
                            onChange={handleInputChange}
                            placeholder="Masukkan nomor telepon"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="id_barang" className="block mb-2">Barang</label>
                        <Select
                            name="id_barang"
                            value={formData.id_barang}
                            onValueChange={(value) => setFormData(prev => ({
                                ...prev,
                                id_barang: value
                            }))}
                            required
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Barang" />
                            </SelectTrigger>
                            <SelectContent>
                                {items.map(item => (
                                    <SelectItem
                                        key={item.id}
                                        value={item.id}
                                        disabled={item.jumlah <= 0}
                                    >
                                        {item.nama_barang} (Tersedia: {item.jumlah})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <label htmlFor="tanggal_sewa" className="block mb-2">Tanggal Sewa</label>
                        <Input
                            type="date"
                            id="tanggal_sewa"
                            name="tanggal_sewa"
                            value={formData.tanggal_sewa}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="deadline_pengembalian" className="block mb-2">Deadline Pengembalian</label>
                        <Input
                            type="date"
                            id="deadline_pengembalian"
                            name="deadline_pengembalian"
                            value={formData.deadline_pengembalian}
                            onChange={handleInputChange}
                            min={formData.tanggal_sewa}
                            required
                        />
                    </div>
                    <Button type="submit" className="w-full">Tambah Peminjaman</Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default LoanCreateForm;

import { Head, Link } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Item } from "./item/columns";
import { Category } from "./category/columns";
import AppearanceDropdown from "@/components/appearance-dropdown";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    CheckCircle,
    Phone,
    Menu,
    X,
    Calendar,
    Image,
    Instagram,
    Facebook,
    Twitter,
    Eye,
    Package,
} from "lucide-react";

interface AllItemsPageProps {
    items: Item[];
    categories: Category[];
    isAuthenticated?: boolean;
}

export default function AllItemsPage({
    items,
    categories,
    isAuthenticated = false,
}: AllItemsPageProps) {
    const [filteredItems, setFilteredItems] = useState<Item[]>([]);
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setFilteredItems(items);
    }, [items]);

    const getWhatsAppLink = (item: Item) =>
        `https://wa.me/089522734461?text=${encodeURIComponent(
            `Halo saya mau sewa ${item.nama_barang}`
        )}`;
    const getCategoryName = (categoryId: number) =>
        categories.find((c) => c.id === categoryId)?.nama_kategori || "-";

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
            <section className="py-8 flex-1">
                <div className="container mx-auto px-4">
                    {filteredItems.length === 0 ? (
                        <div className="text-center py-12">
                            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                                Tidak ada peralatan ditemukan
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400">
                                Coba ubah kata kunci pencarian atau filter
                            </p>
                        </div>
                    ) : (
                        <Dialog open={isOpen} onOpenChange={setIsOpen}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border overflow-hidden group"
                                    >
                                        <div className="relative bg-gray-100 dark:bg-gray-700 aspect-video overflow-hidden">
                                            {item.image ? (
                                                <img
                                                    src={`/storage/${item.image}`}
                                                    alt={item.nama_barang}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Image className="w-12 h-12 text-gray-400" />
                                                </div>
                                            )}
                                            <div className="absolute top-2 left-2">
                                                <span
                                                    className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${
                                                        item.status ===
                                                        "Tersedia"
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-red-100 text-red-800"
                                                    }`}
                                                >
                                                    <CheckCircle className="w-3 h-3 mr-1" />
                                                    {item.status}
                                                </span>
                                            </div>
                                            <DialogTrigger asChild>
                                                <button
                                                    onClick={() => {
                                                        setSelectedItem(item);
                                                        setIsOpen(true);
                                                    }}
                                                    className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md"
                                                >
                                                    <Eye className="w-4 h-4 text-gray-600" />
                                                </button>
                                            </DialogTrigger>
                                        </div>
                                        <div className="p-4">
                                            <h3 className="text-base font-semibold mb-2">
                                                {item.nama_barang}
                                            </h3>
                                            <p className="text-sm mb-2">
                                                {getCategoryName(
                                                    item.id_kategori
                                                )}
                                            </p>
                                            <p className="text-xs mb-2">
                                                Stok: {item.jumlah}
                                            </p>
                                            {item.status === "Tersedia" ? (
                                                <a
                                                    href={getWhatsAppLink(item)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <Button className="w-full text-sm">
                                                        <Phone className="w-4 h-4 mr-2" />{" "}
                                                        Pesan Sekarang
                                                    </Button>
                                                </a>
                                            ) : (
                                                <Button
                                                    disabled
                                                    className="w-full text-sm bg-gray-300 text-gray-500"
                                                >
                                                    Tidak Tersedia
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <DialogContent className="max-w-2xl">
                                {selectedItem && (
                                    <>
                                        <DialogHeader>
                                            <DialogTitle>
                                                {selectedItem.nama_barang}
                                            </DialogTitle>
                                            <DialogDescription>
                                                {getCategoryName(
                                                    selectedItem.id_kategori
                                                )}
                                            </DialogDescription>
                                        </DialogHeader>
                                        <img
                                            src={`/storage/${selectedItem.image}`}
                                            alt={selectedItem.nama_barang}
                                            className="w-full rounded mb-4"
                                        />
                                        <p>{selectedItem.deskripsi}</p>
                                        <div className="flex gap-3 pt-4">
                                            {selectedItem.status ===
                                            "Tersedia" ? (
                                                <a
                                                    href={getWhatsAppLink(
                                                        selectedItem
                                                    )}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex-1"
                                                >
                                                    <Button className="w-full">
                                                        <Phone className="w-4 h-4 mr-2" />{" "}
                                                        Pesan Sekarang
                                                    </Button>
                                                </a>
                                            ) : (
                                                <Button
                                                    disabled
                                                    className="flex-1 bg-gray-300 text-gray-500"
                                                >
                                                    Tidak Tersedia
                                                </Button>
                                            )}
                                        </div>
                                    </>
                                )}
                            </DialogContent>
                        </Dialog>
                    )}
                </div>
            </section>
            <footer className="bg-white dark:bg-gray-800 border-t py-8">
                <div className="container mx-auto flex justify-between">
                    <p className="text-sm text-gray-500">
                        &copy; {new Date().getFullYear()} Dore Production
                    </p>
                    <div className="flex gap-4">
                        <Instagram className="w-5 h-5" />
                        <Facebook className="w-5 h-5" />
                        <Twitter className="w-5 h-5" />
                    </div>
                </div>
            </footer>
        </div>
    );
}
